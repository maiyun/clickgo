/** --- 仅限这些标准关键字，避免把未校验的约束当作已校验 --- */
const KEYWORDS = new Set([
    '$schema', '$ref', '$defs', 'title', 'description', 'default', 'examples', 'type',
    'properties', 'required', 'additionalProperties', 'items', 'minItems', 'maxItems', 'uniqueItems',
    'minLength', 'maxLength', 'pattern', 'minimum', 'maximum', 'exclusiveMinimum', 'exclusiveMaximum',
    'enum', 'const', 'allOf', 'anyOf', 'oneOf', 'not',
]);
/**
 * --- 检查可序列化值，拒绝循环、非有限数和类实例；限制嵌套深度 ---
 * @param value 待检查值
 * @param seen 当前路径上的对象
 * @param depth 当前深度
 * @returns 是否为合法 JSON
 */
export function isJson(value, seen = new Set(), depth = 0) {
    if (depth > 64) {
        return false;
    }
    if (value === null || typeof value === 'string' || typeof value === 'boolean') {
        return true;
    }
    if (typeof value === 'number') {
        return Number.isFinite(value);
    }
    if (typeof value !== 'object' || seen.has(value)) {
        return false;
    }
    if (!Array.isArray(value) && Object.prototype.toString.call(value) !== '[object Object]') {
        return false;
    }
    const prototype = Object.getPrototypeOf(value);
    if (!Array.isArray(value) && prototype && Object.getPrototypeOf(prototype) !== null) {
        return false;
    }
    // --- 不执行 getter/toJSON，也不让稀疏数组在序列化时偷偷变成 null ---
    if (Object.getOwnPropertySymbols(value).length) {
        return false;
    }
    const properties = Object.getOwnPropertyDescriptors(value);
    if (Array.isArray(value)) {
        delete properties['length'];
        if (Object.keys(properties).length !== value.length) {
            return false;
        }
        for (let index = 0; index < value.length; ++index) {
            if (!Object.hasOwn(properties, index)) {
                return false;
            }
        }
    }
    seen.add(value);
    const valid = Object.values(properties).every(property => property.enumerable &&
        Object.hasOwn(property, 'value') && isJson(property.value, seen, depth + 1));
    seen.delete(value);
    return valid;
}
/**
 * --- JSON 深度相等；对象键顺序不影响 enum/const/uniqueItems ---
 * @param left 左值
 * @param right 右值
 * @returns 是否相等
 */
function equal(left, right) {
    if (left === right) {
        return true;
    }
    if (!left || !right || typeof left !== 'object' || typeof right !== 'object' ||
        Array.isArray(left) !== Array.isArray(right)) {
        return false;
    }
    const keys = Object.keys(left);
    return keys.length === Object.keys(right).length && keys.every(key => Object.hasOwn(right, key) &&
        equal(left[key], right[key]));
}
/**
 * --- 解析仅包内的 JSON Pointer 引用，不请求远程 schema ---
 * @param root 根 schema
 * @param ref 本地引用
 * @returns 引用目标，无效时返回 null
 */
function reference(root, ref) {
    if (!ref.startsWith('#')) {
        return null;
    }
    let pointer;
    try {
        pointer = decodeURIComponent(ref.slice(1));
    }
    catch {
        return null;
    }
    if (!pointer) {
        return root;
    }
    if (!pointer.startsWith('/')) {
        return null;
    }
    let node = root;
    for (const part of pointer.slice(1).split('/')) {
        if (/~(?:[^01]|$)/.test(part)) {
            return null;
        }
        const key = part.replace(/~1/g, '/').replace(/~0/g, '~');
        if (!node || typeof node !== 'object' || !Object.hasOwn(node, key)) {
            return null;
        }
        node = node[key];
    }
    return typeof node === 'boolean' || node && typeof node === 'object' && !Array.isArray(node)
        ? node : null;
}
/**
 * --- 同一数据位置的循环引用没有确定的校验结果，在注册时拒绝 ---
 * @param schema 当前 schema
 * @param root 根 schema
 * @param verified 已检查无循环的节点
 * @param active 当前引用路径
 * @returns 是否没有不推进数据的循环
 */
function checkReferenceCycles(schema, root, verified, active = new Set()) {
    if (typeof schema === 'boolean' || verified.has(schema)) {
        return true;
    }
    if (active.has(schema)) {
        return false;
    }
    active.add(schema);
    // --- properties/items 会推进到子数据，不属于当前位置的引用路径 ---
    const children = [...schema.allOf ?? [], ...schema.anyOf ?? [], ...schema.oneOf ?? []];
    if (schema.not !== undefined) {
        children.push(schema.not);
    }
    if (schema.$ref !== undefined) {
        const target = reference(root, schema.$ref);
        if (target === null) {
            return false;
        }
        children.push(target);
    }
    for (const child of children) {
        if (!checkReferenceCycles(child, root, verified, active)) {
            return false;
        }
    }
    active.delete(schema);
    verified.add(schema);
    return true;
}
/**
 * --- 注册时检查 schema，错误约束不能静默放行 ---
 * @param schema 当前 schema
 * @param root 根 schema
 * @param seen 已检查的节点
 * @returns 错误说明，合法时返回 null
 */
export function check(schema, root, seen = new Set()) {
    if (typeof schema === 'boolean') {
        return null;
    }
    if (!isJson(schema) || !schema || typeof schema !== 'object' || Array.isArray(schema)) {
        return 'Invalid schema';
    }
    const rootCheck = root === undefined;
    root ??= schema;
    if (seen.has(schema)) {
        return null;
    }
    seen.add(schema);
    for (const key of Object.keys(schema)) {
        if (!KEYWORDS.has(key)) {
            return `Unsupported schema keyword: ${key}`;
        }
    }
    if (schema.type !== undefined && !['object', 'array', 'string', 'number', 'integer', 'boolean', 'null'].includes(schema.type)) {
        return 'Invalid schema type';
    }
    if (schema.$schema !== undefined && (typeof schema.$schema !== 'string' ||
        schema.$schema.replace(/#$/, '') !== 'https://json-schema.org/draft/2020-12/schema')) {
        return 'Unsupported schema dialect';
    }
    for (const key of ['title', 'description', 'pattern', '$ref']) {
        if (schema[key] !== undefined && typeof schema[key] !== 'string') {
            return `Invalid ${key}`;
        }
    }
    if (schema.pattern !== undefined) {
        try {
            new RegExp(schema.pattern, 'u');
        }
        catch {
            return 'Invalid pattern';
        }
    }
    for (const key of ['minItems', 'maxItems', 'minLength', 'maxLength']) {
        if (schema[key] !== undefined && (!Number.isSafeInteger(schema[key]) || schema[key] < 0)) {
            return `Invalid ${key}`;
        }
    }
    for (const key of ['minimum', 'maximum', 'exclusiveMinimum', 'exclusiveMaximum']) {
        if (schema[key] !== undefined && !Number.isFinite(schema[key])) {
            return `Invalid ${key}`;
        }
    }
    if (schema.required !== undefined && (!Array.isArray(schema.required) ||
        schema.required.some(key => typeof key !== 'string') || new Set(schema.required).size !== schema.required.length)) {
        return 'Invalid required';
    }
    if (schema.uniqueItems !== undefined && typeof schema.uniqueItems !== 'boolean') {
        return 'Invalid uniqueItems';
    }
    for (const key of ['enum', 'examples']) {
        if (schema[key] !== undefined && (!Array.isArray(schema[key]) || key === 'enum' && !schema[key].length)) {
            return `Invalid ${key}`;
        }
    }
    if (schema.enum?.some((item, index) => schema.enum.slice(0, index).some(previous => equal(previous, item)))) {
        return 'Duplicate enum value';
    }
    const children = [];
    for (const key of ['properties', '$defs']) {
        const values = schema[key];
        if (values === undefined) {
            continue;
        }
        if (!values || typeof values !== 'object' || Array.isArray(values)) {
            return `Invalid ${key}`;
        }
        children.push(...Object.values(values));
    }
    for (const key of ['allOf', 'anyOf', 'oneOf']) {
        if (schema[key] !== undefined) {
            if (!Array.isArray(schema[key]) || !schema[key].length) {
                return `Invalid ${key}`;
            }
            children.push(...schema[key]);
        }
    }
    for (const key of ['items', 'additionalProperties', 'not']) {
        if (schema[key] !== undefined) {
            children.push(schema[key]);
        }
    }
    if (schema.$ref !== undefined) {
        const target = reference(root, schema.$ref);
        if (target === null) {
            return 'Invalid local reference';
        }
        children.push(target);
    }
    for (const child of children) {
        const error = check(child, root, seen);
        if (error !== null) {
            return error;
        }
    }
    if (rootCheck) {
        const verified = new Set();
        for (const node of seen) {
            if (!checkReferenceCycles(node, root, verified)) {
                return 'Non-consuming schema reference cycle';
            }
        }
    }
    return null;
}
/**
 * --- 校验数据，不转换类型、不补默认值、不删除额外参数 ---
 * @param value 待校验数据
 * @param schema 当前 schema
 * @param root 根 schema
 * @param path 错误字段路径
 * @param depth 递归深度
 * @param ancestors 当前校验路径上的 schema，防止不推进数据的循环引用
 * @returns 错误说明，匹配时返回 null
 */
export function validate(value, schema, root, path = '$', depth = 0, ancestors = []) {
    if (schema === true) {
        return null;
    }
    if (schema === false || depth > 64) {
        return `${path}: value is not allowed`;
    }
    if (ancestors.some(ancestor => ancestor.schema === schema && ancestor.path === path)) {
        return `${path}: cyclic schema reference`;
    }
    const next = [...ancestors, { 'schema': schema, 'path': path }];
    root ??= schema;
    if (schema.$ref !== undefined) {
        const target = reference(root, schema.$ref);
        if (target === null) {
            return `${path}: invalid reference`;
        }
        const error = validate(value, target, root, path, depth + 1, next);
        if (error !== null) {
            return error;
        }
    }
    if (schema.type !== undefined) {
        let type = typeof value;
        if (value === null) {
            type = 'null';
        }
        else if (Array.isArray(value)) {
            type = 'array';
        }
        if (schema.type === 'integer' ? typeof value !== 'number' || !Number.isInteger(value) : type !== schema.type) {
            return `${path}: expected ${schema.type}`;
        }
    }
    if (schema.enum && !schema.enum.some(item => equal(item, value)) ||
        Object.hasOwn(schema, 'const') && !equal(schema.const, value)) {
        return `${path}: value is not in the allowed set`;
    }
    for (const key of ['allOf', 'anyOf', 'oneOf']) {
        const parts = schema[key];
        if (!parts) {
            continue;
        }
        const count = parts.filter(part => validate(value, part, root, path, depth + 1, next) === null).length;
        if (key === 'allOf' && count !== parts.length || key === 'anyOf' && !count || key === 'oneOf' && count !== 1) {
            return `${path}: ${key} did not match`;
        }
    }
    if (schema.not !== undefined && validate(value, schema.not, root, path, depth + 1, next) === null) {
        return `${path}: excluded value`;
    }
    if (typeof value === 'number') {
        if (schema.minimum !== undefined && value < schema.minimum ||
            schema.maximum !== undefined && value > schema.maximum ||
            schema.exclusiveMinimum !== undefined && value <= schema.exclusiveMinimum ||
            schema.exclusiveMaximum !== undefined && value >= schema.exclusiveMaximum) {
            return `${path}: number is out of range`;
        }
    }
    else if (typeof value === 'string') {
        const length = [...value].length;
        if (schema.minLength !== undefined && length < schema.minLength ||
            schema.maxLength !== undefined && length > schema.maxLength ||
            schema.pattern !== undefined && !new RegExp(schema.pattern, 'u').test(value)) {
            return `${path}: string constraint did not match`;
        }
    }
    else if (Array.isArray(value)) {
        if (schema.minItems !== undefined && value.length < schema.minItems ||
            schema.maxItems !== undefined && value.length > schema.maxItems ||
            schema.uniqueItems && value.some((item, index) => value.slice(0, index).some(previous => equal(previous, item)))) {
            return `${path}: array constraint did not match`;
        }
        if (schema.items !== undefined) {
            for (const [index, item] of value.entries()) {
                const error = validate(item, schema.items, root, `${path}/${index}`, depth + 1, next);
                if (error !== null) {
                    return error;
                }
            }
        }
    }
    else if (value && typeof value === 'object') {
        for (const key of schema.required ?? []) {
            if (!Object.hasOwn(value, key)) {
                return `${path}/${key}: required`;
            }
        }
        for (const [key, item] of Object.entries(value)) {
            const child = schema.properties && Object.hasOwn(schema.properties, key)
                ? schema.properties[key] : schema.additionalProperties;
            if (child !== undefined) {
                const error = validate(item, child, root, `${path}/${key}`, depth + 1, next);
                if (error !== null) {
                    return error;
                }
            }
        }
    }
    return null;
}

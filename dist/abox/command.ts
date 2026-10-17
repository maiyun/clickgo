import { isJson } from './tool.js';
import { copyJson } from './command/json.js';
import type { IAgentInfo, IDefinition, IMetadata, ISchema, TResult, IFileInfo } from '../lib/command.js';
import type { TJson } from '../lib/tool.js';

export { copyJson } from './command/json.js';
export { createWebPublisher } from './command/webmcp.js';
export { createRuntime } from './command/runtime.js';
export { createFileStore } from './command/file.js';

const annotations = new Set(['readOnlyHint', 'destructiveHint', 'idempotentHint', 'openWorldHint',
    'consequentialHint', 'untrustedContentHint']);

export function readMetadata<T extends Record<string, TJson>>(definition: IDefinition<T>): IMetadata | false {
    if (!definition || typeof definition.name !== 'string' || !/^[a-zA-Z0-9_.-]{1,128}$/.test(definition.name) ||
        typeof definition.description !== 'string' || !definition.description.trim() || typeof definition.execute !== 'function') return false;
    if (definition.title !== undefined && typeof definition.title !== 'string' ||
        definition.enabled !== undefined && typeof definition.enabled !== 'function' ||
        definition.exposed !== undefined && typeof definition.exposed !== 'boolean' ||
        definition.concurrent !== undefined && typeof definition.concurrent !== 'boolean') return false;
    if (definition.permissions !== undefined && (!Array.isArray(definition.permissions) ||
        definition.permissions.some(permission => typeof permission !== 'string' || !permission))) return false;
    if (definition.annotations !== undefined && (!isJson(definition.annotations) ||
        typeof definition.annotations !== 'object' || !definition.annotations || Array.isArray(definition.annotations) ||
        Object.entries(definition.annotations).some(([key, value]) => typeof value !== 'boolean' || !annotations.has(key)))) return false;
    if (definition.inputSchema?.type !== 'object' || check(definition.inputSchema) !== null ||
        definition.outputSchema !== undefined && check(definition.outputSchema) !== null) return false;
    if (definition.outputSchema !== undefined && (!definition.outputSchema || typeof definition.outputSchema !== 'object')) return false;
    const metadata: IMetadata = {
        'name': definition.name, 'description': definition.description, 'inputSchema': definition.inputSchema,
    };
    if (definition.title !== undefined) metadata.title = definition.title;
    if (definition.outputSchema !== undefined) metadata.outputSchema = definition.outputSchema;
    if (definition.annotations !== undefined) metadata.annotations = definition.annotations;
    return isJson(metadata) ? copyJson(metadata) : false;
}

function failure(code: string, message: string): TResult<never> {
    return { 'ok': false, 'error': { 'code': code, 'message': message } };
}

export function readInput(args: unknown, schema: ISchema): TResult<Record<string, TJson>> {
    if (!isJson(args) || !args || typeof args !== 'object' || Array.isArray(args)) {
        return failure('invalid-input', 'Arguments must be a JSON object');
    }
    const input = copyJson(args);
    const invalid = validate(input, schema);
    return invalid === null ? { 'ok': true, 'data': input } : failure('invalid-input', invalid);
}

export function readResult(result: unknown, schema?: ISchema): TResult {
    if (!isJson(result) || typeof result !== 'object' || !result || Array.isArray(result) || typeof result['ok'] !== 'boolean') {
        return failure('invalid-output', 'Command returned an invalid result');
    }
    if (!result['ok']) {
        const error = result['error'];
        if (!error || typeof error !== 'object' || Array.isArray(error) || typeof error['code'] !== 'string' ||
            !error['code'].trim() || typeof error['message'] !== 'string') {
            return failure('invalid-output', 'Command returned an invalid error');
        }
        return failure(error['code'], error['message']);
    }
    if (!Object.hasOwn(result, 'data')) return failure('invalid-output', 'Command returned no data');
    if (schema && validate(result['data'], schema) !== null) {
        return failure('invalid-output', 'Command result does not match its output schema');
    }
    const files = result['files'];
    if (files !== undefined && (!Array.isArray(files) || files.length > 8 || files.some(file =>
        !file || typeof file !== 'object' || Array.isArray(file) || typeof file['fileId'] !== 'string' ||
        !file['fileId']))) return failure('invalid-output', 'Command returned invalid files');
    return files === undefined ? { 'ok': true, 'data': copyJson(result['data']) } :
        { 'ok': true, 'data': copyJson(result['data']), 'files': copyJson(files) as unknown as IFileInfo[] };
}

const KEYWORDS = new Set([
    '$schema', '$ref', '$defs', 'title', 'description', 'default', 'examples', 'type',
    'properties', 'required', 'additionalProperties', 'items', 'minItems', 'maxItems', 'uniqueItems',
    'minLength', 'maxLength', 'pattern', 'minimum', 'maximum', 'exclusiveMinimum', 'exclusiveMaximum',
    'enum', 'const', 'allOf', 'anyOf', 'oneOf', 'not',
]);

function equal(left: TJson, right: TJson): boolean {
    if (left === right) {
        return true;
    }
    if (!left || !right || typeof left !== 'object' || typeof right !== 'object' ||
        Array.isArray(left) !== Array.isArray(right)) {
        return false;
    }
    const keys = Object.keys(left);
    return keys.length === Object.keys(right).length && keys.every(key => Object.hasOwn(right, key) &&
        equal((left as Record<string, TJson>)[key], (right as Record<string, TJson>)[key]));
}

function reference(root: ISchema, ref: string): ISchema | boolean | null {
    if (!ref.startsWith('#')) {
        return null;
    }
    let pointer: string;
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
    let node: unknown = root;
    for (const part of pointer.slice(1).split('/')) {
        if (/~(?:[^01]|$)/.test(part)) {
            return null;
        }
        const key = part.replace(/~1/g, '/').replace(/~0/g, '~');
        if (!node || typeof node !== 'object' || !Object.hasOwn(node, key)) {
            return null;
        }
        node = (node as Record<string, unknown>)[key];
    }
    return typeof node === 'boolean' || node && typeof node === 'object' && !Array.isArray(node)
        ? node : null;
}

function checkReferenceCycles(schema: ISchema | boolean, root: ISchema, verified: Set<ISchema>, active = new Set<ISchema>()): boolean {
    if (typeof schema === 'boolean' || verified.has(schema)) {
        return true;
    }
    if (active.has(schema)) {
        return false;
    }
    active.add(schema);
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

export function check(schema: ISchema | boolean, root?: ISchema, seen = new Set<ISchema>()): string | null {
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
    for (const key of ['title', 'description', 'pattern', '$ref'] as const) {
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
    for (const key of ['minItems', 'maxItems', 'minLength', 'maxLength'] as const) {
        if (schema[key] !== undefined && (!Number.isSafeInteger(schema[key]) || schema[key] < 0)) {
            return `Invalid ${key}`;
        }
    }
    for (const key of ['minimum', 'maximum', 'exclusiveMinimum', 'exclusiveMaximum'] as const) {
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
    for (const key of ['enum', 'examples'] as const) {
        if (schema[key] !== undefined && (!Array.isArray(schema[key]) || key === 'enum' && !schema[key].length)) {
            return `Invalid ${key}`;
        }
    }
    if (schema.enum?.some((item, index) => schema.enum!.slice(0, index).some(previous => equal(previous, item)))) {
        return 'Duplicate enum value';
    }
    const children: Array<ISchema | boolean> = [];
    for (const key of ['properties', '$defs'] as const) {
        const values = schema[key];
        if (values === undefined) {
            continue;
        }
        if (!values || typeof values !== 'object' || Array.isArray(values)) {
            return `Invalid ${key}`;
        }
        children.push(...Object.values(values));
    }
    for (const key of ['allOf', 'anyOf', 'oneOf'] as const) {
        if (schema[key] !== undefined) {
            if (!Array.isArray(schema[key]) || !schema[key].length) {
                return `Invalid ${key}`;
            }
            children.push(...schema[key]);
        }
    }
    for (const key of ['items', 'additionalProperties', 'not'] as const) {
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
        const verified = new Set<ISchema>();
        for (const node of seen) {
            if (!checkReferenceCycles(node, root, verified)) {
                return 'Non-consuming schema reference cycle';
            }
        }
    }
    return null;
}

export function validate(value: TJson, schema: ISchema | boolean, root?: ISchema, path = '$', depth = 0, ancestors: Array<{
    'schema': ISchema;
    'path': string;
}> = []): string | null {
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
        let type: string = typeof value;
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
        Object.hasOwn(schema, 'const') && !equal(schema.const!, value)) {
        return `${path}: value is not in the allowed set`;
    }
    for (const key of ['allOf', 'anyOf', 'oneOf'] as const) {
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

function json(value: unknown): string {
    return `\`\`\`json\n${JSON.stringify(value, null, 2).replaceAll('`', '\\u0060')}\n\`\`\``;
}

export function format(info: IAgentInfo): string {
    let webMcp = 'WebMCP tools register automatically when supported.';
    if (info.webMcp.status === 'unsupported') {
        webMcp = 'WebMCP is not supported by this browser.';
    }
    else if (info.webMcp.registrationStatus === 'failed') {
        webMcp = 'WebMCP tool registration failed; use the JavaScript API.';
    }
    const lines = [
        `Browser: use \`${info.browser.api}\` on this page. ${webMcp}`,
        'Call `listTasks()`, choose an App id, inspect `list(taskId)`, then `await execute(taskId, name, args)` per inputSchema. Rediscover IDs after restart.',
        'Export `files`: use the Native resource URI or `readCommand`/`readChunkSize` for the same bytes. Missed downloads are not export failures.',
    ];
    if (info.browser.url !== null && info.native === null) {
        lines.unshift(`Page: ${JSON.stringify(info.browser.url)}`);
    }
    const native = info.native;
    if (native !== null) {
        lines.push('', 'Local MCP (stdio):', json({ 'command': native.command, 'args': [...native.args, '--mcp'] }), 'Discover tools with `tools/list`; use them to list Apps, inspect commands and execute.', 'CLI: use the same executable and initial arguments, replacing `--mcp` with `--cli --help`.', native.startup === 'auto' ? 'CLI/stdio automatically open the software when needed.' :
            'Open the software with MCP and local discovery enabled before using CLI/stdio.');
        if (native.startup === 'auto' && (!native.mcp.enabled || !native.mcp.discovery)) {
            lines.push('MCP and local discovery must be enabled by the software for automatic startup to work.');
        }
    }
    if (info.http !== null) {
        lines.push('', 'HTTP MCP (temporary authorized connection):', json({ 'url': info.http.url, 'headers': { 'Authorization': `Bearer ${info.http.token}` } }), 'Keep this credential private and obtain fresh settings after restart. Discover tools with `tools/list`.');
    }
    else if (native !== null) {
        lines.push('HTTP MCP: obtain the current URL and Authorization header from the software\'s connection settings.');
    }
    return lines.join('\n');
}

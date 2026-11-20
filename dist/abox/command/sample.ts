import type { ISchema, TJson } from '../../lib/command.js';

type Rule = ISchema | boolean;
const maxString = 2048;
const maxItems = 128;

// Common command identifiers and codes use a sequence of literals and character classes.
// More elaborate expressions can supply examples; all candidates still pass the command validator.
function patternSample(pattern: string, minLength: number, variant: number): string | undefined {
    if (pattern.length > 256) return;
    const source = pattern.replace(/^\^/u, '').replace(/\$$/u, '');
    const token = /(\[(?:\\.|[^\\\]])+\]|\\[dws]|\\[^\w]|\.|[^.?*+(){}\[\]\\^$|])(?:\{(\d+)(?:(,)(\d*))?\}|([+*?]))?/uy;
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_- .@/';
    const segments: Array<{ value: string; count: number; limit: number }> = [];
    let size = 0;
    while (token.lastIndex < source.length) {
        const match = token.exec(source);
        if (!match) return;
        const [, atom, count, comma, upper, modifier] = match;
        let value = atom;
        if (atom.startsWith('[') || atom.startsWith('\\') || atom === '.') {
            const test = new RegExp(atom, 'u');
            const available = [...alphabet, ...atom].filter(char => test.test(char));
            if (!available.length) return;
            value = available[variant % available.length];
        }
        const n = count !== undefined ? Number(count) : modifier === '*' || modifier === '?' ? 0 : 1;
        size += n;
        if (size > maxString) return;
        const limit = comma ? Number(upper || maxString) : modifier === '+' || modifier === '*' ? maxString :
            modifier === '?' ? 1 : n;
        segments.push({ value, count: n, limit });
    }
    for (const segment of segments) {
        const add = Math.min(segment.limit - segment.count, Math.max(0, minLength - size));
        segment.count += add;
        size += add;
    }
    return segments.map(s => s.value.repeat(s.count)).join('');
}

export function buildSample(root: ISchema, resolve: (ref: string) => Rule | null,
    matches: (value: TJson, rule: Rule) => boolean): TJson | undefined {
    let budget = 4096;

    function generate(rules: Rule[], variant: number, depth: number, ancestors: ISchema[],
        optional = false, used?: Set<string>): TJson | undefined {
        if (depth > 16 || --budget <= 0) return;

        // Expand references and conjunctions before choosing a value so sibling limits and
        // required fields apply together. Try disjunctions one branch at a time.
        function expand(pending: Rule[], constraints: ISchema[], branches: number): TJson | undefined {
            if (branches > 32) return;
            while (pending.length) {
                if (--budget <= 0) return;
                const node = pending.pop()!;
                if (node === false) return;
                if (node === true || constraints.includes(node)) continue;
                if (optional && ancestors.includes(node)) return;
                constraints.push(node);
                if (node.$ref) pending.push(resolve(node.$ref) ?? false);
                if (node.allOf) {
                    if (node.allOf.length > budget) return;
                    for (const child of node.allOf) pending.push(child);
                }
                if (node.anyOf || node.oneOf) {
                    for (const any of node.anyOf ?? [true]) {
                        for (const one of node.oneOf ?? [true]) {
                            if (--budget <= 0) return;
                            const value = expand([...pending, any, one], [...constraints], branches + 1);
                            if (value !== undefined) return value;
                        }
                    }
                    return;
                }
            }
            const accepts = (value: TJson): boolean => --budget > 0 &&
                !used?.has(JSON.stringify(value)) && constraints.every(rule => matches(value, rule));
            for (const rule of constraints) {
                for (const values of [rule.examples, Object.hasOwn(rule, 'default') ? [rule.default!] : undefined,
                    Object.hasOwn(rule, 'const') ? [rule.const!] : undefined, rule.enum]) {
                    if (!values) continue;
                    for (let i = 0; i < values.length && budget > 0; ++i) {
                        const candidate = values[(i + variant) % values.length];
                        if (accepts(candidate)) return candidate;
                    }
                }
            }
            let type = constraints.find(s => s.type === 'integer')?.type ?? constraints.find(s => s.type)?.type;
            type ??= constraints.some(s => s.properties || s.required) ? 'object' :
                constraints.some(s => s.items !== undefined || s.minItems !== undefined) ? 'array' :
                    constraints.some(s => s.minimum !== undefined || s.maximum !== undefined ||
                        s.exclusiveMinimum !== undefined || s.exclusiveMaximum !== undefined) ? 'number' : 'string';

            if (type === 'object') {
                const required = new Set(constraints.flatMap(s => s.required ?? []));
                const keys = new Set([...required, ...constraints.flatMap(s => Object.keys(s.properties ?? {}))]);
                const object: Record<string, TJson> = Object.create(null);
                const path = [...ancestors, ...constraints];
                for (const key of keys) {
                    if (budget <= 0) return;
                    const child = constraints.map(s => s.properties && Object.hasOwn(s.properties, key) ?
                        s.properties[key] : s.additionalProperties ?? true);
                    const value = generate(child, variant, depth + 1, path, !required.has(key));
                    if (value !== undefined) object[key] = value;
                    else if (required.has(key)) return;
                }
                if (accepts(object)) return object;
                for (const key of keys) if (!required.has(key)) delete object[key];
                if (accepts(object)) return object;
                return;
            }
            if (type === 'array') {
                const min = Math.max(0, ...constraints.map(s => s.minItems ?? 0));
                const max = Math.min(maxItems, ...constraints.map(s => s.maxItems ?? maxItems));
                if (min > max) return;
                const length = Math.max(min, max ? 1 : 0);
                const items = constraints.map(s => s.items ?? true);
                const seen = constraints.some(s => s.uniqueItems) ? new Set<string>() : undefined;
                const path = [...ancestors, ...constraints];
                const array: TJson[] = [];
                for (let i = 0; i < length; ++i) {
                    const item = generate(items, variant + i, depth + 1, path, i >= min, seen);
                    if (item === undefined) break;
                    if (seen) seen.add(JSON.stringify(item));
                    array.push(item);
                }
                if (accepts(array)) return array;
                if (!min && accepts([])) return [];
                return;
            }
            let candidates: TJson[] = [];
            if (type === 'integer' || type === 'number') {
                const low = Math.max(-Infinity, ...constraints.map(s => Math.max(s.minimum ?? -Infinity, s.exclusiveMinimum ?? -Infinity)));
                const high = Math.min(Infinity, ...constraints.map(s => Math.min(s.maximum ?? Infinity, s.exclusiveMaximum ?? Infinity)));
                candidates = [Math.max(low, Math.min(high, variant + 1)), low + variant, high - variant,
                    Math.ceil(low) + 1 + variant, Math.floor(high) - 1 - variant, Math.ceil(low), Math.floor(high),
                    low / 2 + high / 2, low + Math.max(Number.MIN_VALUE, Math.abs(low) * Number.EPSILON),
                    high - Math.max(Number.MIN_VALUE, Math.abs(high) * Number.EPSILON), 0, -1].filter(Number.isFinite);
            }
            else if (type === 'string') {
                const min = Math.max(0, ...constraints.map(s => s.minLength ?? 0));
                const max = Math.min(maxString, ...constraints.map(s => s.maxLength ?? maxString));
                if (min > max) return;
                for (const rule of constraints) {
                    if (!rule.pattern) continue;
                    const value = patternSample(rule.pattern, min, variant);
                    if (value !== undefined) candidates.push(value);
                }
                const letter = String.fromCharCode(97 + variant % 26);
                for (const text of [variant ? 'example' + variant : 'example', letter, String(variant), '']) {
                    candidates.push(text.slice(0, max).padEnd(min, letter));
                }
            }
            else if (type === 'boolean') candidates = [variant % 2 === 0, variant % 2 !== 0];
            else candidates = [null];
            if (!constraints.some(s => s.type)) candidates.push(variant, true, false, null, {}, []);
            return candidates.find(accepts);
        }
        return expand([...rules], [], 0);
    }

    for (let variant = 0; variant < 4 && budget > 0; ++variant) {
        const value = generate([root], variant, 0, []);
        if (value !== undefined) return value;
    }
}

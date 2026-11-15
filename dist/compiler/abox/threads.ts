import { parseAst } from 'rollup/parseAst';

/**
 * --- 保留线程类的独立执行能力，其他应用代码继续混淆 ---
 * @param code Terser 压缩后的应用代码
 * @returns 标记线程类后的代码
 */
export function protectThreads(code: string): string {
    const positions: Array<{ position: number; text: string; }> = [];
    const visit = (value: unknown): void => {
        if (!value || typeof value !== 'object') {
            return;
        }
        if (Array.isArray(value)) {
            for (const item of value) {
                visit(item);
            }
            return;
        }
        const node = value as Record<string, unknown>;
        if (node.type === 'ClassDeclaration' || node.type === 'ClassExpression') {
            const parent = node.superClass as Record<string, unknown> | null;
            const property = parent?.property as Record<string, unknown> | undefined;
            if (((parent?.type === 'MemberExpression' && (property?.name === 'AbstractThread' || property?.value === 'AbstractThread')) ||
                (parent?.type === 'Identifier' && parent.name === 'AbstractThread')) &&
                typeof node.start === 'number' && typeof node.end === 'number') {
                positions.push({ 'position': node.start, 'text': '/* javascript-obfuscator:disable */' });
                positions.push({ 'position': node.end, 'text': '/* javascript-obfuscator:enable */' });
            }
        }
        for (const child of Object.values(node)) {
            visit(child);
        }
    };
    visit(parseAst(code));
    positions.sort((a, b) => b.position - a.position);
    for (const item of positions) {
        code = code.slice(0, item.position) + item.text + code.slice(item.position);
    }
    return code;
}


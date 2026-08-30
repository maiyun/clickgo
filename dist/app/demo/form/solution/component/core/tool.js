/**
 * --- 读取并规范化工具参数 ---
 * @param options 工具参数
 * @returns 可直接用于 Canvas 的参数
 */
export function normalizeOptions(options) {
    return {
        'color': options.color,
        'opacity': Math.min(1, Math.max(0.05, Number(options.opacity) || 1)),
        'size': Math.min(80, Math.max(1, Number(options.size) || 1))
    };
}

import type * as clickgo from 'clickgo';

/** --- 桌面布局使用的尺寸和排列偏好 --- */
export interface ILayoutOptions {
    'width': number;
    'height': number;
    'cellWidth': number;
    'cellHeight': number;
    'gap': number;
    'padding': number;
    'direction': 'column' | 'row';
    'snap': boolean;
    'arrange': boolean;
    'rtl': boolean;
}

/** --- 有限区域的布局结果，more 为溢出入口预留的位置 --- */
export interface ILayoutResult {
    'positions': clickgo.control.TDesktopPositions;
    'visible': string[];
    'overflow': string[];
    'more': clickgo.control.IDesktopPosition | null;
}

/**
 * --- 比较 ID 数组，允许 ID 包含任意字符 ---
 * @param a ID 数组
 * @param b ID 数组
 * @returns 内容和顺序是否相等
 */
export function sameValues(a: string[], b: string[]): boolean {
    return (a.length === b.length) && a.every((id, index) => id === b[index]);
}

/**
 * --- 复制有效位置，剔除已删除的图标，不改动调用方对象 ---
 * @param ids 当前图标 ID
 * @param positions 调用方位置
 * @returns 独立的位置快照
 */
export function copyPositions(
    ids: string[], positions: clickgo.control.TDesktopPositions
): clickgo.control.TDesktopPositions {
    return Object.fromEntries(ids.flatMap(id => {
        const point = Object.hasOwn(positions, id) ? positions[id] : undefined;
        return point && Number.isFinite(point.x) && Number.isFinite(point.y) ? [[id, { 'x': point.x, 'y': point.y }]] : [];
    }));
}

/**
 * --- 比较位置内容，避免父组件回写双向绑定时循环通知 ---
 * @param a 位置快照
 * @param b 位置快照
 * @returns 内容是否相等
 */
export function samePositions(a: clickgo.control.TDesktopPositions, b: clickgo.control.TDesktopPositions): boolean {
    const ids = Object.keys(a);
    return (ids.length === Object.keys(b).length) && ids.every(id => Object.hasOwn(b, id) &&
        Number.isFinite(a[id]?.x) && Number.isFinite(a[id]?.y) &&
        (a[id]?.x === b[id]?.x) && (a[id]?.y === b[id]?.y));
}

/**
 * --- 按起点与指针位移计算整组目标位置，预览和提交共用吸附与边界限制 ---
 * @param moving 本次拖动的图标 ID
 * @param original 拖动开始时的显示位置
 * @param start 控件内的起始指针坐标
 * @param current 控件内的当前指针坐标
 * @param options 可用尺寸与偏好
 * @returns 移动组的候选位置，不修改原始布局
 */
export function getDragPositions(
    moving: string[], original: clickgo.control.TDesktopPositions,
    start: clickgo.control.IDesktopPosition, current: clickgo.control.IDesktopPosition, options: ILayoutOptions
): clickgo.control.TDesktopPositions {
    const { width, height, cellWidth, cellHeight, padding, gap, snap } = options;
    const stepX = cellWidth + gap;
    const stepY = cellHeight + gap;
    const maxX = snap ? padding + Math.floor((width - padding * 2 - cellWidth) / stepX) * stepX :
        width - padding - cellWidth;
    const maxY = snap ? padding + Math.floor((height - padding * 2 - cellHeight) / stepY) * stepY :
        height - padding - cellHeight;
    let dx = current.x - start.x;
    let dy = current.y - start.y;
    if (snap) {
        dx = Math.round(dx / stepX) * stepX;
        dy = Math.round(dy / stepY) * stepY;
    }
    dx = Math.min(maxX - Math.max(...moving.map(id => original[id].x)),
        Math.max(padding - Math.min(...moving.map(id => original[id].x)), dx));
    dy = Math.min(maxY - Math.max(...moving.map(id => original[id].y)),
        Math.max(padding - Math.min(...moving.map(id => original[id].y)), dy));
    return Object.fromEntries(moving.map(id => [id, {
        'x': original[id].x + dx, 'y': original[id].y + dy
    }]));
}

/**
 * --- 保留有效位置，越界或碰撞时寻找空格；满容量时预留一个溢出入口 ---
 * @param ids 当前图标 ID，顺序决定默认排列和碰撞的先后
 * @param positions 当前位置
 * @param options 可用尺寸与偏好
 * @param priority 用户本次主动摆放的图标，优先占据目标位置
 * @returns 不重叠且不超出区域的布局，不修改输入
 */
export function resolveLayout(
    ids: string[], positions: clickgo.control.TDesktopPositions, options: ILayoutOptions, priority: string[] = []
): ILayoutResult {
    const { width, height, cellWidth, cellHeight, gap, padding } = options;
    const stepX = cellWidth + gap;
    const stepY = cellHeight + gap;
    const columns = Math.max(0, Math.floor((width - padding * 2 + gap) / stepX));
    const rows = Math.max(0, Math.floor((height - padding * 2 + gap) / stepY));
    const cells: clickgo.control.IDesktopPosition[] = [];
    for (let i = 0; i < columns * rows; ++i) {
        const column = options.direction === 'column' ? Math.floor(i / rows) : i % columns;
        const row = options.direction === 'column' ? i % rows : Math.floor(i / columns);
        cells.push({ 'x': padding + (options.rtl ? columns - 1 - column : column) * stepX, 'y': padding + row * stepY });
    }
    const priorityIds = new Set(priority);
    const ordered = [...new Set(priority.filter(id => ids.includes(id))), ...ids.filter(id => !priorityIds.has(id))];

    /**
     * --- 先保留所有合法锚点，再为其他图标寻找最近空格 ---
     * @param more 溢出入口占用的格子
     * @returns 本轮布局结果
     */
    const place = (more: clickgo.control.IDesktopPosition | null): ILayoutResult => {
        const result = new Map(Object.entries(copyPositions(ids, positions)));
        const placed = new Set<string>();
        const occupied: clickgo.control.IDesktopPosition[] = more ? [more] : [];
        const grid = new Set(occupied.map(point => `${point.x},${point.y}`));
        const fits = (point: clickgo.control.IDesktopPosition): boolean =>
            (point.x >= padding) && (point.y >= padding) &&
            (point.x + cellWidth <= width - padding) && (point.y + cellHeight <= height - padding);
        const free = (point: clickgo.control.IDesktopPosition): boolean => options.snap ? !grid.has(`${point.x},${point.y}`) :
            !occupied.some(other => (point.x < other.x + stepX) && (point.x + stepX > other.x) &&
                (point.y < other.y + stepY) && (point.y + stepY > other.y));
        const put = (id: string, point: clickgo.control.IDesktopPosition): void => {
            result.set(id, { ...point });
            placed.add(id);
            occupied.push(point);
            grid.add(`${point.x},${point.y}`);
        };
        if (!options.arrange) {
            for (const id of ordered) {
                const point = result.get(id);
                if (!point) {
                    continue;
                }
                const next = options.snap ? {
                    'x': padding + Math.round((point.x - padding) / stepX) * stepX,
                    'y': padding + Math.round((point.y - padding) / stepY) * stepY
                } : point;
                if (fits(next) && free(next)) {
                    put(id, next);
                }
            }
        }
        for (const id of ordered) {
            if (placed.has(id)) {
                continue;
            }
            const desired = !options.arrange ? result.get(id) : undefined;
            let point: clickgo.control.IDesktopPosition | undefined;
            let distance = Infinity;
            for (const cell of cells) {
                if (!free(cell)) {
                    continue;
                }
                const nextDistance = desired ? Math.abs(cell.x - desired.x) + Math.abs(cell.y - desired.y) : 0;
                if (nextDistance >= distance) {
                    continue;
                }
                point = cell;
                distance = nextDistance;
                if (!desired || !distance) {
                    break;
                }
            }
            if (point) {
                put(id, point);
            }
        }
        return {
            'positions': Object.fromEntries(result),
            'visible': ids.filter(id => placed.has(id)),
            'overflow': ids.filter(id => !placed.has(id)),
            'more': more
        };
    };
    // --- 入口与图标共用格子，避免浮动计数挡住最后一个图标；自由摆放也可能造成碎片空隙 ---
    const more = cells.at(-1) ?? null;
    if (ids.length > cells.length) {
        return place(more);
    }
    const result = place(null);
    return result.overflow.length && more ? place(more) : result;
}

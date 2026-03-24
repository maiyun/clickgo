/** --- 矩形（画布坐标系） --- */
export interface IRect { 'x': number; 'y': number; 'width': number; 'height': number; }
/** --- 线段（屏幕坐标系） --- */
export interface IEdge { 'x1': number; 'y1': number; 'x2': number; 'y2': number; }
/** --- 点坐标 --- */
export interface IPoint { 'x': number; 'y': number; }

/**
 * --- 计算两个矩形的交集区域，无交集时返回 null ---
 * @param a 矩形 a
 * @param b 矩形 b
 * @returns [x1, y1, x2, y2] 或 null
 */
function intersect(a: IRect, b: IRect): [number, number, number, number] | null {
    const x1 = Math.max(a.x, b.x);
    const y1 = Math.max(a.y, b.y);
    const x2 = Math.min(a.x + a.width, b.x + b.width);
    const y2 = Math.min(a.y + a.height, b.y + b.height);
    return (x2 > x1 && y2 > y1) ? [x1, y1, x2, y2] : null;
}

/**
 * --- 从矩形列表中提取合并后的外轮廓边缘线段 ---
 * @param rects 矩形列表（画布坐标系）
 * @param zoom 缩放倍数
 * @param vpt 视口变换矩阵
 * @returns 边缘线段数组（屏幕坐标系）
 */
export function extractOutlineEdges(rects: IRect[], zoom: number, vpt: number[]): IEdge[] {
    if (rects.length === 0) {
        return [];
    }
    // --- 将矩形坐标转换为屏幕坐标并取整，防止浮点精度问题 ---
    const screenRects = rects.map((r) => ({
        'x': Math.round(r.x * zoom + vpt[4]),
        'y': Math.round(r.y * zoom + vpt[5]),
        'w': Math.round(r.width * zoom),
        'h': Math.round(r.height * zoom),
    }));
    // --- 收集所有唯一的坐标轴边界并排序 ---
    const xSet = new Set<number>();
    const ySet = new Set<number>();
    for (const sr of screenRects) {
        xSet.add(sr.x); xSet.add(sr.x + sr.w);
        ySet.add(sr.y); ySet.add(sr.y + sr.h);
    }
    const xs = [...xSet].sort((a, b) => a - b);
    const ys = [...ySet].sort((a, b) => a - b);
    const cols = xs.length - 1;
    const rows = ys.length - 1;
    if (cols <= 0 || rows <= 0) {
        return [];
    }
    // --- 用 Map 加速坐标到索引的查找，避免 indexOf 的 O(n) 开销 ---
    const xi = new Map(xs.map((v, i) => [v, i]));
    const yi = new Map(ys.map((v, i) => [v, i]));
    // --- 构建网格：每个格子标记是否被至少一个矩形覆盖 ---
    const grid: boolean[][] = Array.from({ 'length': rows }, () => new Array(cols).fill(false));
    for (const sr of screenRects) {
        const left = xi.get(sr.x)!, right = xi.get(sr.x + sr.w)!;
        const top = yi.get(sr.y)!, bottom = yi.get(sr.y + sr.h)!;
        for (let r = top; r < bottom; r++) {
            for (let c = left; c < right; c++) {
                grid[r][c] = true;
            }
        }
    }
    // --- 扫描网格边缘：只保留一侧被覆盖、另一侧未被覆盖的边 ---
    const edges: IEdge[] = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (!grid[r][c]) {
                continue;
            }
            const x1 = xs[c], x2 = xs[c + 1];
            const y1 = ys[r], y2 = ys[r + 1];
            // --- 上边 ---
            if (r === 0 || !grid[r - 1][c]) {
                edges.push({ 'x1': x1, 'y1': y1, 'x2': x2, 'y2': y1 });
            }
            // --- 下边 ---
            if (r === rows - 1 || !grid[r + 1][c]) {
                edges.push({ 'x1': x1, 'y1': y2, 'x2': x2, 'y2': y2 });
            }
            // --- 左边 ---
            if (c === 0 || !grid[r][c - 1]) {
                edges.push({ 'x1': x1, 'y1': y1, 'x2': x1, 'y2': y2 });
            }
            // --- 右边 ---
            if (c === cols - 1 || !grid[r][c + 1]) {
                edges.push({ 'x1': x2, 'y1': y1, 'x2': x2, 'y2': y2 });
            }
        }
    }
    return edges;
}

/**
 * --- 将外轮廓边缘线段链式连接为多边形顶点数组 ---
 * @param edges 边缘线段数组
 * @returns 多边形顶点数组（不规则选区可能包含多个独立闭合多边形）
 */
export function buildOutlinePolygons(edges: IEdge[]): IPoint[][] {
    if (edges.length === 0) {
        return [];
    }
    // --- 构建端点邻接表 ---
    const key = (x: number, y: number): string => `${x},${y}`;
    const adj = new Map<string, Array<{ 'idx': number; 'to': IPoint; }>>();
    for (let i = 0; i < edges.length; i++) {
        const { x1, y1, x2, y2 } = edges[i];
        const k1 = key(x1, y1), k2 = key(x2, y2);
        if (!adj.has(k1)) {
            adj.set(k1, []);
        }
        if (!adj.has(k2)) {
            adj.set(k2, []);
        }
        adj.get(k1)!.push({ 'idx': i, 'to': { 'x': x2, 'y': y2 } });
        adj.get(k2)!.push({ 'idx': i, 'to': { 'x': x1, 'y': y1 } });
    }
    // --- 链式游走：从每条未访问边出发，依次连接成多边形 ---
    const visited = new Set<number>();
    const polygons: IPoint[][] = [];
    for (let i = 0; i < edges.length; i++) {
        if (visited.has(i)) {
            continue;
        }
        const polygon: IPoint[] = [];
        let cur: IPoint = { 'x': edges[i].x1, 'y': edges[i].y1 };
        let idx = i;
        while (!visited.has(idx)) {
            visited.add(idx);
            polygon.push({ 'x': cur.x, 'y': cur.y });
            const e = edges[idx];
            const next: IPoint = (e.x1 === cur.x && e.y1 === cur.y)
                ? { 'x': e.x2, 'y': e.y2 }
                : { 'x': e.x1, 'y': e.y1 };
            const nextEdge = (adj.get(key(next.x, next.y)) ?? []).find(n => !visited.has(n.idx));
            if (!nextEdge) {
                break;
            }
            cur = next;
            idx = nextEdge.idx;
        }
        if (polygon.length >= 3) {
            polygons.push(polygon);
        }
    }
    return polygons;
}

/**
 * --- 从已有矩形列表中减去新矩形重叠区域（subtract 模式）---
 * @param existing 已有矩形列表
 * @param cut 要减去的矩形
 * @returns 减去后的矩形列表
 */
export function subtractRect(existing: IRect[], cut: IRect): IRect[] {
    const result: IRect[] = [];
    for (const r of existing) {
        const its = intersect(r, cut);
        if (!its) {
            result.push(r);
            continue;
        }
        // --- 有交集，将 r 分割为最多 4 条带状矩形（上/下/左/右）---
        const [ix1, iy1, ix2, iy2] = its;
        if (r.y < iy1) {
            result.push({ 'x': r.x, 'y': r.y, 'width': r.width, 'height': iy1 - r.y });
        }
        if (iy2 < r.y + r.height) {
            result.push({ 'x': r.x, 'y': iy2, 'width': r.width, 'height': r.y + r.height - iy2 });
        }
        if (r.x < ix1) {
            result.push({ 'x': r.x, 'y': iy1, 'width': ix1 - r.x, 'height': iy2 - iy1 });
        }
        if (ix2 < r.x + r.width) {
            result.push({ 'x': ix2, 'y': iy1, 'width': r.x + r.width - ix2, 'height': iy2 - iy1 });
        }
    }
    return result;
}

/**
 * --- 保留已有矩形与新矩形的交集部分（intersect 模式）---
 * @param existing 已有矩形列表
 * @param clip 交集矩形
 * @returns 交集后的矩形列表
 */
export function intersectRect(existing: IRect[], clip: IRect): IRect[] {
    const result: IRect[] = [];
    for (const r of existing) {
        const its = intersect(r, clip);
        if (!its) {
            continue;
        }
        const [ix1, iy1, ix2, iy2] = its;
        result.push({ 'x': ix1, 'y': iy1, 'width': ix2 - ix1, 'height': iy2 - iy1 });
    }
    return result;
}

import type * as clickgo from 'clickgo';
import type { INode, IScene, IEdge } from '../lib/layout';

type Point = { x: number; y: number };

function captionExit(node: INode, dx: number, dy: number): number {
    if (node.height <= 84) { return 0; }
    const caption = node.captionWidth;
    const width = typeof caption === 'number' && Number.isFinite(caption) && caption > 0 ? Math.min(node.width, caption) : node.width;
    let low = 0, high = Infinity;
    for (const [delta, min, max] of [
        [dx, -width / 2 - 6, width / 2 + 6],
        [dy, 44, node.height - 36 + 6]
    ]) {
        if (!delta) {
            if (min > 0 || max < 0) { return 0; }
            continue;
        }
        const a = min / delta, b = max / delta;
        low = Math.max(low, Math.min(a, b));
        high = Math.min(high, Math.max(a, b));
        if (low > high) { return 0; }
    }
    return Number.isFinite(high) ? high : 0;
}

export function arrange(input: INode[], edges: clickgo.control.IObjviewerEdge[], mode: 'radial' | 'tree' | 'compact' | 'manual', root: string, spacing: number): IScene {
    const nodes = input.map(node => ({ ...node,
        width: Number.isFinite(node.width) ? Math.max(1, node.width) : 184,
        height: Number.isFinite(node.height) ? Math.max(1, node.height) : 80,
        x: Number.isFinite(node.x) ? node.x : 0, y: Number.isFinite(node.y) ? node.y : 0
    }));
    if (!nodes.length) { return { nodes, edges: [], width: 0, height: 0 }; }
    const anchorY = (node: INode): number => node.hub ? 36 : node.height / 2;
    const extent = (node: INode): number => Math.hypot(node.width / 2, Math.max(anchorY(node), node.height - anchorY(node)));
    const gap = Number.isFinite(spacing) ? Math.max(24, Math.min(400, spacing)) : 72;
    const byId = new Map(nodes.map(node => [node.id, node]));
    const adjacent = new Map(nodes.map(node => [node.id, new Set<string>()]));
    const incoming = new Set<string>();
    for (const edge of edges) {
        if (!byId.has(edge.source) || !byId.has(edge.target) || edge.source === edge.target) { continue; }
        adjacent.get(edge.source)!.add(edge.target);
        adjacent.get(edge.target)!.add(edge.source);
        incoming.add(edge.target);
    }
    if (mode !== 'manual') {
        const pending = new Set(nodes.map(node => node.id));
        let offset = 0;
        while (pending.size) {
            const candidates = nodes.filter(node => pending.has(node.id));
            const start = pending.has(root) ? root : (candidates.find(node => !incoming.has(node.id)) ??
                candidates.reduce((a, b) => adjacent.get(a.id)!.size >= adjacent.get(b.id)!.size ? a : b)).id;
            const levels: INode[][] = [[byId.get(start)!]];
            pending.delete(start);
            for (let depth = 0; depth < levels.length; ++depth) {
                const next: INode[] = [];
                for (const node of levels[depth]) {
                    for (const id of adjacent.get(node.id)!) {
                        if (!pending.delete(id)) { continue; }
                        next.push(byId.get(id)!);
                    }
                }
                if (next.length) { levels.push(next); }
            }
            const component = levels.flat();
            if (mode === 'compact') {
                let y = 0;
                const width = Math.max(...component.map(node => node.width));
                for (const [index, node] of component.entries()) {
                    node.x = index ? 32 : 32 + (width - node.width) / 2;
                    node.y = y;
                    y += node.height + 24;
                }
            }
            else if (mode === 'tree') {
                let y = 0;
                for (const level of levels) {
                    const width = level.reduce((sum, node) => sum + node.width, 0) + gap * (level.length - 1);
                    let x = -width / 2;
                    for (const node of level) { node.x = x; node.y = y; x += node.width + gap; }
                    y += Math.max(...level.map(node => node.height)) + gap;
                }
            }
            else {
                let radius = 0;
                let previousSize = extent(levels[0][0]);
                levels[0][0].x = -levels[0][0].width / 2;
                levels[0][0].y = -anchorY(levels[0][0]);
                for (const level of levels.slice(1)) {
                    const size = Math.max(...level.map(extent));
                    radius = Math.max(radius + previousSize + size + gap,
                        level.length > 1 ? (2 * size + gap) / (2 * Math.sin(Math.PI / level.length)) : 0);
                    for (const [index, node] of level.entries()) {
                        const angle = -Math.PI / 2 + index * Math.PI * 2 / level.length;
                        node.x = Math.cos(angle) * radius - node.width / 2;
                        node.y = Math.sin(angle) * radius - anchorY(node);
                    }
                    previousSize = size;
                }
            }
            const left = Math.min(...component.map(node => node.x));
            const right = Math.max(...component.map(node => node.x + node.width));
            for (const node of component) { node.x += offset - left; }
            offset += right - left + gap * 2;
        }
    }
    const padding = 48;
    const left = Math.min(...nodes.map(node => node.x));
    const top = Math.min(...nodes.map(node => node.y));
    for (const node of nodes) { node.x += padding - left; node.y += padding - top; }
    const width = Math.max(...nodes.map(node => node.x + node.width)) + padding;
    const height = Math.max(...nodes.map(node => node.y + node.height)) + padding;
    const center = (node: INode): Point => ({ x: node.x + node.width / 2, y: node.y + anchorY(node) });
    const endpoint = (node: INode, dx: number, dy: number): Point => {
        const c = center(node);
        const ratio = node.hub ? Math.max(36 / Math.hypot(dx, dy), captionExit(node, dx, dy)) : Math.min(
            dx ? node.width / 2 / Math.abs(dx) : Infinity, dy ? node.height / 2 / Math.abs(dy) : Infinity);
        return { x: c.x + dx * ratio, y: c.y + dy * ratio };
    };
    const paths: IEdge[] = [];
    for (const inputEdge of edges) {
        const seconds = typeof inputEdge.duration === 'number' && Number.isFinite(inputEdge.duration) ? inputEdge.duration : 3;
        const count = typeof inputEdge.dotCount === 'number' && Number.isFinite(inputEdge.dotCount) ? inputEdge.dotCount : 3;
        const edge = { ...inputEdge,
            animation: inputEdge.animation === 'dash' || inputEdge.animation === 'dots' ? inputEdge.animation : 'none' as const,
            direction: inputEdge.direction === 'reverse' || inputEdge.direction === 'both' ? inputEdge.direction : 'forward' as const,
            duration: Math.max(.25, Math.min(60, seconds)), dotCount: Math.max(1, Math.min(8, Math.round(count)))
        };
        const source = byId.get(edge.source), target = byId.get(edge.target);
        if (!source || !target) { continue; }
        const a = center(source), b = center(target);
        if (source === target) {
            const x = source.x + source.width, y = source.y + source.height / 2;
            paths.push({ ...edge, path: `M ${x} ${y - 8} C ${x + 60} ${y - 64}, ${x + 60} ${y + 64}, ${x} ${y + 8}`, x: x + 44, y });
            continue;
        }
        const dx = b.x - a.x, dy = b.y - a.y;
        if (!dx && !dy) { continue; }
        if (mode === 'compact') {
            const lane = Math.min(source.x, target.x) - 24;
            const sx = source.hub ? a.x - 36 : source.x;
            const tx = target.hub ? b.x - 36 : target.x;
            paths.push({ ...edge, path: `M ${sx} ${a.y} H ${lane} V ${b.y} H ${tx}`, x: lane, y: (a.y + b.y) / 2 });
        }
        else {
            const start = endpoint(source, dx, dy), end = endpoint(target, -dx, -dy);
            paths.push({ ...edge, path: `M ${start.x} ${start.y} L ${end.x} ${end.y}`,
                x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 });
        }
    }
    return { nodes, edges: paths, width, height };
}

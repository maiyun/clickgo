export function sameValues(a, b) {
    return (a.length === b.length) && a.every((id, index) => id === b[index]);
}
export function copyPositions(ids, positions) {
    return Object.fromEntries(ids.flatMap(id => {
        const point = Object.hasOwn(positions, id) ? positions[id] : undefined;
        return point && Number.isFinite(point.x) && Number.isFinite(point.y) ? [[id, { 'x': point.x, 'y': point.y }]] : [];
    }));
}
export function samePositions(a, b) {
    const ids = Object.keys(a);
    return (ids.length === Object.keys(b).length) && ids.every(id => Object.hasOwn(b, id) &&
        Number.isFinite(a[id]?.x) && Number.isFinite(a[id]?.y) &&
        (a[id]?.x === b[id]?.x) && (a[id]?.y === b[id]?.y));
}
export function getDragPositions(moving, original, start, current, options) {
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
    dx = Math.min(maxX - Math.max(...moving.map(id => original[id].x)), Math.max(padding - Math.min(...moving.map(id => original[id].x)), dx));
    dy = Math.min(maxY - Math.max(...moving.map(id => original[id].y)), Math.max(padding - Math.min(...moving.map(id => original[id].y)), dy));
    return Object.fromEntries(moving.map(id => [id, {
            'x': original[id].x + dx, 'y': original[id].y + dy
        }]));
}
export function resolveLayout(ids, positions, options, priority = []) {
    const { width, height, cellWidth, cellHeight, gap, padding } = options;
    const stepX = cellWidth + gap;
    const stepY = cellHeight + gap;
    const columns = Math.max(0, Math.floor((width - padding * 2 + gap) / stepX));
    const rows = Math.max(0, Math.floor((height - padding * 2 + gap) / stepY));
    const cells = [];
    for (let i = 0; i < columns * rows; ++i) {
        const column = options.direction === 'column' ? Math.floor(i / rows) : i % columns;
        const row = options.direction === 'column' ? i % rows : Math.floor(i / columns);
        cells.push({ 'x': padding + (options.rtl ? columns - 1 - column : column) * stepX, 'y': padding + row * stepY });
    }
    const priorityIds = new Set(priority);
    const ordered = [...new Set(priority.filter(id => ids.includes(id))), ...ids.filter(id => !priorityIds.has(id))];
    const place = (more) => {
        const result = new Map(Object.entries(copyPositions(ids, positions)));
        const placed = new Set();
        const occupied = more ? [more] : [];
        const grid = new Set(occupied.map(point => `${point.x},${point.y}`));
        const fits = (point) => (point.x >= padding) && (point.y >= padding) &&
            (point.x + cellWidth <= width - padding) && (point.y + cellHeight <= height - padding);
        const free = (point) => options.snap ? !grid.has(`${point.x},${point.y}`) :
            !occupied.some(other => (point.x < other.x + stepX) && (point.x + stepX > other.x) &&
                (point.y < other.y + stepY) && (point.y + stepY > other.y));
        const put = (id, point) => {
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
            let point;
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
    const more = cells.at(-1) ?? null;
    if (ids.length > cells.length) {
        return place(more);
    }
    const result = place(null);
    return result.overflow.length && more ? place(more) : result;
}

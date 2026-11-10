import * as clickgo from 'clickgo';
import type { IDockGroupSizing } from '../lib/resize';

const owners = new WeakMap<object, Set<IDockGroupSizing>>();

export function register(group: IDockGroupSizing): void {
    if (!group.dock) return;
    let groups = owners.get(group.dock);
    if (!groups) owners.set(group.dock, groups = new Set());
    groups.add(group);
    refresh(group);
}

export function refresh(group: IDockGroupSizing): void {
    if (!group.dock) return;
    const groups = [...(owners.get(group.dock) ?? [])].sort((a, b) =>
        clickgo.dom.index(a.element) - clickgo.dom.index(b.element));
    for (const current of groups) {
        if (current.groups.length !== groups.length || current.groups.some((item, i) => item !== groups[i])) {
            current.access.cancelResize?.();
            current.groups = groups;
        }
    }
}

export function unregister(group: IDockGroupSizing): void {
    group.access.cancelResize?.();
    if (!group.dock) return;
    const groups = owners.get(group.dock);
    groups?.delete(group);
    refresh(group);
    if (!groups?.size) owners.delete(group.dock);
    group.groups = [];
}

function pair(group: IDockGroupSizing) {
    const next = group.nextGroup;
    if (!group.canResize || !next) return null;
    const first = group.element.getBoundingClientRect().height;
    const second = next.element.getBoundingClientRect().height;
    // A cramped Form must not jump larger when a separator is first touched.
    const minFirst = Math.min(first, group.minimumHeight);
    const minSecond = Math.min(second, next.minimumHeight);
    const area = group.element.parentElement;
    let extra = 0;
    if (area) {
        const style = getComputedStyle(area);
        const bottom = area.getBoundingClientRect().bottom -
            (parseFloat(style.borderBottomWidth) || 0) - (parseFloat(style.paddingBottom) || 0);
        let occupiedBottom = next.element.getBoundingClientRect().bottom;
        for (const child of area.children) {
            const rect = child.getBoundingClientRect();
            if (rect.height > 0) {
                occupiedBottom = Math.max(occupiedBottom, rect.bottom);
            }
        }
        extra = Math.max(0, bottom - occupiedBottom);
    }
    return { next, first, second, minFirst, minSecond, extra };
}

function apply(group: IDockGroupSizing, snapshot: NonNullable<ReturnType<typeof pair>>, delta: number): void {
    const change = Math.max(snapshot.minFirst - snapshot.first,
        Math.min(snapshot.extra + snapshot.second - snapshot.minSecond, delta));
    group.heightData = snapshot.first + change;
    snapshot.next.heightData = snapshot.second - change + Math.max(0, Math.min(change, snapshot.extra));
}

function emit(group: IDockGroupSizing): void {
    group.emit('update:height', group.heightData);
}

export function resizeDown(group: IDockGroupSizing, event: PointerEvent): void {
    if (event.button !== 0) return;
    group.access.cancelResize?.();
    const snapshot = pair(group);
    if (!snapshot) return;
    snapshot.next.access.cancelResize?.();
    const previous = [group.heightData, snapshot.next.heightData];
    const start = event.clientY;
    let moved = false;
    event.preventDefault();
    event.stopPropagation();
    const result = clickgo.modules.pointer.move(event, {
        cursor: 'row-resize',
        move: e => {
            if (!group.canResize || group.nextGroup !== snapshot.next || !group.element.isConnected ||
                !snapshot.next.element.isConnected) {
                group.access.cancelResize?.();
                return;
            }
            moved = true;
            apply(group, snapshot, e.clientY - start);
        },
        finish: (_event, detail) => {
            group.access.cancelResize = null;
            snapshot.next.access.cancelResize = null;
            if (detail.cancelled || !group.canResize || group.nextGroup !== snapshot.next) {
                [group.heightData, snapshot.next.heightData] = previous;
            }
            else if (moved) {
                emit(group);
                emit(snapshot.next);
            }
        }
    });
    group.access.cancelResize = result.cancel;
    snapshot.next.access.cancelResize = result.cancel;
}

export function resizeKeydown(group: IDockGroupSizing, event: KeyboardEvent): void {
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
    const snapshot = pair(group);
    if (!snapshot) return;
    event.preventDefault();
    event.stopPropagation();
    apply(group, snapshot, (event.key === 'ArrowUp' ? -1 : 1) * (event.shiftKey ? 1 : 10));
    emit(group);
    emit(snapshot.next);
}

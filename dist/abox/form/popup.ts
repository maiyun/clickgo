import type { IPopupDependencies } from '../../lib/form/popup';
import type * as lCore from '../../lib/core';

export function createPopupRuntime(deps: IPopupDependencies) {
const { lDom, lTool, changeFocus } = deps;
const popInfo: {
    'list': HTMLElement[];
    'elList': HTMLElement[];
    'wayList': Array<'normal' | 'click' | 'hover'>;
    'time': number[];
    'lastZIndex': number;
} = {
    'list': [],
    'elList': [],
    'wayList': [],
    'time': [],
    'lastZIndex': 0
};

const versions = new WeakMap<HTMLElement, number>();
const sizeOwned = new WeakSet<HTMLElement>();
const positionOwned = new WeakSet<HTMLElement>();
const flowing = new Map<HTMLElement, HTMLElement>();
function nextVersion(el: HTMLElement): number { const next = (versions.get(el) ?? 0) + 1; versions.set(el, next); return next; }
function releaseSize(el: HTMLElement): void { if (sizeOwned.delete(el)) lDom.unwatchSize(el); }
function releasePosition(el: HTMLElement): void { if (positionOwned.delete(el)) lDom.unwatchPosition(el); }
function cleanupPop(root: HTMLElement): void {
    for (const [pop, anchor] of [...flowing]) if (root === pop || root.contains(pop) || root === anchor || root.contains(anchor)) hidePop(pop);
    const index = popInfo.elList.findIndex((el, i) => root === el || root.contains(el) || (popInfo.list[i] && (root === popInfo.list[i] || root.contains(popInfo.list[i]))));
    if (index >= 0) hidePop(popInfo.elList[index]);
}
function appendToPop(el: HTMLElement): void {
    deps.getElements().popList.appendChild(el);
}
function removeFromPop(el: HTMLElement): void {
    deps.getElements().popList.removeChild(el);
}

interface IPopViewportStyle {
    'maxWidthSource': string;
    'maxWidthApplied': string;
    'maxHeightSource': string;
    'maxHeightApplied': string;
}
const popViewportStyles = new WeakMap<HTMLElement, IPopViewportStyle>();
function refreshPopPosition(el: HTMLElement, pop: HTMLElement, direction: 'h' | 'v' | 't' | PointerEvent | { x: number; y: number; }, size: { width?: number; height?: number; } = {}, overflow: 'auto' | 'visible' = 'auto', opening: boolean = false): void {
    const viewportPadding = 4;
    const maxWidth = Math.max(0, window.innerWidth - viewportPadding * 2);
    const maxHeight = Math.max(0, window.innerHeight - viewportPadding * 2);
    let viewportStyle = popViewportStyles.get(pop);
    if (!viewportStyle) {
        const computedStyle = getComputedStyle(pop);
        viewportStyle = {
            'maxWidthSource': computedStyle.maxWidth === 'none' ? '' : computedStyle.maxWidth,
            'maxWidthApplied': '',
            'maxHeightSource': computedStyle.maxHeight === 'none' ? '' : computedStyle.maxHeight,
            'maxHeightApplied': ''
        };
        popViewportStyles.set(pop, viewportStyle);
    }
    else {
        const widthChanged = pop.style.maxWidth !== viewportStyle.maxWidthApplied;
        const heightChanged = pop.style.maxHeight !== viewportStyle.maxHeightApplied;
        if (widthChanged || heightChanged) {
            const computedStyle = getComputedStyle(pop);
            if (widthChanged) {
                viewportStyle.maxWidthSource = computedStyle.maxWidth === 'none' ? '' : computedStyle.maxWidth;
            }
            if (heightChanged) {
                viewportStyle.maxHeightSource = computedStyle.maxHeight === 'none' ? '' : computedStyle.maxHeight;
            }
        }
    }
    const maxWidthStyle = viewportStyle.maxWidthSource ? `min(${viewportStyle.maxWidthSource}, ${maxWidth}px)` : `${maxWidth}px`;
    const maxHeightStyle = viewportStyle.maxHeightSource ? `min(${viewportStyle.maxHeightSource}, ${maxHeight}px)` : `${maxHeight}px`;
    if (pop.style.maxWidth !== maxWidthStyle) pop.style.maxWidth = maxWidthStyle;
    if (pop.style.maxHeight !== maxHeightStyle) pop.style.maxHeight = maxHeightStyle;
    viewportStyle.maxWidthApplied = pop.style.maxWidth;
    viewportStyle.maxHeightApplied = pop.style.maxHeight;
    if (pop.style.boxSizing !== 'border-box') pop.style.boxSizing = 'border-box';
    if (pop.style.overflow !== overflow) pop.style.overflow = overflow;
    if (pop.style.overscrollBehavior !== 'contain') pop.style.overscrollBehavior = 'contain';
    if (size.width !== undefined) {
        const widthStyle = `${Math.max(0, Math.min(size.width, maxWidth))}px`;
        if (pop.style.width !== widthStyle) pop.style.width = widthStyle;
    }
    if (size.height !== undefined) {
        const heightStyle = `${Math.max(0, Math.min(size.height, maxHeight))}px`;
        if (pop.style.height !== heightStyle) pop.style.height = heightStyle;
    }
    const width = Math.min(pop.offsetWidth, maxWidth);
    const height = Math.min(pop.offsetHeight, maxHeight);
    let left: number, top: number;
    const rtl = getComputedStyle(el).direction === 'rtl';
    if (typeof direction === 'string') {
        const bcr = el.getBoundingClientRect();
        if (direction === 'v') {
            left = rtl ? bcr.right - width : bcr.left;
            top = bcr.top + bcr.height;
        }
        else if (direction === 'h') {
            left = rtl ? bcr.left - width + 2 : bcr.right - 2;
            top = bcr.top - 2;
        }
        else {
            pop.removeAttribute('data-pop-t-bottom');
            left = bcr.left + bcr.width / 2 - width / 2;
            top = bcr.top - height - 10;
        }
        if (width + left > window.innerWidth - viewportPadding) {
            if (direction === 'v') {
                left = bcr.left + bcr.width - width;
            }
            else if (direction === 'h') {
                left = bcr.left - width + 2;
            }
            else {
                left = window.innerWidth - viewportPadding - width;
            }
        }
        if (left < viewportPadding) {
            if (direction === 'v') {
                left = bcr.left;
            }
            else if (direction === 'h') {
                left = bcr.right - 2;
            }
            else {
                left = viewportPadding;
            }
        }
        if (height + top > window.innerHeight - viewportPadding) {
            if (direction === 'v') {
                top = bcr.top - height;
            }
            else if (direction === 'h') {
                top = bcr.top + bcr.height - height + 2;
            }
            else {
            }
        }
        else if (top < 0 && direction === 't') {
            top = bcr.top + bcr.height + 10;
            pop.dataset.popTBottom = '';
        }
    }
    else {
        let x: number;
        let y: number;
        if (direction instanceof PointerEvent) {
            x = direction.clientX;
            y = direction.clientY;
        }
        else {
            x = direction.x;
            y = direction.y;
        }
        left = rtl ? x - width - 5 : x + 5;
        top = y + 7;
        if (width + left > window.innerWidth - viewportPadding) {
            left = x - width - 5;
        }
        else if (left < viewportPadding) {
            left = x + 5;
        }
        if (height + top > window.innerHeight - viewportPadding) {
            top = y - height - 5;
        }
    }
    left = Math.max(viewportPadding, Math.min(left, window.innerWidth - viewportPadding - width));
    top = Math.max(viewportPadding, Math.min(top, window.innerHeight - viewportPadding - height));
    if (opening && pop.style.left && (pop.style.left !== `${left}px` || pop.style.top !== `${top}px`)) {
        const transition = pop.style.transition;
        pop.style.transition = 'none';
        pop.removeAttribute('data-cg-open');
        void pop.offsetWidth;
        pop.style.transition = transition;
    }
    const leftStyle = `${left}px`;
    const topStyle = `${top}px`;
    if (pop.style.left !== leftStyle) pop.style.left = leftStyle;
    if (pop.style.top !== topStyle) pop.style.top = topStyle;
    pop.style.zIndex = (++popInfo.lastZIndex).toString();
}
let lastShowPopTime: number = 0;
function showPop(el: HTMLElement | lCore.IVue, pop: HTMLElement | lCore.IVue | undefined, direction: 'h' | 'v' | 't' | PointerEvent | { x: number; y: number; }, opt: {
    'size'?: { width?: number; height?: number; };
    'null'?: boolean;
    'autoPosition'?: boolean;
    'autoScroll'?: boolean;
    'flow'?: boolean;
    'overflow'?: 'auto' | 'visible';
    'way'?: 'normal' | 'click' | 'hover';
} = {}): void {
    if (!(el instanceof Element)) {
        if (!el.$el) {
            return;
        }
        el = el.$el;
    }
    if (pop && !(pop instanceof Element)) {
        if (!pop.$el) {
            return;
        }
        pop = pop.$el;
    }
    opt.null ??= false;
    opt.size ??= {};
    opt.flow ??= true;
    if (!pop && !opt.null) {
        return;
    }
    if (pop && !opt.flow) {
        if (pop.dataset.cgLevel !== undefined) {
            hidePop(pop);
        }
        pop.removeAttribute('data-cg-pop-none');
        pop.dataset.cgFlow = '';
        releaseSize(pop);
        flowing.set(pop, el);
        const version = nextVersion(pop);
        lTool.sleep(34).then(() => {
            if (versions.get(pop) !== version || pop.dataset.cgFlow === undefined) {
                return;
            }
            refreshPopPosition(el, pop, direction, opt.size, opt.overflow, true);
            if (opt.autoPosition) {
                if (lDom.watchSize(deps.getSysId(), pop, () => {
                    refreshPopPosition(el, pop, direction, opt.size, opt.overflow);
                })) { sizeOwned.add(pop); }
            }
            pop.dataset.cgOpen = '';
        }).catch(() => {});
        return;
    }
    const now = Date.now();
    if (now - lastShowPopTime < 5) {
        lastShowPopTime = now;
        return;
    }
    lastShowPopTime = now;
    if (pop?.dataset.cgFlow !== undefined) {
        hidePop(pop);
    }
    if (el.dataset.cgPopOpen !== undefined) {
        return;
    }
    const parentPop = lDom.findParentByData(el, 'cg-pop');
    if (parentPop?.dataset.cgLevel !== undefined) {
        const nextlevel = parseInt(parentPop.dataset.cgLevel) + 1;
        if (popInfo.elList[nextlevel]) {
            hidePop(popInfo.elList[nextlevel]);
        }
    }
    else {
        hidePop();
    }
    if (!pop) {
        popInfo.elList.push(el);
        el.dataset.cgPopOpen = '';
        el.dataset.cgLevel = (popInfo.elList.length - 1).toString();
        return;
    }
    pop.removeAttribute('data-cg-pop-none');
    popInfo.list.push(pop);
    popInfo.elList.push(el);
    popInfo.wayList.push(opt.way ?? 'normal');
    popInfo.time.push(Date.now());
    pop.dataset.cgLevel = (popInfo.list.length - 1).toString();
    const version = nextVersion(pop);
    el.dataset.cgLevel = (popInfo.elList.length - 1).toString();
    lTool.sleep(34).then(() => {
        if (versions.get(pop) !== version || pop.dataset.cgLevel === undefined) {
            return;
        }
        refreshPopPosition(el, pop, direction, opt.size, opt.overflow, true);
        if (opt.autoPosition && typeof direction === 'string') {
            if (lDom.watchSize(deps.getSysId(), pop, () => {
                refreshPopPosition(el, pop, direction, opt.size, opt.overflow);
            })) { sizeOwned.add(pop); }
        }
        if (opt.autoScroll && typeof direction === 'string') {
            if (lDom.watchPosition(el, () => {
                refreshPopPosition(el, pop, direction, opt.size, opt.overflow);
            })) { positionOwned.add(el); }
        }
        pop.dataset.cgOpen = '';
        el.dataset.cgPopOpen = '';
    }).catch(() => {});
}
function hidePop(pop?: HTMLElement | lCore.IVue): void {
    if (pop && !(pop instanceof HTMLElement)) {
        if (!pop.$el) {
            return;
        }
        pop = pop.$el;
    }
    if (!pop) {
        if (popInfo.elList.length === 0) {
            return;
        }
        hidePop(popInfo.elList[0]);
        return;
    }
    if (pop.dataset.cgFlow !== undefined) {
        const version = nextVersion(pop);
        flowing.delete(pop);
        pop.removeAttribute('data-cg-flow');
        pop.removeAttribute('data-cg-open');
        releaseSize(pop);
        lTool.sleep(334).then(() => {
            if (versions.get(pop) !== version || pop.dataset.cgFlow !== undefined || pop.dataset.cgLevel !== undefined) {
                return;
            }
            pop.dataset.cgPopNone = '';
        }).catch(() => {});
        return;
    }
    if (pop.dataset.cgLevel === undefined) {
        return;
    }
    const isPop: boolean = pop.dataset.cgPop !== undefined ? true : false;
    const level = pop.dataset.cgLevel ? parseInt(pop.dataset.cgLevel) : -1;
    if (level === -1) {
        return;
    }
    if (popInfo.elList[level + 1]) {
        hidePop(popInfo.elList[level + 1]);
    }
    if (isPop) {
        const version = nextVersion(pop);
        pop.removeAttribute('data-cg-open');
        pop.removeAttribute('data-cg-level');
        releaseSize(pop);
        releasePosition(popInfo.elList[level]);
        popInfo.elList[level].removeAttribute('data-cg-pop-open');
        popInfo.elList[level].removeAttribute('data-cg-level');
        lTool.sleep(334).then(() => {
            if (versions.get(pop) !== version || pop.dataset.cgLevel !== undefined || pop.dataset.cgFlow !== undefined) {
                return;
            }
            pop.dataset.cgPopNone = '';
        }).catch(() => {
        });
    }
    else {
        if (popInfo.list[level]) {
            const opop = popInfo.list[level];
            const version = nextVersion(opop);
            opop.removeAttribute('data-cg-open');
            opop.removeAttribute('data-cg-level');
            releaseSize(popInfo.list[level]);
            releasePosition(pop);
            lTool.sleep(334).then(() => {
                if (versions.get(opop) !== version || opop.dataset.cgLevel !== undefined || opop.dataset.cgFlow !== undefined) {
                    return;
                }
                opop.dataset.cgPopNone = '';
            }).catch(() => {
            });
        }
        pop.removeAttribute('data-cg-pop-open');
        pop.removeAttribute('data-cg-level');
    }
    popInfo.list.splice(level);
    popInfo.elList.splice(level);
    popInfo.wayList.splice(level);
    popInfo.time.splice(level);
}
function isJustPop(el: HTMLElement | number): boolean {
    if (el instanceof HTMLElement) {
        const level = el.dataset.cgLevel;
        if (!level) {
            return false;
        }
        el = parseInt(level);
    }
    const time = popInfo.time[el];
    if (Date.now() - time >= 100) {
        return false;
    }
    return true;
}
async function doFocusAndPopEvent(e: PointerEvent): Promise<void> {
    const target = e.target;
    if (!target) {
        return;
    }
    const paths: HTMLElement[] = (e as any).path ?? (e.composedPath ? e.composedPath() : []);
    let isCgPopOpen: HTMLElement | null = null;
    for (const item of paths) {
        if (!item.tagName) {
            continue;
        }
        if (item.dataset.cgLevel !== undefined && item.dataset.cgPop === undefined) {
            isCgPopOpen = item;
            continue;
        }
        if (item.classList.contains('cg-form-wrap')) {
            const formId = item.getAttribute('data-form-id') ?? '';
            await changeFocus(formId);
            if (isCgPopOpen) {
                if (!isJustPop(isCgPopOpen)) {
                    hidePop();
                }
            }
            else {
                hidePop();
            }
            return;
        }
        if (item.tagName.toLowerCase() === 'body') {
            break;
        }
    }
    for (const item of paths) {
        if (!item.tagName) {
            continue;
        }
        if (item.tagName.toLowerCase() === 'body') {
            break;
        }
        if (item.dataset.cgPop !== undefined) {
            if (item.dataset.cgLevel) {
                const nextlevel = parseInt(item.dataset.cgLevel) + 1;
                if (popInfo.wayList[nextlevel] === 'click' && !isJustPop(nextlevel)) {
                    hidePop(popInfo.list[nextlevel]);
                }
            }
            return;
        }
    }
    hidePop();
    await changeFocus();
}
window.addEventListener('pointerdown', (e) => {
    doFocusAndPopEvent(e).catch(() => {});
});
function keydownPop(e: KeyboardEvent): void {
    if ((e.key !== 'Escape') || e.isComposing || !popInfo.list.length) {
        return;
    }
    const anchor = popInfo.elList[0];
    hidePop();
    anchor.focus({ 'preventScroll': true });
    e.preventDefault();
}
window.addEventListener('keydown', keydownPop);


return { appendToPop, removeFromPop, showPop, hidePop, isJustPop, doFocusAndPopEvent, cleanupPop };
}

export function measureWidth(element: HTMLElement, form: HTMLElement): number {
    let left = 0;
    let right = document.documentElement.clientWidth;
    let owner = element.parentElement;
    while (owner) {
        const rect = owner.getBoundingClientRect();
        const style = getComputedStyle(owner);
        left = Math.max(left, rect.left + (parseFloat(style.borderLeftWidth) || 0) +
            (parseFloat(style.paddingLeft) || 0));
        right = Math.min(right, rect.right - (parseFloat(style.borderRightWidth) || 0) -
            (parseFloat(style.paddingRight) || 0));
        if (owner === form) {
            break;
        }
        owner = owner.parentElement;
    }
    return Math.max(0, right - left);
}

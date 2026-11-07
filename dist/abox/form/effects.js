export function createEffectsRuntime(deps) {
    let circularGeneration = 0;
    let rectangleGeneration = 0;
    function getRectByBorder(border, area = deps.getAvailArea()) {
        let width, height, left, top;
        if (typeof border === 'string') {
            switch (border) {
                case 'lt': {
                    width = area.width / 2;
                    height = area.height / 2;
                    left = area.left;
                    top = area.top;
                    break;
                }
                case 't': {
                    width = area.width;
                    height = area.height;
                    left = area.left;
                    top = area.top;
                    break;
                }
                case 'tr': {
                    width = area.width / 2;
                    height = area.height / 2;
                    left = area.left + area.width / 2;
                    top = area.top;
                    break;
                }
                case 'r': {
                    width = area.width / 2;
                    height = area.height;
                    left = area.left + area.width / 2;
                    top = area.top;
                    break;
                }
                case 'rb': {
                    width = area.width / 2;
                    height = area.height / 2;
                    left = area.left + area.width / 2;
                    top = area.top + area.height / 2;
                    break;
                }
                case 'b': {
                    width = area.width;
                    height = area.height / 2;
                    left = area.left;
                    top = area.top + area.height / 2;
                    break;
                }
                case 'bl': {
                    width = area.width / 2;
                    height = area.height / 2;
                    left = area.left;
                    top = area.top + area.height / 2;
                    break;
                }
                case 'l': {
                    width = area.width / 2;
                    height = area.height;
                    left = area.left;
                    top = area.top;
                    break;
                }
                default: {
                    break;
                }
            }
        }
        else {
            width = border.width ?? area.width;
            height = border.height ?? area.height;
            left = border.left ?? area.left;
            top = border.top ?? area.top;
        }
        return {
            'width': width,
            'height': height,
            'left': left,
            'top': top
        };
    }
    function showCircular(x, y) {
        const circular = deps.getElements().circular;
        const generation = ++circularGeneration;
        circular.style.transition = 'none';
        requestAnimationFrame(function () {
            if (generation !== circularGeneration)
                return;
            circular.style.width = '6px';
            circular.style.height = '6px';
            circular.style.left = (x - 3).toString() + 'px';
            circular.style.top = (y - 3).toString() + 'px';
            circular.style.opacity = '1';
            requestAnimationFrame(function () {
                if (generation !== circularGeneration)
                    return;
                circular.style.transition = 'all .3s var(--g-cubic)';
                requestAnimationFrame(function () {
                    if (generation !== circularGeneration)
                        return;
                    circular.style.width = '60px';
                    circular.style.height = '60px';
                    circular.style.left = (x - 30).toString() + 'px';
                    circular.style.top = (y - 30).toString() + 'px';
                    circular.style.opacity = '0';
                });
            });
        });
    }
    function moveRectangle(border) {
        const rectangle = deps.getElements().rectangle;
        const dataReady = rectangle.getAttribute('data-ready') ?? '0';
        if (dataReady === '0') {
            return;
        }
        const setDataBorder = typeof border === 'string' ? border : `o-${border.left}-${border.top ?? 'n'}-${border.width}-${border.height ?? 'n'}`;
        if (rectangle.getAttribute('data-dir') !== setDataBorder)
            rectangle.setAttribute('data-dir', setDataBorder);
        const pos = getRectByBorder(border);
        const width = pos.width - 20;
        const height = pos.height - 20;
        const left = pos.left + 10;
        const top = pos.top + 10;
        if (width !== undefined && height !== undefined && left !== undefined && top !== undefined) {
            if (rectangle.style.width !== `${width}px`)
                rectangle.style.width = `${width}px`;
            if (rectangle.style.height !== `${height}px`)
                rectangle.style.height = `${height}px`;
            if (rectangle.style.left !== `${left}px`)
                rectangle.style.left = `${left}px`;
            if (rectangle.style.top !== `${top}px`)
                rectangle.style.top = `${top}px`;
        }
    }
    function showRectangle(x, y, border) {
        const rectangle = deps.getElements().rectangle;
        const generation = ++rectangleGeneration;
        rectangle.setAttribute('data-ready', '0');
        rectangle.style.transition = 'none';
        requestAnimationFrame(function () {
            if (generation !== rectangleGeneration)
                return;
            rectangle.style.width = '5px';
            rectangle.style.height = '5px';
            rectangle.style.left = (x - 10).toString() + 'px';
            rectangle.style.top = (y - 10).toString() + 'px';
            rectangle.style.opacity = '1';
            rectangle.setAttribute('data-ready', '0');
            rectangle.setAttribute('data-dir', '');
            requestAnimationFrame(function () {
                if (generation !== rectangleGeneration)
                    return;
                rectangle.style.transition = 'all .3s var(--g-cubic)';
                requestAnimationFrame(function () {
                    if (generation !== rectangleGeneration)
                        return;
                    rectangle.setAttribute('data-ready', '1');
                    moveRectangle(border);
                });
            });
        });
    }
    function hideRectangle() {
        const rectangle = deps.getElements().rectangle;
        ++rectangleGeneration;
        rectangle.setAttribute('data-ready', '0');
        rectangle.style.opacity = '0';
    }
    return { getRectByBorder, showCircular, moveRectangle, showRectangle, hideRectangle };
}

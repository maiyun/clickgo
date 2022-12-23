import * as clickgo from 'clickgo';
import * as types from '~/types/index';

interface IDItem {
    'type': 'rect' | 'circle' | 'ellipse' | 'line' | 'polyline' | 'polygon' | 'path';
    'width': number;
    'height': number;
    'x': number;
    'y': number;
    'move'?: boolean;
    'resize'?: string[];
}

export default class extends clickgo.control.AbstractControl {

    public props: {
        'modelValue': Record<string, IDItem>;
    } = {
            'modelValue': {}
        };

    /** --- 是否正在拖动、改变大小的交互 --- */
    public isInteract: boolean = false;

    /** --- 是否在拖动选择中 --- */
    public isSelection: boolean = false;

    /** --- 当前选中状态的 id 列表 --- */
    public selected: string[] = [];

    public wrapDown(e: MouseEvent | TouchEvent): void {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        if (e.target !== e.currentTarget) {
            return;
        }
        if (!e.ctrlKey && !e.metaKey) {
            this.selected.length = 0;
        }
        // --- 选框相关 ---
        const rect = this.element.getBoundingClientRect();
        const x: number = (e instanceof MouseEvent) ? e.clientX : e.touches[0].clientX;
        const y: number = (e instanceof MouseEvent) ? e.clientY : e.touches[0].clientY;
        // --- 鼠标手指只会响应一个，进行建立选区 ---
        clickgo.dom.bindDown(e, {
            start: (): void => {
                this.isSelection = true;
            },
            move: (ne: MouseEvent | TouchEvent): void => {
                const nx: number = (ne instanceof MouseEvent) ? ne.clientX : ne.touches[0].clientX;
                const ny: number = (ne instanceof MouseEvent) ? ne.clientY : ne.touches[0].clientY;
                if (nx > x) {
                    this.refs.selection.setAttribute('x', (x - rect.left).toString());
                    this.refs.selection.setAttribute('width', (nx - x).toString());
                }
                else {
                    this.refs.selection.setAttribute('x', (nx - rect.left).toString());
                    this.refs.selection.setAttribute('width', (x - nx).toString());
                }
                if (ny > y) {
                    this.refs.selection.setAttribute('y', (y - rect.top).toString());
                    this.refs.selection.setAttribute('height', (ny - y).toString());
                }
                else {
                    this.refs.selection.setAttribute('y', (ny - rect.top).toString());
                    this.refs.selection.setAttribute('height', (y - ny).toString());
                }
            },
            end: (ne: MouseEvent | TouchEvent) => {
                // --- 判断要选中 ---
                const left = Math.round(parseFloat(this.refs.selection.getAttribute('x')!));
                const right = Math.round(parseFloat(this.refs.selection.getAttribute('width')!)) + left;
                const top = Math.round(parseFloat(this.refs.selection.getAttribute('y')!));
                const bottom = Math.round(parseFloat(this.refs.selection.getAttribute('height')!)) + top;
                if (!ne.ctrlKey && !ne.metaKey) {
                    this.selected.length = 0;
                }
                for (const id in this.props.modelValue) {
                    const item = this.props.modelValue[id];
                    if ((right < item.x) ||
                        (left > item.x + item.width) ||
                        (bottom < item.y) ||
                        (top > item.y + item.height)
                    ) {
                        continue;
                    }
                    if (this.selected.includes(id)) {
                        continue;
                    }
                    this.selected.push(id);
                }
                // --- 重置 ---
                this.refs.selection.setAttribute('x', '0');
                this.refs.selection.setAttribute('y', '0');
                this.refs.selection.setAttribute('width', '1');
                this.refs.selection.setAttribute('height', '1');
                this.isSelection = false;
            }
        });
    }

    public resize(e: MouseEvent | TouchEvent, id: string, dir: types.TDomBorder): void {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        clickgo.dom.bindResize(e, {
            'objectLeft': this.props.modelValue[id].x,
            'objectTop': this.props.modelValue[id].y,
            'objectWidth': this.props.modelValue[id].width,
            'objectHeight': this.props.modelValue[id].height,
            'border': dir,
            'start': () => {
                this.isInteract = true;
            },
            'move': (left, top, width, height) => {
                let item = this.props.modelValue[id];

                let x = item.x;
                item.x = left;
                x = item.x - x;

                let y = item.y;
                item.y = top;
                y = item.y - y;

                let widthx = item.width;
                item.width = width;
                widthx = item.width - widthx;

                let heightx = item.height;
                item.height = height;
                heightx = item.height - heightx;

                for (const key of this.selected) {
                    if (key === id) {
                        continue;
                    }
                    item = this.props.modelValue[key];
                    item.x += x;
                    item.y += y;
                    item.width += widthx;
                    item.height += heightx;
                }
            },
            'end': () => {
                this.isInteract = false;
            }
        });
    }

    public down(e: MouseEvent | TouchEvent, id: string): void {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        // --- 判断是否选中 ---
        if (!this.selected.includes(id)) {
            if (!e.ctrlKey && !e.metaKey) {
                this.selected.length = 0;
            }
            this.selected.push(id);
        }
        // --- 再来看是否拖动 ---
        if (this.props.modelValue[id].move === false) {
            return;
        }
        clickgo.dom.bindMove(e, {
            'areaObject': this.element,
            'object': e.currentTarget as HTMLElement,
            'cursor': 'auto',
            start: (): void => {
                this.isInteract = true;
            },
            move: (e, o): void => {
                for (const key of this.selected) {
                    this.props.modelValue[key].x += o.ox;
                    this.props.modelValue[key].y += o.oy;
                }
            },
            end: (): void => {
                this.isInteract = false;
            }
        });
    }

    public onMounted(): void {
        this.watch('modelValue', () => {
            for (let i = 0; i < this.selected.length; ++i) {
                const id = this.selected[i];
                if (this.props.modelValue[id]) {
                    continue;
                }
                this.selected.splice(i, 1);
                --i;
            }
        });
    }

}

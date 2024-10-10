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
    'index'?: number;
}

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'update:selected': null,
    };

    public props: {
        'modelValue': Record<string, IDItem>;
        'selected': string[] | string;
    } = {
            'modelValue': {},
            'selected': []
        };

    /** --- 是否正在拖动、改变大小的交互 --- */
    public isInteract: boolean = false;

    /** --- 是否在拖动选择中 --- */
    public isSelection: boolean = false;

    /** --- 当前选中状态的 id 列表 --- */
    public selectedData: string[] = [];

    public get modelValueComp(): IDItem[] {
        const arr = Object.keys(this.props.modelValue).map(key => ({ 'id': key, ...this.props.modelValue[key] }));
        arr.sort((a, b) => (a.index ?? 1) - (b.index ?? 1));
        return arr;
    }

    public wrapDown(e: MouseEvent | TouchEvent): void {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        if (e.target !== e.currentTarget) {
            return;
        }
        if (!e.ctrlKey && !e.metaKey) {
            this.selectedData.length = 0;
            this.updateSelected();
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
                    this.selectedData.length = 0;
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
                    if (this.selectedData.includes(id)) {
                        continue;
                    }
                    this.selectedData.push(id);
                }
                this.updateSelected();
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

                for (const key of this.selectedData) {
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
        if (!this.selectedData.includes(id)) {
            if (!e.ctrlKey && !e.metaKey) {
                this.selectedData.length = 0;
            }
            this.selectedData.push(id);
        }
        this.updateSelected();
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
                for (const key of this.selectedData) {
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
            for (let i = 0; i < this.selectedData.length; ++i) {
                const id = this.selectedData[i];
                if (this.props.modelValue[id]) {
                    continue;
                }
                this.selectedData.splice(i, 1);
                --i;
            }
            this.updateSelected();
        });
        this.watch('selected', () => {
            this.selectedData = clickgo.tool.clone(this.propArray('selected'));
        }, {
            'deep': true,
            'immediate': true
        });
    }

    /** --- 向上更新 --- */
    public updateSelected(): void {
        if (
            (this.selectedData.length === this.propArray('selected').length)
            && this.selectedData.every((item: string) => this.propArray('selected').includes(item))
        ) {
            return;
        }
        this.emit('update:selected', clickgo.tool.clone(this.selectedData));
    }

}

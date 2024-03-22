import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        'disabled': boolean | string;
        'must': boolean | string;
        'multi': boolean | string;
        'ctrl': boolean | string;
        'selection': boolean | string;
        'gesture': string[] | string;
        'scroll': 'auto' | 'hidden' | 'visible';
        /** --- 默认可排序 --- */
        'sort': boolean | string;
        /** --- 是否鼠标可调整列宽度，此模式下每列宽均为数值，不能为 0 --- */
        'split': boolean | string;
        /** --- 是否开启虚拟 DOM 模式，默认不开启 --- */
        'virtual': boolean | string;

        'data': any[];
        'sizes': Record<string, number | undefined>;
        'modelValue': Array<string | number>;
    } = {
            'disabled': false,
            'must': true,
            'multi': false,
            'ctrl': true,
            'selection': false,
            'gesture': [],
            'scroll': 'auto',
            'sort': false,
            'split': false,
            'virtual': false,

            'data': [],
            'sizes': {},
            'modelValue': []
        };

    /** --- 列头信息 --- */
    public items: Array<{
        'label': string;
        /** --- 用户设置的默认宽度值 --- */
        'width': number;
        'sort'?: boolean;
    }> = [];

    /** --- item width 的映射 --- */
    public widthMap: Record<string, number> = {};

    /** --- 当前是否排序中 --- */
    public nowSort: string[] = [];

    // --- 外部 ---

    public arrowUp(): void {
        this.refs.gl.arrowUp();
    }

    public arrowDown(): void {
        this.refs.gl.arrowDown();
    }

    // --- 子组件 ---

    /** --- 修改 header 的 label --- */
    public setHeaderLabel(n: string, old: string): void {
        for (const item of this.items) {
            if (item.label !== old) {
                continue;
            }
            item.label = n;
            this.widthMap[n] = this.widthMap[old];
            delete this.widthMap[old];
            break;
        }
    }

    /** --- 修改 header 的宽度 --- */
    public setHeaderWidth(n: string, width: number): void {
        if (this.widthMap[n] === undefined) {
            return;
        }
        this.widthMap[n] = width;
    }

    /** --- 修改 header 的 sort --- */
    public setHeaderSort(n: string, sort?: boolean): void {
        for (const item of this.items) {
            if (item.label !== n) {
                continue;
            }
            item.sort = sort;
            break;
        }
    }

    // --- 内部 ---

    public updateScrollLeft(sl: number): any {
        this.refs.header.scrollLeft = sl;
    }

    public refreshHeader(): void {
        const slots = this.slotsAll('default');
        if (slots.length === this.items.length) {
            return;
        }
        this.items.length = 0;
        this.widthMap = {};
        for (const slot of slots) {
            if (!slot.props.label) {
                continue;
            }
            // --- 用户的应该的 width ---
            const width = slot.props.width ? parseInt(slot.props.width) : 0;
            this.items.push({
                'label': slot.props.label,
                'width': width,
                'sort': slot.props.sort !== undefined ? clickgo.tool.getBoolean(slot.props.sort) : slot.props.sort
            });
            // --- 再根据 split 状态确定是否设置为默认 width  ---
            this.widthMap[slot.props.label] = this.propBoolean('split') ? (width ? width : 150) : width;
        }
        this.checkNowSort();
    }

    /** --- 检测当前列已经不能 sort 了，但是目前还在 nowSort 当中 --- */
    public checkNowSort(): void {
        if (!this.nowSort.length) {
            return;
        }
        for (const item of this.items) {
            if (item.label !== this.nowSort[0]) {
                continue;
            }
            const sort = item.sort === undefined ? this.propBoolean('sort') : item.sort;
            if (sort) {
                return;
            }
            break;
        }
        // --- 找到了但不是 sort 和没找到，都要重置 ---
        this.nowSort.length = 0;
        this.emit('sort');
    }

    // --- 头部项点击事件 ---
    public headerClick(e: MouseEvent | TouchEvent, i: number): void {
        clickgo.dom.bindClick(e, () => {
            const item = this.items[i];
            const sort = item.sort === undefined ? this.propBoolean('sort') : item.sort;
            if (!sort) {
                return;
            }
            if (this.nowSort[0] !== item.label) {
                this.nowSort.length = 0;
                this.nowSort.push(item.label);
                this.nowSort.push('desc');
                this.emit('sort', item.label, 'desc');
                return;
            }
            if (this.nowSort[1] === 'desc') {
                this.nowSort[1] = 'asc';
                this.emit('sort', item.label, 'asc');
                return;
            }
            this.nowSort.length = 0;
            this.emit('sort');
        });
    }

    // --- 绑定拖动改变列宽 ---
    public bindResize(e: MouseEvent | TouchEvent, i: number): void {
        const el = (e.currentTarget as HTMLElement).parentNode as HTMLElement;
        clickgo.dom.bindResize(e, {
            'object': el,
            'border': 'r',
            'minWidth': 50,
            'move': (left, top, width) => {
                this.widthMap[this.items[i].label] = width;
            }
        });
    }

    public onMounted(): void {
        this.watch('sort', () => {
            this.checkNowSort();
        });
        this.watch('split', () => {
            if (this.props.split) {
                // --- 不可拖动变可拖动 ---
                for (let i = 0; i < this.items.length; ++i) {
                    if (this.items[i].width > 0) {
                        continue;
                    }
                    this.widthMap[this.items[i].label] = (this.refs.header.children[i] as HTMLElement).offsetWidth;
                }
            }
            else {
                // --- 可拖动变不可拖动 ---
                for (const item of this.items) {
                    if (item.width === this.widthMap[item.label]) {
                        continue;
                    }
                    this.widthMap[item.label] = item.width;
                }
            }
        }, {
            'immediate': true
        });
    }

}

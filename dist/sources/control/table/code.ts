import * as clickgo from 'clickgo';
import * as types from '~/types/index';

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'sort': null,
        'select': null,
        'gesture': null,

        'update:modelValue': null
    };

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
        /** --- 左侧列吸附数量 --- */
        'stickyleft': number | string;
        /** --- 右侧列吸附数量 --- */
        'stickyright': number | string;

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
            'stickyleft': 0,
            'stickyright': 0,

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

    /** --- 计算属性，获取 items 的总数 --- */
    public get itemsLength() {
        return this.items.length;
    }
    
    public get stickyleftindex(): number {
        if (this.propInt('stickyleft') <= 0) {
            return 0;
        }
        return this.itemsLength - this.propInt('stickyright');
    }

    public get stickyrightindex(): number {
        if (this.propInt('stickyright') <= 0) {
            return 0;
        }
        return this.itemsLength - this.propInt('stickyright');
    }

    /** --- item width 的映射 --- */
    public widthMap: number[] = [];

    /** --- 当前是否排序中，-1 为没有排序中 --- */
    public nowSort: {
        'index': number;
        'sort': 'desc' | 'asc';
    } = {
        'index': -1,
        'sort': 'desc'
    };

    // --- 外部 ---

    public arrowUp(): void {
        this.refs.gl.arrowUp();
    }

    public arrowDown(): void {
        this.refs.gl.arrowDown();
    }

    // --- 子组件 ---

    /** --- 修改 header 的 label --- */
    public setHeaderLabel(index: number, n: string): void {
        const item = this.items[index];
        if (!item) {
            return;
        }
        item.label = n;
    }

    /** --- 修改 header 的宽度 --- */
    public setHeaderWidth(index: number, width: number): void {
        if (this.widthMap[index] === undefined) {
            return;
        }
        this.widthMap[index] = width;
    }

    /** --- 修改 header 的 sort --- */
    public setHeaderSort(index: number, sort?: boolean): void {
        const item = this.items[index];
        if (!item) {
            return;
        }
        item.sort = sort;
    }

    /** --- 根据 index 判断当前项是否是吸附项 --- */
    public get isSticky() {
        return (index: number) => {

        };
    }

    // --- 内部 ---

    public updateScrollLeft(sl: number): any {
        this.refs.header.scrollLeft = sl;
    }

    public refreshHeader(): void {
        const slots = this.slotsAll('default');
        this.items.length = 0;
        this.widthMap.length = 0;
        for (const slot of slots) {
            // --- 用户的应该的 width ---
            const width = slot.props.width ? parseInt(slot.props.width) : 0;
            this.items.push({
                'label': slot.props.label ?? '',
                'width': width,
                'sort': slot.props.sort !== undefined ? clickgo.tool.getBoolean(slot.props.sort) : slot.props.sort
            });
            // --- 再根据 split 状态确定是否设置为默认 width  ---
            this.widthMap.push(this.propBoolean('split') ? (width ? width : 150) : width);
        }
        this.checkNowSort();
    }

    /** --- 检测当前列已经不能 sort 了，但是目前还在 nowSort 当中 --- */
    public checkNowSort(): void {
        if (this.nowSort.index === -1) {
            return;
        }
        for (let i = 0; i < this.items.length; ++i) {
            if (i !== this.nowSort.index) {
                continue;
            }
            const item = this.items[i];
            const sort = item.sort === undefined ? this.propBoolean('sort') : item.sort;
            if (sort) {
                return;
            }
            break;
        }
        // --- 找到了但不是 sort 和没找到，都要重置 ---
        this.nowSort.index = -1;
        const event: types.ITableSortEvent = {
            'go': true,
            preventDefault: function() {
                this.go = false;
            },
            'detail': {
                'index': -1,
                'label': '',
                'sort': 'desc'
            }
        };
        this.emit('sort', event);
    }

    // --- 头部项点击事件 ---
    public headerClick(e: MouseEvent | TouchEvent, i: number): void {
        clickgo.dom.bindClick(e, () => {
            const item = this.items[i];
            const sort = item.sort === undefined ? this.propBoolean('sort') : item.sort;
            if (!sort) {
                return;
            }
            const event: types.ITableSortEvent = {
                'go': true,
                preventDefault: function() {
                    this.go = false;
                },
                'detail': {
                    'index': i,
                    'label': item.label,
                    'sort': 'desc'
                }
            };
            if (this.nowSort.index !== i) {
                this.emit('sort', event);
                if (!event.go) {
                    return;
                }
                this.nowSort.index = i;
                this.nowSort.sort = 'desc';
                return;
            }
            if (this.nowSort.sort === 'desc') {
                event.detail.sort = 'asc';
                this.emit('sort', event);
                if (!event.go) {
                    return;
                }
                this.nowSort.index = i;
                this.nowSort.sort = 'asc';
                return;
            }
            event.detail.index = -1;
            event.detail.label = '';
            this.emit('sort', event);
            if (!event.go) {
                return;
            }
            this.nowSort.index = -1;
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
                this.widthMap[i] = width;
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
                    this.widthMap[i] = (this.refs.header.children[i] as HTMLElement).offsetWidth;
                }
            }
            else {
                // --- 可拖动变不可拖动 ---
                for (let i = 0; i < this.items.length; ++i) {
                    const item = this.items[i];
                    if (item.width === this.widthMap[i]) {
                        continue;
                    }
                    this.widthMap[i] = item.width;
                }
            }
        }, {
            'immediate': true
        });
    }

}

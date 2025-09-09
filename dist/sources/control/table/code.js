import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.emits = {
            'sort': null,
            'select': null,
            'itemclicked': null,
            'gesture': null,
            'update:modelValue': null
        };
        this.props = {
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
            'fixed': undefined,
            'map': {},
            'data': [],
            'sizes': {},
            'modelValue': [],
            'mode': 'default'
        };
        /** --- 列头信息 --- */
        this.items = [];
        /** --- item width 的映射 --- */
        this.widthMap = [];
        /** --- item min width 的映射 --- */
        this.minWidthMap = [];
        /** --- 当前的滚动位置 --- */
        this.scrollLeft = 0;
        /** --- 当前总宽度 --- */
        this.scrollWidth = 0;
        /** --- 当前可视宽度 --- */
        this.clientWidth = 0;
        /** --- 当前是否排序中，-1 为没有排序中 --- */
        this.nowSort = {
            'index': -1,
            'sort': 'desc'
        };
        /** --- 当前列是否是固定模式，是的话当前列是固定在左侧还是右侧 --- */
        this.isFixed = {
            'left': undefined,
            'right': undefined,
        };
    }
    /** --- 计算属性，获取 items 的总数 --- */
    get itemsLength() {
        return this.items.length;
    }
    /**
     * --- 最大可拖动的 scroll 左侧位置 ---
     */
    get maxScrollLeft() {
        return this.scrollWidth - this.clientWidth;
    }
    // --- 外部 ---
    arrowUp() {
        this.refs.gl.arrowUp();
    }
    arrowDown() {
        this.refs.gl.arrowDown();
    }
    // --- 子组件 ---
    /** --- 修改 header 的 label --- */
    setHeaderLabel(index, n) {
        const item = this.items[index];
        if (!item) {
            return;
        }
        item.label = n;
    }
    /** --- 修改 header 的宽度 --- */
    setHeaderWidth(index, width) {
        this.widthMap[index] = width;
    }
    /** --- 修改 header 的最小宽度 --- */
    setHeaderMinWidth(index, minWidth) {
        this.minWidthMap[index] = minWidth;
    }
    /** --- 修改 header 的 sort --- */
    setHeaderSort(index, sort) {
        const item = this.items[index];
        if (!item) {
            return;
        }
        item.sort = sort;
    }
    // --- 内部 ---
    updateScrollLeft(sl) {
        this.refs.header.scrollLeft = sl;
        this.scrollLeft = sl;
    }
    refreshHeader() {
        const slots = this.slotsAll('default');
        this.items.length = 0;
        this.widthMap.length = 0;
        this.minWidthMap.length = 0;
        for (const slot of slots) {
            // --- 用户的应该的 width ---
            const width = slot.props.width ? parseInt(slot.props.width) : 0;
            this.items.push({
                'label': slot.props.label ?? '',
                'width': width,
                'sort': slot.props.sort !== undefined ? clickgo.tool.getBoolean(slot.props.sort) : slot.props.sort
            });
            // --- 再根据 split 状态确定是否设置为默认 width  ---
            this.widthMap.push(this.propBoolean('split') ? (width ? width : 0) : width);
            // --- min width ---
            const minWidth = slot.props.minWidth ?? slot.props['min-width'];
            this.minWidthMap.push(minWidth ? parseInt(minWidth) : 50);
        }
        this.checkNowSort();
    }
    /** --- 检测当前列已经不能 sort 了，但是目前还在 nowSort 当中 --- */
    checkNowSort() {
        if (this.nowSort.index === -1) {
            return;
        }
        for (let i = 0; i < this.items.length; ++i) {
            if (i !== this.nowSort.index) {
                continue;
            }
            const item = this.items[i];
            const sort = item.sort ?? this.propBoolean('sort');
            if (sort) {
                return;
            }
            break;
        }
        // --- 找到了但不是 sort 和没找到，都要重置 ---
        this.nowSort.index = -1;
        const event = {
            'go': true,
            preventDefault: function () {
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
    headerClick(e, i) {
        clickgo.dom.bindClick(e, () => {
            const item = this.items[i];
            const sort = item.sort ?? this.propBoolean('sort');
            if (!sort) {
                return;
            }
            const event = {
                'go': true,
                preventDefault: function () {
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
    bindResize(e, i) {
        const el = e.currentTarget.parentNode;
        clickgo.dom.bindResize(e, {
            'object': el,
            'border': 'r',
            'minWidth': this.minWidthMap[i],
            'move': (left, top, width) => {
                this.widthMap[i] = width;
            }
        });
    }
    onMounted() {
        this.watch('sort', () => {
            this.checkNowSort();
        });
        // --- 重置 isFixed 数据 ---
        this.watch(() => {
            return (this.props.fixed ?? '') + '|' + this.itemsLength;
        }, () => {
            if (this.props.fixed === undefined) {
                this.isFixed.left = undefined;
                this.isFixed.right = undefined;
                return;
            }
            if (this.props.fixed === 'both') {
                this.isFixed.left = 'left';
                this.isFixed.right = 'right';
                return;
            }
            if (this.props.fixed === 'left') {
                this.isFixed.left = 'left';
                this.isFixed.right = undefined;
                return;
            }
            this.isFixed.left = undefined;
            this.isFixed.right = 'right';
        }, {
            'immediate': true
        });
        this.watch('split', () => {
            if (!this.refs.header) {
                return;
            }
            if (this.props.split) {
                // --- 不可拖动变可拖动 ---
                /*
                for (let i = 0; i < this.items.length; ++i) {
                    if (this.items[i].width > 0) {
                        continue;
                    }
                    this.widthMap[i] = (this.refs.header.children[i] as HTMLElement).offsetWidth;
                }
                    */
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

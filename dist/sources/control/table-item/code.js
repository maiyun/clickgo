import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.props = {
            'width': 0,
            'minWidth': 50,
            'label': 'label',
            'sort': undefined,
            'direction': 'h',
            'gutter': '',
            'alignH': undefined,
            'alignV': undefined
        };
        /** --- 当前是第几列，从 0 开始 --- */
        this.index = 0;
        /** --- 所属的 table 控件 --- */
        this.table = {
            'widthMap': {
                [this.index]: 0
            },
            'minWidthMap': {
                [this.index]: 0
            }
        };
    }
    /** --- 当前列是否是固定模式，是的话当前列是固定在左侧还是右侧 --- */
    get isFixed() {
        if (this.table.clientWidth < 500) {
            return undefined;
        }
        if (this.index === 0) {
            return this.table.isFixed?.left;
        }
        if (this.index === this.table.itemsLength - 1) {
            return this.table.isFixed?.right;
        }
        return undefined;
    }
    /** --- 当前是固定模式下，是否正在浮动中 --- */
    get isBase() {
        if (this.table.clientWidth < 500) {
            return undefined;
        }
        if (this.isFixed === 'left') {
            if (this.scrollLeft > 0) {
                return 'left';
            }
            return undefined;
        }
        if (this.isFixed === 'right') {
            if (this.scrollLeft < this.maxScrollLeft) {
                return 'right';
            }
            return undefined;
        }
        return undefined;
    }
    /** --- 父 table 的左侧滚动位置 --- */
    get scrollLeft() {
        return this.table.scrollLeft ?? 0;
    }
    /** --- 父 table 的最大横向可滚动位置 --- */
    get maxScrollLeft() {
        return this.table.maxScrollLeft ?? 0;
    }
    onMounted() {
        const table = this.parentByName('table');
        if (!table) {
            return;
        }
        this.index = clickgo.dom.index(this.element);
        table.refreshHeader();
        this.watch('label', (n) => {
            table.setHeaderLabel(this.index, n);
        });
        this.watch('width', () => {
            table.setHeaderWidth(this.index, this.propNumber('width'));
        });
        this.watch('minWidth', () => {
            table.setHeaderMinWidth(this.index, this.propNumber('minWidth'));
        });
        this.watch('sort', () => {
            table.setHeaderSort(this.index, this.props.sort === undefined ? undefined : this.propBoolean('sort'));
        });
        this.watch(() => {
            return table.itemsLength;
        }, () => {
            this.index = clickgo.dom.index(this.element);
        });
        this.table = table;
    }
    onUnmounted() {
        const table = this.parentByName('table');
        if (!table) {
            return;
        }
        table.refreshHeader();
    }
}

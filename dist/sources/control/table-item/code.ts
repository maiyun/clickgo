import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        'width': number | string;
        'label': string;
        'sort'?: boolean | string;
        'direction': 'h' | 'v';
        'gutter': number | string;
        'alignH': string | undefined;
        'alignV': string | undefined;
    } = {
            'width': 0,
            'label': 'label',
            'sort': undefined,
            'direction': 'h',
            'gutter': '',
            'alignH': undefined,
            'alignV': undefined
        };

    /** --- 当前是第几列，从 0 开始 --- */
    public index: number = 0;

    /** --- 所属的 table 控件 --- */
    public table: any = {
        'widthMap': {
            [this.index]: 0
        }
    };

    /** --- 当前列是否是固定模式，是的话当前列是固定在左侧还是右侧 --- */
    public get isFixed(): 'left' | 'right' | undefined {
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
    public get isBase(): 'left' | 'right' | undefined {
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
    public get scrollLeft(): number {
        return this.table.scrollLeft ?? 0;
    }

    /** --- 父 table 的最大横向可滚动位置 --- */
    public get maxScrollLeft(): number {
        return this.table.maxScrollLeft ?? 0;
    }

    public onMounted(): void | Promise<void> {
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

    public onUnmounted(): void | Promise<void> {
        const table = this.parentByName('table');
        if (!table) {
            return;
        }
        table.refreshHeader();
    }

}

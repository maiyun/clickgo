import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        'width': number | string;
        'label': string;
        'sort'?: boolean | string;
        'direction': 'h' | 'v';
        'gutter': number | string;
        'alignH': string;
        'alignV': string;
    } = {
            'width': 0,
            'label': 'label',
            'sort': undefined,
            'direction': 'h',
            'gutter': '',
            'alignH': '',
            'alignV': ''
        };
    
    /** --- 当前是第几列，从 0 开始 --- */
    public index: number = 0;

    /** --- 所属的 table 控件 --- */
    public table: any = {
        'widthMap': {
            [this.index]: 0
        }
    };

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

import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        'width': number | string;
        'label': string;
        'sort'?: boolean | string;
    } = {
            'width': 0,
            'label': 'label',
            'sort': undefined
        };

    public table: any = {
        'widthMap': {
            [this.props.label]: 0
        }
    };

    public onMounted(): void | Promise<void> {
        const table = this.parentByName('table');
        if (!table) {
            return;
        }
        table.refreshHeader();
        this.watch('label', (n, o) => {
            table.setHeaderLabel(n, o);
        });
        this.watch('width', () => {
            table.setHeaderWidth(this.props.label, this.propNumber('width'));
        });
        this.watch('sort', () => {
            table.setHeaderSort(this.props.label, this.props.sort === undefined ? undefined : this.propBoolean('sort'));
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

import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public border = true;

    public collapse = true;

    public outside = true;

    public data: Array<{
        'name': string;
        'child': string[];
    }> = [
            {
                'name': 'name1',
                'child': ['val1', 'val2']
            },
            {
                'name': 'name2',
                'child': ['val1', 'val2', 'val3']
            },
            {
                'name': 'name3',
                'child': ['val1', 'val2', 'val3', 'val4']
            }
        ];

    public plain: boolean = false;

    public size: string[] = ['m'];

    /** --- 最大行数 --- */
    public get maxLine(): number {
        let len = 0;
        for (const item of this.data) {
            if (!len) {
                len = item.child.length;
                continue;
            }
            len *= item.child.length;
        }
        return len;
    }

    /** --- 每列的个数 --- */
    public get cols(): number[] {
        const cols: number[] = [];
        for (let i = 0; i < this.data.length; ++i) {
            if (i === 0) {
                cols.push(this.maxLine / this.data[i].child.length);
                continue;
            }
            cols.push(cols[i - 1] / this.data[i].child.length);
        }
        return cols;
    }

}

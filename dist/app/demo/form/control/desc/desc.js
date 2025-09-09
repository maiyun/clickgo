import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.border = true;
        this.collapse = true;
        this.data = [
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
        this.plain = false;
        this.size = ['m'];
    }
    /** --- 最大行数 --- */
    get maxLine() {
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
    get cols() {
        const cols = [];
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

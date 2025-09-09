import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.loadFirst = false;
        this.val = [];
        this.data = [];
        // --- 操作 ---
        this.adaptation = false;
        this.disabled = false;
        this.must = true;
        this.multi = false;
        this.ctrl = true;
        this.bottom = false;
        this.top = false;
        this.selection = false;
        this.gesture = false;
        this.selectionArea = {};
        this.scroll = 'auto';
        this.sort = undefined;
        this.index = false;
        this.split = false;
        this.virtual = false;
        this.slot = false;
        this.fixed = ['undefined'];
        this.mode = ['default'];
        /** --- 已选中的个数 --- */
        this.checkinfo = {
            'total': 0,
            'selected': 0
        };
        /** --- 当前 sort 情况 --- */
        this.sortinfo = {
            'index': -1,
            'sort': 'desc'
        };
    }
    refreshCheckinfo() {
        this.checkinfo.total = 0;
        this.checkinfo.selected = 0;
        for (const item of this.data) {
            if (item.check === undefined) {
                continue;
            }
            ++this.checkinfo.total;
            if (item.check) {
                ++this.checkinfo.selected;
            }
        }
    }
    onHeaderCheck(e) {
        if (e.detail.value && !e.detail.indeterminate) {
            // --- 从选中变为不选 ---
            for (const item of this.data) {
                if (item.check === undefined) {
                    continue;
                }
                item.check = false;
            }
            this.checkinfo.selected = 0;
            return;
        }
        for (const item of this.data) {
            if (item.check === undefined) {
                continue;
            }
            item.check = true;
        }
        this.checkinfo.selected = this.checkinfo.total;
    }
    // --- size 高度 ---
    get sizes() {
        const rtn = {};
        for (let i = 0; i < this.data.length; ++i) {
            if (this.data[i].control === 'split') {
                rtn[i] = 3;
                continue;
            }
        }
        return rtn;
    }
    async onGesture(dir) {
        await clickgo.form.dialog(this, 'onGesture: ' + dir);
    }
    onSelect(area) {
        this.selectionArea = area;
    }
    onSort(e) {
        this.sortinfo.index = e.detail.index;
        this.sortinfo.sort = e.detail.sort;
        this.refreshSort();
    }
    refreshSort() {
        if (this.sortinfo.index === -1) {
            return;
        }
        if (this.sortinfo.index === (this.index ? 1 : 0)) {
            this.data.sort((a, b) => {
                const aname = a.name ?? 'name';
                const bname = b.name ?? 'name';
                if (this.sortinfo.sort === 'asc') {
                    return aname.localeCompare(bname);
                }
                else {
                    return bname.localeCompare(aname);
                }
            });
            return;
        }
        this.data.sort((a, b) => {
            const atype = a.type ?? 0;
            const btype = b.type ?? 0;
            if (this.sortinfo.sort === 'asc') {
                return atype - btype;
            }
            else {
                return btype - atype;
            }
        });
    }
    async showIndex() {
        await clickgo.form.dialog(this, 'Index is ' + this.val[0].toString() + '.');
    }
    scrollChange() {
        switch (this.scroll) {
            case 'auto': {
                this.scroll = 'visible';
                break;
            }
            case 'visible': {
                this.scroll = 'hidden';
                break;
            }
            default: {
                this.scroll = 'auto';
            }
        }
    }
    sortChange() {
        switch (this.sort) {
            case true: {
                this.sort = false;
                break;
            }
            case false: {
                this.sort = undefined;
                break;
            }
            default: {
                this.sort = true;
            }
        }
    }
    load() {
        this.data = [
            {
                'check': false,
                'type': 0,
                'name': 'Appraise',
                'bottom': false,
                'leftline': 'info'
            },
            {
                'check': false,
                'type': 0,
                'name': 'Card',
                'bottom': false,
                'leftline': 'info'
            },
            {
                'check': false,
                'type': 0,
                'name': 'Appraise2',
                'disabled': true
            },
            {
                'control': 'split'
            },
            {
                'check': false,
                'type': 1,
                'bottom': true
            }
        ];
        this.loadFirst = true;
    }
}

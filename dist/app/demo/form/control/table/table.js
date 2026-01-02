import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    loadFirst = false;
    val = [];
    data = [];
    // --- 操作 ---
    adaptation = false;
    disabled = false;
    must = true;
    multi = false;
    ctrl = true;
    bottom = false;
    top = false;
    selection = false;
    gesture = false;
    selectionArea = {};
    scroll = 'auto';
    sort = undefined;
    index = false;
    split = false;
    virtual = false;
    slot = false;
    fixed = ['undefined'];
    mode = ['default'];
    /** --- 已选中的个数 --- */
    checkinfo = {
        'total': 0,
        'selected': 0
    };
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
    /** --- 当前 sort 情况 --- */
    sortinfo = {
        'index': -1,
        'sort': 'desc'
    };
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

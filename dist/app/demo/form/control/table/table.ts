import * as clickgo from 'clickgo';
import * as types from '~/types/index';

export default class extends clickgo.form.AbstractForm {

    public loadFirst = false;

    public val: any[] = [];

    public data: any[] = [];

    // --- 操作 ---

    public adaptation = false;

    public disabled = false;

    public must = true;

    public multi = false;

    public ctrl = true;

    public bottom = false;

    public selection = false;

    public gesture = false;

    public selectionArea = {};

    public scroll = 'auto';

    public sort?: boolean = undefined;

    public index: boolean = false;

    public split: boolean = false;

    public virtual: boolean = false;

    public slot = false;

    public fixed: string[] = ['undefined'];

    public mode: string[] = ['default'];

    /** --- 已选中的个数 --- */
    public checkinfo = {
        'total': 0,
        'selected': 0
    };

    public refreshCheckinfo(): void {
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

    public onHeaderCheck(e: types.ICheckChangeEvent): void {
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
    public get sizes(): any {
        const rtn: any = {};
        for (let i = 0; i < this.data.length; ++i) {
            if (this.data[i].control === 'split') {
                rtn[i] = 3;
                continue;
            }
        }
        return rtn;
    }

    public async onGesture(dir: string): Promise<void> {
        await clickgo.form.dialog('onGesture: ' + dir);
    }

    public onSelect(area: Record<string, any>): void {
        this.selectionArea = area;
    }

    /** --- 当前 sort 情况 --- */
    public sortinfo = {
        'index': -1,
        'sort': 'desc'
    };

    public onSort(e: types.ITableSortEvent): void {
        this.sortinfo.index = e.detail.index;
        this.sortinfo.sort = e.detail.sort;
        this.refreshSort();
    }

    public refreshSort(): void {
        if (this.sortinfo.index === -1) {
            return;
        }
        if (this.sortinfo.index === (this.index ? 1 : 0)) {
            this.data.sort((a: { 'name'?: string; }, b: { 'name'?: string; }): number => {
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
        this.data.sort((a: { 'type'?: number; }, b: { 'type'?: number; }): number => {
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

    public async showIndex(): Promise<void> {
        await clickgo.form.dialog('Index is ' + this.val[0].toString() + '.');
    }

    public scrollChange(): void {
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

    public sortChange(): void {
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

    public load(): void {
        this.data = [
            {
                'check': false,
                'type': 0,
                'name': 'Appraise',
                'bottom': false
            },
            {
                'check': false,
                'type': 0,
                'name': 'Card',
                'bottom': false
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

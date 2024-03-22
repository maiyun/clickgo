import * as clickgo from 'clickgo';

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

    public selection = false;

    public gesture = false;

    public selectionArea = {};

    public scroll = 'auto';

    public sort?: boolean = undefined;

    public nowSort: string[] = [];

    public index: boolean = false;

    public split: boolean = false;

    public virtual: boolean = false;

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

    public onSort(label?: string, sort?: 'asc' | 'desc'): void {
        this.nowSort.length = 0;
        if (!label) {
            return;
        }
        this.nowSort.push(label);
        this.nowSort.push(sort ?? 'asc');
        this.refreshSort();
    }

    public refreshSort(): void {
        if (this.nowSort[0] === 'name') {
            this.data.sort((a: { 'name'?: string; }, b: { 'name'?: string; }): number => {
                const aname = a.name ?? 'name';
                const bname = b.name ?? 'name';
                if (this.nowSort[1] === 'asc') {
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
            if (this.nowSort[1] === 'asc') {
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
                'type': 0,
                'name': 'Appraise'
            },
            {
                'type': 0,
                'name': 'Card',
            },
            {
                'type': 0,
                'name': 'Appraise2',
                'disabled': true
            },
            {
                'control': 'split'
            },
            {
                'type': 1
            }
        ];
        this.loadFirst = true;
    }

}

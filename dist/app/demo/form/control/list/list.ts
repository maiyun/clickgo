import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public ntab = '';

    // --- greatlist ---

    public slist = [
        {
            'type': 0,
            'name': 'Appraise',
            'path': 'Bob >> folder >> Appraise',
            'src': '/package/res/r-1.svg'
        },
        {
            'type': 0,
            'name': 'Card',
            'path': 'Bob >> folder >> Card',
            'src': '/package/res/r-2.svg',
            'menu': true,
            'leftline': 'warning'
        },
        {
            'type': 0,
            'name': 'Appraise2',
            'path': 'Bob >> folder >> Appraise2',
            'src': '/package/res/r-1.svg',
            'disabled': true,
            'leftline': 'warning'
        },
        {
            'type': 0,
            'name': 'Appraise3',
            'path': 'Bob >> folder >> Appraise3',
            'src': '/package/res/r-2.svg',
            'unavailable': true
        },
        {
            'control': 'split'
        },
        {
            'type': 1
        },
        {
            'type': 1
        },
        {
            'type': 1
        },
        {
            'type': 1
        },
        {
            'type': 1
        },
        {
            'type': 1
        },
        {
            'type': 1
        }
    ];

    public select: number[] = [11];

    // --- list ---

    public select2 = ['Appraise'];

    public label2 = [''];

    public listData5 = [
        {
            'name': 'hi',
            'name2': 'xhi',
            'id': '1'
        },
        {
            'name': 'hi2dis',
            'name2': 'xhi2dis',
            'id': '2',
            'disabled': true,
            'count': 2
        },
        {
            'name': 'hi2',
            'name2': 'xhi2',
            'id': '3',
            'sub': [
                {
                    'name': 'hi3',
                    'name2': 'xhi3',
                    'id': '4'
                }
            ]
        }
    ];

    public listData6 = ['1', '2', '3', '4', '5'];

    public listMap5: any = undefined;

    public listData5Index = false;

    public disabledList: string[] = [];

    // --- obejct ---

    public selectObject = ['test'];

    public listDataObject = {
        'test': 'This is test',
        '-1': 'This is number',
        'other': 'This is other',
        'same': 'same'
    };

    // --- async ---

    public sub6children: string[] = [];

    public select3 = [0];

    public listData3 = [];

    public select4 = [];

    public listData4 = [];

    // --- 操作 ---

    public disabled = false;

    public must = true;

    public multi = false;

    public ctrl = true;

    public selection = false;

    public gesture = false;

    public selectionArea = {};

    public tree = false;

    public async = false;

    public icon = false;

    public scroll = 'auto';

    public virtual = false;

    public check = false;

    public mode = ['default'];

    // --- size 高度 ---
    public get sizes(): any {
        const rtn: any = {};
        for (let i = 0; i < this.slist.length; ++i) {
            if (this.slist[i].control === 'split') {
                rtn[i] = 3;
                continue;
            }
            if (this.slist[i].type === 1) {
                rtn[i] = 31;
                continue;
            }
        }
        return rtn;
    }

    // --- 自适应选项卡的数据 ---
    public get adData(): any[] {
        const data: any[] = [];
        for (let i = 0; i < this.slist.length; ++i) {
            const item = this.slist[i];
            data.push({
                'type': item.type ?? 'split',
                'menu': i === 20 ? true : false
            });
        }
        return data;
    }

    // --- list ---

    public listDataEmpty = false;

    public get listData(): any[] {
        const data: any[] = ['Item1', {
            'label': 'Tip',
            'color': 'tip',
        }, {
            'label': 'Title1',
            'leftline': 'danger',
            'children': [
                'Sub1',
                {
                    'label': 'Title2',
                    'children': ['Sub2', 'Sub3'],
                    'icon': '../../../res/zip.svg',
                    'openicon': '../../../res/sql.svg'
                },
                'Sub4',
                {
                    'label': 'Title3',
                    'title': true,
                    'children': ['Sub5',
                        {
                            'value': 'Sub6',
                            'children': this.sub6children
                        }
                    ],
                    'tree': 1
                }
            ]
        }];
        for (let k = 0; k < this.slist.length; ++k) {
            if (this.slist[k].name) {
                data.push({
                    'label': `index: ${k}, value: ${this.slist[k].name ?? ''}${(k === 20 ? ' long test long test long test long test long test' : '')}`,
                    'value': this.slist[k].name,
                    'disabled': this.slist[k].disabled
                });
            }
            else {
                data.push({
                    'label': `index: ${k}, value: i${k}${(k === 20 ? ' long test long test long test long test long test' : '')}`,
                    'value': 'i' + k.toString(),
                    'disabled': true
                });
            }
        }
        return data;
    }

    public get listData2(): number[] {
        const data = [];
        for (let k = 0; k < this.listData.length; k++) {
            data.push(k + 1);
        }
        return data;
    }

    public showIndex(): void {
        clickgo.form.dialog(this, 'Index is ' + this.select.toString() + '.').catch((e: Error) => { throw e; });
    }

    public showIndex2(): void {
        clickgo.form.dialog(this, 'Index is ' + this.select2.toString() + '.').catch((e: Error) => { throw e; });
    }

    public showType(): void {
        if (this.select.length === 0) {
            clickgo.form.dialog(this, 'There are currently no selected items.').catch((e: Error) => { throw e; });
        }
        else {
            const types: number[] = [];
            for (const item of this.select) {
                const sitem = this.slist[item];
                if (sitem.type === undefined) {
                    continue;
                }
                types.push(sitem.type);
            }
            clickgo.form.dialog(this, `Type is ${types.join(', ')}.`).catch((e: Error) => { throw e; });
        }
    }

    public selectButton(): void {
        if (this.ntab === 'list') {
            this.select2 = ['Item1'];
        }
        else {
            this.select = [1];
        }
    }

    public selectButtonList(): void {
        this.select2 = ['Sub3'];
    }

    public async onSelectLoad(value: string, resolve: (child?: any[]) => void): Promise<void> {
        if (value !== 'Sub6') {
            await clickgo.tool.sleep(100);
            if (value === 'Sub8') {
                resolve(['Sub9', 'Sub10']);
            }
            else {
                resolve();
            }
            return;
        }
        await clickgo.tool.sleep(300);
        this.sub6children = ['Sub7', 'Sub8'];
    }

    public async onList6Load(value: string, resolve: (child?: any[]) => void): Promise<void> {
        await clickgo.tool.sleep(300);
        resolve();
    }

    public onSelect(area: Record<string, any>): void {
        this.selectionArea = area;
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

    public async onGesture(dir: string): Promise<void> {
        await clickgo.form.dialog(this, 'onGesture: ' + dir);
    }

    public onGAdd(e: clickgo.control.IGreatlistAddEvent): void {
        clickgo.form.notify({
            'type': 'info',
            'title': 'Greatlist @add',
            'content': 'value: ' + e.detail.value.toString()
        });
    }

    public onGRemove(e: clickgo.control.IGreatlistRemoveEvent): void {
        clickgo.form.notify({
            'type': 'info',
            'title': 'Greatlist @remove',
            'content': 'value: ' + e.detail.value.toString()
        });
    }

    public onGChange(e: clickgo.control.IGreatlistChangeEvent): void {
        console.log('onGChange', e);
    }

    public onGChanged(e: clickgo.control.IGreatlistChangedEvent): void {
        console.log('onGChanged', e);
    }

    public onLAdd(e: clickgo.control.IListAddEvent): void {
        clickgo.form.notify({
            'type': 'info',
            'title': 'List @add',
            'content': 'value: ' + e.detail.value
        });
    }

    public onLRemove(e: clickgo.control.IListRemoveEvent): void {
        clickgo.form.notify({
            'type': 'info',
            'title': 'List @remove',
            'content': 'value: ' + e.detail.value
        });
    }

    public changelistData5Index(): void {
        this.listData5Index = !this.listData5Index;
        if (this.listData5Index) {
            this.listMap5 = { 'label': 'name2', 'value': 'id', 'children': 'sub', 'disabled': 'disabled1' };
        }
        else {
            this.listMap5 = { 'label': 'name', 'value': 'id', 'children': 'sub', 'disabled': 'disabled1' };
        }
    }

    public async onlist5Load(value: string, resolve: (child?: any[]) => void): Promise<void> {
        if (value === '4') {
            await clickgo.tool.sleep(100);
            resolve([
                {
                    'name': 'hi5',
                    'name2': 'xhi5',
                    'id': '5'
                },
                {
                    'name': 'hi6',
                    'name2': 'xhi6',
                    'id': '6'
                }
            ]);
            return;
        }
        await clickgo.tool.sleep(300);
        resolve();
    }

    public glNone: boolean = false;

    public onMounted(): void {
        /*
        clickgo.task.sleep(() => {
            this.glNone = false;
        }, 1_000);
        */
    }

}

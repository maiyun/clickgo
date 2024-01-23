import * as clickgo from 'clickgo';
import * as types from '~/types';

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
            'menu': true
        },
        {
            'type': 0,
            'name': 'Appraise2',
            'path': 'Bob >> folder >> Appraise2',
            'src': '/package/res/r-1.svg',
            'disabled': true
        },
        {
            'control': 'split'
        },
        {
            'type': 1
        }
    ];

    public select: number[] = [];

    // --- list ---

    public select2 = ['Appraise'];

    public label2 = [''];

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
                'type': item.type === undefined ? 'split' : item.type,
                'menu': i === 20 ? true : false
            });
        }
        return data;
    }

    // --- list ---

    public get listData(): any[] {
        const data: any[] = ['Item1', {
            'label': 'Tip',
            'color': 'tip'
        }, {
            'label': 'Title1',
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
                    'label': `index: ${k}, value: ${this.slist[k].name}${(k === 20 ? ' long test long test long test long test long test' : '')}`,
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
        clickgo.form.dialog('Index is ' + this.select.toString() + '.').catch((e: Error) => { throw e; });
    }

    public showIndex2(): void {
        clickgo.form.dialog('Index is ' + this.select2.toString() + '.').catch((e: Error) => { throw e; });
    }

    public showType(): void {
        if (this.select.length === 0) {
            clickgo.form.dialog('There are currently no selected items.').catch((e: Error) => { throw e; });
        }
        else {
            const types = [];
            for (const item of this.select) {
                types.push(this.slist[item].type);
            }
            clickgo.form.dialog(`Type is ${types}.`).catch((e: Error) => { throw e; });
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
        await clickgo.form.dialog('onGesture: ' + dir);
    }

    public onGAdd(e: types.IGreatlistAddEvent): void {
        clickgo.form.notify({
            'type': 'info',
            'title': 'Greatlist @add',
            'content': 'value: ' + e.detail.value.toString()
        });
    }

    public onGRemove(e: types.IGreatlistRemoveEvent): void {
        clickgo.form.notify({
            'type': 'info',
            'title': 'Greatlist @remove',
            'content': 'value: ' + e.detail.value.toString()
        });
    }

    public onLAdd(e: types.IListAddEvent): void {
        console.log('x', e.detail);
        clickgo.form.notify({
            'type': 'info',
            'title': 'List @add',
            'content': 'value: ' + e.detail.value
        });
    }

    public onLRemove(e: types.IListRemoveEvent): void {
        clickgo.form.notify({
            'type': 'info',
            'title': 'List @remove',
            'content': 'value: ' + e.detail.value
        });
    }

}

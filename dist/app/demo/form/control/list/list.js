import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.ntab = '';
        // --- greatlist ---
        this.slist = [
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
        this.select = [11];
        // --- list ---
        this.select2 = ['Appraise'];
        this.label2 = [''];
        this.listData5 = [
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
        this.listData6 = ['1', '2', '3', '4', '5'];
        this.listMap5 = undefined;
        this.listData5Index = false;
        this.disabledList = [];
        // --- obejct ---
        this.selectObject = ['test'];
        this.listDataObject = {
            'test': 'This is test',
            '-1': 'This is number',
            'other': 'This is other',
            'same': 'same'
        };
        // --- async ---
        this.sub6children = [];
        this.select3 = [0];
        this.listData3 = [];
        this.select4 = [];
        this.listData4 = [];
        // --- 操作 ---
        this.disabled = false;
        this.must = true;
        this.multi = false;
        this.ctrl = true;
        this.selection = false;
        this.gesture = false;
        this.selectionArea = {};
        this.tree = false;
        this.async = false;
        this.icon = false;
        this.scroll = 'auto';
        this.virtual = false;
        this.check = false;
        this.mode = ['default'];
        // --- list ---
        this.listDataEmpty = false;
        this.glNone = false;
    }
    // --- size 高度 ---
    get sizes() {
        const rtn = {};
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
    get adData() {
        const data = [];
        for (let i = 0; i < this.slist.length; ++i) {
            const item = this.slist[i];
            data.push({
                'type': item.type ?? 'split',
                'menu': i === 20 ? true : false
            });
        }
        return data;
    }
    get listData() {
        const data = ['Item1', {
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
    get listData2() {
        const data = [];
        for (let k = 0; k < this.listData.length; k++) {
            data.push(k + 1);
        }
        return data;
    }
    showIndex() {
        clickgo.form.dialog(this, 'Index is ' + this.select.toString() + '.').catch((e) => { throw e; });
    }
    showIndex2() {
        clickgo.form.dialog(this, 'Index is ' + this.select2.toString() + '.').catch((e) => { throw e; });
    }
    showType() {
        if (this.select.length === 0) {
            clickgo.form.dialog(this, 'There are currently no selected items.').catch((e) => { throw e; });
        }
        else {
            const types = [];
            for (const item of this.select) {
                const sitem = this.slist[item];
                if (sitem.type === undefined) {
                    continue;
                }
                types.push(sitem.type);
            }
            clickgo.form.dialog(this, `Type is ${types.join(', ')}.`).catch((e) => { throw e; });
        }
    }
    selectButton() {
        if (this.ntab === 'list') {
            this.select2 = ['Item1'];
        }
        else {
            this.select = [1];
        }
    }
    selectButtonList() {
        this.select2 = ['Sub3'];
    }
    async onSelectLoad(value, resolve) {
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
    async onList6Load(value, resolve) {
        await clickgo.tool.sleep(300);
        resolve();
    }
    onSelect(area) {
        this.selectionArea = area;
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
    async onGesture(dir) {
        await clickgo.form.dialog(this, 'onGesture: ' + dir);
    }
    onGAdd(e) {
        clickgo.form.notify({
            'type': 'info',
            'title': 'Greatlist @add',
            'content': 'value: ' + e.detail.value.toString()
        });
    }
    onGRemove(e) {
        clickgo.form.notify({
            'type': 'info',
            'title': 'Greatlist @remove',
            'content': 'value: ' + e.detail.value.toString()
        });
    }
    onGChange(e) {
        console.log('onGChange', e);
    }
    onGChanged(e) {
        console.log('onGChanged', e);
    }
    onLAdd(e) {
        clickgo.form.notify({
            'type': 'info',
            'title': 'List @add',
            'content': 'value: ' + e.detail.value
        });
    }
    onLRemove(e) {
        clickgo.form.notify({
            'type': 'info',
            'title': 'List @remove',
            'content': 'value: ' + e.detail.value
        });
    }
    changelistData5Index() {
        this.listData5Index = !this.listData5Index;
        if (this.listData5Index) {
            this.listMap5 = { 'label': 'name2', 'value': 'id', 'children': 'sub', 'disabled': 'disabled1' };
        }
        else {
            this.listMap5 = { 'label': 'name', 'value': 'id', 'children': 'sub', 'disabled': 'disabled1' };
        }
    }
    async onlist5Load(value, resolve) {
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
    onMounted() {
        /*
        clickgo.task.sleep(() => {
            this.glNone = false;
        }, 1_000);
        */
    }
}

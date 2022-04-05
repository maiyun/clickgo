export const data = {
    'ntab': '',
    'slist': [
        {
            'type': 0,
            'name': 'Appraise',
            'path': 'Bob >> folder >> Appraise',
            'src': '/res/r-1.svg'
        },
        {
            'type': 0,
            'name': 'Card',
            'path': 'Bob >> folder >> Card',
            'src': '/res/r-2.svg',
            'menu': true
        },
        {
            'type': 0,
            'name': 'Appraise2',
            'path': 'Bob >> folder >> Appraise2',
            'src': '/res/r-1.svg',
            'disabled': true
        },
        {
            'control': 'split'
        },
        {
            'type': 1
        }
    ],
    'select': 0,

    'select2': 'Appraise',
    'label2': '',

    'select3': 0,
    'listData3': [],
    'select4': '',
    'listData4': [],

    'disabled': false,
    'must': true,
    'multi': false,
    'selection': false,
    'selectionArea': {},
    'scroll': 'auto'
};

export const computed = {
    'adData': function(this: IVForm): any[] {
        const data: any[] = [];
        for (let i = 0; i < this.slist.length; ++i) {
            const item = this.slist[i];
            data.push({
                'type': item.type === undefined ? 'split' : item.type,
                'menu': i === 20 ? true : false
            });
        }
        return data;
    },
    'listData': function(this: IVForm): any[] {
        const data: any[] = ['Item1', {
            'label': 'Title1',
            'children': [
                'Sub1',
                {
                    'label': 'Title2',
                    'children': ['Sub2', 'Sub3']
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
    },
    'listData2': function(this: IVForm): number[] {
        const data = [];
        for (let k = 0; k < this.listData.length; k++) {
            data.push(k + 1);
        }
        return data;
    }
};

export const methods = {
    showType: function(this: IVForm): void {
        if (Array.isArray(this.select)) {
            if (this.select.length === 0) {
                this.cgDialog('There are currently no selected items.').catch((e) => { throw e; });
            }
            else {
                const types = [];
                for (const item of this.select) {
                    types.push(this.slist[item].type);
                }
                this.cgDialog(`Type is ${types}.`).catch((e) => { throw e; });
            }
        }
        else {
            this.cgDialog(this.select === -1 ? 'There are currently no selected items.' : `Type is ${this.slist[this.select].type}.`).catch((e) => { throw e; });
        }
    },
    selectButton: function(this: IVForm): void {
        if (this.ntab === 'list') {
            this.select2 = 'Item1';
        }
        else {
            this.select = 1;
        }
    },
    onSelect: function(this: IVForm, area: Record<string, any>): void {
        this.selectionArea = area;
    },
    scrollChange: function(this: IVForm): void {
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
};

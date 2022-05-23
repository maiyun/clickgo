import * as types from '~/types/index';

export const data = {
    'ntab': '',

    'area': 'all',
    'slist': [
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
    ],
    'select': 0,
    'disabled': false,

    'slist2': [
        'haha1', 'haha2', 'haha3', 'haha4', {
            'value': 'ha5',
            'label': 'The value is ha5'
        }, {
            'value': 'ha6',
            'label': 'Can not be selected',
            'disabled': true
        }, {
            'value': 'title',
            'children': [
                {
                    'label': 'sub1label'
                }, {
                    'label': 'sub2'
                }, {
                    'label': 'Sub title',
                    'children': ['1', '2']
                }
            ]
        }, {
            'label': 'happy',
            'children': ['xixi', 'xixida', 'gogogo']
        }
    ],
    'select2': 'haha2',
    'editable': false,

    'padding': false,
    'fontSize': false,
    'background': false
};

export const watch = {
    'select': async function(this: types.IVForm, n: number, o: number): Promise<void> {
        if (this.slist[n].type === 0) {
            return;
        }
        // --- 让其响应 watch 重定 modelValue ---
        await this.$nextTick();
        if (this.slist[o].type === 0) {
            this.select = o;
            return;
        }
        this.select = 0;
    }
};

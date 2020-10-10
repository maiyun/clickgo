export let data = {
    'lineCount': 2,
    'so': 0,
    'l': 0,
    'c': 0,

    'so2': 0,
    'l2': 0,
    'c2': 0,

    'so3': 0,
    'l3': 0,
    'c3': 0,

    // --- 2 ---

    'lineCountC2': 2,
    'soC2': 0,
    'lC2': 0,
    'cC2': 0,

    'so2C2': 0,
    'l2C2': 0,
    'c2C2': 0,

    'so3C2': 0,
    'l3C2': 0,
    'c3C2': 0,

    // --- 3 ---

    'area': 'all',
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
            'type': 1
        },
        {
            'type': 2
        }
    ],
    'select': 0,

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
            'children': {
                'sub1': {
                    'label': 'sub1label'
                },
                'sub2': {
                    'label': 'sub2'
                }
            }
        }, {
            'label': 'happy',
            'children': ['xixi', 'xixida', 'gogogo']
        }
    ],
    'select2': 'haha1',
    'select3': 'some text',

    'style': false,

    'tabs': [],
    'tabsi': 0,
    'tabPosition': 'top'
};

export let watch = {
    select: function(this: IVueControl, n: number, o: number): void {
        if (!this.slist[n].name) {
            this.select = o;
        }
    },
    'slist': {
        handler: function(this: IVueControl): void {
            if (!this.slist[this.select].name) {
                this.select = 0;
            }
        },
        'deep': true
    }
};

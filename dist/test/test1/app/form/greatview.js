"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.watch = exports.data = void 0;
exports.data = {
    'lineCount': 2,
    'soLeft': 0,
    'soTop': 0,
    'l': 0,
    'c': 0,
    'soLeft2': 0,
    'soTop2': 0,
    'l2': 0,
    'c2': 0,
    'soLeft3': 0,
    'soTop3': 0,
    'l3': 0,
    'c3': 0,
    'lineCountD': 2,
    'soLeftD': 0,
    'soTopD': 0,
    'lD': 0,
    'cD': 0,
    'soLeft2D': 0,
    'soTop2D': 0,
    'l2D': 0,
    'c2D': 0,
    'soLeft3D': 0,
    'soTop3D': 0,
    'l3D': 0,
    'c3D': 0,
    'soLeft4': 0,
    'soTop4': 0,
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
exports.watch = {
    select: function (n, o) {
        if (!this.slist[n].name) {
            this.select = o;
        }
    },
    'slist': {
        handler: function () {
            if (!this.slist[this.select].name) {
                this.select = 0;
            }
        },
        'deep': true
    }
};

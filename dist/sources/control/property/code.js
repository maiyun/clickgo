"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = exports.data = exports.watch = exports.computed = exports.props = void 0;
exports.props = {
    'disabled': {
        'default': false
    },
    'width': {
        'default': undefined
    },
    'height': {
        'default': undefined
    },
    'left': {
        'default': 0
    },
    'top': {
        'default': 0
    },
    'zIndex': {
        'default': 0
    },
    'flex': {
        'default': ''
    },
    'sort': {
        'default': 'kind'
    },
    'type': {
        'default': 'property'
    },
    'modelValue': {
        'default': []
    }
};
exports.computed = {
    'isDisabled': function () {
        return clickgo.tool.getBoolean(this.disabled);
    },
    'value': function () {
        let list = [];
        let bigList = {};
        let bigTitle = [];
        for (let item of this.modelValue) {
            let kind = this.sortData === 'letter' ? undefined : item.kind;
            if (!bigList[kind]) {
                bigList[kind] = {
                    'list': {},
                    'title': []
                };
                bigTitle.push(kind);
            }
            bigList[kind].list[item.title] = {
                'kind': item.kind,
                'title': item.title,
                'desc': item.desc,
                'type': item.type,
                'control': item.control,
                'default': item.default,
                'value': item.value,
                'sub': item.sub
            };
            bigList[kind].title.push(item.title);
        }
        for (let title of bigTitle) {
            list.push({
                'title': title,
                'list': []
            });
            let i = list.length - 1;
            bigList[title].title.sort();
            for (let item of bigList[title].title) {
                list[i].list.push(bigList[title].list[item]);
            }
        }
        return list;
    }
};
exports.watch = {
    'sort': {
        handler: function () {
            this.sortData = this.sort;
        },
        'immediate': true
    },
    'type': {
        handler: function () {
            this.typeData = this.type;
        },
        'immediate': true
    }
};
exports.data = {
    'direction': 'h',
    'localData': {
        'en-us': {
            'reset': 'Reset',
            'description': 'Description'
        },
        'zh-cn': {
            'reset': '重置',
            'description': '说明'
        },
        'zh-tw': {
            'reset': '重置',
            'description': '說明'
        },
        'ja-jp': {
            'reset': 'リセット',
            'description': '形容'
        }
    },
    'sortData': 'kind',
    'typeData': 'property',
    'selectedTitle': undefined,
    'selectedSub': undefined
};
exports.methods = {
    contextmenu: function (e) {
        if (clickgo.dom.isMouseAlsoTouchEvent(e)) {
            return;
        }
        this.cgShowPop(e);
    },
    down: function (e) {
        this.cgDown(e);
        if (clickgo.dom.isMouseAlsoTouchEvent(e)) {
            return;
        }
        if (this.cgSelfPopOpen) {
            this.cgHidePop();
        }
    },
    vdown: function (e) {
        clickgo.dom.bindLong(e, () => {
            this.cgShowPop(e);
        });
    },
    changeSort: function (sort) {
        this.sortData = sort;
        this.$emit('update:sort', sort);
    },
    changeType: function (type) {
        this.typeData = type;
        this.$emit('update:type', type);
    },
    select: function (e, item2, item3) {
        if (clickgo.dom.isMouseAlsoTouchEvent(e)) {
            return;
        }
        this.selectedTitle = item2;
        this.selectedSub = item3;
    }
};

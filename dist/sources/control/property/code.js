"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = exports.data = exports.watch = exports.computed = exports.props = void 0;
exports.props = {
    'disabled': {
        'default': false
    },
    'sort': {
        'default': 'kind'
    },
    'type': {
        'default': 'property'
    },
    'desc': {
        'default': true
    },
    'modelValue': {
        'default': []
    }
};
exports.computed = {
    'isDisabled': function () {
        return clickgo.tool.getBoolean(this.disabled);
    },
    'isDesc': function () {
        return clickgo.tool.getBoolean(this.descData);
    },
    'subValue': function () {
        return (item2, i3, isDefault = false) => {
            if (isDefault) {
                return item2.default.split(',')[i3] ? item2.default.split(',')[i3].trim() : '';
            }
            else {
                return item2.value.split(',')[i3] ? item2.value.split(',')[i3].trim() : '';
            }
        };
    },
    'value': function () {
        var _a, _b, _c, _d, _e;
        let list = [];
        let bigList = {};
        let bigTitle = [];
        for (let item of this.modelValue) {
            let kind = this.sortData === 'letter' ? undefined : item.kind;
            let type = (_a = item.type) !== null && _a !== void 0 ? _a : 'property';
            if (type !== this.typeData) {
                continue;
            }
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
                'desc': (_b = item.desc) !== null && _b !== void 0 ? _b : '',
                'type': type,
                'control': (_c = item.control) !== null && _c !== void 0 ? _c : 'text',
                'default': (_d = item.default) !== null && _d !== void 0 ? _d : '',
                'value': (_e = item.value) !== null && _e !== void 0 ? _e : '',
                'data': item.data,
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
    },
    'desc': {
        handler: function () {
            this.descData = this.desc;
        },
        'immediate': true
    }
};
exports.data = {
    'direction': 'h',
    'localData': {
        'en': {
            'reset': 'Reset',
            'description': 'Description'
        },
        'sc': {
            'reset': '重置',
            'description': '说明'
        },
        'tc': {
            'reset': '重置',
            'description': '說明'
        },
        'ja': {
            'reset': 'リセット',
            'description': '形容'
        }
    },
    'sortData': 'kind',
    'typeData': 'property',
    'descData': true,
    'selectedTitle': undefined,
    'selectedSub': undefined,
    'bigClosed': [],
    'opened': [],
    'title': '',
    'description': '',
    'dockValue': ''
};
exports.methods = {
    contextmenu: function (e) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        clickgo.form.showPop(this.$refs.content, this.$refs.pop, e);
    },
    down: function (e) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        if (this.$refs.content.dataset.cgPopOpen !== undefined) {
            clickgo.form.hidePop(this.$refs.content);
        }
        if (e instanceof TouchEvent) {
            clickgo.dom.bindLong(e, () => {
                clickgo.form.showPop(this.$refs.content, this.$refs.pop, e);
            });
        }
    },
    changeSort: function (sort) {
        this.sortData = sort;
        this.$emit('update:sort', sort);
    },
    changeType: function (type) {
        this.typeData = type;
        this.$emit('update:type', type);
    },
    select: function (e, item2, item3, desc) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        this.selectedTitle = item2;
        this.selectedSub = item3;
        this.title = item3 !== null && item3 !== void 0 ? item3 : item2;
        this.description = desc;
    },
    bigToggle: function (bigTitle) {
        let io = this.bigClosed.indexOf(bigTitle);
        if (io === -1) {
            this.bigClosed.push(bigTitle);
            return;
        }
        this.bigClosed.splice(io, 1);
    },
    toggle: function (title) {
        let io = this.opened.indexOf(title);
        if (io === -1) {
            this.opened.push(title);
            return;
        }
        this.opened.splice(io, 1);
    },
    update: function (value) {
        for (let item of this.modelValue) {
            if (item.title !== this.selectedTitle) {
                continue;
            }
            if (!this.selectedSub) {
                if (item.value === value) {
                    continue;
                }
                item.value = value;
                this.$emit('update:modelValue', this.modelValue);
            }
            else {
                let arr = item.value.split(',');
                for (let i = 0; i < arr.length; ++i) {
                    if (typeof arr[i] !== 'string') {
                        continue;
                    }
                    arr[i] = arr[i].trim();
                }
                for (let i = 0; i < item.sub.length; ++i) {
                    let sub = item.sub[i];
                    if (sub.title !== this.selectedSub) {
                        continue;
                    }
                    let val = this.subValue(item, i);
                    if (val === value) {
                        continue;
                    }
                    arr[i] = value;
                    item.value = arr.join(', ');
                    this.$emit('update:modelValue', this.modelValue);
                }
            }
        }
    },
    dock: function (e) {
        if (e.currentTarget.dataset.cgPopOpen !== undefined) {
            clickgo.form.hidePop();
            return;
        }
        for (let item of this.modelValue) {
            if (item.title !== this.selectedTitle) {
                continue;
            }
            if (!this.selectedSub) {
                this.dockValue = item.value;
            }
            else {
                for (let i = 0; i < item.sub.length; ++i) {
                    let sub = item.sub[i];
                    if (sub.title !== this.selectedSub) {
                        continue;
                    }
                    this.dockValue = this.subValue(item, i);
                }
            }
        }
        clickgo.form.showPop(e.currentTarget, this.$refs.dock, 'v');
    },
    dockSelect: function (value) {
        this.update(value);
        clickgo.form.hidePop();
    },
    reset: function () {
        for (let item of this.modelValue) {
            if (item.title !== this.selectedTitle) {
                continue;
            }
            if (!this.selectedSub) {
                if (item.value === item.default) {
                    continue;
                }
                item.value = item.default;
                this.$emit('update:modelValue', this.modelValue);
            }
            else {
                let arr = item.value.split(',');
                for (let i = 0; i < arr.length; ++i) {
                    if (typeof arr[i] !== 'string') {
                        continue;
                    }
                    arr[i] = arr[i].trim();
                }
                for (let i = 0; i < item.sub.length; ++i) {
                    let sub = item.sub[i];
                    if (sub.title !== this.selectedSub) {
                        continue;
                    }
                    let val = this.subValue(item, i);
                    let def = this.subValue(item, i, true);
                    if (val === def) {
                        continue;
                    }
                    arr[i] = def;
                    item.value = arr.join(', ');
                    this.$emit('update:modelValue', this.modelValue);
                }
            }
        }
    }
};

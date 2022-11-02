"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clickgo = require("clickgo");
class default_1 extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.props = {
            'disabled': false,
            'sort': 'kind',
            'type': 'property',
            'desc': true,
            'modelValue': []
        };
        this.direction = 'h';
        this.localeData = {
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
        };
        this.sortData = 'kind';
        this.typeData = 'property';
        this.descData = true;
        this.selectedTitle = '';
        this.selectedSub = '';
        this.bigClosed = [];
        this.opened = [];
        this.title = '';
        this.description = '';
        this.dockValue = '';
    }
    get isDisabled() {
        return clickgo.tool.getBoolean(this.props.disabled);
    }
    get isDesc() {
        return clickgo.tool.getBoolean(this.descData);
    }
    get subValue() {
        return (item2, i3, isDefault = false) => {
            if (isDefault) {
                return item2.default.split(',')[i3] ? item2.default.split(',')[i3].trim() : '';
            }
            else {
                return item2.value.split(',')[i3] ? item2.value.split(',')[i3].trim() : '';
            }
        };
    }
    get value() {
        var _a, _b, _c, _d, _e;
        const list = [];
        const bigList = {};
        const bigTitle = [];
        for (const item of this.props.modelValue) {
            const kind = this.sortData === 'letter' ? '' : item.kind;
            const type = (_a = item.type) !== null && _a !== void 0 ? _a : 'property';
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
        for (const title of bigTitle) {
            list.push({
                'title': title,
                'list': []
            });
            const i = list.length - 1;
            bigList[title].title.sort();
            for (const item of bigList[title].title) {
                list[i].list.push(bigList[title].list[item]);
            }
        }
        return list;
    }
    contextmenu(e) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        clickgo.form.showPop(this.refs.content, this.refs.pop, e);
    }
    down(e) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        if (this.refs.content.dataset.cgPopOpen !== undefined) {
            clickgo.form.hidePop(this.refs.content);
        }
        if (e instanceof TouchEvent) {
            clickgo.dom.bindLong(e, () => {
                clickgo.form.showPop(this.refs.content, this.refs.pop, e);
            });
        }
    }
    changeSort(sort) {
        this.sortData = sort;
        this.emit('update:sort', sort);
    }
    changeType(type) {
        this.typeData = type;
        this.emit('update:type', type);
    }
    select(e, item2, item3, desc) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        this.selectedTitle = item2;
        this.selectedSub = item3;
        this.title = item3 !== null && item3 !== void 0 ? item3 : item2;
        this.description = desc;
    }
    bigToggle(bigTitle) {
        const io = this.bigClosed.indexOf(bigTitle);
        if (io === -1) {
            this.bigClosed.push(bigTitle);
            return;
        }
        this.bigClosed.splice(io, 1);
    }
    toggle(title) {
        const io = this.opened.indexOf(title);
        if (io === -1) {
            this.opened.push(title);
            return;
        }
        this.opened.splice(io, 1);
    }
    update(value) {
        for (const item of this.props.modelValue) {
            if (item.title !== this.selectedTitle) {
                continue;
            }
            if (!this.selectedSub) {
                if (item.value === value) {
                    continue;
                }
                item.value = value;
                this.emit('update:modelValue', this.props.modelValue);
            }
            else {
                const arr = item.value.split(',');
                for (let i = 0; i < arr.length; ++i) {
                    if (typeof arr[i] !== 'string') {
                        continue;
                    }
                    arr[i] = arr[i].trim();
                }
                for (let i = 0; i < item.sub.length; ++i) {
                    const sub = item.sub[i];
                    if (sub.title !== this.selectedSub) {
                        continue;
                    }
                    const val = this.subValue(item, i);
                    if (val === value) {
                        continue;
                    }
                    arr[i] = value;
                    item.value = arr.join(', ');
                    this.emit('update:modelValue', this.props.modelValue);
                }
            }
        }
    }
    dock(e) {
        if (e.currentTarget.dataset.cgPopOpen !== undefined) {
            clickgo.form.hidePop();
            return;
        }
        for (const item of this.props.modelValue) {
            if (item.title !== this.selectedTitle) {
                continue;
            }
            if (!this.selectedSub) {
                this.dockValue = item.value;
            }
            else {
                for (let i = 0; i < item.sub.length; ++i) {
                    const sub = item.sub[i];
                    if (sub.title !== this.selectedSub) {
                        continue;
                    }
                    this.dockValue = this.subValue(item, i);
                }
            }
        }
        clickgo.form.showPop(e.currentTarget, this.refs.dock, 'v');
    }
    dockSelect(value) {
        this.update(value);
        clickgo.form.hidePop();
    }
    reset() {
        for (const item of this.props.modelValue) {
            if (item.title !== this.selectedTitle) {
                continue;
            }
            if (!this.selectedSub) {
                if (item.value === item.default) {
                    continue;
                }
                item.value = item.default;
                this.emit('update:modelValue', this.props.modelValue);
            }
            else {
                const arr = item.value.split(',');
                for (let i = 0; i < arr.length; ++i) {
                    if (typeof arr[i] !== 'string') {
                        continue;
                    }
                    arr[i] = arr[i].trim();
                }
                for (let i = 0; i < item.sub.length; ++i) {
                    const sub = item.sub[i];
                    if (sub.title !== this.selectedSub) {
                        continue;
                    }
                    const val = this.subValue(item, i);
                    const def = this.subValue(item, i, true);
                    if (val === def) {
                        continue;
                    }
                    arr[i] = def;
                    item.value = arr.join(', ');
                    this.emit('update:modelValue', this.props.modelValue);
                }
            }
        }
    }
    onMounted() {
        this.watch('sort', () => {
            this.sortData = this.props.sort;
        }, {
            'immediate': true
        });
        this.watch('type', () => {
            this.typeData = this.props.type;
        }, {
            'immediate': true
        });
        this.watch('desc', () => {
            this.descData = this.props.desc;
        }, {
            'immediate': true
        });
    }
}
exports.default = default_1;

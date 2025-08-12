"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const clickgo = __importStar(require("clickgo"));
class default_1 extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.emits = {
            'update:sort': null,
            'update:type': null,
            'update:modelValue': null
        };
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
                'description': '説明'
            },
            'ko': {
                'reset': '재설정',
                'description': '설명'
            },
            'th': {
                'reset': 'รีเซ็ต',
                'description': 'คำอธิบาย'
            },
            'es': {
                'reset': 'Reiniciar',
                'description': 'Descripción'
            },
            'de': {
                'reset': 'Zurücksetzen',
                'description': 'Beschreibung'
            },
            'fr': {
                'reset': 'Réinitialiser',
                'description': 'Description'
            },
            'pt': {
                'reset': 'Redefinir',
                'description': 'Descrição'
            },
            'ru': {
                'reset': 'Сбросить',
                'description': 'Описание'
            },
            'vi': {
                'reset': 'Đặt lại',
                'description': 'Mô tả'
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
        const list = [];
        const bigList = {};
        const bigTitle = [];
        for (const item of this.props.modelValue) {
            const kind = this.sortData === 'letter' ? '' : item.kind;
            const type = item.type ?? 'property';
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
                'desc': item.desc ?? '',
                'type': type,
                'control': item.control ?? 'text',
                'default': item.default ?? '',
                'value': item.value ?? '',
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
        this.title = item3 ?? item2;
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
    reset(e) {
        const handler = () => {
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
        };
        if (e) {
            clickgo.dom.bindDblClick(e, handler);
            return;
        }
        handler();
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
            this.descData = this.propBoolean('desc');
        }, {
            'immediate': true
        });
    }
}
exports.default = default_1;

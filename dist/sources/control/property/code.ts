import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        'disabled': boolean | string;

        'sort': 'kind' | 'letter';
        'type': 'property' | 'event';
        'desc': boolean | string;
        'modelValue': Array<{
            'title': string;
            'desc': string;
            'control': 'text' | 'check' | 'dock' | 'select';
            'default': string;
            'value': string;
            'data'?: string[];
            'sub': any[];
            'kind': string;
            'type': 'property' | 'event';
        }>;
    } = {
            'disabled': false,

            'sort': 'kind',
            'type': 'property',
            'desc': true,
            'modelValue': []
        };

    public direction = 'h';

    public localeData = {
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

    public sortData = 'kind';

    public typeData = 'property';

    public descData = true;

    public selectedTitle = '';

    public selectedSub = '';

    /** --- 已关闭的大类 --- */
    public bigClosed: string[] = [];

    /** --- 已打开的小类 --- */
    public opened: string[] = [];

    public title = '';

    public description = '';

    public dockValue = '';

    public get subValue() {
        return (item2: Record<string, any>, i3: number, isDefault: boolean = false): string => {
            if (isDefault) {
                return item2.default.split(',')[i3] ? item2.default.split(',')[i3].trim() : '';
            }
            else {
                return item2.value.split(',')[i3] ? item2.value.split(',')[i3].trim() : '';
            }
        };
    }

    public get value(): any[] {
        const list: any[] = [];
        // --- 大列表 ---
        const bigList: any = {};
        const bigTitle: string[] = [];
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

    public contextmenu(e: MouseEvent): void {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        clickgo.form.showPop(this.refs.content, this.refs.pop, e);
    }

    public down(e: MouseEvent | TouchEvent): void {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        if (this.refs.content.dataset.cgPopOpen !== undefined) {
            clickgo.form.hidePop(this.refs.content);
        }
        if (e instanceof TouchEvent) {
            // --- 长按触发 contextmenu ---
            clickgo.dom.bindLong(e, () => {
                clickgo.form.showPop(this.refs.content, this.refs.pop, e);
            });
        }
    }

    public changeSort(sort: string): void {
        this.sortData = sort;
        this.emit('update:sort', sort);
    }

    public changeType(type: string): void {
        this.typeData = type;
        this.emit('update:type', type);
    }

    // --- 点击选择一个 line ---
    public select(
        e: MouseEvent | TouchEvent,
        item2: string,
        item3: string,
        desc: string
    ): void {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        this.selectedTitle = item2;
        this.selectedSub = item3;
        this.title = item3 ?? item2;
        this.description = desc;
    }

    // --- 打开/关闭子项 ---
    public bigToggle(bigTitle: string): void {
        const io = this.bigClosed.indexOf(bigTitle);
        if (io === -1) {
            this.bigClosed.push(bigTitle);
            return;
        }
        this.bigClosed.splice(io, 1);
    }

    public toggle(title: string): void {
        const io = this.opened.indexOf(title);
        if (io === -1) {
            this.opened.push(title);
            return;
        }
        this.opened.splice(io, 1);
    }

    // --- 项内容更新方法 ---
    public update(value: string): void {
        for (const item of this.props.modelValue) {
            if (item.title !== this.selectedTitle) {
                continue;
            }
            if (!this.selectedSub) {
                // --- 大级别 ---
                if (item.value === value) {
                    continue;
                }
                item.value = value;
                this.emit('update:modelValue', this.props.modelValue);
            }
            else {
                // --- 小级别 ---
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

    // --- dock ---
    public dock(e: MouseEvent): void {
        if ((e.currentTarget as HTMLElement).dataset.cgPopOpen !== undefined) {
            clickgo.form.hidePop();
            return;
        }
        for (const item of this.props.modelValue) {
            if (item.title !== this.selectedTitle) {
                continue;
            }
            if (!this.selectedSub) {
                // --- 大级别 ---
                this.dockValue = item.value;
            }
            else {
                // --- 小级别 ---
                for (let i = 0; i < item.sub.length; ++i) {
                    const sub = item.sub[i];
                    if (sub.title !== this.selectedSub) {
                        continue;
                    }
                    this.dockValue = this.subValue(item, i);
                }
            }
        }
        clickgo.form.showPop(e.currentTarget as HTMLElement, this.refs.dock, 'v');
    }

    public dockSelect(value: string): void {
        this.update(value);
        clickgo.form.hidePop();
    }

    // --- 双击 ---
    public reset(): void {
        for (const item of this.props.modelValue) {
            if (item.title !== this.selectedTitle) {
                continue;
            }
            if (!this.selectedSub) {
                // --- 大级别 ---
                if (item.value === item.default) {
                    continue;
                }
                item.value = item.default;
                this.emit('update:modelValue', this.props.modelValue);
            }
            else {
                // --- 小级别 ---
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
                    // --- 要 reset ---
                    arr[i] = def;
                    item.value = arr.join(', ');
                    this.emit('update:modelValue', this.props.modelValue);
                }
            }
        }
    }

    public onMounted(): void {
        this.watch('sort', (): void => {
            this.sortData = this.props.sort;
        }, {
            'immediate': true
        });
        this.watch('type', (): void => {
            this.typeData = this.props.type;
        }, {
            'immediate': true
        });
        this.watch('desc', (): void => {
            this.descData = this.propBoolean('desc');
        }, {
            'immediate': true
        });
    }

}

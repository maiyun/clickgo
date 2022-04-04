export const props = {
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

export const computed = {
    'isDisabled': function(this: IVControl): boolean {
        return clickgo.tool.getBoolean(this.disabled);
    },
    'isDesc': function(this: IVControl): boolean {
        return clickgo.tool.getBoolean(this.descData);
    },

    'subValue': function(this: IVControl) {
        return (item2: Record<string, any>, i3: number, isDefault: boolean = false): string => {
            if (isDefault) {
                return item2.default.split(',')[i3] ? item2.default.split(',')[i3].trim() : '';
            }
            else {
                return item2.value.split(',')[i3] ? item2.value.split(',')[i3].trim() : '';
            }
        };
    },
    'value': function(this: IVControl): any[] {
        const list: any[] = [];
        // --- 大列表 ---
        const bigList: any = {};
        const bigTitle: string[] = [];
        for (const item of this.modelValue) {
            const kind = this.sortData === 'letter' ? undefined : item.kind;
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
};

export const watch = {
    'sort': {
        handler: function(this: IVControl): void {
            this.sortData = this.sort;
        },
        'immediate': true
    },
    'type': {
        handler: function(this: IVControl): void {
            this.typeData = this.type;
        },
        'immediate': true
    },
    'desc': {
        handler: function(this: IVControl): void {
            this.descData = this.desc;
        },
        'immediate': true
    }
};

export const data = {
    'direction': 'h',
    'localeData': {
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

export const methods = {
    contextmenu: function(this: IVControl, e: MouseEvent): void {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        clickgo.form.showPop(this.$refs.content, this.$refs.pop, e);
    },
    down: function(this: IVControl, e: MouseEvent | TouchEvent): void {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        if (this.$refs.content.dataset.cgPopOpen !== undefined) {
            clickgo.form.hidePop(this.$refs.content);
        }
        if (e instanceof TouchEvent) {
            // --- 长按触发 contextmenu ---
            clickgo.dom.bindLong(e, () => {
                clickgo.form.showPop(this.$refs.content, this.$refs.pop, e);
            });
        }
    },
    changeSort: function(this: IVControl, sort: string): void {
        this.sortData = sort;
        this.$emit('update:sort', sort);
    },
    changeType: function(this: IVControl, type: string): void {
        this.typeData = type;
        this.$emit('update:type', type);
    },
    // --- 点击选择一个 line ---
    select: function(this: IVControl, e: MouseEvent | TouchEvent, item2: string, item3: string, desc: string): void {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        this.selectedTitle = item2;
        this.selectedSub = item3;
        this.title = item3 ?? item2;
        this.description = desc;
    },
    // --- 打开/关闭子项 ---
    bigToggle: function(this: IVControl, bigTitle: string): void {
        const io = this.bigClosed.indexOf(bigTitle);
        if (io === -1) {
            this.bigClosed.push(bigTitle);
            return;
        }
        this.bigClosed.splice(io, 1);
    },
    toggle: function(this: IVControl, title: string): void {
        const io = this.opened.indexOf(title);
        if (io === -1) {
            this.opened.push(title);
            return;
        }
        this.opened.splice(io, 1);
    },
    // --- 项内容更新方法 ---
    update: function(this: IVControl, value: string): void {
        for (const item of this.modelValue) {
            if (item.title !== this.selectedTitle) {
                continue;
            }
            if (!this.selectedSub) {
                // --- 大级别 ---
                if (item.value === value) {
                    continue;
                }
                item.value = value;
                this.$emit('update:modelValue', this.modelValue);
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
                    this.$emit('update:modelValue', this.modelValue);
                }
            }
        }
    },
    // --- dock ---
    dock: function(this: IVControl, e: MouseEvent): void {
        if ((e.currentTarget as HTMLElement).dataset.cgPopOpen !== undefined) {
            clickgo.form.hidePop();
            return;
        }
        for (const item of this.modelValue) {
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
        clickgo.form.showPop(e.currentTarget as HTMLElement, this.$refs.dock, 'v');
    },
    dockSelect: function(this: IVControl, value: string): void {
        this.update(value);
        clickgo.form.hidePop();
    },
    // --- 双击 ---
    reset: function(this: IVControl): void {
        for (const item of this.modelValue) {
            if (item.title !== this.selectedTitle) {
                continue;
            }
            if (!this.selectedSub) {
                // --- 大级别 ---
                if (item.value === item.default) {
                    continue;
                }
                item.value = item.default;
                this.$emit('update:modelValue', this.modelValue);
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
                    this.$emit('update:modelValue', this.modelValue);
                }
            }
        }
    }
};

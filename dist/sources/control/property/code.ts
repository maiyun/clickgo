export let props = {
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

export let computed = {
    'isDisabled': function(this: IVueControl): boolean {
        return clickgo.tool.getBoolean(this.disabled);
    },

    'value': function(this: IVueControl): any[] {
        let list: any[] = [];
        // --- 大列表 ---
        let bigList: any = {};
        let bigTitle: string[] = [];
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

export let watch = {
    'sort': {
        handler: function(this: IVueControl): void {
            this.sortData = this.sort;
        },
        'immediate': true
    },
    'type': {
        handler: function(this: IVueControl): void {
            this.typeData = this.type;
        },
        'immediate': true
    }
};

export let data = {
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

export let methods = {
    contextmenu: function(this: IVueControl, e: MouseEvent): void {
        if (clickgo.dom.isMouseAlsoTouchEvent(e)) {
            return;
        }
        this.cgShowPop(e);
    },
    down: function(this: IVueControl, e: MouseEvent | TouchEvent): void {
        this.cgDown(e);
        if (clickgo.dom.isMouseAlsoTouchEvent(e)) {
            return;
        }
        if (this.cgSelfPopOpen) {
            this.cgHidePop();
        }
    },
    vdown: function(this: IVueControl, e: TouchEvent): void {
        // --- 长按触发 contextmenu ---
        clickgo.dom.bindLong(e, () => {
            this.cgShowPop(e);
        });
    },
    changeSort: function(this: IVueControl, sort: string): void {
        this.sortData = sort;
        this.$emit('update:sort', sort);
    },
    changeType: function(this: IVueControl, type: string): void {
        this.typeData = type;
        this.$emit('update:type', type);
    },
    select: function(this: IVueControl, e: MouseEvent | TouchEvent, item2: string, item3: string): void {
        if (clickgo.dom.isMouseAlsoTouchEvent(e)) {
            return;
        }
        this.selectedTitle = item2;
        this.selectedSub = item3;
    }
};

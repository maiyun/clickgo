export const props = {
    'tabPosition': {
        'default': 'top'
    },
    'drag': {
        'default': false
    },

    'tabs': {
        'default': []
    },
    'modelValue': {
        'default': ''
    }
};

export const data = {
    'arrow': false,
    'timer': 0,

    'oldTabs': undefined,
    'value': ''
};

export const computed = {
    'isDrag': function(this: IVControl): boolean {
        return clickgo.tool.getBoolean(this.drag);
    },

    'tabsComp': function(this: IVControl): any[] {
        const tabs = [];
        for (const item of this.tabs) {
            if (typeof item !== 'object') {
                tabs.push({
                    'value': item,
                    'drag': this.isDrag
                });
            }
            else {
                tabs.push({
                    'value': item.value ?? 'error',
                    'drag': item.drag ?? this.isDrag
                });
            }
        }
        return tabs;
    },
    'values': function(this: IVControl): string[] {
        const list = [];
        for (const item of this.tabsComp) {
            list.push(item.value);
        }
        return list;
    }
};

export const watch = {
    'modelValue': {
        handler: function(this: IVControl): void {
            if (this.value !== this.modelValue) {
                this.value = this.modelValue;
                this.refreshValue();
            }
        },
        'immediate': true
    },
    'tabs': {
        handler: function(this: IVControl): void {
            this.refreshValue();
            this.$nextTick().then(() => {
                this.onResize(clickgo.dom.getSize(this.$refs.tabs[0]));
            }).catch(function(e) {
                console.log(e);
            });
        },
        'deep': 'true'
    },
    'tabPosition': {
        handler: async function(this: IVControl): Promise<void> {
            await this.$nextTick();
            if (this.oldTabs === this.$refs.tabs[0]) {
                return;
            }
            this.oldTabs = this.$refs.tabs[0];
            clickgo.dom.watchSize(this.$refs.tabs[0], (size) => {
                this.onResize(size);
            });
        }
    }
};

export const methods = {
    wheel: function(this: IVControl, e: WheelEvent): void {
        if (this.tabPosition === 'left' || this.tabPosition === 'right') {
            return;
        }
        if (e.deltaX !== 0) {
            return;
        }
        // --- 用来屏蔽不小心触发前进、后退的浏览器事件 ---
        e.preventDefault();
        (this.$refs.tabs[0] as HTMLElement).scrollLeft += e.deltaY;
    },
    tabClick: function(this: IVControl, e: MouseEvent | TouchEvent, item: Record<string, any>): void {
        this.value = item.value;
        this.$emit('update:modelValue', this.value);
    },
    longDown: function(this: IVControl, e: MouseEvent | TouchEvent, type: 'start' | 'end'): void {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        const num = type === 'start' ? -5 : 5;
        clickgo.dom.bindDown(e, {
            down: () => {
                this.timer = this.cgOnFrame(() => {
                    if (this.tabPosition === 'top' || this.tabPosition === 'bottom') {
                        (this.$refs.tabs[0] as HTMLElement).scrollLeft += num;
                    }
                    else {
                        (this.$refs.tabs[0] as HTMLElement).scrollTop += num;
                    }
                });
            },
            up: () => {
                this.cgOffFrame(this.timer);
                this.timer = 0;
            }
        });
    },
    // --- 检测是否显示箭头 ---
    onResize: function(this: IVControl, size: ICGDomSize): void {
        if (this.tabPosition === 'top' || this.tabPosition === 'bottom') {
            const width = this.arrow ? Math.round(size.clientWidth) + 40 : Math.round(size.clientWidth);
            if (size.scrollWidth > width) {
                this.arrow = true;
            }
            else {
                this.arrow = false;
            }
        }
        else {
            const height = this.arrow ? Math.round(size.clientHeight) + 40 : Math.round(size.clientHeight);
            if (size.scrollHeight > height) {
                this.arrow = true;
            }
            else {
                this.arrow = false;
            }
        }
    },
    refreshValue: function(this: IVControl): void {
        // --- 默认选项卡选择 ---
        if (this.value === '') {
            const v = this.values[0] ? this.values[0] : '';
            if (this.value !== v) {
                this.value = v;
                this.$emit('update:modelValue', this.value);
            }
        }
        else if (this.values.indexOf(this.value) === -1) {
            const v = this.values[this.values.length - 1] ? this.values[this.values.length - 1] : '';
            if (this.value !== v) {
                this.value = v;
                this.$emit('update:modelValue', this.value);
            }
        }
    }
};

export const mounted = function(this: IVControl): void {
    // --- 检测是否显示箭头 ---
    this.oldTabs = this.$refs.tabs[0];
    clickgo.dom.watchSize(this.$refs.tabs[0], (size) => {
        this.onResize(size);
    });
    this.refreshValue();
};

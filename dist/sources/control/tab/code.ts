export let props = {
    'tabPosition': {
        'default': 'top'
    },

    'modelValue': {
        'default': ''
    }
};

export let data = {
    'arrow': false,
    'timer': 0,

    'oldTabs': undefined,
    'selected': ''
};

export let computed = {
    'tabs': function(this: IVControl): any[] {
        if (!this.$slots.default) {
            return [];
        }
        let tabs = [];
        for (let item of this.cgSlots()) {
            tabs.push({
                'label': item.props.label,
                'value': item.props.value ?? item.props.label
            });
        }
        return tabs;
    },
    'values': function(this: IVControl): string[] {
        let list = [];
        for (let item of this.tabs) {
            list.push(item.value);
        }
        return list;
    }
};

export let watch = {
    'modelValue': {
        handler: function(this: IVControl): void {
            if (this.selected !== this.modelValue) {
                this.selected = this.modelValue;
                this.reSelected();
            }
        },
        'immediate': true
    },
    'tabs': {
        handler: async function(this: IVControl): Promise<void> {
            await this.$nextTick();
            this.onResize(clickgo.dom.getSize(this.$refs.tabs[0]));
            this.reSelected();
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

export let methods = {
    wheel: function(this: IVControl, e: WheelEvent): void {
        if (this.tabPosition === 'left' || this.tabPosition === 'right') {
            return;
        }
        if (e.deltaX !== 0) {
            return;
        }
        // --- 用来屏蔽不小心触发前进、后退的浏览器事件 ---
        e.preventDefault();
        this.$refs.tabs[0].scrollLeft += e.deltaY;
    },
    tabClick: function(this: IVControl, e: MouseEvent | TouchEvent, item: Record<string, any>): void {
        this.selected = item.value;
        this.$emit('update:modelValue', item.value);
    },
    longDown: function(this: IVControl, e: MouseEvent | TouchEvent, type: 'start' | 'end'): void {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        let num = type === 'start' ? -5 : 5;
        clickgo.dom.bindDown(e, {
            down: () => {
                this.timer = this.cgAddFrameListener(() => {
                    if (this.tabPosition === 'top' || this.tabPosition === 'bottom') {
                        this.$refs.tabs[0].scrollLeft += num;
                    }
                    else {
                        this.$refs.tabs[0].scrollTop += num;
                    }
                });
            },
            up: () => {
                this.cgRemoveFrameListener(this.timer);
                this.timer = 0;
            }
        });
    },
    // --- 检测是否显示箭头 ---
    onResize: function(this: IVControl, size: ICGDomSize): void {
        if (this.tabPosition === 'top' || this.tabPosition === 'bottom') {
            let width = this.arrow ? Math.round(size.clientWidth) + 40 : Math.round(size.clientWidth);
            if (size.scrollWidth > width) {
                this.arrow = true;
            }
            else {
                this.arrow = false;
            }
        }
        else {
            let height = this.arrow ? Math.round(size.clientHeight) + 40 : Math.round(size.clientHeight);
            if (size.scrollHeight > height) {
                this.arrow = true;
            }
            else {
                this.arrow = false;
            }
        }
    },
    reSelected: function(this: IVControl): void {
        // --- 默认选项卡选择 ---
        if (this.selected === '') {
            let s = this.values[0] ? this.values[0] : '';
            if (this.selected !== s) {
                this.selected = s;
                this.$emit('update:modelValue', this.selected);
            }
        }
        else if (this.values.indexOf(this.selected) === -1) {
            let s = this.values[this.values.length - 1] ? this.values[this.values.length - 1] : '';
            if (this.selected !== s) {
                this.selected = s;
                this.$emit('update:modelValue', this.selected);
            }
        }
    }
};

export let mounted = function(this: IVControl): void {
    // --- 检测是否显示箭头 ---
    this.oldTabs = this.$refs.tabs[0];
    clickgo.dom.watchSize(this.$refs.tabs[0], (size) => {
        this.onResize(size);
    });
    this.reSelected();
};

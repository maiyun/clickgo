export let props = {
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
    'tabPosition': {
        'default': 'top'
    },

    'modelValue': {
        'default': ''
    }
};

export let data = {
    'arrow': false,
    'timer': undefined,

    'oldTabs': undefined,
    'selected': ''
};

export let computed = {
    'widthPx': function(this: IVueControl): string | undefined {
        if (this.width !== undefined) {
            return this.width + 'px';
        }
        if (this.flex !== '') {
            let parent = this.cgParent();
            return parent ? (parent.direction === 'v' ? undefined : '0') : undefined;
        }
    },
    'heightPx': function(this: IVueControl): string | undefined {
        if (this.height !== undefined) {
            return this.height + 'px';
        }
        if (this.flex !== '') {
            let parent = this.cgParent();
            return parent ? (parent.direction === 'v' ? '0' : undefined) : undefined;
        }
    },

    'tabs': function(this: IVueControl): any[] {
        if (!this.$slots.default) {
            return [];
        }
        let tabs = [];
        let list = this.cgSlots();
        for (let item of list) {
            tabs.push({
                'label': item.props.label,
                'value': item.props.value ?? item.props.label
            });
        }
        return tabs;
    },
    'values': function(this: IVueControl): string[] {
        let list = [];
        for (let item of this.tabs) {
            list.push(item.value);
        }
        return list;
    }
};

export let watch = {
    'modelValue': {
        handler: function(this: IVueControl): void {
            if (this.selected !== this.modelValue) {
                this.selected = this.modelValue;
                this.reSelected();
            }
        },
        'immediate': true
    },
    'tabs': {
        handler: async function(this: IVueControl): Promise<void> {
            await this.$nextTick();
            this.onResize(clickgo.dom.getSize(this.$refs.tabs));
            this.reSelected();
        },
        'deep': 'true'
    },
    'tabPosition': {
        handler: async function(this: IVueControl): Promise<void> {
            await this.$nextTick();
            if (this.oldTabs === this.$refs.tabs) {
                return;
            }
            this.oldTabs = this.$refs.tabs;
            clickgo.dom.watchSize(this.$refs.tabs, (size) => {
                this.onResize(size);
            });
        }
    }
};

export let methods = {
    wheel: function(this: IVueControl, e: WheelEvent): void {
        if (this.tabPosition === 'left' || this.tabPosition === 'right') {
            return;
        }
        if (e.deltaX !== 0) {
            return;
        }
        // --- 用来屏蔽不小心触发前进、后退的浏览器事件 ---
        e.preventDefault();
        this.$refs.tabs.scrollLeft += e.deltaY;
    },
    longDown: function(this: IVueControl, e: MouseEvent | TouchEvent, type: 'start' | 'end'): void {
        if (e instanceof MouseEvent && this.cgHasTouch) {
            return;
        }
        let num = type === 'start' ? -5 : 5;
        clickgo.dom.bindDown(e, {
            down: () => {
                if (this.timer !== undefined) {
                    this.timer = undefined;
                }
                let cb = (): void => {
                    if (this.tabPosition === 'top' || this.tabPosition === 'bottom') {
                        this.$refs.tabs.scrollLeft += num;
                    }
                    else {
                        this.$refs.tabs.scrollTop += num;
                    }
                    if (this.timer !== undefined) {
                        requestAnimationFrame(cb);
                    }
                };
                this.timer = requestAnimationFrame(cb);
            },
            up: () => {
                if (this.timer !== undefined) {
                    this.timer = undefined;
                }
            }
        });
    },
    // --- 检测是否显示箭头 ---
    onResize: function(this: IVueControl, size: ICGDomSize): void {
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
    reSelected: function(this: IVueControl): void {
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

export let mounted = function(this: IVueControl): void {
    // --- 检测是否显示箭头 ---
    this.oldTabs = this.$refs.tabs;
    clickgo.dom.watchSize(this.$refs.tabs, (size) => {
        this.onResize(size);
    });
    this.reSelected();
};

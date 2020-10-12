export let props = {
    'tabs': {
        'default': []
    }
};

export let data = {
    'arrow': false,
    'timer': undefined
};

export let watch = {
    'tabs': {
        handler: async function(this: IVue): Promise<void> {
            await this.$nextTick();
            this.onResize(clickgo.element.getSize(this.$refs.tabs));
        },
        'deep': true
    }
};

export let methods = {
    longDown: function(this: IVue, e: MouseEvent | TouchEvent, type: 'start' | 'end'): void {
        if (!this.$parent) {
            return;
        }
        let num = type === 'start' ? -5 : 5;
        clickgo.element.bindDown(e, {
            down: () => {
                if (this.timer !== undefined) {
                    this.timer = undefined;
                }
                let cb = (): void => {
                    if (this.$parent!.tabPosition === 'top' || this.$parent!.tabPosition === 'bottom') {
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
    wheel: function(this: IVue, e: WheelEvent): void {
        if (!this.$parent) {
            return;
        }
        if (this.$parent.tabPosition === 'left' || this.$parent.tabPosition === 'right') {
            return;
        }
        if (e.deltaX !== 0) {
            return;
        }
        // --- 用来屏蔽不小心触发前进、后退的浏览器事件 ---
        e.preventDefault();
        this.$refs.tabs.scrollLeft += e.deltaY;
    },
    // --- 检测是否显示箭头 ---
    onResize: function(this: IVueControl, size: IElementSize): void {
        if (this.$parent!.tabPosition === 'top' || this.$parent!.tabPosition === 'bottom') {
            if (size.scrollWidth > Math.round(size.clientWidth)) {
                this.arrow = true;
            }
            else {
                this.arrow = false;
            }
        }
        else {
            if (size.scrollHeight > Math.round(size.clientHeight)) {
                this.arrow = true;
            }
            else {
                this.arrow = false;
            }
        }
    }
};

export let mounted = function(this: IVue): void {
    if (!this.$parent) {
        return;
    }
    // --- 检测是否显示箭头 ---
    clickgo.element.watchSize(this.$refs.tabs, (size) => {
        this.onResize(size);
    });
};

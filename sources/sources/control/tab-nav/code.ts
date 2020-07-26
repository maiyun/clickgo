export let data = {
    "arrow": false,
    "timer": undefined
};

export let mounted = function(this: IVue): void {
    // --- 检测是否显示箭头 ---
    ClickGo.watchSize(this.$refs.tabs, (size) => {
        if (this.$parent.tabPosition === "top" || this.$parent.tabPosition === "bottom") {
            if (size.scrollWidth > size.clientWidth) {
                this.arrow = true;
            } else {
                this.arrow = false;
            }
        } else {
            if (size.scrollHeight > size.clientHeight) {
                this.arrow = true;
            } else {
                this.arrow = false;
            }
        }
    }, true);
};

export let methods = {
    longDown: function(this: IVue, e: MouseEvent | TouchEvent, type: "start" | "end"): void {
        let num = type === "start" ? -20 : 20;
        ClickGo.bindDown(e, {
            down: () => {
                if (this.timer !== undefined) {
                    clearInterval(this.timer);
                }
                this.timer = setInterval(() => {
                    if (this.$parent.tabPosition === "top" || this.$parent.tabPosition === "bottom") {
                        this.$refs.tabs.scrollLeft += num;
                    } else {
                        this.$refs.tabs.scrollTop += num;
                    }
                }, 50);
            },
            up: () => {
                if (this.timer !== undefined) {
                    clearInterval(this.timer);
                    this.timer = undefined;
                }
            }
        });
    }
};


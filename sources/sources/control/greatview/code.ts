export let props = {
    "width": {
        "default": undefined
    },
    "height": {
        "default": undefined
    },
    "left": {
        "default": undefined
    },
    "top": {
        "default": undefined
    },
    "zIndex": {
        "default": undefined
    },
    "flex": {
        "default": undefined
    },
    "direction": {
        "default": "v"
    },
    "padding": {
        "default": undefined
    },

    "scrollOffset": {
        "default": undefined
    },

    "data": {
        "default": []
    }
};

export let data = {
    "length": 0,
    "dataInner": [],
    "dataShow": [],
    "dataHeight": [],

    "scrollOffsetData": 0,
    "client": 0,

    "refreshCount": 0,

    "_direction": undefined
};

export let watch = {
    "data": {
        handler: function(this: IVue): void {
            this.refreshView();
        }
    },
    "direction": function(this: IVue): void {
        this.refreshView();
    },
    "_direction": {
        handler: function(this: IVue): void {
            this.$children[0].$data._direction = this.$data._direction;
        }
    }
};

export let computed = {
    "dataComp": function(this: IVue): any[] {
        if (typeof this.data !== "number") {
            return this.data;
        }
        let list: any[] = [];
        for (let i = 1; i <= this.data; ++i) {
            list.push(i);
        }
        return list;
    },

    "paddingComp": function(this: IVue): any {
        if (!this.padding) {
            return {"top": 0, "right": 0, "bottom": 0, "left": 0};
        }
        let arr = this.padding.split(" ");
        for (let i = 0; i < arr.length; ++i) {
            arr[i] = Math.round(arr[i]);
        }
        switch (arr.length) {
            case 1: {
                return {"top": arr[0], "right": arr[0], "bottom": arr[0], "left": arr[0]};
            }
            case 2: {
                return {"top": arr[0], "right": arr[1], "bottom": arr[0], "left": arr[1]};
            }
            case 3: {
                return {"top": arr[0], "right": arr[1], "bottom": arr[2], "left": arr[1]};
            }
            default: {
                return {"top": arr[0], "right": arr[1], "bottom": arr[2], "left": arr[3]};
            }
        }
    }
};

export let methods = {
    // --- 重新获取高度 ---
    refreshView: async function(this: IVue): Promise<void> {
        let nowCount = ++this.refreshCount;

        let length: number = this.direction === "v" ? this.paddingComp.top : this.paddingComp.left;
        if (this.dataComp.length === 0) {
            return;
        }

        let maxCursor = this.dataComp.length;
        let cursor = 0;

        while (true) {
            if (nowCount !== this.refreshCount) {
                return;
            }

            let theCursor = cursor + 50;
            if (theCursor > maxCursor) {
                theCursor = maxCursor;
            }
            this.dataInner = [];
            for (let i = cursor; i < theCursor; ++i) {
                this.dataInner.push({
                    "index": i,
                    "item": this.dataComp[i]
                });
            }
            await this.$nextTick();
            await ClickGo.sleep(0);
            if (nowCount !== this.refreshCount) {
                return;
            }
            // --- 遍历 inner items ---
            if (!this.$refs.inner) {
                return;
            }
            for (let i = 0; i < this.$refs.inner.children.length; ++i) {
                let item = this.$refs.inner.children.item(i) as HTMLElement;
                let start = length;
                length += (this.direction === "v" ? item.offsetHeight : item.offsetWidth);
                this.dataHeight[cursor + i] = {
                    "start": start,
                    "end": length
                };
            }
            if (theCursor === maxCursor) {
                this.dataHeight.splice(maxCursor);
                break;
            }
            cursor = theCursor;
        }
        this.dataInner = [];

        this.length = length + (this.direction === "v" ? this.paddingComp.top : this.paddingComp.left);

        this.reShow();
    },
    // --- 控制显示和隐藏 ---
    reShow: async function(this: IVue): Promise<void> {
        let list = [];
        for (let i = 0; i < this.dataComp.length; ++i) {
            let item = this.dataComp[i];
            let pos = this.dataHeight[i];
            if (!pos) {
                return;
            }
            if ((pos.end > this.scrollOffsetData - 10) && (pos.start < this.scrollOffsetData + this.client + 10)) {
                list.push({
                    "index": i,
                    "item": item
                });
            }
        }
        this.dataShow = list;
    }
};

export let mounted = function(this: IVue): void {
    if (this.$parent.direction !== undefined) {
        this.$data._direction = this.$parent.direction;
    }
    this.$children[0].$data._direction = this.$data._direction;

    this.refreshView();

    let mo = new MutationObserver((ms) => {
        this.refreshView();
    });
    mo.observe(this.$children[0].$el, {
        "attributeFilter": ["style", "class"],
        "attributes": true
    });
};


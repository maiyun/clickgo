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
    "same": {
        "default": false
    },

    "data": {
        "default": []
    }
};

export let data = {
    "innerPos": {
        "start": 0,
        "end": 0
    },
    "showPos": {
        "start": 0,
        "end": 0
    },

    "dataHeight": [],
    "lineHeight": 0,

    "scrollOffsetData": 0,
    "client": 0,
    "length": 0,

    "refreshCount": 0,
    "lengthInit": false,
    "initFirst": false
};

export let watch = {
    "data": {
        handler: function(this: IVue): void {
            this.refreshView();
        }
    },
    "direction": function(this: IVue): void {
        this.refreshView();
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
    "sameComp": function(this: IVue): boolean {
        if (typeof this.same === "boolean") {
            return this.same;
        }
        return this.same === "true" ? true : false;
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
            this.dataHeight = [];
            this.lineHeight = 0;
            this.length = length + (this.direction === "v" ? this.paddingComp.bottom : this.paddingComp.right);
            return;
        }

        if (!this.sameComp) {
            let maxCursor = this.dataComp.length;
            let cursor = 0;

            /** --- 这个在最后应用，要不然可能出现白屏，因为 reShow 还没没执行，正在显示的被移走了，但没移动的意义 --- */
            let dataHeight = [];
            while (true) {
                if (nowCount !== this.refreshCount) {
                    return;
                }

                let theCursor = cursor + 50;
                if (theCursor > maxCursor) {
                    theCursor = maxCursor;
                }
                this.innerPos.start = cursor;
                this.innerPos.end = theCursor;
                await this.$nextTick();
                await ClickGo.sleep(0);
                if (nowCount !== this.refreshCount) {
                    return;
                }
                // --- 遍历 inner items ---
                for (let i = 0; i < this.$refs.inner.children.length; ++i) {
                    let item = this.$refs.inner.children.item(i) as HTMLElement;
                    let start = length;
                    let rect = item.getBoundingClientRect();
                    length += this.direction === "v" ? rect.height : rect.width;
                    dataHeight[cursor + i] = {
                        "start": start,
                        "end": length
                    };
                }
                if (theCursor === maxCursor) {
                    break;
                }
                cursor = theCursor;
            }
            this.dataHeight = dataHeight;
        } else {
            // --- same true 模式 ---
            this.innerPos.start = 0;
            this.innerPos.end = 1;
            await this.$nextTick();
            await ClickGo.sleep(100);
            if (nowCount !== this.refreshCount) {
                return;
            }
            let item = this.$refs.inner.children.item(0) as HTMLElement;
            if (item) {
                let rect = item.getBoundingClientRect();
                this.lineHeight = this.direction === "v" ? rect.height : rect.width;
            } else {
                this.lineHeight = 0;
            }
            length += this.lineHeight * this.dataComp.length;
        }
        this.innerPos.start = 0;
        this.innerPos.end = 0;
        length += this.direction === "v" ? this.paddingComp.bottom : this.paddingComp.right;
        this.length = length;
        this.lengthInit = true;

        this.reShow();
    },
    // --- 控制显示和隐藏 ---
    reShow: function(this: IVue): void {
        if (!this.sameComp) {
            let overShow = false;
            for (let i = 0; i < this.dataComp.length; ++i) {
                let pos = this.dataHeight[i];
                if (!pos) {
                    return;
                }
                if ((pos.end > this.scrollOffsetData - 10) && (pos.start < this.scrollOffsetData + this.client + 10)) {
                    if (!overShow) {
                        overShow = true;
                        this.showPos.start = i;
                    }
                    if (!this.dataComp[i + 1]) {
                        this.showPos.end = i + 1;
                    }
                    continue;
                }
                if (overShow) {
                    this.showPos.end = i;
                    break;
                }
            }
        } else {
            if (this.lineHeight === 0) {
                this.showPos.start = this.showPos.end = 0;
                return;
            }
            let start = Math.floor((this.scrollOffsetData - 10) / this.lineHeight);
            let end = Math.ceil((this.scrollOffsetData + this.client + 10) / this.lineHeight);
            if (start < 0) {
                start = 0;
            }
            if (end > this.dataComp.length) {
                end = this.dataComp.length;
            }
            this.showPos.start = start;
            this.showPos.end = end;
        }
    },
    updateScrollOffset: function(this: IVue, val: number): void {
        // --- 接收 view 组件传递的 scroll-offset 更改事件 ---
        if (!this.lengthInit) {
            // --- length 还没初始化成功，不更新 scroll offset ---
            return;
        }
        if (!this.initFirst) {
            // --- length 更新后首次执行，将 scroll offset 更改为用户设定值 ---
            this.initFirst = true;
            if (this.scrollOffset) {
                this.$refs.view.goScroll(this.scrollOffset);
            }
            return;
        }
        this.scrollOffsetData = val;
        this.$emit("update:scrollOffset", val);
        this.reShow();
    }
};

export let mounted = function(this: IVue): void {
    this.refreshView();

    let mo = new MutationObserver(() => {
        this.refreshView();
    });
    mo.observe(this.$children[0].$el, {
        "attributeFilter": ["style", "class"],
        "attributes": true
    });
};


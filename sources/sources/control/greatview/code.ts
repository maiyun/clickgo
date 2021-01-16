export let props = {
    'width': {
        'default': undefined
    },
    'height': {
        'default': undefined
    },
    'left': {
        'default': undefined
    },
    'top': {
        'default': undefined
    },
    'zIndex': {
        'default': undefined
    },
    'flex': {
        'default': undefined
    },
    'direction': {
        'default': 'v'
    },
    'padding': {
        'default': undefined
    },

    'adaptation': {
        'dafault': false
    },
    'scrollLeft': {
        'default': undefined
    },
    'scrollTop': {
        'default': undefined
    },
    'same': {
        'default': false
    },

    'data': {
        'default': []
    }
};

export let data = {
    'placePos': {
        'start': 0,
        'end': 0
    },
    'showPos': {
        'start': 0,
        'end': 0
    },

    'dataHeight': [],
    'lineHeight': 0,

    'scrollLeftEmit': 0,
    'scrollTopEmit': 0,
    'lengthWidth': 0,
    'lengthHeight': 0,
    'client': 0,

    'refreshCount': 0,
    'lengthInit': false,

    'cgNest': true
};

export let watch = {
    'data': {
        handler: function(this: IVueControl): void {
            this.refreshView();
        },
        'deep': true
    },
    'direction': function(this: IVueControl): void {
        this.refreshView();
    }
};

export let computed = {
    'dataComp': function(this: IVueControl): any[] {
        if (typeof this.data !== 'number') {
            return this.data;
        }
        let list: any[] = [];
        for (let i = 1; i <= this.data; ++i) {
            list.push(i);
        }
        return list;
    },
    'sameComp': function(this: IVueControl): boolean {
        if (typeof this.same === 'boolean') {
            return this.same;
        }
        return this.same === 'true' ? true : false;
    },

    'paddingComp': function(this: IVueControl): any {
        if (!this.padding) {
            return {'top': 0, 'right': 0, 'bottom': 0, 'left': 0};
        }
        let arr = this.padding.split(' ');
        for (let i = 0; i < arr.length; ++i) {
            arr[i] = Math.round(arr[i]);
        }
        switch (arr.length) {
            case 1: {
                return {'top': arr[0], 'right': arr[0], 'bottom': arr[0], 'left': arr[0]};
            }
            case 2: {
                return {'top': arr[0], 'right': arr[1], 'bottom': arr[0], 'left': arr[1]};
            }
            case 3: {
                return {'top': arr[0], 'right': arr[1], 'bottom': arr[2], 'left': arr[1]};
            }
            default: {
                return {'top': arr[0], 'right': arr[1], 'bottom': arr[2], 'left': arr[3]};
            }
        }
    }
};

export let methods = {
    // --- 重新获取高度 ---
    refreshView: async function(this: IVueControl): Promise<void> {
        let nowCount = ++this.refreshCount;

        let lengthWidth: number = this.paddingComp.left;
        let lengthHeight: number = this.paddingComp.top;
        if (this.dataComp.length === 0) {
            this.dataHeight = [];
            this.lineHeight = 0;
            this.lengthWidth = lengthWidth + this.paddingComp.right;
            this.lengthHeight = lengthHeight + this.paddingComp.bottom;
            return;
        }

        if (!this.sameComp) {
            let maxCursor = this.dataComp.length;
            let cursor = 0;
            let anotherWOH: number = 0;

            /** --- 这个在最后应用，要不然可能出现白屏，因为 reShow 还没没执行，正在显示的被移走了，但没移动的意义 --- */
            let dataHeight = [];
            while (true) {
                if (nowCount !== this.refreshCount) {
                    // --- 重复执行，以最后一次执行为准 ---
                    return;
                }

                let theCursor = cursor + 50;
                if (theCursor > maxCursor) {
                    theCursor = maxCursor;
                }
                this.placePos.start = cursor;
                this.placePos.end = theCursor;
                await this.$nextTick();
                await clickgo.tool.sleep(0);
                if (nowCount !== this.refreshCount) {
                    // --- 重复执行，以最后一次执行为准 ---
                    return;
                }
                if (!this.$refs.place) {
                    // --- 当前被卸载了 ---
                    return;
                }
                // --- 遍历 place items ---
                for (let i = 0; i < this.$refs.place.children.length; ++i) {
                    let item = this.$refs.place.children.item(i) as HTMLElement;
                    let start = this.direction === 'v' ? lengthHeight : lengthWidth;
                    let rect = item.getBoundingClientRect();
                    if (this.direction === 'v') {
                        lengthHeight += rect.height;
                        if (anotherWOH < rect.width) {
                            anotherWOH = rect.width;
                        }
                    }
                    else {
                        lengthWidth += rect.width;
                        if (anotherWOH < rect.height) {
                            anotherWOH = rect.height;
                        }
                    }
                    dataHeight[cursor + i] = {
                        'start': start,
                        'end': this.direction === 'v' ? lengthHeight : lengthWidth
                    };
                }
                if (theCursor === maxCursor) {
                    break;
                }
                cursor = theCursor;
            }
            this.dataHeight = dataHeight;
        }
        else {
            // --- same true 模式 ---
            this.placePos.start = 0;
            this.placePos.end = 1;
            await this.$nextTick();
            await clickgo.tool.sleep(0);
            if (nowCount !== this.refreshCount) {
                // --- 重复执行，以最后一次执行为准 ---
                return;
            }
            if (!this.$refs.place) {
                // --- 当前被卸载了 ---
                return;
            }
            let item = this.$refs.place.children.item(0) as HTMLElement;
            if (item) {
                let rect = item.getBoundingClientRect();
                if (this.direction === 'v') {
                    this.lineHeight = rect.height;
                    lengthHeight += this.lineHeight * this.dataComp.length;
                    lengthWidth += rect.width;
                }
                else {
                    this.lineHeight = rect.width;
                    lengthWidth += this.lineHeight * this.dataComp.length;
                    lengthHeight += rect.height;
                }
            }
            else {
                this.lineHeight = 0;
            }
        }
        this.placePos.start = 0;
        this.placePos.end = 0;
        lengthWidth += this.paddingComp.right;
        lengthHeight += this.paddingComp.bottom;
        this.lengthWidth = lengthWidth;
        this.lengthHeight = lengthHeight;
        if (!this.lengthInit) {
            this.lengthInit = true;
            // --- 延迟让 length 的变更生效，让 view 可以监测到并重置他的 lengthWidth 逻辑 ---
            await clickgo.tool.sleep(34);
            // --- length 计算完毕后初次进行上层设定值的传导 ---
            if (this.scrollLeft) {
                this.scrollLeftEmit = this.scrollLeft;
                this.$refs.view.goScroll(this.scrollLeft, 'left');
            }
            if (this.scrollTop) {
                this.scrollTopEmit = this.scrollTop;
                this.$refs.view.goScroll(this.scrollTop, 'top');
            }
        }
        this.reShow();
    },
    // --- 控制显示和隐藏 ---
    reShow: function(this: IVueControl): void {
        let scrollOffset = this.direction === 'v' ? this.scrollTopEmit : this.scrollLeftEmit;
        if (!this.sameComp) {
            let overShow = false;
            for (let i = 0; i < this.dataComp.length; ++i) {
                let pos = this.dataHeight[i];
                if (!pos) {
                    return;
                }
                if ((pos.end > scrollOffset - 10) && (pos.start < scrollOffset + this.client + 10)) {
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
        }
        else {
            if (this.lineHeight === 0) {
                this.showPos.start = this.showPos.end = 0;
                return;
            }
            let start = Math.floor((scrollOffset - 10) / this.lineHeight);
            let end = Math.ceil((scrollOffset + this.client + 10) / this.lineHeight);
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

    updateScrollOffset: function(this: IVueControl, val: number, pos: 'left' | 'top'): void {
        // --- 接收 view 组件传递的 scroll-offset 更改事件 ---
        if (!this.lengthInit) {
            // --- length 还没初始化成功，不更新 scroll offset ---
            return;
        }
        if (pos === 'left') {
            this.scrollLeftEmit = val;
            this.$emit('update:scrollLeft', val);
        }
        else {
            this.scrollTopEmit = val;
            this.$emit('update:scrollTop', val);
        }
        this.reShow();
    },
    onResize: function(this: IVueControl, val: number): void {
        this.client = val;
        this.$emit('resize', val);
        if (!this.lengthInit) {
            return;
        }
        this.reShow();
    }
};

export let mounted = function(this: IVueControl): void {
    this.refreshView();

    let mo = new MutationObserver(() => {
        this.refreshView();
    });
    mo.observe(this.$refs.view.$el, {
        'attributeFilter': ['style', 'class'],
        'attributes': true
    });
};

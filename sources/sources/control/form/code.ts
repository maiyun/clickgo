export let props = {
    "icon": {
        "default": "",
    },
    "title": {
        "default": "title"
    },
    "min": {
        "default": true
    },
    "max": {
        "default": true
    },
    "close": {
        "default": true
    },

    "stateMax": {
        "default": false
    },
    "stateMin": {
        "default": false
    },
    "focus": {
        "default": false
    },

    "width": {
        "default": 300
    },
    "height": {
        "default": 200
    },
    "left": {
        "default": -1
    },
    "top": {
        "default": -1
    },
    "zIndex": {
        "default": -1
    },
    "minWidth": {
        "default": 200
    },
    "minHeight": {
        "default": 100
    },
    "resize": {
        "default": true
    },
    "border": {
        "default": "normal"
    },
    "background": {
        "default": undefined
    }
};

export let data = {
    "stateMaxData": false,
    "stateMinData": false,
    "stateAbs": false,

    "iconData": undefined,

    "widthData": 300,
    "heightData": 200,
    "leftData": 0,
    "topData": 0,
    "zIndexData": 0,

    "historyLocationMove": {
        "width": 0,
        "height": 0,
        "left": 0,
        "top": 0
    },
    "historyLocationMax": {
        "width": 0,
        "height": 0,
        "left": 0,
        "top": 0
    },
    "historyLocationMin": {
        "width": 0,
        "height": 0,
        "left": 0,
        "top": 0
    },
    "maskFor": undefined,
    "maskFrom": undefined,
    "flashTimer": undefined
};

export let watch = {
    "icon": {
        handler: async function(this: IVue): Promise<void> {
            let first: boolean = false;
            if (this.iconData === undefined) {
                first = true;
            }
            if (this.icon === "") {
                this.iconData = "";
            } else {
                this.iconData = await this.getDataUrl(this.icon) ?? "";
            }
            if (!first) {
                // --- 触发 formIconChanged 事件 ---
                ClickGo.trigger("formIconChanged", this.taskId, this.formId, {"icon": this.iconData});
            }
        },
        "immediate": true
    },
    "title": function(this: IVue): void {
        // --- 触发 formTitleChanged 事件 ---
        ClickGo.trigger("formTitleChanged", this.taskId, this.formId, {"title": this.title});
    },
    "stateMin": function(this: IVue): void {
        this.minMethod();
    },
    "stateMax": function(this: IVue): void {
        this.maxMethod();
    },

    "width": function(this: IVue): void {
        this.widthData = parseInt(this.width);
    },
    "height": function(this: IVue): void {
        this.heightData = parseInt(this.height);
    },
    "left": function(this: IVue): void {
        this.leftData = parseInt(this.left);
    },
    "top": function(this: IVue): void {
        this.topData = parseInt(this.top);
    },
    "zIndex": function(this: IVue): void {
        this.zIndexData = parseInt(this.zIndex);
    }
};

export let methods = {
    // --- 拖动 ---
    moveMethod: function(this: IVue, e: MouseEvent | TouchEvent): void {
        if (e instanceof MouseEvent && ClickGo.hasTouch) {
            return;
        }
        // --- 绑定双击事件 ---
        let el = e.currentTarget as HTMLElement;
        let dataHasDbl = el.getAttribute("data-has-dbl");
        if (!dataHasDbl) {
            el.setAttribute("data-has-dbl", "yes");
            el.addEventListener("dblclick", () => {
                if (this.stateAbs) {
                    this.maxVMethod(true);
                } else {
                    this.maxMethod();
                }
            });
        }
        /** --- 当前所处边框 --- */
        let isBorder: TBorderDir = "";
        ClickGo.bindMove(e, {
            "start": (x, y) => {
                if (this.stateMaxData) {
                    // --- 如果是最大化状态 ---
                    if (this.stateMinData) {
                        if (this.minMethod() === false) {
                            return false;
                        }
                    }
                    // --- 不能用 maxMethod 方法，因为那个获得的形状不能满足拖动还原的形状 ---
                    this.$emit("max", event, 0, this.historyLocationMax);
                    this.stateMaxData = false;
                    this.$emit("update:stateMax", false);
                    this.$el.classList.remove("cg-state-max");
                    // --- 进行位置设定 ---
                    let olx = x - this.leftData;
                    let orx = this.leftData + this.widthData - x;
                    let w2 = this.historyLocationMax.width / 2;
                    if (olx <= w2) {
                        this.leftData = x - olx;
                    } else if (orx <= w2) {
                        this.leftData = x - (this.historyLocationMax.width - orx);
                    } else {
                        this.leftData = x - w2;
                    }
                    this.$emit("update:left", this.leftData);
                    // --- 高 ---
                    let oty = y - this.topData;
                    let oby = this.topData + this.heightData - y;
                    let h2 = this.historyLocationMax.height / 2;
                    if (oty <= h2) {
                        this.topData = y - oty;
                    } else if (oby <= h2) {
                        this.topData = y - (this.historyLocationMax.height - oby);
                    } else {
                        this.topData = y - h2;
                    }
                    this.$emit("update:top", this.topData);
                    // --- 还原宽高 ---
                    this.widthData = this.historyLocationMax.width;
                    this.$emit("update:width", this.historyLocationMax.width);
                    this.heightData = this.historyLocationMax.height;
                    this.$emit("update:height", this.historyLocationMax.height);
                } else if (this.stateAbs) {
                    // --- 吸附拖动还原 ---
                    this.stateAbs = false;
                    // --- 进行位置设定 ---
                    let olx = x - this.leftData;
                    let orx = this.leftData + this.widthData - x;
                    let w2 = this.historyLocationMove.width / 2;
                    if (olx <= w2) {
                        this.leftData = x - olx;
                    } else if (orx <= w2) {
                        this.leftData = x - (this.historyLocationMove.width - orx);
                    } else {
                        this.leftData = x - w2;
                    }
                    this.$emit("update:left", this.leftData);
                    // --- 高 ---
                    let oty = y - this.topData;
                    let oby = this.topData + this.heightData - y;
                    let h2 = this.historyLocationMove.height / 2;
                    if (oty <= h2) {
                        this.topData = y - oty;
                    } else if (oby <= h2) {
                        this.topData = y - (this.historyLocationMove.height - oby);
                    } else {
                        this.topData = y - h2;
                    }
                    this.$emit("update:top", this.topData);
                    // --- 还原宽高 ---
                    this.widthData = this.historyLocationMove.width;
                    this.$emit("update:width", this.historyLocationMove.width);
                    this.heightData = this.historyLocationMove.height;
                    this.$emit("update:height", this.historyLocationMove.height);
                } else if (!this.stateMinData) {
                    this.historyLocationMove = {
                        "width": this.widthData,
                        "height": this.heightData,
                        "left": this.leftData,
                        "top": this.topData
                    };
                }
            },
            "move": async (ox, oy, x, y, border) => {
                this.leftData += ox;
                this.$emit("update:left", this.leftData);
                this.topData += oy;
                this.$emit("update:top", this.topData);
                if (border !== "") {
                    if ((border === "t" && this.max) || (border !== "t" && this.resize)) {
                        if (isBorder === "") {
                            isBorder = border;
                            ClickGo.showCircular(x, y);
                            await ClickGo.showRectangle(x, y, border);
                        } else {
                            isBorder = border;
                            ClickGo.moveRectangle(border);
                        }
                    } else {
                        if (isBorder !== "") {
                            isBorder = "";
                            ClickGo.hideRectangle();
                        }
                    }
                } else {
                    if (isBorder !== "") {
                        isBorder = "";
                        ClickGo.hideRectangle();
                    }
                }
            },
            "end": () => {
                if (isBorder !== "") {
                    if (isBorder === "t") {
                        // --- 要最大化 ---
                        if (this.max) {
                            // --- 不要使用 emit，只是模拟原大小，马上值就又被改变了 ---
                            this.widthData = this.historyLocationMove.width;
                            this.heightData = this.historyLocationMove.height;
                            this.leftData = this.historyLocationMove.left;
                            this.topData = this.historyLocationMove.top;
                            this.maxMethod();
                        }
                    } else {
                        // --- 要做大小调整 ---
                        if (this.resize) {
                            if (this.stateMinData) {
                                if (!this.minMethod()) {
                                    ClickGo.hideRectangle();
                                    return;
                                }
                            }
                            this.stateAbs = true;
                            let pos = ClickGo.getPositionByBorderDir(isBorder);
                            this.widthData = pos.width;
                            this.$emit("update:width", this.widthData);
                            this.heightData = pos.height;
                            this.$emit("update:height", this.heightData);
                            this.leftData = pos.left;
                            this.$emit("update:left", this.leftData);
                            this.topData = pos.top;
                            this.$emit("update:top", this.topData);
                        }
                    }
                    ClickGo.hideRectangle();
                }
            }
        });
    },
    // --- 最小化 ---
    minMethod: function(this: IVue): boolean {
        let event = {
            "go": true,
            preventDefault: function() {
                this.go = false;
            },
            "ds": false,
            disableShape: function() {
                this.ds = false;
            }
        };
        if (!this.stateMinData) {
            // --- 当前是正常状态，需要变成最小化 ---
            this.$emit("min", event, 1, {});
            if (event.go) {
                this.historyLocationMin = {
                    "width": this.widthData,
                    "height": this.heightData,
                    "left": this.leftData,
                    "top": this.topData
                };
                this.stateMinData = true;
                this.$emit("update:stateMin", true);
                this.$el.classList.add("cg-state-min");
                if (!event.ds) {
                    this.$el.style.height = "auto";
                    this.heightData = this.$el.offsetHeight;
                    this.$emit("update:height", this.$el.offsetHeight);
                    if (this.border !== "thin") {
                        this.widthData = 200;
                        this.$emit("update:width", 200);
                    } else {
                        this.widthData = 150;
                        this.$emit("update:width", 150);
                    }
                }
            } else {
                return false;
            }
        } else {
            // --- 需要变正常 ---
            this.$emit("min", event, 0, this.historyLocationMin);
            if (event.go) {
                this.stateMinData = false;
                this.$emit("update:stateMin", false);
                this.$el.classList.remove("cg-state-min");
                if (!event.ds) {
                    this.heightData = this.historyLocationMin.height;
                    this.$emit("update:height", this.historyLocationMin.height);
                    this.widthData = this.historyLocationMin.width;
                    this.$emit("update:width", this.historyLocationMin.width);
                }
            } else {
                return false;
            }
        }
        // --- 触发 formRemoved 事件 ---
        ClickGo.trigger("formStateMinChanged", this.taskId, this.formId, {"state": this.stateMinData});
        return true;
    },
    // --- 竖版扩大 ---
    maxVMethod: function(this: IVue, dbl: boolean): void {
        if (this.stateAbs) {
            this.stateAbs = false;
            this.topData = this.historyLocationMove.top;
            this.$emit("update:top", this.topData);
            this.heightData = this.historyLocationMove.height;
            this.$emit("update:height", this.heightData);
            if (dbl) {
                this.leftData = this.historyLocationMove.left;
                this.$emit("update:top", this.leftData);
                this.widthData = this.historyLocationMove.width;
                this.$emit("update:width", this.widthData);
            }
        } else {
            this.stateAbs = true;
            this.historyLocationMove = {
                "width": this.widthData,
                "height": this.heightData,
                "left": this.leftData,
                "top": this.topData
            };
            this.topData = ClickGo.getTop();
            this.$emit("update:top", this.topData);
            this.heightData = ClickGo.getHeight();
            this.$emit("update:height", this.heightData);
        }
    },
    // --- 最大化 ---
    maxMethod: function(this: IVue): boolean {
        if (this.stateMinData) {
            if (this.minMethod() === false) {
                return false;
            }
        }
        let event = {
            "go": true,
            preventDefault: function() {
                this.go = false;
            },
            "ds": false,
            disableShape: function() {
                this.ds = false;
            }
        };
        if (!this.stateMaxData) {
            // --- 当前是正常状态，需要变成最大化 ---
            this.$emit("max", event, 1, {});
            if (event.go) {
                if (this.stateAbs) {
                    this.stateAbs = false;
                    this.historyLocationMax = {
                        "width": this.historyLocationMove.width,
                        "height": this.historyLocationMove.height,
                        "left": this.historyLocationMove.left,
                        "top": this.historyLocationMove.top
                    };
                } else {
                    this.historyLocationMax = {
                        "width": this.widthData,
                        "height": this.heightData,
                        "left": this.leftData,
                        "top": this.topData
                    };
                }
                this.stateMaxData = true;
                this.$emit("update:stateMax", true);
                this.$el.classList.add("cg-state-max");
                if (!event.ds) {
                    this.leftData = ClickGo.getLeft();
                    this.$emit("update:left", this.leftData);
                    this.topData = ClickGo.getTop();
                    this.$emit("update:top", this.topData);
                    this.widthData = ClickGo.getWidth();
                    this.$emit("update:width", this.widthData);
                    this.heightData = ClickGo.getHeight();
                    this.$emit("update:height", this.heightData);
                }
            } else {
                return false;
            }
        } else {
            // --- 需要变正常 ---
            this.$emit("max", event, 0, this.historyLocationMax);
            if (event.go) {
                this.stateMaxData = false;
                this.$emit("update:stateMax", false);
                this.$el.classList.remove("cg-state-max");
                if (!event.ds) {
                    this.leftData = this.historyLocationMax.left;
                    this.$emit("update:left", this.historyLocationMax.left);
                    this.topData = this.historyLocationMax.top;
                    this.$emit("update:top", this.historyLocationMax.top);
                    this.widthData = this.historyLocationMax.width;
                    this.$emit("update:width", this.historyLocationMax.width);
                    this.heightData = this.historyLocationMax.height;
                    this.$emit("update:height", this.historyLocationMax.height);
                }
            } else {
                return false;
            }
        }
        // --- 触发 formRemoved 事件 ---
        ClickGo.trigger("formStateMaxChanged", this.taskId, this.formId, {"state": this.stateMaxData});
        return true;
    },
    // --- 关闭窗体 ---
    closeMethod: function(this: IVue): void {
        let event = {
            go: true,
            preventDefault: function() {
                this.go = false;
            }
        };
        this.$emit("close", event);
        if (event.go) {
            ClickGo.removeForm(this.formId);
        }
    },
    // --- 改变窗体大小 ---
    resizeMethod: function(this: IVue, e: MouseEvent | TouchEvent, dir: TBorderDir): void {
        if (e instanceof MouseEvent && ClickGo.hasTouch) {
            return;
        }
        let isBorder: TBorderDir = "";
        let top = this.topData;
        let height = this.heightData;
        if (dir !== "l" && dir !== "r") {
            if (this.stateAbs) {
                // --- 进行高度还原 ---
                if (dir === "lt" || dir === "t" || dir === "tr") {
                    height = this.historyLocationMove.top + this.historyLocationMove.height;
                } else {
                    top = this.historyLocationMove.top;
                    height = ClickGo.getHeight() - top;
                }
            } else {
                this.historyLocationMove = {
                    "width": this.widthData,
                    "height": this.heightData,
                    "left": this.leftData,
                    "top": this.topData
                };
            }
        }
        ClickGo.bindResize(e, {
            "left": this.leftData,
            "top": top,
            "width": this.widthData,
            "height": height,
            "minWidth": parseInt(this.minWidth),
            "minHeight": parseInt(this.minHeight),
            "dir": dir,
            "start": () => {
                if (dir === "l" || dir === "r") {
                    return;
                }
                if (this.stateAbs) {
                    // --- 吸附拖动还原 ---
                    this.stateAbs = false;
                }
            },
            "move": async (left, top, width, height, x, y, border) => {
                this.leftData = left;
                this.$emit("update:left", left);
                this.topData = top;
                this.$emit("update:top", top);
                this.widthData = width;
                this.$emit("update:width", width);
                this.heightData = height;
                this.$emit("update:height", height);
                if (border !== "") {
                    if (
                        ((dir === "lt" || dir === "t" || dir === "tr") && (border === "lt" || border === "t" || border === "tr")) ||
                        ((dir === "bl" || dir === "b" || dir === "rb") && (border === "bl" || border === "b" || border === "rb"))
                    ) {
                        if (isBorder === "") {
                            isBorder = border;
                            ClickGo.showCircular(x, y);
                            await ClickGo.showRectangle(x, y, {
                                "left": left,
                                "width": width
                            });
                        } else {
                            isBorder = border;
                            ClickGo.moveRectangle({
                                "left": left,
                                "width": width
                            });
                        }
                    } else {
                        if (isBorder !== "") {
                            isBorder = "";
                            ClickGo.hideRectangle();
                        }
                    }
                } else {
                    if (isBorder !== "") {
                        isBorder = "";
                        ClickGo.hideRectangle();
                    }
                }
            },
            "end": () => {
                if (isBorder !== "") {
                    if (isBorder !== "l" && isBorder !== "r") {
                        this.stateAbs = true;
                        this.heightData = ClickGo.getHeight();
                        this.$emit("update:height", this.heightData);
                        this.topData = ClickGo.getTop();
                        this.$emit("update:top", this.topData);
                    }
                    ClickGo.hideRectangle();
                }
            }
        });
    },
    // --- 遮罩层被点击时 ---
    maskDown: function(this: IVue, e: MouseEvent | TouchEvent): void {
        if (e instanceof MouseEvent && ClickGo.hasTouch) {
            return;
        }
        if (typeof this.maskFor !== "number") {
            return;
        }
        if (!ClickGo.taskList[this.taskId].formList[this.maskFor]) {
            return;
        }
        e.stopPropagation();
        ClickGo.taskList[this.taskId].formList[this.maskFor].vue.flash();
    },
    // --- 设置 left, width, zIndex 等 ---
    setPropData: function(this: IVue, name: string, val: number, mode: string = ""): void {
        if (this[name + "Data"] === undefined || this[name] === undefined) {
            return;
        }
        if (mode === "") {
            this[name + "Data"] = val;
        } else if (mode === "+") {
            this[name + "Data"] += val;
        } else {
            this[name + "Data"] -= val;
        }
        this.$emit("update:" + name, this[name + "Data"]);
    }
};

export let mounted = function(this: IVue): void {
    this.widthData = parseInt(this.width);
    this.heightData = parseInt(this.height);
    this.zIndexData = parseInt(this.zIndex);
    let stateMax = (typeof this.stateMax === "string") ? ((this.stateMax === "true") ? true : false) : this.stateMax;
    if (stateMax) {
        this.leftData = (ClickGo.getWidth() - this.widthData) / 2;
        this.topData = (ClickGo.getHeight() - this.heightData) / 2;
        this.maxMethod();
    }
};


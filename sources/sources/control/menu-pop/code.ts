export let props = {
    "width": {
        "default": undefined
    },
    "height": {
        "default": undefined
    }
};

export let data = {
    "leftData": -20070831,
    "topData": -20070831,
    "zIndexData": 0,
    "open": false,

    "hasSubItemsCount": 0,
    "hasTypeItemsCount": 0
};

export let methods = {
    onHide: function(this: IVue): void {
        // --- 检测是否有打开的子 pop 统一关掉 ---
        for (let item of this.$children) {
            if (!item.popOpen) {
                continue;
            }
            ClickGo.hidePop(item.$children[0]);
        }
    }
};

export let mounted = function(this: IVue): void {
    ClickGo.appendToPop(this.$el);
};

export let destroyed = function(this: IVue): void {
    ClickGo.removeFromPop(this.$el);
};


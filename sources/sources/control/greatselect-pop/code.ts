export let props = {
    "height": {
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
    "widthData": undefined,
    "leftData": -20070831,
    "topData": -20070831,
    "zIndexData": 0,
    "open": false
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

export let updated = function(this: IVue): void {
    let i;
    for (i = 1; i < this.$children[0].$children[0].$slots.default.length; ++i) {
        let item: IVue = this.$children[0].$children[0].$slots.default[i].children[0].componentInstance;
        if (item.index !== i - 1) {
            item.index = i - 1;
        }
    }
};

export let mounted = function(this: IVue): void {
    ClickGo.appendToPop(this.$el);
};

export let destroyed = function(this: IVue): void {
    ClickGo.removeFromPop(this.$el);
};


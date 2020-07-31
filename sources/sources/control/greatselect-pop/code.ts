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
    for (i = 0; i < this.$children[0].$children[0].$slots.default.length; ++i) {
        let item = this.$children[0].$children[0].$slots.default[i];
        let v: IVue = item.componentInstance || item.context;
        if (v.index !== i) {
            v.index = i;
        }
    }
};

export let mounted = function(this: IVue): void {
    ClickGo.appendToPop(this.$el);
};

export let destroyed = function(this: IVue): void {
    ClickGo.removeFromPop(this.$el);
};


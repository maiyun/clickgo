export let props = {
    'height': {
        'default': undefined
    },

    'same': {
        'default': false
    },

    'data': {
        'default': []
    },
    'value': {
        'default': 0
    }
};

export let data = {
    'widthData': undefined,
    'leftData': -20070831,
    'topData': -20070831,
    'zIndexData': 0,
    'open': false
};

export let methods = {
    onHide: function(this: IVue): void {
        // --- 检测是否有打开的子 pop 统一关掉 ---
        for (let item of this.$children[0].$children[0].$children) {
            if (!item.popOpen) {
                continue;
            }
            for (let maybeMenu of item.$children) {
                if (maybeMenu.$data._controlName !== 'menu-pop') {
                    continue;
                }
                clickgo.form.hidePop(maybeMenu);
                break;
            }
        }
    },
    select: function(this: IVue, index: number): void {
        this.$emit('input', index);
    }
};

export let mounted = function(this: IVue): void {
    clickgo.form.appendToPop(this.$el);
};

export let destroyed = function(this: IVue): void {
    clickgo.form.removeFromPop(this.$el);
};

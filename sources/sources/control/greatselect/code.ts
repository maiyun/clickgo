export let props = {
    'disabled': {
        'default': false
    },

    'width': {
        'default': undefined
    },
    'height': {
        'default': undefined
    },
    'left': {
        'default': 0
    },
    'top': {
        'default': 0
    },
    'zIndex': {
        'default': 0
    },
    'direction': {
        'default': 'h'
    },
    'flex': {
        'default': ''
    },
    'padding': {
        'default': undefined
    },

    'area': {
        'default': 'all'
    }
};

export let computed = {
    'isDisabled': function(this: IVueControl): boolean {
        return clickgo.tool.getBoolean(this.disabled);
    }
};

export let methods = {
    keydown: function(this: IVueControl, e: KeyboardEvent): void {
        if (e.keyCode !== 13) {
            return;
        }
        if (this.cgSelfPopOpen) {
            this.cgHidePop();
            return;
        }
        this.cgShowPop('v', { width: this.$el.offsetWidth });
    },
    click: function(this: IVueControl, e: MouseEvent, area: 'left' | 'arrow'): void {
        if (this.disabled) {
            return;
        }
        this.cgTap(e);
        if (this.cgSelfPopOpen) {
            this.cgHidePop();
            return;
        }
        if (this.area === 'arrow' && area === 'left') {
            // --- 当前只能箭头展开，并且点击的还是不能展开的左侧 ---
            return;
        }
        this.cgShowPop('v', { width: this.$el.offsetWidth });
    }
};

export let mounted = function(this: IVueControl): void {
    this.cgPopPosition.width = '800px';
};

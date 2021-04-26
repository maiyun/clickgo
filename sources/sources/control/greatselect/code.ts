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
        'default': '7'
    },

    'area': {
        'default': 'all'
    }
};

export let computed = {
    'widthPx': function(this: IVueControl): string | undefined {
        if (this.width !== undefined) {
            return this.width + 'px';
        }
        if (this.flex !== '') {
            let parent = this.cgParent();
            return parent ? (parent.direction === 'v' ? undefined : '0') : undefined;
        }
    },
    'heightPx': function(this: IVueControl): string | undefined {
        if (this.height !== undefined) {
            return this.height + 'px';
        }
        if (this.flex !== '') {
            let parent = this.cgParent();
            return parent ? (parent.direction === 'v' ? '0' : undefined) : undefined;
        }
    },

    'isDisabled': function(this: IVueControl): boolean {
        return clickgo.tool.getBoolean(this.disabled);
    }
};

export let data = {
    'popOpen': false,
    'selfPop': undefined,

    'popOptions': {
        'left': '-5000px',
        'top': '0px',
        'width': '500px',
        'zIndex': '0'
    }
};

export let methods = {
    keydown: function(this: IVueControl, e: KeyboardEvent): void {
        if (e.keyCode !== 13) {
            return;
        }
        if (this.popOpen) {
            clickgo.form.hidePop(this);
            return;
        }
        this.showPop(e, this.area);
    },
    click: function(this: IVueControl, e: MouseEvent, area: 'left' | 'arrow'): void {
        if (this.disabled) {
            return;
        }
        if (this.area === 'arrow' && area === 'left') {
            // --- 当前只能箭头展开，并且点击的还是不能展开的左侧 ---
            if (this.popOpen) {
                clickgo.form.hidePop(this);
            }
            this.cgTap(e);
            return;
        }
        this.showPop();
        this.cgTap(e);
    },

    showPop: function(this: IVueControl): void {
        if (this.popOpen) {
            // --- 本来就是展开状态，隐藏起来 ---
            clickgo.form.hidePop(this);
            return;
        }
        // --- 显示本 pop  ---
        this.popOpen = true;
        this.popOptions = clickgo.form.showPop(this, 'v');
        this.popOptions.width = this.$el.offsetWidth + 'px';
    },
    hidePop: function(this: IVueControl): void {
        if (!this.popOpen) {
            return;
        }
        this.popOpen = false;
        if (this.selfPop?.itemPopShowing) {
            this.selfPop.itemPopShowing.hidePop();
        }
    }
};

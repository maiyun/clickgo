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
    'widthPx': function(this: IVue): string | undefined {
        if (this.width !== undefined) {
            return this.width + 'px';
        }
        if (this.flex !== '') {
            let dir = this.$parent?.$data._controlName === 'select' ? this.$parent.$parent?.direction : this.$parent?.direction;
            return dir ? (dir === 'v' ? undefined : '0') : undefined;
        }
    },
    'heightPx': function(this: IVue): string | undefined {
        if (this.height !== undefined) {
            return this.height + 'px';
        }
        if (this.flex !== '') {
            let dir = this.$parent?.$data._controlName === 'select' ? this.$parent.$parent?.direction : this.$parent?.direction;
            return dir.direction ? (dir.direction === 'v' ? '0' : undefined) : undefined;
        }
    }
};

export let data = {
    'popOpen': false,
    'subPop': undefined,

    'popOptions': {
        'left': '-5000px',
        'top': '0px',
        'width': '0px',
        'zIndex': '0'
    }
};

export let methods = {
    down: function(this: IVueControl, e: MouseEvent | TouchEvent): void {
        if (e instanceof MouseEvent && clickgo.hasTouch) {
            return;
        }
        this.cgStopPropagation(e);
        this.cgDown(e);
    },
    keydown: function(this: IVue, e: KeyboardEvent): void {
        if (e.keyCode !== 13) {
            return;
        }
        if (this.popOpen) {
            clickgo.form.hidePop(this);
            return;
        }
        this.showPop(e, this.area);
    },
    click: function(this: IVueControl, event: MouseEvent, area: 'all' | 'arrow'): void {
        if (this.disabled) {
            return;
        }
        if (this.area === 'arrow') {
            if (area === 'all') {
                if (this.popOpen) {
                    clickgo.form.hidePop(this);
                }
                this.cgTap(event);
                return;
            }
            else {
                event.stopPropagation();
            }
        }
        else {
            // --- all ---
            if (area === 'arrow') {
                return;
            }
        }
        if (this.popOpen) {
            clickgo.form.hidePop(this);
            this.cgTap(event);
            return;
        }
        this.showPop();
        this.cgTap(event);
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
        if (this.subPop?.itemPopShowing) {
            this.subPop.itemPopShowing.hidePop();
        }
    }
};

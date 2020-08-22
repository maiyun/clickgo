export let props = {
    'disabled': {
        'default': false
    },
    'focus': {
        'default': false
    },

    'width': {
        'default': undefined
    },
    'height': {
        'default': 30
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
    'flex': {
        'default': ''
    }
};

export let computed = {
    'widthPx': function(this: IVue): string | undefined {
        if (this.width !== undefined) {
            return this.width + 'px';
        }
        if (this.flex !== '') {
            return this.$parent.direction ? (this.$parent.direction === 'v' ? undefined : '0') : undefined;
        }
    },
    'heightPx': function(this: IVue): string | undefined {
        if (this.height !== undefined) {
            return this.height + 'px';
        }
        if (this.flex !== '') {
            return this.$parent.direction ? (this.$parent.direction === 'v' ? '0' : undefined) : undefined;
        }
    }
};

export let methods = {
    keydown: function(this: IVue, e: KeyboardEvent): void {
        if (e.keyCode !== 13) {
            return;
        }
        this._tap(e);
    },
    down: function(this: IVue, e: MouseEvent | TouchEvent): void {
        if (e instanceof MouseEvent && clickgo.hasTouch) {
            return;
        }
        this.stopPropagation(e);
        this._down();
    }
};

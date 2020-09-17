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
    'popOpen': false
};

export let methods = {
    showPop: function(this: IVueControl, event: MouseEvent | KeyboardEvent, area: 'all' | 'arrow'): void {
        if (this.area === 'arrow') {
            if (area === 'all') {
                if (this.popOpen) {
                    clickgo.form.hidePop();
                }
                return;
            }
            else {
                event.stopPropagation();
            }
        }
        else {
            if (area === 'arrow') {
                return;
            }
        }
        if (this.popOpen) {
            clickgo.form.hidePop();
            return;
        }
        let pop: IVue | null = null;
        for (let item of this.$children) {
            if (item.$data._controlName !== 'greatselect-pop') {
                continue;
            }
            pop = item;
            break;
        }
        if (pop) {
            pop.widthData = this.$el.offsetWidth;
            clickgo.form.showPop(pop, this.$el);
        }
        this.cgTap(event);
    },
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
        this.showPop(e, this.area);
    }
};

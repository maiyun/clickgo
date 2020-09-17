export let props = {
    'disabled': {
        'default': false
    },

    'padding': {
        'default': undefined
    },

    'value': {
        'default': ''
    }
};

export let data = {
    'popOpen': false,
    'hasMenuPop': false
};

export let methods = {
    click: function(this: IVueControl, event: MouseEvent): void {
        if (this.disabled) {
            return;
        }
        clickgo.form.hidePop();
        this.$parent?.$parent?.$parent?.select(this.value);
        this.cgTap(event);
    },
    controlClick: function(this: IVue, e: MouseEvent): void {
        if (this.disabled) {
            return;
        }
        let menuPopVue: IVue | null = null;
        for (let item of this.$children) {
            if (item.$data._controlName !== 'menu-pop') {
                continue;
            }
            menuPopVue = item;
        }
        if (menuPopVue) {
            clickgo.form.showPop(menuPopVue, e.pageX, e.pageY);
        }
    }
};

export let updated = function(this: IVue): void {
    let hasMenuPop = false;
    for (let item of this.$children) {
        if (item.$data._controlName !== 'menu-pop') {
            continue;
        }
        hasMenuPop = true;
        break;
    }
    if (this.hasMenuPop !== hasMenuPop) {
        this.hasMenuPop = hasMenuPop;
    }
};

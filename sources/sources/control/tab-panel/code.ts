export let props = {
    'label': {
        'default': ''
    }
};

export let data = {
    'index': -1
};

export let computed = {
    'showTab': function(this: IVue): boolean {
        return this.$parent?.selectedIndex === this.index;
    }
};

export let watch = {
    'showTab': function(this: IVue): void {
        if (this.showTab) {
            this.$emit('show');
        }
        else {
            this.$emit('hide');
        }
    }
};

export let props = {
    'direction': {
        'default': 'h'
    },

    'label': {
        'default': ''
    },
    'name': {
        'default': undefined
    }
};

export let computed = {
    'showTab': function(this: IVue): boolean {
        return this.$parent ? this.$parent.selected === (this.name || this.label) : false;
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

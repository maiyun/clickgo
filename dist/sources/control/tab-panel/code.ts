export let props = {
    'direction': {
        'default': 'h'
    },

    'label': {
        'default': ''
    },
    'value': {
        'default': undefined
    }
};

export let computed = {
    'show': function(this: IVControl): boolean {
        return this.$parent ? this.$parent.selected === (this.value ?? this.label) : false;
    }
};

export let watch = {
    'show': function(this: IVControl): void {
        if (this.showTab) {
            this.$emit('show');
        }
        else {
            this.$emit('hide');
        }
    }
};

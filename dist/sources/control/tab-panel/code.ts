export const props = {
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

export const computed = {
    'show': function(this: IVControl): boolean {
        return this.$parent ? this.$parent.selected === (this.value ?? this.label) : false;
    }
};

export const watch = {
    'show': function(this: IVControl): void {
        if (this.showTab) {
            this.$emit('show');
        }
        else {
            this.$emit('hide');
        }
    }
};

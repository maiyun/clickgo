export let props = {
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
    'gutter': {
        'default': undefined
    },

    'buttons': {
        'default': ['OK']
    }
};

export let methods = {
    click: function(this: IVueControl, item: string): void {
        this.$emit('select', item);
    }
};

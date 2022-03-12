export let props = {
    'direction': {
        'default': 'h'
    },
    'gutter': {
        'default': undefined
    },

    'buttons': {
        'default': ['OK']
    }
};

export let data = {
    'padding': ''
};

export let computed = {
    'paddingMargin': function(this: IVControl): string {
        return this.padding.replace(/(\w+)/g, '-$1');
    }
};

export let methods = {
    click: function(this: IVControl, item: string): void {
        this.$emit('select', item);
    }
};

export let mounted = function(this: IVControl): void {
    clickgo.dom.watchStyle(this.$el, 'padding', (n, v) => {
        this.padding = v;
    }, true);
};

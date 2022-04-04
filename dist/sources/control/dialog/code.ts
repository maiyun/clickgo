export const props = {
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

export const data = {
    'padding': ''
};

export const computed = {
    'paddingMargin': function(this: IVControl): string {
        return this.padding.replace(/(\w+)/g, '-$1');
    }
};

export const methods = {
    click: function(this: IVControl, item: string): void {
        this.$emit('select', item);
    }
};

export const mounted = function(this: IVControl): void {
    clickgo.dom.watchStyle(this.$el, 'padding', (n, v) => {
        this.padding = v;
    }, true);
};

export let props = {
    'disabled': {
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
    'flex': {
        'default': ''
    },

    'type': {
        'default': 'default'
    },
    'plain': {
        'default': false
    }
};

export let computed = {
    'isDisabled': function(this: IVueControl): boolean {
        return clickgo.tool.getBoolean(this.disabled);
    },
    'isPlain': function(this: IVueControl): boolean {
        return clickgo.tool.getBoolean(this.plain);
    }
};

export let methods = {
    keydown: function(this: IVueControl, e: KeyboardEvent): void {
        if (e.keyCode !== 13) {
            return;
        }
        this.cgTap(e);
    }
};

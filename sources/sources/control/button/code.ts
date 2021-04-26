export let props = {
    'disabled': {
        'default': false
    },

    'width': {
        'default': undefined
    },
    'height': {
        'default': 30
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
    'widthPx': function(this: IVueControl): string | undefined {
        if (this.width !== undefined) {
            return this.width + 'px';
        }
        if (this.flex !== '') {
            let parent = this.cgParent();
            return parent ? (parent.direction === 'v' ? undefined : '0') : undefined;
        }
    },
    'heightPx': function(this: IVueControl): string | undefined {
        if (this.height !== undefined) {
            return this.height + 'px';
        }
        if (this.flex !== '') {
            let parent = this.cgParent();
            return parent ? (parent.direction === 'v' ? '0' : undefined) : undefined;
        }
    },

    'isDisabled': function(this: IVueControl): boolean {
        if (typeof this.disabled === 'boolean') {
            return this.disabled;
        }
        else {
            return (this.disabled === '' || this.disabled === 'true') ? true : false;
        }
    },
    'isPlain': function(this: IVueControl): boolean {
        if (typeof this.plain === 'boolean') {
            return this.plain;
        }
        else {
            return (this.plain === '' || this.plain === 'true') ? true : false;
        }
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

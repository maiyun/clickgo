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
    },
    'checked': {
        'default': undefined
    },
    'modelValue': {
        'default': undefined
    }
};

export let computed = {
    'isDisabled': function(this: IVueControl): boolean {
        return clickgo.tool.getBoolean(this.disabled);
    },
    'isPlain': function(this: IVueControl): boolean {
        return clickgo.tool.getBoolean(this.plain);
    },
    'isChecked': function(this: IVueControl): boolean {
        return clickgo.tool.getBoolean(this.checkedData);
    }
};

export let watch = {
    'checked': function(this: IVueControl): void {
        this.checkedData = this.checked;
    }
};

export let data = {
    'checkedData': undefined
};

export let methods = {
    keydown: function(this: IVueControl, e: KeyboardEvent): void {
        if (e.keyCode !== 13) {
            return;
        }
        this.cgTap(e);
    },
    click: function(this: IVueControl, e: MouseEvent): void {
        if (this.checkedData !== undefined) {
            this.checkedData = this.isChecked ? false : true;
            this.$emit('update:checked', this.checkedData);
        }
        this.cgTap(e);
    }
};

export let mounted = function(this: IVueControl): void {
    this.checkedData = this.checked;
};

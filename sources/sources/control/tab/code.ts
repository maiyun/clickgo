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
    'flex': {
        'default': ''
    },
    'tabPosition': {
        'default': 'top'
    },

    'modelValue': {
        'default': ''
    },
    'name': {
        'default': undefined
    }
};

export let data = {
    'selected': ''
};

export let computed = {
    'widthPx': function(this: IVue): string | undefined {
        if (this.width !== undefined) {
            return this.width + 'px';
        }
        if (this.flex !== '') {
            return this.$parent?.direction ? (this.$parent.direction === 'v' ? undefined : '0') : undefined;
        }
    },
    'heightPx': function(this: IVue): string | undefined {
        if (this.height !== undefined) {
            return this.height + 'px';
        }
        if (this.flex !== '') {
            return this.$parent?.direction ? (this.$parent.direction === 'v' ? '0' : undefined) : undefined;
        }
    },
    'tabs': function(this: IVueControl): any[] {
        if (!this.$slots.default) {
            return [];
        }
        let tabs = [];
        let list = this.cgSlos();
        for (let item of list) {
            tabs.push({
                'label': item.props.label,
                'name': item.props.name || item.props.label
            });
        }
        return tabs;
    },
    'names': function(this: IVue): string[] {
        let list = [];
        for (let item of this.tabs) {
            list.push(item.name);
        }
        return list;
    }
};

export let watch = {
    'modelValue': {
        handler: function(this: IVue): void {
            if (this.selected !== this.modelValue) {
                this.selected = this.modelValue;
            }
        },
        'immediate': true
    }
};

export let updated = function(this: IVue): void {
    if (this.selected === '') {
        let s = this.names[0] ? this.names[0] : '';
        if (this.selected !== s) {
            this.selected = s;
        }
    }
    else if (this.names.indexOf(this.selected) === -1) {
        let s = this.names[this.names.length - 1] ? this.names[this.names.length - 1] : '';
        if (this.selected !== s) {
            this.selected = s;
        }
    }
};

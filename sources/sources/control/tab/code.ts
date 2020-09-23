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

    'value': {
        'default': 0
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
    'tabs': function(this: IVue): any[] {
        if (!this.$slots.default) {
            return [];
        }
        let tabs = [];
        let list = this.$slots.default();
        for (let item of list) {
            if (typeof item.type === 'symbol') {
                for (let item2 of item.children) {
                    tabs.push({
                        'label': item2.props.label,
                        'name': item2.props.name || item2.props.label
                    });
                }
            }
            else {
                tabs.push({
                    'label': item.props.label,
                    'name': item.props.name || item.props.label
                });
            }
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
    'value': {
        handler: function(this: IVue): void {
            this.selectedIndex = this.value;
        },
        'immediate': true
    }
};

export let updated = function(this: IVue): void {
    if (this.selected === '') {
        this.selected = this.names[0] ? this.names[0] : '';
    }
    else if (this.names.indexOf(this.selected) === -1) {
        this.selected = this.names[this.names.length - 1] ? this.names[this.names.length - 1] : '';
    }
};

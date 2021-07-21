export let props = {
    'selected': {
        'default': false
    },
    'opened': {
        'default': false
    }
};

export let computed = {
    'isSelected': function(this: IVueControl): boolean {
        return clickgo.tool.getBoolean(this.selected);
    },
    'isOpened': function(this: IVueControl): boolean {
        return clickgo.tool.getBoolean(this.opened);
    },
    'position': function(this: IVueControl): string {
        return this.cgParent?.position ?? 'bottom';
    }
};

export let methods = {
    tap: function(this: IVueControl, e: MouseEvent): void {
        this.cgTap(e);
        if (this.$slots.pop) {
            this.cgShowPop('v');
        }
    }
};

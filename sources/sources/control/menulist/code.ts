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
    }
};

export let data = {
    'hasSubItemsCount': 0,
    'hasTypeItemsCount': 0,
    'itemPopShowing': undefined,
    'menulist': undefined
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
    }
};

export let mounted = function(this: IVueControl): void {
    let menulist = this.cgFindParent('menulist');
    if (menulist) {
        this.menulist = menulist;
    }

    if (this.$parent?.popOpen !== undefined) {
        this.$parent.selfPop = this;
        if (!menulist) {
            return;
        }
        ++menulist.hasSubItemsCount;
    }
};

export let unmounted = function(this: IVueControl): void {
    if (this.$parent?.selfPop === this) {
        this.$parent.selfPop = undefined;
        if (!this.menulist) {
            return;
        }
        --this.menulist.hasSubItemsCount;
    }
};

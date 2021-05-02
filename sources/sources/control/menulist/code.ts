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

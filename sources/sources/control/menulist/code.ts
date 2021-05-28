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
    'menulist': undefined
};

export let mounted = function(this: IVueControl): void {
    let menulist = this.cgFindParent('menulist');
    if (menulist) {
        this.menulist = menulist;
        ++menulist.hasSubItemsCount;
    }
};

export let unmounted = function(this: IVueControl): void {
    if (this.menulist) {
        --this.menulist.hasSubItemsCount;
    }
};

let count = 0;

export let data = {
    'resize': true,
    'max': false,
    'resizeButtonClickCount': 0
};

export let methods = {
    resizeMethod: function(this: IVueForm): void {
        this.resize = !this.resize;
        ++count;
        this.resizeButtonClickCount = count;
    },
    maxMethod: function(this: IVueForm): void {
        this.max = !this.max;
    }
};

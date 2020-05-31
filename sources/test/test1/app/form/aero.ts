let count = 0;

export let data = {
    "resize": true,
    "max": false,
    "resizeButtonClickCount": 0
};

export let methods = {
    resizeMethod: function(this: IVue): void {
        this.resize = !this.resize;
        ++count;
        this.resizeButtonClickCount = count;
    },
    maxMethod: function(this: IVue): void {
        this.max = !this.max;
    }
};


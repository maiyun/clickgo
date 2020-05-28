export let data = {
    "resize": true,
    "max": false
};

export let methods = {
    resizeMethod: function(this: IVue): void {
        this.resize = !this.resize;
    },
    maxMethod: function(this: IVue): void {
        this.max = !this.max;
    }
};


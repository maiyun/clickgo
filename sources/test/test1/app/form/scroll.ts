export let data = {
    "l": 1000,
    "c": 100,
    "so": 500,

    "bl": 0,
    "bc": 0,
    "bso": 0
};

export let mounted = function(this: IVue): void {
    let scrollRect = ClickGo.watchSize(this.$refs.scrollLayout.$el, (rect) => {
        this.bc = rect.height;
    });
    this.bc = scrollRect.height;

    let bodyRect = ClickGo.watchSize(this.$refs.bodyLayout.$el, (rect) => {
        this.bl = rect.height;
    });
    this.bl = bodyRect.height;
};


export let data = {
    'select': ''
};

export let computed = {
    'globalLocal': function(): string {
        return clickgo.core.config.local;
    }
};

export let methods = {
    'change': function(this: IVForm): void {
        clickgo.core.config.local = this.select;
    }
};

export let mounted = function(this: IVForm): void {
    this.select = clickgo.core.config.local;
};

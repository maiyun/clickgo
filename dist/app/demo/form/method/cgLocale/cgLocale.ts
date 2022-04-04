export let data = {
    'select': ''
};

export let computed = {
    'globalLocale': function(): string {
        return clickgo.core.config.locale;
    }
};

export let methods = {
    'change': function(this: IVForm): void {
        clickgo.core.config.locale = this.select;
    }
};

export let mounted = function(this: IVForm): void {
    this.select = clickgo.core.config.locale;
};

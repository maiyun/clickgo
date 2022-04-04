export const data = {
    'select': ''
};

export const computed = {
    'globalLocale': function(): string {
        return clickgo.core.config.locale;
    }
};

export const methods = {
    'change': function(this: IVForm): void {
        clickgo.core.config.locale = this.select;
    }
};

export const mounted = function(this: IVForm): void {
    this.select = clickgo.core.config.locale;
};

export let props = {
    "disabled": {
        "default": false
    }
};

export let data = {
    "popOpen": false
};

export let methods = {
    click: function(this: IVue, event: MouseEvent): void {
        if (this.disabled) {
            return;
        }
        ClickGo.hidePop();
        this._tap(event);
    }
};


export let props = {
    "disabled": {
        "default": false
    },
    "value": {
        "default": ""
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
        this.$parent.$parent.$parent.select(this.value);
        this._tap(event);
    }
};


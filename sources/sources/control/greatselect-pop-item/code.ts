export let props = {
    "disabled": {
        "default": false
    }
};

export let data = {
    "index": 0,
    "popOpen": false
};

export let methods = {
    click: function(this: IVue, event: MouseEvent): void {
        if (this.disabled) {
            return;
        }
        ClickGo.hidePop();
        this.$parent.$parent.$parent.select(this.index);
        this._tap(event);
    }
};


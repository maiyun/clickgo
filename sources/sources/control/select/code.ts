export let props = {
    "disabled": {
        "default": false
    },
    "focus": {
        "default": false
    },

    "width": {
        "default": undefined
    },
    "height": {
        "default": 30
    },
    "left": {
        "default": 0
    },
    "top": {
        "default": 0
    },
    "zIndex": {
        "default": 0
    },
    "padding": {
        "default": undefined
    },
    "flex": {
        "default": ""
    },

    "value": {
        "default": undefined
    },
    "list": {
        "default": []
    }
};

export let data = {
    "valueData": ""
};

export let watch = {
    "value": {
        handler: function(this: IVue): void {
            this.valueData = this.value ?? "";
        },
        "immediate": true
    }
};

export let methods = {
    input: function(this: IVue): void {
        this.$emit("input", this.valueData);
    }
};


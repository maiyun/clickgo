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
    }
};

export let data = {
    "controlName": "button"
};

export let methods = {
    keydown: function(this: IVue, e: KeyboardEvent): void {
        if (e.keyCode !== 13) {
            return;
        }
        this.$emit("tap");
    }
};


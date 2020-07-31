export let props = {
    "width": {
        "default": undefined
    },
    "height": {
        "default": undefined
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

    "src": {
        "default": ""
    }
};

export let data = {
    "iconData": ""
};

export let watch = {
    "src": {
        handler: async function(this: IVue): Promise<void> {
            if (this.src === "") {
                this.iconData = "";
            } else {
                this.iconData = await this.getDataUrl(this.src) ?? "";
            }
        },
        "immediate": true
    }
};


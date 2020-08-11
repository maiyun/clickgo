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
                this.iconData = undefined;
                return;
            }
            let pre = this.src.slice(0, 5).toLowerCase();
            if (pre === "http:") {
                this.iconData = this.src;
                return;
            }
            let t = await this.getDataUrl(this.src);
            if (t) {
                this.iconData = "url(" + t + ")";
                return;
            }
            this.iconData = undefined;
        },
        "immediate": true
    }
};


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
    "flex": {
        "default": ""
    },
    "direction": {
        "default": "v"
    },

    "scrolOffset": {
        "default": 0
    }
};

export let data = {
    "length": 0,
    "innerTop": 0,
    "innerLeft": 0
};

export let methods = {
    wheel: function(this: IVue, e: WheelEvent): void {
        this.innerTop -= e.deltaY;
        let wrapRect = this.$refs.wrap.getBoundingClientRect();
        let innerRect = this.$refs.inner.getBoundingClientRect();
        let max = -innerRect.height + wrapRect.height;
        if (max > 0) {
            max = 0;
        }
        if (this.innerTop > 0) {
            this.innerTop = 0;
        } else if (this.innerTop < max) {
            this.innerTop = max;
        }
    },
    down: function(this: IVue, e: MouseEvent | TouchEvent): void {
        if (e instanceof MouseEvent && ClickGo.hasTouch) {
            return;
        }
        let wrapRect = this.$refs.wrap.getBoundingClientRect();
        let innerRect = this.$refs.inner.getBoundingClientRect();
        console.log(wrapRect.left, wrapRect.right, innerRect.bottom - wrapRect.bottom, wrapRect.top - innerRect.top);
        ClickGo.bindMove(e, {
            "object": this.$refs.inner,
            "offsetLeft": wrapRect.left,
            "offsetRight": wrapRect.right,
            "offsetTop": innerRect.bottom - wrapRect.bottom,
            "offsetBottom": wrapRect.top - innerRect.top,
            "move": (ox, oy) => {
                this.innerTop += ox;
                this.innerLetf += oy;
            }
        });
    }
};

export let mounted = function(this: IVue): void {
    this._subDownStop();
};


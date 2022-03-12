export let props = {
    'src': {
        'default': ''
    },
    'mode': {
        'default': 'default'
    }
};

export let data = {
    'imgData': '',
    'width': 0,
    'height': 0
};

export let computed = {
    'backgroundSize': function(this: IVControl): string | undefined {
        if (this.mode === 'default') {
            return this.width + 'px ' + this.height + 'px';
        }
        else {
            return this.mode;
        }
    }
};

export let watch = {
    'src': {
        handler: async function(this: IVControl): Promise<void> {
            if (this.src === '') {
                this.imgData = undefined;
                return;
            }
            let pre = this.src.slice(0, 6).toLowerCase();
            if (pre === 'http:/' || pre === 'https:' || pre === 'data:i') {
                this.imgData = 'url(' + this.src + ')';
                return;
            }
            // --- 本 app 包 ---
            let t = this.cgGetObjectUrl(this.src);
            if (t) {
                this.imgData = 'url(' + t + ')';
                return;
            }
            this.imgData = undefined;
        },
        'immediate': true
    }
};

export let mounted = function(this: IVControl): void {
    clickgo.dom.watchSize(this.$el, (size) => {
        this.width = size.width;
        this.height = size.height;
    }, true);
};

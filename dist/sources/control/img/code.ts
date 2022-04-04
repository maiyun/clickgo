export const props = {
    'src': {
        'default': ''
    },
    'mode': {
        'default': 'default'
    }
};

export const data = {
    'imgData': '',
    'width': 0,
    'height': 0
};

export const computed = {
    'backgroundSize': function(this: IVControl): string | undefined {
        if (this.mode === 'default') {
            return (this.width as number).toString() + 'px ' + (this.height as number).toString() + 'px';
        }
        else {
            return this.mode;
        }
    }
};

export const watch = {
    'src': {
        handler: function(this: IVControl): void {
            if (this.src === '') {
                this.imgData = undefined;
                return;
            }
            const pre = this.src.slice(0, 6).toLowerCase();
            if (pre === 'http:/' || pre === 'https:' || pre === 'file:/' || pre === 'data:i') {
                this.imgData = `url(${this.src})`;
                return;
            }
            // --- 本 app 包 ---
            const t = this.cgGetObjectUrl(this.src);
            if (t) {
                this.imgData = 'url(' + t + ')';
                return;
            }
            this.imgData = undefined;
        },
        'immediate': true
    }
};

export const mounted = function(this: IVControl): void {
    clickgo.dom.watchSize(this.$el, (size) => {
        this.width = size.width;
        this.height = size.height;
    }, true);
};

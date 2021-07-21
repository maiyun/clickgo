export let props = {
    'width': {
        'default': undefined
    },
    'height': {
        'default': undefined
    },
    'left': {
        'default': 0
    },
    'top': {
        'default': 0
    },
    'zIndex': {
        'default': 0
    },
    'flex': {
        'default': ''
    },

    'src': {
        'default': ''
    },
    'mode': {
        'default': 'default'
    }
};

export let data = {
    'imgData': ''
};

export let computed = {
    'backgroundSize': function(this: IVueControl): string | undefined {
        if (this.mode === 'default') {
            if ((this.width !== undefined) && (this.height !== undefined)) {
                return this.width + 'px ' + this.height + 'px';
            }
            return undefined;
        }
        else {
            return this.mode;
        }
    }
};

export let watch = {
    'src': {
        handler: async function(this: IVueControl): Promise<void> {
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

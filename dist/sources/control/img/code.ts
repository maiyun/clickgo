import * as clickgo from 'clickgo';
import * as types from '~/types/index';

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
    'height': 0,

    // --- watch: src 变更次数 ---
    'count': 0
};

export const computed = {
    'backgroundSize': function(this: types.IVControl): string | undefined {
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
        handler: async function(this: types.IVControl): Promise<void> {
            const count = ++this.count;
            if (typeof this.src !== 'string' || this.src === '') {
                this.imgData = undefined;
                return;
            }
            const pre = this.src.slice(0, 6).toLowerCase();
            if (pre === 'file:/') {
                return;
            }
            if (pre === 'http:/' || pre === 'https:' || pre === 'data:i') {
                this.imgData = `url(${this.src})`;
                return;
            }
            // --- 本 app 包 ---
            const path = clickgo.tool.urlResolve(this.cgPath, this.src);
            const blob = await clickgo.fs.getContent(path);
            if ((count !== this.count) || !blob || typeof blob === 'string') {
                return;
            }
            const t = await clickgo.tool.blob2DataUrl(blob);
            if (count !== this.count) {
                return;
            }
            if (t) {
                this.imgData = 'url(' + t + ')';
                return;
            }
            this.imgData = undefined;
        },
        'immediate': true
    }
};

export const mounted = function(this: types.IVControl): void {
    clickgo.dom.watchSize(this.$el, (size) => {
        this.width = size.width;
        this.height = size.height;
    }, true);
};

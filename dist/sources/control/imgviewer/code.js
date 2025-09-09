import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.props = {
            'src': [],
            'modelValue': 0
        };
        this.width = 0;
        this.height = 0;
        /** --- 当前显示的图像数据 --- */
        this.imgData = '';
        /** --- watch: src 变更次数 --- */
        this.count = 0;
        this.scaleS = 1;
        this.scaleX = 0;
        this.scaleY = 0;
    }
    /** --- 刷新 img data --- */
    async refreshImgData() {
        const count = ++this.count;
        const srcArray = this.propArray('src');
        const src = srcArray[this.propNumber('modelValue')];
        if (!src) {
            return;
        }
        if (typeof src !== 'string' || src === '') {
            this.imgData = '';
            return;
        }
        const pre = src.slice(0, 6).toLowerCase();
        if (pre === 'file:/') {
            this.imgData = '';
            return;
        }
        if (pre === 'http:/' || pre === 'https:' || pre.startsWith('data:')) {
            this.imgData = src;
            return;
        }
        let blob = null;
        if (src.startsWith('/control/')) {
            // --- 从 rootControl 中读取 ---
            if (!this.rootControl) {
                return;
            }
            blob = this.rootControl.packageFiles[src.slice(8)];
        }
        else {
            // --- 从 app 包中读取 ---
            const path = clickgo.tool.urlResolve('/package' + this.path + '/', src);
            blob = await clickgo.fs.getContent(this, path);
        }
        if ((count !== this.count) || !blob || typeof blob === 'string') {
            return;
        }
        const t = await clickgo.tool.blob2DataUrl(blob);
        if (count !== this.count) {
            return;
        }
        if (t) {
            this.imgData = t;
            return;
        }
        this.imgData = '';
    }
    /** --- 绑定缩放事件 --- */
    scale(oe) {
        clickgo.dom.bindScale(oe, (e, scale, cpos) => {
            e.preventDefault();
            this.scaleX += cpos.x;
            this.scaleY += cpos.y;
            this.scaleS *= scale;
            if (this.scaleS > 5) {
                this.scaleS = 5;
            }
            else if (this.scaleS < 0.05) {
                this.scaleS = 0.05;
            }
        });
    }
    /** --- 图片加载完成的回调 --- */
    load() {
        if ((this.refs.img.offsetWidth / this.refs.img.offsetHeight) > (this.width / this.height)) {
            this.scaleS = this.width / this.refs.img.offsetWidth;
        }
        else {
            this.scaleS = this.height / this.refs.img.offsetHeight;
        }
        if (this.scaleS < 0.05) {
            this.scaleS = 0.05;
        }
    }
    onMounted() {
        clickgo.dom.watchSize(this, this.element, () => {
            this.width = this.element.offsetWidth;
            this.height = this.element.offsetHeight;
        }, true);
        this.watch('modelValue', async (n, o) => {
            if (n === o) {
                return;
            }
            this.scaleX = 0;
            this.scaleY = 0;
            this.scaleS = 1;
            await this.refreshImgData();
        });
        this.watch('src', async () => {
            await this.refreshImgData();
        }, {
            'deep': true,
            'immediate': true
        });
    }
}

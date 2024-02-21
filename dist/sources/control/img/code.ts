import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        'src': string;
        'mode': string;

        'direction': 'h' | 'v';
        'gutter': number | string;
        'alignH': string;
        'alignV': string;
    } = {
        'src': '',
        'mode': 'default',

        'direction': 'h',
        'gutter': '',
        'alignH': '',
        'alignV': ''
    };

    public imgData = '';

    public width = 0;

    public height = 0;

    /** --- watch: src 变更次数 --- */
    public count = 0;

    public get backgroundSize(): string {
        if (this.props.mode === 'default') {
            return this.width.toString() + 'px ' + this.height.toString() + 'px';
        }
        else {
            return this.props.mode;
        }
    }

    public onMounted(): void {
        this.watch('src', async () => {
            const count = ++this.count;
            if (typeof this.props.src !== 'string' || this.props.src === '') {
                this.imgData = '';
                return;
            }
            const pre = this.props.src.slice(0, 6).toLowerCase();
            if (pre === 'file:/') {
                this.imgData = '';
                return;
            }
            if (pre === 'http:/' || pre === 'https:' || pre.startsWith('data:')) {
                this.imgData = `url(${this.props.src})`;
                return;
            }
            let blob: string | Blob | null = null;
            if (this.props.src.startsWith('/control/')) {
                // --- 从 rootControl 中读取 ---
                if (!this.rootControl) {
                    return;
                }
                blob = this.rootControl.packageFiles[this.props.src.slice(8)];
            }
            else {
                // --- 从 app 包中读取 ---
                const path = clickgo.tool.urlResolve('/package' + this.path + '/', this.props.src);
                blob = await clickgo.fs.getContent(path);
            }
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
            this.imgData = '';
        }, {
            'immediate': true
        });

        clickgo.dom.watchSize(this.element, () => {
            this.width = this.element.offsetWidth;
            this.height = this.element.offsetHeight;
        }, true);
    }

}

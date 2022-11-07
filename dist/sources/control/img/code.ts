import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props = {
        'src': '',
        'mode': 'default'
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
                return;
            }
            if (pre === 'http:/' || pre === 'https:' || pre === 'data:i') {
                this.imgData = `url(${this.props.src})`;
                return;
            }
            // --- 本 app 包 ---
            const path = clickgo.tool.urlResolve('/package' + this.path + '/', this.props.src);
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
            this.imgData = '';
        }, {
            'immediate': true
        });

        clickgo.dom.watchSize(this.element, (size) => {
            this.width = size.width;
            this.height = size.height;
        }, true);
    }

}

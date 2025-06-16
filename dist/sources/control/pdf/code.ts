import * as clickgo from 'clickgo';
import * as types from '~/types';

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'loaded': null,
        'view': null
    };

    public props: {
        'disabled': boolean | string;

        'src': string;
        'page': number | string;
    } = {
            'disabled': false,

            'src': '',
            'page': 1
        };

    public notInit = false;

    public isLoading = true;

    public access: {
        'pdfjs': any;
        'pdf': any;
        'context': any;
    } = {
            'pdfjs': undefined,
            'pdf': undefined,
            'context': undefined
        };

    /** --- watch: src 变更次数 --- */
    public count = 0;

    /** --- 供用户调用的 --- */
    public async load(buf: ArrayBuffer | Blob): Promise<boolean> {
        if (!this.access.pdfjs) {
            return false;
        }
        if (buf instanceof Blob) {
            buf = await clickgo.tool.blob2ArrayBuffer(buf);
        }
        this.isLoading = true;
        this.access.pdf = await this.access.pdfjs.getDocument(buf).promise;
        this.isLoading = false;
        await this.go();
        // --- 加载完成后渲染 ---
        this.emit('loaded', this.access.pdf);
        return true;
    }

    /** --- 跳转 page --- */
    public async go(): Promise<boolean> {
        this.isLoading = true;
        let page: any = null;
        try {
            page = await this.access.pdf.getPage(this.propInt('page'));
        }
        catch {
            this.isLoading = false;
            return false;
        }
        this.access.context ??= this.refs.content.getContext('2d');
        const viewport = page.getViewport({
            'scale': 1
        });
        const event: types.IPdfViewEvent = {
            'detail': {
                'width': viewport.width,
                'height': viewport.height,
                'inwidth': Math.round((viewport.width / 72) * 100) / 100,
                'inheight': Math.round((viewport.height / 72) * 100) / 100,
                'pxwidth': 0,
                'pxheight': 0,
            }
        };
        /** --- 重新获取 --- */
        const viewport2 = page.getViewport({
            'scale': event.detail.inwidth * clickgo.dom.dpi / viewport.width
        });
        event.detail.pxwidth = Math.round(viewport2.width);
        event.detail.pxheight = Math.round(viewport2.height);
        this.refs.content.width = event.detail.pxwidth;
        this.refs.content.height = event.detail.pxheight;
        page.render({
            'canvasContext': this.access.context,
            'viewport': viewport2
        });
        this.emit('view', event);
        this.isLoading = false;
        return true;
    }

    public async onMounted(): Promise<void> {
        this.access.pdfjs = await clickgo.core.getModule('pdfjs');
        if (!this.access.pdfjs) {
            // --- 没有成功 ---
            this.isLoading = false;
            this.notInit = true;
            return;
        }
        // --- 监听 src ---
        this.watch('src', async () => {
            const count = ++this.count;
            if (typeof this.props.src !== 'string' || this.props.src === '') {
                this.access.pdf = undefined;
                this.emit('loaded', this.access.pdf);
                return;
            }
            const pre = this.props.src.slice(0, 6).toLowerCase();
            if (pre === 'file:/') {
                this.access.pdf = undefined;
                this.emit('loaded', this.access.pdf);
                return;
            }
            if (pre.startsWith('data:')) {
                // --- TOOD, dataUrl2blob ---
                this.access.pdf = undefined;
                this.emit('loaded', this.access.pdf);
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
                // --- 从 app 包、http 中读取 ---
                const path = clickgo.tool.urlResolve('/package' + this.path + '/', this.props.src);
                blob = await clickgo.fs.getContent(path);
            }
            if ((count !== this.count) || !blob || typeof blob === 'string') {
                return;
            }
            await this.load(blob);
        }, {
            'immediate': true,
        });
        // --- 监听 page ---
        this.watch('page', async () => {
            if (!this.access.pdf) {
                return;
            }
            await this.go();
        }, {
            'deep': true
        });
        // --- 初始化成功 ---
        this.isLoading = false;
    }

}

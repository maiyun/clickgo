import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        'viewBox': string;
        'fill': string;
        'stroke': string;
        /** --- 直接插入 svg 内部标签，有的话优先显示本图形 --- */
        'layout': string;
        /** --- 或者从文件中读取 --- */
        'src': string;
    } = {
        'viewBox': '0 0 24 24',
        'fill': '',
        'stroke': '',
        /** --- 直接插入 svg 内部标签，有的话优先显示本图形 --- */
        'layout': '',
        /** --- 或者从文件中读取 --- */
        'src': ''
    };

    public fileViewBox: string = '';

    public fileFill: string = '';

    public fileStroke: string = '';

    /** --- 文件中读取的 layout --- */
    public fileLayout: string = '';

    /** --- watch: src 变更次数 --- */
    public count = 0;

    public onMounted(): void | Promise<void> {
        this.watch('src', async () => {
            const count = ++this.count;
            if (typeof this.props.src !== 'string' || this.props.src === '') {
                this.fileLayout = '';
                this.fileFill = '';
                this.fileStroke = '';
                this.fileViewBox = '';
                return;
            }
            const pre = this.props.src.slice(0, 6).toLowerCase();
            if (pre === 'file:/' || pre === 'http:/' || pre === 'https:' || pre.startsWith('data:')) {
                // --- svg 只能从本地读取 ---
                return;
            }
            // --- 本 app 包 ---
            const path = clickgo.tool.urlResolve('/package' + this.path + '/', this.props.src);
            const blob = await clickgo.fs.getContent(path);
            if ((count !== this.count) || !blob || typeof blob === 'string') {
                return;
            }
            const t = await clickgo.tool.blob2Text(blob);
            if (count !== this.count) {
                return;
            }
            if (t) {
                const viewBoxMatch = /<svg[\s\S]*?viewBox\s*?=\s*?"(.+?)"/.exec(t);
                const fillMatch = /<svg[\sa-zA-Z0-9'"=:/._;]*?fill\s*?=\s*?"(.+?)"/.exec(t);
                const strokeMatch = /<svg[\sa-zA-Z0-9'"=:/._;]*?stroke\s*?=\s*?"(.+?)"/.exec(t);
                const layoutMatch = /<svg[\s\S]*?>([\s\S]*?)<\/svg>/.exec(t);
                this.fileViewBox = viewBoxMatch ? viewBoxMatch[1] : '';
                this.fileFill = fillMatch ? fillMatch[1] : '';
                this.fileStroke = strokeMatch ? strokeMatch[1] : '';
                this.fileLayout = layoutMatch ? layoutMatch[1] : '';
                return;
            }
            this.fileViewBox = '';
            this.fileFill = '';
            this.fileStroke = '';
            this.fileLayout = '';
        }, {
            'immediate': true
        });
    }

}

import * as clickgo from 'clickgo';
/** --- 允许从 SVG 文件根标签透传的展示与缩放属性（小写键映射到标准属性名） --- */
const SVG_ROOT_ATTRS = {
    'stroke-width': 'stroke-width',
    'stroke-linecap': 'stroke-linecap',
    'stroke-linejoin': 'stroke-linejoin',
    'stroke-miterlimit': 'stroke-miterlimit',
    'stroke-dasharray': 'stroke-dasharray',
    'stroke-dashoffset': 'stroke-dashoffset',
    'stroke-opacity': 'stroke-opacity',
    'fill-rule': 'fill-rule',
    'fill-opacity': 'fill-opacity',
    'clip-rule': 'clip-rule',
    'opacity': 'opacity',
    'color': 'color',
    'preserveaspectratio': 'preserveAspectRatio'
};
export default class extends clickgo.control.AbstractControl {
    props = {
        'viewBox': '0 0 24 24',
        'fill': '',
        'stroke': '',
        /** --- 直接插入 svg 内部标签，有的话优先显示本图形 --- */
        'layout': '',
        /** --- 或者从文件中读取 --- */
        'src': ''
    };
    fileViewBox = '';
    fileFill = '';
    fileStroke = '';
    /** --- 文件根 svg 标签上的其余展示属性 --- */
    fileAttrs = {};
    /** --- 文件中读取的 layout --- */
    fileLayout = '';
    /** --- watch: src 变更次数 --- */
    count = 0;
    /**
     * --- 挂载时监听 src 变化并加载解析本地 SVG 文件 ---
     * @returns 无返回值
     */
    onMounted() {
        this.watch('src', async () => {
            const count = ++this.count;
            if (typeof this.props.src !== 'string' || this.props.src === '') {
                this._resetFile();
                return;
            }
            const pre = this.props.src.slice(0, 6).toLowerCase();
            if (pre === 'file:/' || pre === 'http:/' || pre === 'https:' || pre.startsWith('data:')) {
                // --- svg 只能从本地读取 ---
                return;
            }
            let blob = null;
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
                blob = await clickgo.fs.getContent(this, path);
            }
            // --- 本 app 包 ---
            if ((count !== this.count) || !blob || typeof blob === 'string') {
                return;
            }
            const text = await clickgo.tool.blob2Text(blob);
            if (count !== this.count) {
                return;
            }
            if (text) {
                this._applySvgText(text);
                return;
            }
            this._resetFile();
        }, {
            'immediate': true
        });
    }
    /**
     * --- 清空已加载的 SVG 文件状态 ---
     * @returns 无返回值
     */
    _resetFile() {
        this.fileViewBox = '';
        this.fileFill = '';
        this.fileStroke = '';
        this.fileAttrs = {};
        this.fileLayout = '';
    }
    /**
     * --- 解析 SVG 文本的根标签属性与内部图形并写入状态 ---
     * 只扫描根 svg 起始标签，避免把子元素的 fill/stroke 误当成根属性，
     * 同时按白名单透传 stroke-width、stroke-linecap 等展示属性，忽略固定宽高与脚本属性。
     * @param text SVG 文件文本
     * @returns 无返回值
     */
    _applySvgText(text) {
        const svgMatch = /<svg\b([^>]*)>([\s\S]*?)<\/svg>/i.exec(text);
        if (!svgMatch) {
            this._resetFile();
            return;
        }
        const openAttrs = svgMatch[1];
        const attrs = {};
        let viewBox = '';
        let fill = '';
        let stroke = '';
        const attrReg = /([a-zA-Z_:][a-zA-Z0-9_.:-]*)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
        let match = attrReg.exec(openAttrs);
        while (match) {
            const rawName = match[1].toLowerCase();
            const value = match[2] ?? match[3] ?? '';
            if (rawName === 'viewbox') {
                viewBox = value;
            }
            else if (rawName === 'fill') {
                fill = value;
            }
            else if (rawName === 'stroke') {
                stroke = value;
            }
            else {
                const mapped = SVG_ROOT_ATTRS[rawName];
                if (mapped && value !== '') {
                    attrs[mapped] = value;
                }
            }
            match = attrReg.exec(openAttrs);
        }
        this.fileViewBox = viewBox;
        this.fileFill = fill;
        this.fileStroke = stroke;
        this.fileAttrs = attrs;
        this.fileLayout = svgMatch[2];
    }
}

import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    access = {
        'editor': undefined,
    };
    /** --- 是否加载失败 --- */
    failed = false;
    /**
     * --- 加载失败回调 ---
     */
    onFailed() {
        this.loading = false;
        this.failed = true;
    }
    /**
     * --- 加载成功回调，创建编辑器实例 ---
     * @param konva Konva 类
     */
    onInit(konva) {
        this.loading = false;
        const el = this.refs['konva'].element;
        this.access.editor = new konva.Stage({
            'container': el,
            'width': el.clientWidth,
            'height': el.clientHeight,
        });
        // --- 示例，未实现自适应 ---
        var layer = new konva.Layer();
        this.access.editor.add(layer);
        var box = new konva.Rect({
            'x': 50,
            'y': 50,
            'width': 100,
            'height': 50,
            'fill': '#00D2FF',
            'stroke': 'black',
            'strokeWidth': 4,
            'draggable': true,
        });
        layer.add(box);
        box.on('mouseover', () => {
            clickgo.dom.setGlobalCursor('pointer');
        });
        box.on('mouseout', () => {
            clickgo.dom.setGlobalCursor();
        });
    }
    onMounted() {
        this.loading = true;
    }
}

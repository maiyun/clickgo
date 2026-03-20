import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    access = {
        'canvas': undefined
    };
    disabled = false;
    autoLayer = true;
    transform = true;
    selector = true;
    artboard = false;
    /** --- 画板外背景色，空字符串为透明 --- */
    artboardBg = '#7a7a7a';
    /** --- 画板内填充色，空字符串为透明 --- */
    artboardFill = '#ffffff';
    mode = [''];
    /** --- 选区组合模式 --- */
    marqueeCompose = ['replace'];
    /** --- 选区信息文本 --- */
    marqueeInfo = '(none)';
    /** --- 当前激活图层名称，由 v-model:layer 双向绑定 --- */
    layer = '';
    onInit(canvas) {
        this.access.canvas = canvas;
        const fabric = clickgo.modules.fabric;
        if (!fabric) {
            return;
        }
        // --- 红色矩形图层 ---
        const rect = new fabric.Rect({
            'name': 'rect',
            'left': 110,
            'top': 55,
            'fill': '#e74c3c',
            'width': 150,
            'height': 110,
        });
        // --- 绿色圆形图层 ---
        const circle = new fabric.Circle({
            'name': 'circle',
            'radius': 60,
            'fill': '#2ecc71',
            'left': 200,
            'top': 110,
        });
        // --- 蓝色三角形图层 ---
        const triangle = new fabric.Triangle({
            'name': 'triangle',
            'width': 140,
            'height': 115,
            'fill': '#3498db',
            'left': 255,
            'top': 60,
        });
        this.access.canvas.add(rect, circle, triangle);
    }
    onZoomActual() {
        this.refs['fabric'].zoomActual();
    }
    onZoomFit() {
        this.refs['fabric'].zoomFit();
    }
    onZoomIn() {
        this.refs['fabric'].zoomIn();
    }
    onZoomOut() {
        this.refs['fabric'].zoomOut();
    }
    onClearMarquee() {
        this.refs['fabric'].clearMarquee();
    }
    onMarqueeChange() {
        const rect = this.refs['fabric'].getMarqueeRect();
        if (rect) {
            const objs = this.refs['fabric'].getMarqueeObjects();
            this.marqueeInfo = `(${Math.round(rect.x)}, ${Math.round(rect.y)}) ${Math.round(rect.width)}×${Math.round(rect.height)}, ${objs.length} objs`;
        }
        else {
            this.marqueeInfo = '(none)';
        }
    }
}

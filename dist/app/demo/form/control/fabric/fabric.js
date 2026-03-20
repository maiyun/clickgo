import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    access = {
        'canvas': undefined
    };
    disabled = false;
    autoLayer = true;
    transform = true;
    selector = true;
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
            'left': 40,
            'top': 60,
            'fill': '#e74c3c',
            'width': 150,
            'height': 110,
        });
        // --- 绿色圆形图层 ---
        const circle = new fabric.Circle({
            'name': 'circle',
            'radius': 65,
            'fill': '#2ecc71',
            'left': 160,
            'top': 110,
        });
        // --- 蓝色三角形图层 ---
        const triangle = new fabric.Triangle({
            'name': 'triangle',
            'width': 150,
            'height': 120,
            'fill': '#3498db',
            'left': 290,
            'top': 70,
        });
        this.access.canvas.add(rect, circle, triangle);
    }
}

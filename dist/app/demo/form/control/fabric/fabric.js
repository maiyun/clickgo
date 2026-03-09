import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    access = {
        'canvas': undefined
    };
    disabled = false;
    onInit(canvas) {
        this.access.canvas = canvas;
        const fabric = clickgo.modules.fabric;
        if (!fabric) {
            return;
        }
        // --- Demo to add a simple rectangle ---
        const rect = new fabric.Rect({
            'left': 100,
            'top': 100,
            'fill': 'red',
            'width': 200,
            'height': 200,
        });
        // --- Demo to add a simple circle ---
        const circle = new fabric.Circle({
            'radius': 50,
            'fill': 'green',
            'left': 300,
            'top': 200
        });
        this.access.canvas.add(rect, circle);
    }
}

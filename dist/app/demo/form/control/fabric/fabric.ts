import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public access: {
        'canvas': any;
    } = {
            'canvas': undefined
        };

    public disabled: boolean = false;

    public autoLayer: boolean = true;

    public transform: boolean = true;

    public selector: boolean = true;

    public artboard: boolean = false;

    /** --- 画板外背景色，空字符串为透明 --- */
    public artboardBg: string = '#7a7a7a';

    /** --- 画板内填充色，空字符串为透明 --- */
    public artboardFill: string = '#ffffff';

    public mode: string[] = [''];

    /** --- 选区组合模式 --- */
    public marqueeCompose: string[] = ['replace'];

    /** --- 选区信息文本 --- */
    public marqueeInfo: string = '(none)';

    /** --- 图层列表显示文本 --- */
    public layerListInfo: string = '(none)';

    /** --- 图层管理输入框内容 --- */
    public newLayerName: string = '';

    /** --- 当前激活图层名称列表，由 v-model:layer 双向绑定 --- */
    public layer: string[] = [];

    public onInit(canvas: any): void {
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

    public onZoomActual(): void {
        (this.refs['fabric'] as any).zoomActual();
    }

    public onZoomFit(): void {
        (this.refs['fabric'] as any).zoomFit();
    }

    public onZoomIn(): void {
        (this.refs['fabric'] as any).zoomIn();
    }

    public onZoomOut(): void {
        (this.refs['fabric'] as any).zoomOut();
    }

    public onClearMarquee(): void {
        (this.refs['fabric'] as any).clearMarquee();
    }

    public onMarqueeChange(): void {
        const rect = (this.refs['fabric'] as any).getMarqueeRect();
        if (rect) {
            const objs = (this.refs['fabric'] as any).getMarqueeObjects();
            this.marqueeInfo = `(${Math.round(rect.x)}, ${Math.round(rect.y)}) ${Math.round(rect.width)}×${Math.round(rect.height)}, ${objs.length} objs`;
        }
        else {
            this.marqueeInfo = '(none)';
        }
    }

    public onLayerListChange(): void {
        const ls = this.refs.fabric.layerList;
        this.layerListInfo = ls.length ? JSON.stringify(ls) : '(none)';
    }

    public onAddLayer(): void {
        if (!this.newLayerName) {
            return;
        }
        this.refs.fabric.addLayer(this.newLayerName);
        this.newLayerName = '';
    }

    public onRemoveLayer(): void {
        if (!this.newLayerName) {
            return;
        }
        this.refs.fabric.removeLayer(this.newLayerName);
        this.newLayerName = '';
    }

}

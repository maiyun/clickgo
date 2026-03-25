import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public access: {
        'canvas': any;
    } = {
            'canvas': undefined,
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

    /** --- 图层树 HTML 展示内容（[F]=文件夹 [L]=图层 [H]=隐藏 [K]=锁定） --- */
    public layerListHtml: string = '(none)';

    /** --- 当前激活图层名称列表，由 v-model:layer 双向绑定 --- */
    public layer: string[] = [];

    /** --- 图层操作的 name 输入内容（供 add / remove / rename / visible / locked 复用） --- */
    public layerOpName: string = '';

    /** --- 图层操作的 title 输入内容（add 时为初始标题，rename 时为新标题） --- */
    public layerOpTitle: string = '';

    /** --- setLayerVisible 目标可见状态 --- */
    public stateVisible: boolean = true;

    /** --- setLayerLocked 目标锁定状态 --- */
    public stateLocked: boolean = false;

    /** --- moveLayer 源图层，逗号分隔多个 name --- */
    public moveSrc: string = '';

    /** --- moveLayer 参考目标 name，空字符串表示移到根末尾 --- */
    public moveRef: string = '';

    /** --- moveLayer 插入位置 --- */
    public movePos: string[] = ['before'];

    /** --- 事件触发日志列表 --- */
    public eventLog: Array<{ 'time': string; 'name': string; 'content': string; }> = [];

    /**
     * --- 向事件日志列表头部插入一条记录 ---
     * @param name 事件名称
     * @param content 事件内容摘要
     */
    private _logEvent(name: string, content: string): void {
        const d = new Date();
        const pad = (n: number): string => n.toString().padStart(2, '0');
        this.eventLog.unshift({
            'time': `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`,
            'name': name,
            'content': content,
        });
        if (this.eventLog.length > 50) {
            this.eventLog.pop();
        }
    }

    /** --- 递归构建图层树 HTML 字符串 --- */
    private _buildLayerHtml(list: any[], indent: number = 0): string {
        const parts: string[] = [];
        for (const item of list) {
            const pad = '&nbsp;&nbsp;'.repeat(indent);
            const state = `${item.hidden ? ' [H]' : ''}${item.locked ? ' [K]' : ''}`;
            if (item.type === 'folder') {
                parts.push(`${pad}<b>[F]</b> <b>${item.name}</b> (${item.title})${state}`);
                if (item.children?.length) {
                    parts.push(this._buildLayerHtml(item.children, indent + 1));
                }
            }
            else {
                parts.push(`${pad}[L] ${item.name} (${item.title})${state}`);
            }
        }
        return parts.join('<br>');
    }

    public onInit(canvas: any): void {
        this._logEvent('init', 'canvas ready');
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
        // --- 创建 shapes 文件夹，将 rect、circle 移入其中演示文件夹结构 ---
        const fb = this.refs['fabric'] as any;
        fb.addFolder('shapes', 'Shapes');
        fb.moveLayer(['rect', 'circle'], 'shapes', 'inside');
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

    public onLayerChange(e: CustomEvent): void {
        const prev = (e.detail.prev as string[]).join(', ') || '(none)';
        const next = (e.detail.next as string[]).join(', ') || '(none)';
        this._logEvent('layerchange', `${prev} → ${next}`);
    }

    public onMarqueeChange(): void {
        const rect = (this.refs['fabric'] as any).getMarqueeRect();
        if (rect) {
            const objs = (this.refs['fabric'] as any).getMarqueeObjects();
            this.marqueeInfo = `(${Math.round(rect.x)}, ${Math.round(rect.y)}) ${Math.round(rect.width)}×${Math.round(rect.height)}, ${objs.length} objs`;
            this._logEvent('marqueechange', this.marqueeInfo);
        }
        else {
            this.marqueeInfo = '(none)';
            this._logEvent('marqueechange', '(none)');
        }
    }

    public onLayerListChange(e: CustomEvent): void {
        const ls = (this.refs['fabric'] as any).layerList;
        this.layerListHtml = ls.length ? this._buildLayerHtml(ls) : '(none)';
        this._logEvent('layerlistchange', `type=${e.detail.type}, names=[${(e.detail.names as string[]).join(', ')}]`);
    }

    public onObjectChanged(e: CustomEvent): void {
        const d = e.detail;
        this._logEvent('objectchanged', `${d.name}: left=${Math.round(d.left)}, top=${Math.round(d.top)}, w=${Math.round(d.width * d.scaleX)}, h=${Math.round(d.height * d.scaleY)}, angle=${Math.round(d.angle)}°`);
    }

    public onAddLayer(): void {
        if (!this.layerOpName) {
            return;
        }
        (this.refs['fabric'] as any).addLayer(this.layerOpName, this.layerOpTitle || this.layerOpName);
        this.layerOpName = '';
        this.layerOpTitle = '';
    }

    public onAddFolder(): void {
        if (!this.layerOpName) {
            return;
        }
        this.refs.fabric.addFolder(this.layerOpName, this.layerOpTitle || this.layerOpName);
        this.layerOpName = '';
        this.layerOpTitle = '';
    }

    public onRemoveLayer(): void {
        if (!this.layerOpName) {
            return;
        }
        this.refs.fabric.removeLayer(this.layerOpName);
    }

    public onRenameLayer(): void {
        if (!this.layerOpName || !this.layerOpTitle) {
            return;
        }
        this.refs.fabric.renameLayer(this.layerOpName, this.layerOpTitle);
    }

    public onSetVisible(): void {
        if (!this.layerOpName) {
            return;
        }
        this.refs.fabric.setLayerVisible(this.layerOpName, this.stateVisible);
    }

    public onSetLocked(): void {
        if (!this.layerOpName) {
            return;
        }
        this.refs.fabric.setLayerLocked(this.layerOpName, this.stateLocked);
    }

    public onMoveLayer(): void {
        const names = this.moveSrc.split(',').map(n => n.trim()).filter(n => n);
        if (names.length === 0) {
            return;
        }
        const ref = this.moveRef.trim() || null;
        const pos = this.movePos[0] as 'before' | 'after' | 'inside';
        this.refs.fabric.moveLayer(names, ref, pos);
    }

}

import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    access = {
        'canvas': undefined,
    };
    disabled = false;
    autoLayer = true;
    transform = true;
    selector = true;
    artboard = false;
    /** --- 吸附模式 --- */
    snap = false;
    /** --- 画板外背景色，空字符串为透明 --- */
    artboardBg = '#7a7a7a';
    /** --- 画板内填充色，空字符串为透明 --- */
    artboardFill = '#ffffff';
    mode = [''];
    /** --- 选区组合模式 --- */
    marqueeCompose = ['replace'];
    /** --- 选区信息文本 --- */
    marqueeInfo = '(none)';
    /** --- 图层树 HTML 展示内容（[F]=文件夹 [L]=图层 [H]=隐藏 [K]=锁定） --- */
    layerListHtml = '(none)';
    /** --- 当前激活图层名称列表，由 v-model:layer 双向绑定 --- */
    layer = [];
    /** --- 图层操作的 name 输入内容（供 add / remove / rename / visible / locked 复用） --- */
    layerOpName = '';
    /** --- 图层操作的 title 输入内容（add 时为初始标题，rename 时为新标题） --- */
    layerOpTitle = '';
    /** --- setLayerVisible 目标可见状态 --- */
    stateVisible = true;
    /** --- setLayerLocked 目标锁定状态 --- */
    stateLocked = false;
    /** --- moveLayer 源图层，逗号分隔多个 name --- */
    moveSrc = '';
    /** --- moveLayer 参考目标 name，空字符串表示移到根末尾 --- */
    moveRef = '';
    /** --- moveLayer 插入位置 --- */
    movePos = ['before'];
    /** --- 事件触发日志列表 --- */
    eventLog = [];
    /**
     * --- 向事件日志列表头部插入一条记录 ---
     * @param name 事件名称
     * @param content 事件内容摘要
     */
    _logEvent(name, content) {
        const d = new Date();
        const pad = (n) => n.toString().padStart(2, '0');
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
    _buildLayerHtml(list, indent = 0) {
        const parts = [];
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
    async onInit(canvas) {
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
        // --- 位图图层 ---
        const blob = await clickgo.fs.getContent(this, '/package/res/img.jpg');
        if (blob instanceof Blob) {
            const url = URL.createObjectURL(blob);
            const img = await fabric.FabricImage.fromURL(url);
            img.set({ 'name': 'img', 'left': 50, 'top': 200 });
            img.scaleToWidth(120);
            this.access.canvas.add(img);
        }
        // --- 创建 shapes 文件夹，将 rect、circle 移入其中演示文件夹结构 ---
        const fb = this.refs['fabric'];
        fb.addFolder('shapes', 'Shapes');
        fb.moveLayer(['rect', 'circle'], 'shapes', 'inside');
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
    onLayerChange(e) {
        const prev = e.detail.prev.join(', ') || '(none)';
        const next = e.detail.next.join(', ') || '(none)';
        this._logEvent('layerchange', `${prev} → ${next}`);
    }
    onMarqueeChange() {
        const rect = this.refs['fabric'].getMarqueeRect();
        if (rect) {
            const objs = this.refs['fabric'].getMarqueeObjects();
            this.marqueeInfo = `(${Math.round(rect.x)}, ${Math.round(rect.y)}) ${Math.round(rect.width)}×${Math.round(rect.height)}, ${objs.length} objs`;
            this._logEvent('marqueechange', this.marqueeInfo);
        }
        else {
            this.marqueeInfo = '(none)';
            this._logEvent('marqueechange', '(none)');
        }
    }
    onLayerListChange(e) {
        const ls = this.refs['fabric'].layerList;
        this.layerListHtml = ls.length ? this._buildLayerHtml(ls) : '(none)';
        this._logEvent('layerlistchange', `type=${e.detail.type}, names=[${e.detail.names.join(', ')}]`);
    }
    onObjectChanged(e) {
        const d = e.detail;
        this._logEvent('objectchanged', `${d.name}: left=${Math.round(d.left)}, top=${Math.round(d.top)}, w=${Math.round(d.width * d.scaleX)}, h=${Math.round(d.height * d.scaleY)}, angle=${Math.round(d.angle)}°`);
    }
    onAddLayer() {
        if (!this.layerOpName) {
            return;
        }
        this.refs['fabric'].addLayer(this.layerOpName, this.layerOpTitle || this.layerOpName);
        this.layerOpName = '';
        this.layerOpTitle = '';
    }
    onAddFolder() {
        if (!this.layerOpName) {
            return;
        }
        this.refs.fabric.addFolder(this.layerOpName, this.layerOpTitle || this.layerOpName);
        this.layerOpName = '';
        this.layerOpTitle = '';
    }
    onRemoveLayer() {
        if (!this.layerOpName) {
            return;
        }
        this.refs.fabric.removeLayer(this.layerOpName);
    }
    onRenameLayer() {
        if (!this.layerOpName || !this.layerOpTitle) {
            return;
        }
        this.refs.fabric.renameLayer(this.layerOpName, this.layerOpTitle);
    }
    onSetVisible() {
        if (!this.layerOpName) {
            return;
        }
        this.refs.fabric.setLayerVisible(this.layerOpName, this.stateVisible);
    }
    onSetLocked() {
        if (!this.layerOpName) {
            return;
        }
        this.refs.fabric.setLayerLocked(this.layerOpName, this.stateLocked);
    }
    onMoveLayer() {
        const names = this.moveSrc.split(',').map(n => n.trim()).filter(n => n);
        if (names.length === 0) {
            return;
        }
        const ref = this.moveRef.trim() || null;
        const pos = this.movePos[0];
        this.refs.fabric.moveLayer(names, ref, pos);
    }
}

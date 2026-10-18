import * as clickgo from 'clickgo';
import { arrange } from './lib/layout';
export default class extends clickgo.control.AbstractControl {
    emits = { 'update:modelValue': null, 'select': null };
    props = {
        'edges': [], 'layout': 'auto', 'root': '', 'gap': 48, 'bg': 'none',
        'modelValue': '', 'disabled': false, 'label': ''
    };
    /** --- 所有节点及连接共用的内容坐标 --- */
    scene = { 'nodes': [], 'edges': [], 'width': 0, 'height': 0 };
    selected = '';
    width = 0;
    /** --- 下一轮 DOM 稳定后统一测量，子项实例不参与响应式深克隆 --- */
    access = {
        'items': null,
        'resize': null,
        'pending': false, 'alive': true, 'signature': ''
    };
    /** --- 窄容器使用纵排节点，避免只缩小整张图导致文字无法识别 --- */
    get compact() {
        return this.props.layout === 'auto' && this.width > 0 && this.width < 600;
    }
    localeData = {
        'en': { 'fit': 'Fit view', 'in': 'Zoom in', 'out': 'Zoom out', 'empty': 'No nodes' },
        'sc': { 'fit': '完整显示', 'in': '放大', 'out': '缩小', 'empty': '暂无节点' },
        'tc': { 'fit': '完整顯示', 'in': '放大', 'out': '縮小', 'empty': '暫無節點' },
        'ja': { 'fit': '全体を表示', 'in': '拡大', 'out': '縮小', 'empty': 'ノードがありません' },
        'ko': { 'fit': '전체 보기', 'in': '확대', 'out': '축소', 'empty': '노드 없음' },
        'th': { 'fit': 'แสดงทั้งหมด', 'in': 'ขยาย', 'out': 'ย่อ', 'empty': 'ไม่มีโหนด' },
        'vi': { 'fit': 'Hiện toàn bộ', 'in': 'Phóng to', 'out': 'Thu nhỏ', 'empty': 'Không có nút' },
        'ar': { 'fit': 'عرض الكل', 'in': 'تكبير', 'out': 'تصغير', 'empty': 'لا توجد عقد' },
        'id': { 'fit': 'Tampilkan semua', 'in': 'Perbesar', 'out': 'Perkecil', 'empty': 'Tidak ada simpul' },
        'es': { 'fit': 'Ajustar vista', 'in': 'Acercar', 'out': 'Alejar', 'empty': 'Sin nodos' },
        'de': { 'fit': 'Alles anzeigen', 'in': 'Vergrößern', 'out': 'Verkleinern', 'empty': 'Keine Knoten' },
        'fr': { 'fit': 'Tout afficher', 'in': 'Agrandir', 'out': 'Réduire', 'empty': 'Aucun nœud' },
        'pt': { 'fit': 'Ajustar vista', 'in': 'Ampliar', 'out': 'Reduzir', 'empty': 'Sem nós' },
        'ru': { 'fit': 'Показать всё', 'in': 'Увеличить', 'out': 'Уменьшить', 'empty': 'Нет узлов' },
        'it': { 'fit': 'Mostra tutto', 'in': 'Ingrandisci', 'out': 'Riduci', 'empty': 'Nessun nodo' },
        'tr': { 'fit': 'Tümünü göster', 'in': 'Yakınlaştır', 'out': 'Uzaklaştır', 'empty': 'Düğüm yok' }
    };
    /**
     * --- 注册稳定 ID 节点 ---
     * @param item 已挂载节点
     * @returns 注册完成
     */
    register(item) {
        this.access.items?.set(item.element, item);
        this.schedule();
    }
    /**
     * --- 注销节点，下一轮同步移除悬空连接 ---
     * @param item 待卸载节点
     * @returns 注销完成
     */
    unregister(item) {
        this.access.items?.delete(item.element);
        this.schedule();
    }
    /**
     * --- 合并同一轮增删、改名和尺寸通知 ---
     * @returns 测量已排入下一轮 DOM 更新
     */
    schedule() {
        if (this.access.pending || !this.access.alive) {
            return;
        }
        this.access.pending = true;
        this.nextTick().then(() => {
            this.access.pending = false;
            if (this.access.alive) {
                this.refresh();
            }
        }).catch(() => { });
    }
    /**
     * --- 按直属节点顺序计算场景；相同几何和状态不反复更新 ---
     * @returns 布局更新完成
     */
    refresh() {
        if (!this.refs.nodes || !this.access.items) {
            return;
        }
        const nodes = [];
        const items = [];
        const ids = new Set();
        for (const element of this.refs.nodes.children) {
            const item = this.access.items.get(element);
            if (!item) {
                continue;
            }
            const id = item.props.nodeId.trim();
            if (!id || ids.has(id)) {
                item.placed = false;
                continue;
            }
            ids.add(id);
            items.push(item);
            nodes.push({
                'id': id, 'width': item.element.offsetWidth, 'height': item.element.offsetHeight,
                'x': item.propNumber('x'), 'y': item.propNumber('y'), 'hub': item.props.variant === 'hub',
                'captionWidth': item.refs.body?.offsetWidth
            });
        }
        let mode = 'radial';
        if (this.compact) {
            mode = 'compact';
        }
        else if (this.props.layout !== 'auto') {
            mode = this.props.layout;
        }
        const scene = arrange(nodes, this.props.edges, mode, this.props.root, this.propNumber('gap'));
        const signature = JSON.stringify(scene);
        if (signature !== this.access.signature) {
            this.access.signature = signature;
            this.scene = scene;
        }
        for (const [index, node] of scene.nodes.entries()) {
            const item = items[index];
            item.left = node.x;
            item.top = node.y;
            item.placed = true;
        }
        if (this.selected && !ids.has(this.selected)) {
            this.selected = '';
            this.emit('update:modelValue', '');
        }
    }
    /**
     * --- 选择节点，只通知应用，不执行业务跳转 ---
     * @param item 用户激活的节点
     * @returns 选择完成，重复选择和禁用节点不通知
     */
    select(item) {
        const id = item.props.nodeId.trim();
        if (this.propBoolean('disabled') || item.propBoolean('disabled') || !item.placed || this.selected === id) {
            return;
        }
        this.selected = id;
        this.emit('update:modelValue', id);
        const event = { 'detail': { 'nodeId': id, 'label': item.props.label } };
        this.emit('select', event);
    }
    /**
     * --- 恢复完整显示并随视口尺寸适应 ---
     * @returns 适应完成
     */
    fit() {
        this.refs.view?.zoomFit();
    }
    /**
     * --- 围绕视口中心缩放 ---
     * @param factor 相对比例
     * @returns 缩放完成
     */
    zoom(factor) {
        if (!this.propBoolean('disabled')) {
            this.refs.view?.zoomTo(this.refs.view.zoomData * factor);
        }
    }
    /** --- 初始化子项注册表 --- */
    onCreated() {
        this.access.items = new Map();
    }
    /** --- 监听声明式拓扑与选择输入 --- */
    onMounted() {
        this.selected = this.props.modelValue;
        this.access.resize = () => {
            this.width = this.element.clientWidth;
            this.schedule();
        };
        clickgo.dom.watchSizeMulti(this, this.element, this.access.resize, true);
        this.watch('modelValue', () => { this.selected = this.props.modelValue; });
        this.watch(() => [this.props.edges, this.props.layout, this.props.root, this.props.gap], () => { this.schedule(); }, { 'deep': true });
        this.schedule();
    }
    /** --- 插槽重排后同步节点顺序 --- */
    onUpdated() {
        this.schedule();
    }
    /** --- 阻止待处理测量继续运行，释放节点引用 --- */
    onBeforeUnmount() {
        this.access.alive = false;
        if (this.access.resize) {
            clickgo.dom.unwatchSizeMulti(this, this.element, this.access.resize);
        }
        this.access.resize = null;
        this.access.items = null;
    }
}

import * as clickgo from 'clickgo';
import type Item from '../objviewer-item/code';
import { arrange, type INode, type IScene } from './lib/layout';

export default class extends clickgo.control.AbstractControl {

    public emits = { 'update:modelValue': null, 'select': null };

    public props: {
        'edges': clickgo.control.IObjviewerEdge[];
        'layout': 'auto' | 'radial' | 'tree' | 'manual';
        'root': string;
        'gap': number | string;
        'bg': 'none' | 'dot' | 'grid';
        'modelValue': string;
        'disabled': boolean | string;
        'label': string;
    } = {
            'edges': [], 'layout': 'auto', 'root': '', 'gap': 48, 'bg': 'none',
            'modelValue': '', 'disabled': false, 'label': ''
        };

    /** --- 所有节点及连接共用的内容坐标 --- */
    public scene: IScene = { 'nodes': [], 'edges': [], 'width': 0, 'height': 0 };

    public selected = '';

    public width = 0;

    /** --- 下一轮 DOM 稳定后统一测量，子项实例不参与响应式深克隆 --- */
    public access = {
        'items': null as Map<HTMLElement, Item> | null,
        'resize': null as (() => void) | null,
        'pending': false, 'alive': true, 'signature': ''
    };

    /** --- 窄容器使用纵排节点，避免只缩小整张图导致文字无法识别 --- */
    public get compact(): boolean {
        return this.props.layout === 'auto' && this.width > 0 && this.width < 600;
    }

    public localeData = {
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
    public register(item: Item): void {
        this.access.items?.set(item.element, item);
        this.schedule();
    }

    /**
     * --- 注销节点，下一轮同步移除悬空连接 ---
     * @param item 待卸载节点
     * @returns 注销完成
     */
    public unregister(item: Item): void {
        this.access.items?.delete(item.element);
        this.schedule();
    }

    /**
     * --- 合并同一轮增删、改名和尺寸通知 ---
     * @returns 测量已排入下一轮 DOM 更新
     */
    public schedule(): void {
        if (this.access.pending || !this.access.alive) {
            return;
        }
        this.access.pending = true;
        this.nextTick().then(() => {
            this.access.pending = false;
            if (this.access.alive) {
                this.refresh();
            }
        }).catch(() => {});
    }

    /**
     * --- 按直属节点顺序计算场景；相同几何和状态不反复更新 ---
     * @returns 布局更新完成
     */
    public refresh(): void {
        if (!this.refs.nodes || !this.access.items) {
            return;
        }
        const nodes: INode[] = [];
        const items: Item[] = [];
        const ids = new Set<string>();
        for (const element of this.refs.nodes.children) {
            const item = this.access.items.get(element as HTMLElement);
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
        let mode: 'radial' | 'tree' | 'manual' | 'compact' = 'radial';
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
    public select(item: Item): void {
        const id = item.props.nodeId.trim();
        if (this.propBoolean('disabled') || item.propBoolean('disabled') || !item.placed || this.selected === id) {
            return;
        }
        this.selected = id;
        this.emit('update:modelValue', id);
        const event: clickgo.control.IObjviewerSelectEvent = { 'detail': { 'nodeId': id, 'label': item.props.label } };
        this.emit('select', event);
    }

    /**
     * --- 恢复完整显示并随视口尺寸适应 ---
     * @returns 适应完成
     */
    public fit(): void {
        this.refs.view?.zoomFit();
    }

    /**
     * --- 围绕视口中心缩放 ---
     * @param factor 相对比例
     * @returns 缩放完成
     */
    public zoom(factor: number): void {
        if (!this.propBoolean('disabled')) {
            this.refs.view?.zoomTo(this.refs.view.zoomData * factor);
        }
    }

    /** --- 初始化子项注册表 --- */
    public onCreated(): void {
        this.access.items = new Map();
    }

    /** --- 监听声明式拓扑与选择输入 --- */
    public onMounted(): void {
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
    public onUpdated(): void {
        this.schedule();
    }

    /** --- 阻止待处理测量继续运行，释放节点引用 --- */
    public onBeforeUnmount(): void {
        this.access.alive = false;
        if (this.access.resize) {
            clickgo.dom.unwatchSizeMulti(this, this.element, this.access.resize);
        }
        this.access.resize = null;
        this.access.items = null;
    }

}

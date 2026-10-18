import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public fullscreen = false;

    public layout = ['tree'];

    public status = ['All states'];

    public selected = '';

    public pulse = true;

    public animation = ['dots'];

    public direction = ['forward'];

    public duration = '3';

    public dotCount = '3';

    public narrow = false;

    public deviceAdded = false;

    public outage = false;

    public nodes = [
        { 'id': 'gateway', 'label': 'Gateway', 'description': 'Main connection', 'icon': 'cpu', 'status': 'online' as clickgo.control.TObjviewerStatus, 'variant': 'hub' },
        { 'id': 'compute', 'label': 'Compute cluster', 'description': 'Asia Pacific · 3 services', 'icon': '', 'status': 'online' as clickgo.control.TObjviewerStatus, 'variant': 'card' },
        { 'id': 'storage', 'label': 'Object storage', 'description': 'Europe · 82% capacity', 'icon': '', 'status': 'warning' as clickgo.control.TObjviewerStatus, 'variant': 'card' },
        { 'id': 'worker', 'label': 'Background worker', 'description': 'Last seen 2h ago', 'icon': '', 'status': 'offline' as clickgo.control.TObjviewerStatus, 'variant': 'card' }
    ];

    /** --- 根据筛选生成真实挂载节点，连接按 ID 自动匹配 --- */
    public get visibleNodes(): typeof this.nodes {
        const nodes = [...this.nodes];
        if (this.deviceAdded) {
            nodes.push({ 'id': 'device', 'label': 'Branch device', 'description': 'Newly connected', 'icon': 'surveillance', 'status': 'online', 'variant': 'card' });
        }
        const visible = nodes.filter(node => node.id === 'gateway' || this.status[0] === 'All states' || node.status === this.status[0].toLowerCase());
        if (!this.deviceAdded && visible.some(node => node.id === 'compute')) {
            visible.push({ 'id': 'device', 'label': 'Add device', 'description': '', 'icon': 'plus', 'status': 'default', 'variant': 'hub' });
        }
        return visible;
    }

    /** --- 连接只描述业务关系与连接状态 --- */
    public get edges(): clickgo.control.IObjviewerEdge[] {
        const nodes = this.visibleNodes;
        return nodes.filter(node => node.id !== 'gateway' && (node.id !== 'device' || nodes.some(parent => parent.id === 'compute'))).map(node => ({
            'source': node.id === 'device' ? 'compute' : 'gateway', 'target': node.id, 'status': node.status,
            'animation': node.status === 'online' ? this.animation[0] as clickgo.control.IObjviewerEdge['animation'] : 'none',
            'direction': this.direction[0] as clickgo.control.IObjviewerEdge['direction'],
            'duration': Number(this.duration) || 3, 'dotCount': Number(this.dotCount) || 3
        }));
    }

    /**
     * --- 将加号节点原位转为设备，保留节点 ID 与上游连接 ---
     * @param event 用户激活的节点
     * @returns 添加处理完成
     */
    public addDevice(event: clickgo.control.IObjviewerSelectEvent): void {
        if (event.detail.nodeId !== 'device' || this.deviceAdded) {
            return;
        }
        this.deviceAdded = true;
    }

    /** --- 紧凑空间保留名称和状态，完整说明在选择后展示 --- */
    public get selectionText(): string {
        const node = this.visibleNodes.find(node => node.id === this.selected);
        if (!node) {
            return 'Select a node to view details.';
        }
        return `${node.label} · ${node.description}`;
    }

    /**
     * --- 演示状态更新，节点 ID 和当前视图保持稳定 ---
     * @returns 更新完成
     */
    public changeStatus(): void {
        this.outage = !this.outage;
        this.nodes[1].status = this.outage ? 'offline' : 'online';
    }

    /**
     * --- 独立入口可以无边框展示；Demo 内仍为普通窗口 ---
     * @param data 窗口展示方式，主题沿用系统设置
     * @returns 初始化完成
     */
    public onMounted(data: { 'fullscreen'?: boolean; }): void {
        this.fullscreen = data.fullscreen ?? false;
    }

}

import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    props = {
        'nodeId': '', 'label': '', 'description': '', 'icon': '', 'status': 'default',
        'statusLabel': '', 'variant': 'card', 'pulse': true, 'disabled': false, 'x': 0, 'y': 0
    };
    viewer = null;
    left = 0;
    top = 0;
    placed = false;
    spaceDown = false;
    /** --- 保留尺寸回调身份，卸载时准确移除 --- */
    access = { 'resize': null };
    localeData = {
        'en': { 'default': 'Unknown', 'online': 'Online', 'warning': 'Warning', 'offline': 'Offline' },
        'sc': { 'default': '未知', 'online': '在线', 'warning': '警告', 'offline': '离线' },
        'tc': { 'default': '未知', 'online': '線上', 'warning': '警告', 'offline': '離線' },
        'ja': { 'default': '不明', 'online': 'オンライン', 'warning': '警告', 'offline': 'オフライン' },
        'ko': { 'default': '알 수 없음', 'online': '온라인', 'warning': '경고', 'offline': '오프라인' },
        'th': { 'default': 'ไม่ทราบ', 'online': 'ออนไลน์', 'warning': 'คำเตือน', 'offline': 'ออฟไลน์' },
        'vi': { 'default': 'Chưa rõ', 'online': 'Trực tuyến', 'warning': 'Cảnh báo', 'offline': 'Ngoại tuyến' },
        'ar': { 'default': 'غير معروف', 'online': 'متصل', 'warning': 'تحذير', 'offline': 'غير متصل' },
        'id': { 'default': 'Tidak diketahui', 'online': 'Daring', 'warning': 'Peringatan', 'offline': 'Luring' },
        'es': { 'default': 'Desconocido', 'online': 'En línea', 'warning': 'Advertencia', 'offline': 'Desconectado' },
        'de': { 'default': 'Unbekannt', 'online': 'Online', 'warning': 'Warnung', 'offline': 'Offline' },
        'fr': { 'default': 'Inconnu', 'online': 'En ligne', 'warning': 'Avertissement', 'offline': 'Hors ligne' },
        'pt': { 'default': 'Desconhecido', 'online': 'Online', 'warning': 'Aviso', 'offline': 'Offline' },
        'ru': { 'default': 'Неизвестно', 'online': 'В сети', 'warning': 'Предупреждение', 'offline': 'Не в сети' },
        'it': { 'default': 'Sconosciuto', 'online': 'Online', 'warning': 'Avviso', 'offline': 'Offline' },
        'tr': { 'default': 'Bilinmiyor', 'online': 'Çevrimiçi', 'warning': 'Uyarı', 'offline': 'Çevrimdışı' }
    };
    /** --- 状态映射到框架语义色 --- */
    get statusType() {
        if (this.props.status === 'online') {
            return 'primary';
        }
        if (this.props.status === 'warning') {
            return 'warning';
        }
        return 'default';
    }
    /** --- 节点与整个空间的禁用状态 --- */
    get isDisabled() {
        return this.propBoolean('disabled') || (this.viewer?.propBoolean('disabled') ?? false);
    }
    /** --- 选择状态由容器统一维护 --- */
    get isSelected() {
        return this.viewer?.selected === this.props.nodeId.trim();
    }
    /** --- 自动窄视图优先展示名称和状态，说明仍可由选中 ID 查询 --- */
    get compact() {
        return this.viewer?.compact ?? false;
    }
    /**
     * --- 节点单击用于选择，不从卡片启动平移手势 ---
     * @param event 指针事件
     * @returns 焦点及弹层处理完成
     */
    down(event) {
        event.stopPropagation();
        clickgo.form.doFocusAndPopEvent(event).catch(() => { });
    }
    /**
     * --- 激活节点，插槽内独立交互控件自行处理 ---
     * @param event 鼠标或键盘事件
     * @returns 选择处理完成
     */
    activate(event) {
        if (this.isDisabled) {
            return;
        }
        const target = event.target;
        const interactive = target.closest('button, input, select, textarea, a, [role="button"], [role="checkbox"], [role="combobox"], [contenteditable="true"], [data-cg-control="button"], [data-cg-control="check"], [data-cg-control="select"], [data-cg-control="switch"]');
        if (interactive && interactive !== this.element) {
            return;
        }
        this.viewer?.select(this);
    }
    /**
     * --- 回车立即选择，空格按下等待释放 ---
     * @param event 键盘事件
     * @returns 按键处理完成
     */
    keydown(event) {
        if (event.target !== this.element || !['Enter', ' '].includes(event.key)) {
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        if (event.repeat || event.isComposing || this.isDisabled) {
            return;
        }
        if (event.key === 'Enter') {
            this.activate(event);
        }
        else {
            this.spaceDown = true;
        }
    }
    /**
     * --- 空格释放时选择，失焦或禁用时不会提交 ---
     * @param event 键盘事件
     * @returns 按键处理完成
     */
    keyup(event) {
        if (event.key === ' ' && this.spaceDown) {
            event.preventDefault();
            this.spaceDown = false;
            this.activate(event);
        }
    }
    /** --- 注册节点及尺寸监听，位置变动无需重复测量屏幕坐标 --- */
    onMounted() {
        this.viewer = this.parentByName('objviewer');
        this.access.resize = () => { this.viewer?.schedule(); };
        this.viewer?.register(this);
        clickgo.dom.watchSizeMulti(this, this.element, this.access.resize);
        if (this.refs.body) {
            clickgo.dom.watchSizeMulti(this, this.refs.body, this.access.resize);
        }
        this.watch(() => [this.props.nodeId, this.props.x, this.props.y, this.props.variant], () => {
            this.viewer?.schedule();
        });
        this.watch(() => this.isDisabled, () => { this.spaceDown = false; });
    }
    /** --- 解除自身监听与父级引用 --- */
    onBeforeUnmount() {
        if (this.access.resize) {
            clickgo.dom.unwatchSizeMulti(this, this.element, this.access.resize);
            if (this.refs.body) {
                clickgo.dom.unwatchSizeMulti(this, this.refs.body, this.access.resize);
            }
        }
        this.viewer?.unregister(this);
        this.viewer = null;
        this.access.resize = null;
    }
}

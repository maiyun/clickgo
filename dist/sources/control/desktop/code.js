import * as clickgo from 'clickgo';
import { copyPositions, getDragPositions, resolveLayout, samePositions, sameValues } from './lib/layout';
export default class extends clickgo.control.AbstractControl {
    emits = {
        'update:modelValue': null,
        'update:positions': null,
        'select': null,
        'open': null,
        'layout': null,
        'overflow': null,
        'drop': null
    };
    props = {
        'data': [], 'modelValue': [], 'positions': {},
        'disabled': false, 'plain': false, 'keepActive': false, 'multi': true, 'ctrl': true, 'selection': true,
        'draggable': true, 'autoArrange': false, 'snap': true, 'direction': 'column',
        'size': 48, 'cellWidth': 96, 'cellHeight': 96, 'gap': 8, 'padding': 8
    };
    /** --- 测量后的可用尺寸 --- */
    width = 0;
    height = 0;
    /** --- 当前选择和布局；不直接修改 props --- */
    valueData = [];
    positionsData = {};
    visible = [];
    overflowData = [];
    more = null;
    /** --- 当前键盘锚点、范围选择锚点和菜单目标 --- */
    active = '';
    anchor = '';
    contextId = '';
    contextPosition = { 'x': 0, 'y': 0 };
    uid = '';
    dragging = false;
    /** --- 仅用于显示落点预览，不回写位置或触发布局事件 --- */
    dropPositions = {};
    selectionArea = null;
    /** --- 每个实例自己的会话、监听函数和点击记录 --- */
    access = { 'positions': {}, 'stop': null, 'resize': null, 'alive': false, 'click': null };
    /** --- 唯一且非空的图标 ID；重复 ID 只保留第一项 --- */
    get items() {
        const ids = new Set();
        return this.props.data.filter(item => {
            if (!item || (typeof item.id !== 'string') || !item.id || ids.has(item.id)) {
                return false;
            }
            ids.add(item.id);
            return true;
        });
    }
    /** --- ID 到数据的映射支持任意字符串 ID --- */
    get itemMap() {
        return Object.fromEntries(this.items.map(item => [item.id, item]));
    }
    /** --- 本轮使用的尺寸，非法数值恢复默认值 --- */
    get metrics() {
        const number = (name, fallback, min) => {
            const value = this.propNumber(name);
            return Number.isFinite(value) ? Math.max(min, value) : fallback;
        };
        return {
            'width': this.width, 'height': this.height,
            'cellWidth': number('cellWidth', 96, 24), 'cellHeight': number('cellHeight', 96, 40),
            'gap': number('gap', 8, 0), 'padding': number('padding', 8, 0),
            'direction': this.props.direction === 'row' ? 'row' : 'column',
            'snap': this.propBoolean('snap'), 'arrange': this.propBoolean('autoArrange'),
            'rtl': this.localeDirection === 'rtl'
        };
    }
    /** --- 图像限制在单个格子的内容区域内 --- */
    get iconSize() {
        const value = this.propNumber('size');
        return Math.max(1, Math.min(Number.isFinite(value) ? Math.max(1, value) : 48, this.metrics.cellWidth - 10, this.metrics.cellHeight - 40));
    }
    /** --- 当前未放入区域的图标 --- */
    get overflowItems() {
        return this.overflowData.map(id => this.itemMap[id]);
    }
    /**
     * --- 图标位置和尺寸，用物理坐标维持持久化布局 ---
     * @param id 图标 ID；空字符串表示溢出入口
     * @param positions 显示位置，默认使用当前图标布局
     * @returns 内联几何样式
     */
    itemStyle(id, positions = this.positionsData) {
        const point = id ? positions[id] : this.more;
        return {
            'left': point ? `${point.x}px` : '0', 'top': point ? `${point.y}px` : '0',
            'width': `${this.metrics.cellWidth}px`, 'height': `${this.metrics.cellHeight}px`
        };
    }
    /** --- 只提供仍存在的右键菜单目标 --- */
    get contextItem() {
        return Object.hasOwn(this.itemMap, this.contextId) ? this.itemMap[this.contextId] : undefined;
    }
    /**
     * --- 按 ID 同步选择；只在用户完成选择时通知 select ---
     * @param values 候选 ID
     * @param notify 是否为用户操作
     * @returns 无返回值
     */
    setValue(values, notify = false) {
        const valid = new Set(this.items.map(item => item.id));
        const next = [...new Set(values)].filter(id => valid.has(id));
        if (!this.propBoolean('multi')) {
            next.splice(1);
        }
        const changed = !sameValues(next, this.valueData);
        this.valueData = next;
        if (!sameValues(next, this.props.modelValue)) {
            this.emit('update:modelValue', [...next]);
        }
        if (notify && changed) {
            const event = { 'detail': { 'value': [...next] } };
            this.emit('select', event);
        }
    }
    /**
     * --- 点击或键盘选择，Shift 按数据顺序扩展，Ctrl/Command 切换 ---
     * @param id 图标 ID
     * @param shift 范围选择
     * @param ctrl 增减选择
     * @returns 无返回值
     */
    select(id, shift = false, ctrl = false) {
        if (!this.visible.includes(id)) {
            return;
        }
        this.active = id;
        const multi = this.propBoolean('multi');
        if (multi && shift && this.visible.includes(this.anchor)) {
            const start = this.visible.indexOf(this.anchor);
            const end = this.visible.indexOf(id);
            this.setValue(this.visible.slice(Math.min(start, end), Math.max(start, end) + 1), true);
            return;
        }
        this.anchor = id;
        this.setValue(multi && ctrl ? (this.valueData.includes(id) ? this.valueData.filter(value => value !== id) :
            [...this.valueData, id]) : [id], true);
    }
    /**
     * --- 更新有限区域布局，保留未显示图标的位置 ---
     * @param reason 变更来源
     * @param priority 本次主动移动的图标
     * @returns 无返回值
     */
    reflow(reason, priority = []) {
        const ids = this.items.map(item => item.id);
        const valid = new Set(ids);
        const preferred = copyPositions(ids, this.access.positions);
        const result = this.width && this.height ? resolveLayout(ids, reason === 'drag' ? this.positionsData : preferred, {
            ...this.metrics, 'arrange': this.propBoolean('autoArrange') || (reason === 'arrange')
        }, priority) : {
            'positions': copyPositions(ids, this.positionsData),
            'visible': this.visible.filter(id => valid.has(id)),
            'overflow': this.overflowData.filter(id => valid.has(id)),
            'more': this.more
        };
        const changed = !samePositions(this.positionsData, result.positions) ||
            !sameValues(this.visible, result.visible);
        const overflowChanged = !sameValues(this.overflowData, result.overflow);
        const overlaps = (a, b) => (a.x < b.x + this.metrics.cellWidth + this.metrics.gap) &&
            (a.x + this.metrics.cellWidth + this.metrics.gap > b.x) &&
            (a.y < b.y + this.metrics.cellHeight + this.metrics.gap) &&
            (a.y + this.metrics.cellHeight + this.metrics.gap > b.y);
        if ((reason === 'arrange') || this.propBoolean('autoArrange')) {
            Object.assign(preferred, result.positions);
        }
        else {
            if (reason === 'drag') {
                for (const id of priority) {
                    if (Object.hasOwn(result.positions, id)) {
                        preferred[id] = { ...result.positions[id] };
                    }
                }
            }
            // --- 主动占用旧锚点时只更新让位项，不把其他临时压缩位置保存下来 ---
            const claimed = priority.flatMap(id => Object.hasOwn(preferred, id) ? [preferred[id]] : []);
            for (const id of ids) {
                if (!priority.includes(id) && Object.hasOwn(preferred, id) &&
                    claimed.some(point => overlaps(point, preferred[id]))) {
                    delete preferred[id];
                }
            }
            for (const id of result.visible) {
                if (!Object.hasOwn(preferred, id) &&
                    !Object.values(preferred).some(point => overlaps(point, result.positions[id]))) {
                    preferred[id] = { ...result.positions[id] };
                }
            }
        }
        const preferredChanged = !samePositions(this.access.positions, preferred);
        this.access.positions = preferred;
        this.positionsData = result.positions;
        this.visible = result.visible;
        this.overflowData = result.overflow;
        this.more = result.more;
        if (!this.visible.includes(this.active)) {
            this.active = this.visible.find(id => this.valueData.includes(id)) ?? this.visible[0] ?? '';
        }
        if (!samePositions(this.props.positions, preferred)) {
            this.emit('update:positions', copyPositions(ids, preferred));
        }
        if (overflowChanged) {
            const event = { 'detail': { 'value': [...result.overflow] } };
            this.emit('overflow', event);
        }
        if (changed || preferredChanged || overflowChanged || (reason === 'drag') || (reason === 'positions')) {
            const event = {
                'detail': {
                    'positions': copyPositions(ids, result.positions),
                    'preferredPositions': copyPositions(ids, preferred),
                    'overflow': [...result.overflow], 'reason': reason
                }
            };
            this.emit('layout', event);
        }
    }
    /**
     * --- 主动整理图标，双向绑定输出整理后的位置 ---
     * @returns 无返回值
     */
    arrange() {
        this.access.stop?.();
        this.reflow('arrange');
    }
    /**
     * --- 请求打开图标，包括溢出入口中的图标 ---
     * @param values 要打开的图标 ID
     * @returns 无返回值
     */
    open(values) {
        if (this.propBoolean('disabled')) {
            return;
        }
        const valid = new Set(this.items.map(item => item.id));
        const value = [...new Set(values)].filter(id => valid.has(id));
        if (value.length) {
            const event = { 'detail': { 'value': value } };
            this.emit('open', event);
        }
    }
    /**
     * --- 槽内的交互控件自行处理输入 ---
     * @param target 事件目标
     * @returns 是否来自交互子元素
     */
    isInteractive(target) {
        if (!(target instanceof Element)) {
            return false;
        }
        if (target.closest('[data-desktop-more]')) {
            return true;
        }
        const item = target.closest('input,textarea,select,button,a,[contenteditable="true"],[role="button"],[role="textbox"]');
        return !!item && (item !== this.element);
    }
    /**
     * --- 菜单通过框架挂载到所属 Form 的系统弹层 ---
     * @param event 指针、鼠标或键盘事件
     * @param id 图标 ID，空字符串表示空白区
     * @returns 菜单就绪后结束
     */
    async context(event, id = '') {
        if (!this.access.alive || this.propBoolean('disabled') || this.isInteractive(event.target)) {
            return;
        }
        this.access.stop?.();
        if (id && !this.valueData.includes(id)) {
            this.select(id);
        }
        this.contextId = id;
        if ('clientX' in event) {
            this.contextPosition = this.point(event);
        }
        const name = id ? 'itempop' : 'pop';
        await this.nextTick();
        if (!this.access.alive || (this.contextId !== id) || !this.refs[name]) {
            return;
        }
        const target = id ? [...this.element.querySelectorAll('[data-desktop-id]')]
            .find(item => item.dataset.desktopId === id) ?? this.element : this.element;
        clickgo.form.showPop(target, this.refs[name], 'clientX' in event ? { 'x': event.clientX, 'y': event.clientY } : 'v');
    }
    /**
     * --- 只关闭本实例的菜单，包括默认溢出菜单 ---
     * @returns 是否关闭了已打开的菜单
     */
    hideMenus() {
        let hidden = false;
        for (const pop of [this.refs.pop, this.refs.itempop, this.refs.moreButton?.refs?.pop]) {
            if (!pop?.hasAttribute('data-cg-level')) {
                continue;
            }
            hidden = true;
            clickgo.form.hidePop(pop);
        }
        return hidden;
    }
    /**
     * --- 菜单内部或其触发器按 Esc 时关闭菜单并恢复桌面焦点 ---
     * @param event 键盘事件
     * @returns 是否已处理
     */
    popKeydown(event) {
        if ((event.key !== 'Escape') || !this.hideMenus()) {
            return false;
        }
        event.preventDefault();
        event.stopPropagation();
        this.element.focus({ 'preventScroll': true });
        return true;
    }
    /**
     * --- 相对控件内边缘的物理坐标，兼容祖先缩放 ---
     * @param event 当前指针或鼠标
     * @returns 区域内坐标
     */
    point(event) {
        const rect = this.element.getBoundingClientRect();
        return {
            'x': (event.clientX - rect.left) * (this.element.offsetWidth / (rect.width || 1)) - this.element.clientLeft,
            'y': (event.clientY - rect.top) * (this.element.offsetHeight / (rect.height || 1)) - this.element.clientTop
        };
    }
    /**
     * --- 图标使用公共拖拽协议，本桌面空白落点提交位置，其他落点交给业务 ---
     * @param event 起始指针
     * @param id 图标 ID
     * @param selected 按下前是否已选中
     * @param toggle 点击是否切换选择
     * @returns 无返回值
     */
    dragItem(event, id, selected, toggle) {
        const start = this.point(event);
        const original = copyPositions(this.visible, this.positionsData);
        const moving = this.valueData.filter(value => this.visible.includes(value) && !this.itemMap[value].locked);
        let cancelMenu = () => { };
        const target = [...this.element.querySelectorAll('[data-desktop-id]')]
            .find(item => item.dataset.desktopId === id);
        if (!target) {
            return;
        }
        this.access.stop = clickgo.modules.pointer.drag(event, target, {
            'start': () => {
                cancelMenu();
                this.access.click = null;
                if (!this.propBoolean('draggable') || this.itemMap[id].locked || !moving.length) {
                    return false;
                }
                this.dragging = true;
                clickgo.modules.pointer.setDragData({
                    'rand': this.uid, 'type': 'fs',
                    'list': moving.map(value => ({
                        ...this.itemMap[value], 'index': this.items.findIndex(item => item.id === value),
                        'type': this.itemMap[value].type ?? 1, 'path': this.itemMap[value].path ?? ''
                    }))
                });
                // --- 同一拖动组中的文件夹不能成为自己的接收区；无需等待模板刷新 ---
                for (const item of this.element.querySelectorAll('[data-desktop-id]')) {
                    if (moving.includes(item.dataset.desktopId ?? '')) {
                        item.removeAttribute('data-drop');
                    }
                }
            },
            'move': (e) => {
                // --- data-hover 由 Pointer.js 命中检测维护，不另行穿透或搜索落点 ---
                if (this.propBoolean('autoArrange') || !this.element.hasAttribute('data-hover')) {
                    this.dropPositions = {};
                    return;
                }
                const positions = getDragPositions(moving, original, start, this.point(e), this.metrics);
                const result = resolveLayout(this.items.map(item => item.id), { ...this.positionsData, ...positions }, this.metrics, moving);
                this.dropPositions = copyPositions(moving.filter(value => result.visible.includes(value)), result.positions);
            },
            'finish': (e, detail) => {
                cancelMenu();
                this.dropPositions = {};
                this.access.stop = null;
                this.dragging = false;
                if (!detail.cancelled) {
                    if (detail.started && e && (detail.target === this.element) && !this.propBoolean('autoArrange')) {
                        // --- 原图标在整个拖动过程中保持原位，仅松手到本桌面空白区时计算并提交位置 ---
                        const positions = getDragPositions(moving, original, start, this.point(e), this.metrics);
                        this.positionsData = { ...this.positionsData, ...positions };
                        this.reflow('drag', moving);
                    }
                    else if (!detail.started) {
                        if (selected && !event.shiftKey) {
                            this.select(id, false, toggle);
                        }
                        const now = Date.now();
                        if ((this.access.click?.id === id) && (now - this.access.click.time < 300)) {
                            this.access.click = null;
                            this.open([id]);
                        }
                        else {
                            this.access.click = { 'id': id, 'time': now };
                        }
                    }
                }
                else {
                    this.access.click = null;
                }
            }
        });
        if (clickgo.modules.pointer.isTouch(event)) {
            cancelMenu = clickgo.modules.pointer.menu(event, () => this.context(event, id));
        }
    }
    /**
     * --- 接收通用 fs 数据；目录与外部空白落点由应用处理 ---
     * @param event 公共拖拽事件
     * @param id 目录 ID，空字符串为桌面空白
     * @returns 无返回值
     */
    drop(event, id = '') {
        const data = event.detail?.value;
        if (this.propBoolean('disabled') || !data || (typeof data !== 'object') ||
            !('type' in data) || (data.type !== 'fs') || !('list' in data) || !Array.isArray(data.list)) {
            return;
        }
        const self = ('rand' in data) && (data.rand === this.uid);
        if ((self && !id) || (id && (!Object.hasOwn(this.itemMap, id) || (this.itemMap[id].type !== 0)))) {
            return;
        }
        const from = [];
        for (const value of data.list) {
            if (!value || (typeof value !== 'object')) {
                continue;
            }
            const item = value;
            from.push({
                'id': typeof item.id === 'string' ? item.id : undefined,
                'index': typeof item.index === 'number' ? item.index : 0,
                'type': (item.type === 0) || (item.type === 1) ? item.type : -1,
                'path': typeof item.path === 'string' ? item.path : '',
                'name': typeof item.name === 'string' ? item.name : undefined,
                'icon': typeof item.icon === 'string' ? item.icon : undefined
            });
        }
        if (!from.length || (self && from.some(item => item.id === id))) {
            return;
        }
        const dropEvent = {
            'detail': {
                'event': event.detail.event, 'self': self, 'from': from, 'to': id ? this.itemMap[id] : null,
                'position': event.detail.event ? this.point(event.detail.event) : { ...this.contextPosition }
            }
        };
        this.emit('drop', dropEvent);
    }
    /**
     * --- 背景框选或图标拖动，取消和卸载均释放会话 ---
     * @param event 起始指针
     * @param id 图标 ID，空字符串表示背景
     * @returns 无返回值
     */
    down(event, id = '') {
        if (this.propBoolean('disabled') || this.isInteractive(event.target)) {
            return;
        }
        event.stopPropagation();
        clickgo.form.doFocusAndPopEvent(event).then(async () => {
            await this.nextTick();
            if (this.access.alive) {
                this.element.focus({ 'preventScroll': true });
            }
        }).catch(() => { });
        if (this.access.stop && !event.isPrimary) {
            this.access.stop();
            return;
        }
        if (event.button !== 0) {
            return;
        }
        this.access.stop?.();
        const ctrl = event.ctrlKey || event.metaKey;
        const toggle = ctrl || (this.propBoolean('multi') && !this.propBoolean('ctrl'));
        const selected = this.valueData.includes(id);
        if (id && (!selected || event.shiftKey)) {
            this.select(id, event.shiftKey, toggle);
        }
        if (id) {
            this.dragItem(event, id, selected, toggle);
            return;
        }
        const start = this.point(event);
        const before = [...this.valueData];
        let cancelMenu = () => { };
        const stop = clickgo.modules.pointer.down(event, {
            'threshold': 5,
            'single': true,
            'escape': true,
            'start': () => {
                cancelMenu();
                this.access.click = null;
            },
            'move': (e) => {
                const current = this.point(e);
                if (this.propBoolean('selection')) {
                    const x = Math.min(this.width, Math.max(0, current.x));
                    const y = Math.min(this.height, Math.max(0, current.y));
                    this.selectionArea = {
                        'x': Math.min(start.x, x), 'y': Math.min(start.y, y),
                        'width': Math.abs(start.x - x), 'height': Math.abs(start.y - y)
                    };
                    const area = this.selectionArea;
                    const hits = this.visible.filter(value => {
                        const point = this.positionsData[value];
                        return (point.x < area.x + area.width) &&
                            (point.x + this.metrics.cellWidth > area.x) &&
                            (point.y < area.y + area.height) && (point.y + this.metrics.cellHeight > area.y);
                    });
                    this.valueData = ctrl ? [
                        ...before.filter(value => !hits.includes(value)),
                        ...hits.filter(value => !before.includes(value))
                    ] : event.shiftKey ? [...new Set([...before, ...hits])] : hits;
                    if (!this.propBoolean('multi')) {
                        this.valueData.splice(1);
                    }
                }
            },
            'finish': (_e, detail) => {
                cancelMenu();
                this.access.stop = null;
                if (!detail.cancelled) {
                    if (this.selectionArea) {
                        const values = this.valueData;
                        this.valueData = before;
                        this.setValue(values, true);
                    }
                    else if (!detail.started) {
                        if (!ctrl && !event.shiftKey) {
                            this.setValue([], true);
                            this.access.click = null;
                        }
                    }
                }
                else {
                    this.valueData = before;
                    this.access.click = null;
                }
                this.selectionArea = null;
            }
        });
        this.access.stop = stop;
        // --- 长按与框选一同取消，计时与菜单监听由 Pointer.js 管理 ---
        if (clickgo.modules.pointer.isTouch(event)) {
            cancelMenu = clickgo.modules.pointer.menu(event, () => this.context(event, id));
        }
    }
    /**
     * --- 键盘按实际位置导航，支持选中、打开和上下文菜单 ---
     * @param event 键盘事件
     * @returns 无返回值
     */
    keydown(event) {
        if (this.propBoolean('disabled') || event.altKey || this.popKeydown(event) || (event.target !== this.element)) {
            return;
        }
        const ctrl = event.ctrlKey || event.metaKey;
        if ((event.key.toLowerCase() === 'a') && ctrl && this.propBoolean('multi')) {
            this.setValue([...this.visible], true);
        }
        else if (event.key === 'Enter') {
            this.open(this.valueData.filter(id => this.visible.includes(id)));
        }
        else if ((event.key === 'ContextMenu') || ((event.key === 'F10') && event.shiftKey)) {
            this.context(event, this.active).catch(() => { });
        }
        else if (event.key === 'Escape') {
            this.access.stop?.();
            this.setValue([], true);
        }
        else if ((event.key === ' ') && this.active) {
            this.select(this.active, event.shiftKey, ctrl);
        }
        else if (['Home', 'End', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
            let id = event.key === 'End' ? this.visible.at(-1) : this.visible[0];
            if (event.key.startsWith('Arrow') && this.active && this.positionsData[this.active]) {
                const point = this.positionsData[this.active];
                let distance = Infinity;
                id = this.active;
                for (const value of this.visible) {
                    const next = this.positionsData[value];
                    const dx = next.x - point.x;
                    const dy = next.y - point.y;
                    const horizontal = (event.key === 'ArrowLeft') || (event.key === 'ArrowRight');
                    const forward = event.key === 'ArrowLeft' ? -dx : event.key === 'ArrowRight' ? dx :
                        event.key === 'ArrowUp' ? -dy : dy;
                    if (forward <= 0) {
                        continue;
                    }
                    const score = forward + Math.abs(horizontal ? dy : dx) * 4;
                    if (score < distance) {
                        id = value;
                        distance = score;
                    }
                }
            }
            if (id) {
                if (ctrl && !event.shiftKey) {
                    this.active = id;
                }
                else {
                    this.select(id, event.shiftKey);
                }
            }
        }
        else {
            return;
        }
        event.preventDefault();
        event.stopPropagation();
    }
    /**
     * --- 挂载独立尺寸监听与 props 同步，不跨 Form 共享状态 ---
     * @returns 无返回值
     */
    onMounted() {
        this.access.alive = true;
        this.uid = clickgo.tool.random(12);
        this.access.positions = copyPositions(this.items.map(item => item.id), this.props.positions);
        this.positionsData = copyPositions(this.items.map(item => item.id), this.access.positions);
        this.setValue(this.props.modelValue);
        this.access.resize = () => {
            const width = this.element.clientWidth;
            const height = this.element.clientHeight;
            // --- 隐藏的 Form 没有可用尺寸，不能因此改写用户保存的位置 ---
            if (!width || !height) {
                this.access.stop?.();
                this.width = 0;
                this.height = 0;
                return;
            }
            if ((width !== this.width) || (height !== this.height)) {
                this.access.stop?.();
                this.width = width;
                this.height = height;
                this.reflow('resize');
            }
        };
        clickgo.dom.watchSizeMulti(this, this.element, this.access.resize, true);
        this.watch('positions', () => {
            const next = copyPositions(this.items.map(item => item.id), this.props.positions);
            if (samePositions(next, this.access.positions)) {
                return;
            }
            this.access.stop?.();
            const priority = Object.keys(next).filter(id => !Object.hasOwn(this.access.positions, id) ||
                (next[id].x !== this.access.positions[id].x) || (next[id].y !== this.access.positions[id].y));
            this.access.positions = next;
            this.reflow('positions', priority);
        }, { 'deep': true });
        this.watch('modelValue', () => {
            if (sameValues(this.props.modelValue, this.valueData)) {
                return;
            }
            this.access.stop?.();
            this.setValue(this.props.modelValue);
        }, { 'deep': true });
        this.watch('data', () => {
            this.access.stop?.();
            this.hideMenus();
            this.setValue(this.valueData);
            this.reflow('data');
        }, { 'deep': true });
        for (const name of ['cellWidth', 'cellHeight', 'gap', 'padding', 'direction', 'snap', 'autoArrange']) {
            this.watch(name, () => {
                this.access.stop?.();
                this.reflow('options');
            });
        }
        this.watch('localeDirection', () => {
            this.access.stop?.();
            this.reflow('options');
        });
        this.watch('multi', () => {
            this.access.stop?.();
            this.setValue(this.valueData);
        });
        for (const name of ['disabled', 'draggable', 'selection']) {
            this.watch(name, () => {
                this.access.stop?.();
                this.hideMenus();
            });
        }
    }
    /**
     * --- 释放指针会话和自身订阅 ---
     * @returns 无返回值
     */
    onBeforeUnmount() {
        this.access.alive = false;
        this.access.stop?.();
        this.hideMenus();
        if (this.access.resize) {
            clickgo.dom.unwatchSizeMulti(this, this.element, this.access.resize);
        }
        this.access.resize = null;
        this.access.click = null;
    }
}

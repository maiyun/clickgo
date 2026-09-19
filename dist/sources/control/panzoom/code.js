import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    emits = {
        'update:modelValue': null,
        'update:x': null,
        'update:y': null,
        'change': null,
        'editstart': null,
        'editmove': null,
        'editend': null,
        'editcancel': null
    };
    props = {
        'contentWidth': 0,
        'contentHeight': 0,
        'modelValue': 1,
        'x': 0,
        'y': 0,
        'zoomMin': 0.05,
        'zoomMax': 20,
        'autoFit': true,
        'disabled': false,
        'mode': 'pan'
    };
    zoomData = 1;
    xData = 0;
    yData = 0;
    width = 0;
    height = 0;
    /** --- 会话资源不进入 Vue 响应式数据；每个控件实例单独持有 --- */
    access = {
        'stop': null, 'editing': false, 'multi': false, 'fitted': false, 'last': null
    };
    get contentWidthComp() {
        const value = this.propNumber('contentWidth');
        return Number.isFinite(value) ? Math.max(0, value) : 0;
    }
    get contentHeightComp() {
        const value = this.propNumber('contentHeight');
        return Number.isFinite(value) ? Math.max(0, value) : 0;
    }
    /**
     * --- 约束缩放比例，禁止零、负数或非有限值 ---
     * @param value 候选比例
     * @returns 有效比例
     */
    clamp(value) {
        const minProp = this.propNumber('zoomMin');
        const min = Number.isFinite(minProp) && (minProp > 0) ? minProp : 0.05;
        const maxProp = this.propNumber('zoomMax');
        const max = Number.isFinite(maxProp) && (maxProp > 0) ? Math.max(min, maxProp) : Math.max(min, 20);
        return Math.min(max, Math.max(min, Number.isFinite(value) ? value : 1));
    }
    /**
     * --- 原子更新视图并同步双向绑定 ---
     * @param zoom 缩放比例
     * @param x 水平偏移，视口像素
     * @param y 垂直偏移，视口像素
     */
    setView(zoom, x, y) {
        const next = { 'zoom': this.clamp(zoom), 'x': Number.isFinite(x) ? x : 0, 'y': Number.isFinite(y) ? y : 0 };
        const changed = (next.zoom !== this.zoomData) || (next.x !== this.xData) || (next.y !== this.yData);
        this.zoomData = next.zoom;
        this.xData = next.x;
        this.yData = next.y;
        if (this.propNumber('modelValue') !== next.zoom) {
            this.emit('update:modelValue', next.zoom);
        }
        if (this.propNumber('x') !== next.x) {
            this.emit('update:x', next.x);
        }
        if (this.propNumber('y') !== next.y) {
            this.emit('update:y', next.y);
        }
        if (changed) {
            this.emit('change', next);
        }
    }
    /**
     * --- 围绕视口中的指定点缩放，默认使用视口中心 ---
     * @param zoom 绝对比例，1 表示 1:1
     * @param x 视口内水平坐标
     * @param y 视口内垂直坐标
     */
    zoomTo(zoom, x = this.width / 2, y = this.height / 2) {
        this.access.stop?.();
        this.access.fitted = false;
        const next = this.clamp(zoom);
        const factor = next / this.zoomData;
        this.setView(next, x - (x - this.xData) * factor, y - (y - this.yData) * factor);
    }
    /** --- 完整显示内容并居中；后续视口调整继续适应 --- */
    zoomFit() {
        this.access.stop?.();
        this.access.fitted = true;
        if (!this.contentWidthComp || !this.contentHeightComp || !this.width || !this.height) {
            return;
        }
        const zoom = this.clamp(Math.min(this.width / this.contentWidthComp, this.height / this.contentHeightComp));
        this.setView(zoom, (this.width - this.contentWidthComp * zoom) / 2, (this.height - this.contentHeightComp * zoom) / 2);
    }
    /** --- 以原始尺寸居中显示 --- */
    zoomActual() {
        this.access.stop?.();
        this.access.fitted = false;
        const zoom = this.clamp(1);
        this.setView(zoom, (this.width - this.contentWidthComp * zoom) / 2, (this.height - this.contentHeightComp * zoom) / 2);
    }
    /**
     * --- 将浏览器坐标转换为内容坐标 ---
     * @param clientX 浏览器水平坐标
     * @param clientY 浏览器垂直坐标
     * @returns 内容坐标及是否位于内容内
     */
    toLocal(clientX, clientY) {
        const rect = this.element.getBoundingClientRect();
        const x = (clientX - rect.left - this.element.clientLeft - this.xData) / this.zoomData;
        const y = (clientY - rect.top - this.element.clientTop - this.yData) / this.zoomData;
        return { 'x': x, 'y': y, 'inside': (x >= 0) && (y >= 0) && (x < this.contentWidthComp) && (y < this.contentHeightComp) };
    }
    /**
     * --- 取消尚未提交的编辑，通知调用方回滚 ---
     * @param event 导致取消的事件
     */
    cancelEdit(event) {
        if (!this.access.editing) {
            return;
        }
        this.access.editing = false;
        this.emit('editcancel', { ...this.access.last, 'event': event });
    }
    /**
     * --- Pointer 统一处理拖拽、双指和滚轮；第二指立即取消单指编辑 ---
     * @param event 起始指针或滚轮事件
     */
    gesture(event) {
        if (this.propBoolean('disabled') || ((event.type === 'pointerdown') && (event.button !== 0))) {
            return;
        }
        event.stopPropagation();
        if (event.type === 'pointerdown') {
            // --- 等浏览器切换到指针输入状态后再聚焦，避免空格按下后误显示键盘焦点框 ---
            window.setTimeout(() => {
                if (this.element.isConnected && !this.propBoolean('disabled')) {
                    this.element.focus({ 'preventScroll': true });
                }
            });
        }
        else {
            this.cancelEdit(event);
            // --- 滚轮打断编辑后，本次按下不会继续编辑 ---
            this.access.multi = true;
        }
        const stop = clickgo.modules.pointer.scale(event, (e, factor, _cpos, detail) => {
            if (this.access.editing && (detail.mode === 'pan')) {
                this.access.last = { ...this.toLocal(e.clientX, e.clientY), 'event': e };
                this.emit('editmove', this.access.last);
                return;
            }
            if ((this.props.mode === 'edit') && !this.access.multi && (detail.mode === 'pan')) {
                return;
            }
            this.access.fitted = false;
            const rect = this.element.getBoundingClientRect();
            const left = rect.left + this.element.clientLeft;
            const top = rect.top + this.element.clientTop;
            const zoom = this.clamp(this.zoomData * factor);
            const applied = zoom / this.zoomData;
            this.setView(zoom, detail.center.x - left - (detail.previousCenter.x - left - this.xData) * applied, detail.center.y - top - (detail.previousCenter.y - top - this.yData) * applied);
        }, {
            'target': this.element,
            'onPointers': (e, count) => {
                if (count > 1) {
                    this.access.multi = true;
                    this.cancelEdit(e);
                }
                else if ((count === 1) && (e.type === 'pointerdown') && !this.access.multi && (this.props.mode === 'edit')) {
                    const point = this.toLocal(e.clientX, e.clientY);
                    if (point.inside) {
                        this.access.editing = true;
                        this.access.last = { ...point, 'event': e };
                        this.emit('editstart', this.access.last);
                    }
                }
            },
            'onEnd': (e, reason) => {
                this.access.stop = null;
                if ((reason === 'up') && this.access.editing) {
                    this.access.editing = false;
                    const pointer = e;
                    this.emit('editend', { ...this.toLocal(pointer.clientX, pointer.clientY), 'event': e });
                }
                else {
                    this.cancelEdit(e);
                }
                this.access.last = null;
                this.access.multi = false;
            }
        });
        if (event.type === 'pointerdown') {
            this.access.stop = stop;
        }
        else if (!this.access.stop) {
            this.access.multi = false;
        }
    }
    /**
     * --- 控件聚焦时的视图快捷键，不拦截插槽子控件 ---
     * @param event 键盘事件
     */
    keydown(event) {
        if (this.propBoolean('disabled') || (event.target !== this.element) || event.ctrlKey || event.metaKey || event.altKey) {
            return;
        }
        switch (event.key) {
            case '+':
            case '=':
                this.zoomTo(this.zoomData * 1.2);
                break;
            case '-':
                this.zoomTo(this.zoomData / 1.2);
                break;
            case '0':
                this.zoomFit();
                break;
            case '1':
                this.zoomActual();
                break;
            default: return;
        }
        event.preventDefault();
        event.stopPropagation();
    }
    onMounted() {
        this.setView(this.propNumber('modelValue'), this.propNumber('x'), this.propNumber('y'));
        this.access.fitted = this.propBoolean('autoFit');
        clickgo.dom.watchSize(this, this.element, () => {
            const oldWidth = this.width;
            const oldHeight = this.height;
            const width = this.element.clientWidth;
            const height = this.element.clientHeight;
            if (!width || !height) {
                return;
            }
            this.width = width;
            this.height = height;
            if (this.access.fitted) {
                this.zoomFit();
            }
            else if (oldWidth && oldHeight) {
                this.access.stop?.();
                this.setView(this.zoomData, this.xData + (this.width - oldWidth) / 2, this.yData + (this.height - oldHeight) / 2);
            }
        }, true);
        // --- 同一轮同时恢复 zoom/x/y 时合并处理，防止中间 emit 覆盖其他新值 ---
        this.watch(() => [this.props.modelValue, this.props.x, this.props.y], (next, old) => {
            const zoom = this.clamp(this.propNumber('modelValue'));
            const zoomChanged = (next[0] !== old[0]) && (this.propNumber('modelValue') !== this.zoomData);
            const xChanged = (next[1] !== old[1]) && (this.propNumber('x') !== this.xData);
            const yChanged = (next[2] !== old[2]) && (this.propNumber('y') !== this.yData);
            if (!zoomChanged && !xChanged && !yChanged) {
                return;
            }
            this.access.stop?.();
            this.access.fitted = false;
            const applied = zoomChanged ? zoom / this.zoomData : 1;
            this.setView(zoomChanged ? zoom : this.zoomData, xChanged ? this.propNumber('x') : this.width / 2 - (this.width / 2 - this.xData) * applied, yChanged ? this.propNumber('y') : this.height / 2 - (this.height / 2 - this.yData) * applied);
        });
        for (const name of ['contentWidth', 'contentHeight', 'autoFit']) {
            this.watch(name, () => {
                if (this.propBoolean('autoFit')) {
                    this.zoomFit();
                }
                else {
                    this.access.fitted = false;
                }
            });
        }
        for (const name of ['zoomMin', 'zoomMax']) {
            this.watch(name, () => {
                if (this.access.fitted) {
                    this.zoomFit();
                }
                else {
                    this.zoomTo(this.zoomData);
                }
            });
        }
        for (const name of ['disabled', 'mode']) {
            this.watch(name, () => { this.access.stop?.(); });
        }
    }
    onBeforeUnmount() {
        this.access.stop?.();
        clickgo.dom.unwatchSize(this.element);
    }
}

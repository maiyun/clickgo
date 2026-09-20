import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    props = {
        'direction': 'h',
        'bg': 'dot',
        'gutter': '',
        'alignH': undefined,
        'alignV': undefined,
    };
    scaleS = 1;
    scaleX = 0;
    scaleY = 0;
    /** --- 当前有的线段 --- */
    lines = [];
    /** --- 不参与响应式处理的连线端点监听状态 --- */
    access = {
        'resizeElements': new Map(),
        'resizeHandler': null
    };
    /**
     * --- 增加连线端点的尺寸监听引用 ---
     * @param el 连线端点
     */
    _bindResize(el) {
        const count = this.access.resizeElements.get(el) ?? 0;
        if (count) {
            this.access.resizeElements.set(el, count + 1);
            return;
        }
        if (!this.access.resizeHandler || !clickgo.dom.watchSizeMulti(this, el, this.access.resizeHandler)) {
            return;
        }
        this.access.resizeElements.set(el, 1);
    }
    /**
     * --- 减少连线端点的尺寸监听引用 ---
     * @param el 连线端点
     */
    _unbindResize(el) {
        const count = this.access.resizeElements.get(el);
        if (!count) {
            return;
        }
        if (count > 1) {
            this.access.resizeElements.set(el, count - 1);
            return;
        }
        if (this.access.resizeHandler) {
            clickgo.dom.unwatchSizeMulti(this, el, this.access.resizeHandler);
        }
        this.access.resizeElements.delete(el);
    }
    // --- 供用户调用 ---
    /** --- 添加连接线 --- */
    addLine(line) {
        const rtn = this.lines.push(line) - 1;
        if (!(line.start.obj instanceof HTMLElement)) {
            line.start.obj = line.start.obj.element;
        }
        if (!(line.end.obj instanceof HTMLElement)) {
            line.end.obj = line.end.obj.element;
        }
        this._bindResize(line.start.obj);
        this._bindResize(line.end.obj);
        this.refreshLines();
        return rtn;
    }
    /** --- 删除连接线 --- */
    removeLine(index) {
        const line = this.lines[index];
        if (!line) {
            return;
        }
        this.lines.splice(index, 1);
        this._unbindResize(line.start.obj);
        this._unbindResize(line.end.obj);
        this.refreshLines();
    }
    /** --- 用 name 删除连接线 --- */
    removeLineByName(name) {
        const index = this.lines.findIndex(line => line.name === name);
        if (index === -1) {
            return false;
        }
        this.removeLine(index);
        return true;
    }
    /** --- 刷新连线 --- */
    refreshLines() {
        const scale = this.scaleS;
        for (const line of this.lines) {
            const startPos = clickgo.dom.getRectPoint(line.start.obj, this.refs.content, line.start.pos);
            const endPos = clickgo.dom.getRectPoint(line.end.obj, this.refs.content, line.end.pos);
            startPos.x /= scale;
            startPos.y /= scale;
            endPos.x /= scale;
            endPos.y /= scale;
            /*
            // --- 创建一条平滑的贝塞尔曲线 ---
            // --- 计算控制点，使线条有一个自然的弯曲 ---
            const dx = Math.abs(endPos.x - startPos.x) * 0.5;
            // --- 设置路径数据 ---
            line.path = `M ${startPos.x} ${startPos.y}
                             C ${startPos.x + dx} ${startPos.y},
                               ${endPos.x - dx} ${endPos.y},
                               ${endPos.x} ${endPos.y}`;
            */
            // --- 上面的版本有上下水平问题，新版可上下垂直引出引入 ---
            // --- 根据连接点位置确定控制点的偏移方向 ---
            // --- 对于顶部/底部连接点，控制点应该垂直偏移 ---
            // --- 对于左侧/右侧连接点，控制点应该水平偏移 ---
            const distance = Math.sqrt(Math.pow(endPos.x - startPos.x, 2) + Math.pow(endPos.y - startPos.y, 2));
            const offset = Math.min(distance * 0.5, 150); // 控制点偏移距离
            let startControlX = startPos.x;
            let startControlY = startPos.y;
            let endControlX = endPos.x;
            let endControlY = endPos.y;
            // --- 根据起点位置设置起点控制点 ---
            switch (line.start.pos) {
                case 'lt': {
                    startControlX = startPos.x - offset * 0.7;
                    startControlY = startPos.y - offset * 0.7;
                    break;
                }
                case 't': {
                    startControlY = startPos.y - offset;
                    break;
                }
                case 'tr': {
                    startControlX = startPos.x + offset * 0.7;
                    startControlY = startPos.y - offset * 0.7;
                    break;
                }
                case 'r': {
                    startControlX = startPos.x + offset;
                    break;
                }
                case 'rb': {
                    startControlX = startPos.x + offset * 0.7;
                    startControlY = startPos.y + offset * 0.7;
                    break;
                }
                case 'b': {
                    startControlY = startPos.y + offset;
                    break;
                }
                case 'bl': {
                    startControlX = startPos.x - offset * 0.7;
                    startControlY = startPos.y + offset * 0.7;
                    break;
                }
                case 'l': {
                    startControlX = startPos.x - offset;
                    break;
                }
            }
            // --- 根据终点位置设置终点控制点 ---
            switch (line.end.pos) {
                case 'lt': {
                    endControlX = endPos.x - offset * 0.7;
                    endControlY = endPos.y - offset * 0.7;
                    break;
                }
                case 't': {
                    endControlY = endPos.y - offset;
                    break;
                }
                case 'tr': {
                    endControlX = endPos.x + offset * 0.7;
                    endControlY = endPos.y - offset * 0.7;
                    break;
                }
                case 'r': {
                    endControlX = endPos.x + offset;
                    break;
                }
                case 'rb': {
                    endControlX = endPos.x + offset * 0.7;
                    endControlY = endPos.y + offset * 0.7;
                    break;
                }
                case 'b': {
                    endControlY = endPos.y + offset;
                    break;
                }
                case 'bl': {
                    endControlX = endPos.x - offset * 0.7;
                    endControlY = endPos.y + offset * 0.7;
                    break;
                }
                case 'l': {
                    endControlX = endPos.x - offset;
                    break;
                }
            }
            // 设置路径数据 - 使用三次贝塞尔曲线
            line.path = `M ${startPos.x} ${startPos.y} 
                             C ${startControlX} ${startControlY}, 
                               ${endControlX} ${endControlY}, 
                               ${endPos.x} ${endPos.y}`;
            line.stroke ??= 'solid';
            line.hue ??= '255';
        }
    }
    /** --- 重置缩放/定位 --- */
    refresh() {
        this.scaleS = 1;
        const elWidth = this.element.offsetWidth;
        const elHeight = this.element.offsetHeight;
        const contentWidth = this.refs.content.offsetWidth;
        const contentHeight = this.refs.content.offsetHeight;
        if (!elWidth || !elHeight) {
            return;
        }
        this.scaleX = (elWidth - contentWidth) / 2;
        this.scaleY = (elHeight - contentHeight) / 2;
    }
    // --- 供用户调用结束 ---
    /** --- 有些时候要刷新 --- */
    refreshLineTimer = 0;
    onCreated() {
        // --- 回调需要绑定当前控件实例 ---
        this.access.resizeHandler = () => {
            if (this.refreshLineTimer) {
                return;
            }
            this.refreshLineTimer = window.setTimeout(() => {
                this.refreshLines();
                this.refreshLineTimer = 0;
            }, 100);
        };
    }
    /** --- 绑定缩放事件 --- */
    scale(oe) {
        clickgo.modules.pointer.scale(oe, (e, scale, cpos) => {
            e.preventDefault();
            this.scaleX += cpos.x;
            this.scaleY += cpos.y;
            this.scaleS *= scale;
            if (this.scaleS > 5) {
                this.scaleS = 5;
            }
            else if (this.scaleS < 0.3) {
                this.scaleS = 0.3;
            }
        });
    }
    async onMounted() {
        await clickgo.tool.sleep(34);
        // --- 初次刷新 ---
        this.refresh();
        await clickgo.tool.sleep(300);
        // --- 有可能响应较慢，补刷新一次 ---
        this.refresh();
    }
    onUnmounted() {
        if (this.access.resizeHandler) {
            for (const el of this.access.resizeElements.keys()) {
                clickgo.dom.unwatchSizeMulti(this, el, this.access.resizeHandler);
            }
        }
        this.access.resizeElements.clear();
        this.access.resizeHandler = null;
        if (this.refreshLineTimer) {
            clearTimeout(this.refreshLineTimer);
            this.refreshLineTimer = 0;
        }
    }
}

import { CanvasSnapshotCommand, CommandHistory } from './history';
export default class {
    _canvas;
    _onHistoryChange;
    /** --- Canvas 2D 上下文 --- */
    _context;
    /** --- 工具注册表 --- */
    _tools = new Map();
    /** --- 撤销重做历史 --- */
    _history = new CommandHistory();
    /** --- 当前工具 --- */
    _activeTool = null;
    /** --- 当前是否正在绘制 --- */
    _drawing = false;
    /** --- 当前笔画绘制前快照 --- */
    _before = null;
    /** --- 已完成笔画数 --- */
    _stroke = 0;
    constructor(_canvas, _onHistoryChange) {
        this._canvas = _canvas;
        this._onHistoryChange = _onHistoryChange;
        const context = _canvas.getContext('2d');
        if (!context) {
            throw new Error('Canvas 2D context is not available.');
        }
        this._context = context;
        this._emitHistory();
    }
    /**
     * --- 注册绘图工具 ---
     * @param tools 工具列表
     */
    register(...tools) {
        for (const tool of tools) {
            this._tools.set(tool.id, tool);
        }
    }
    /**
     * --- 激活工具 ---
     * @param id 工具 ID
     */
    activate(id) {
        this._activeTool = this._tools.get(id) ?? null;
    }
    /**
     * --- 开始绘制 ---
     * @param event Pointer 事件
     */
    pointerDown(event) {
        if (!this._activeTool) {
            return;
        }
        this._drawing = true;
        this._before = this._snapshot();
        this._canvas.setPointerCapture(event.pointerId);
        this._activeTool.begin(this._context, this._point(event));
    }
    /**
     * --- 绘制移动 ---
     * @param event Pointer 事件
     */
    pointerMove(event) {
        if (!this._drawing || !this._activeTool) {
            return;
        }
        this._activeTool.move(this._context, this._point(event));
    }
    /**
     * --- 结束绘制 ---
     * @param event Pointer 事件
     */
    pointerUp(event) {
        if (!this._drawing || !this._activeTool || !this._before) {
            return;
        }
        this._activeTool.end(this._context);
        this._drawing = false;
        if (this._canvas.hasPointerCapture(event.pointerId)) {
            this._canvas.releasePointerCapture(event.pointerId);
        }
        this._history.push(new CanvasSnapshotCommand(this._context, this._before, this._snapshot()));
        this._before = null;
        ++this._stroke;
        this._emitHistory();
    }
    undo() {
        this._history.undo();
        this._emitHistory();
    }
    redo() {
        this._history.redo();
        this._emitHistory();
    }
    clear() {
        const before = this._snapshot();
        this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this._history.push(new CanvasSnapshotCommand(this._context, before, this._snapshot()));
        this._emitHistory();
    }
    dispose() {
        this._drawing = false;
        this._activeTool = null;
        this._before = null;
        this._tools.clear();
    }
    /** --- 当前 Canvas 快照 --- */
    _snapshot() {
        return this._context.getImageData(0, 0, this._canvas.width, this._canvas.height);
    }
    /**
     * --- 将 Pointer 坐标转换为 Canvas 坐标 ---
     * @param event Pointer 事件
     * @returns Canvas 坐标
     */
    _point(event) {
        const rect = this._canvas.getBoundingClientRect();
        return {
            'x': (event.clientX - rect.left) * this._canvas.width / rect.width,
            'y': (event.clientY - rect.top) * this._canvas.height / rect.height
        };
    }
    /** --- 通知界面历史状态变化 --- */
    _emitHistory() {
        this._onHistoryChange({
            'redo': this._history.redoCount,
            'stroke': this._stroke,
            'undo': this._history.undoCount
        });
    }
}

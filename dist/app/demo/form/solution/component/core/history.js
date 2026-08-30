export class CanvasSnapshotCommand {
    _context;
    _before;
    _after;
    constructor(_context, _before, _after) {
        this._context = _context;
        this._before = _before;
        this._after = _after;
    }
    undo() {
        this._context.putImageData(this._before, 0, 0);
    }
    redo() {
        this._context.putImageData(this._after, 0, 0);
    }
}
export class CommandHistory {
    /** --- 最大保留操作数 --- */
    _max = 20;
    /** --- 已执行命令 --- */
    _undoList = [];
    /** --- 已撤销命令 --- */
    _redoList = [];
    get undoCount() {
        return this._undoList.length;
    }
    get redoCount() {
        return this._redoList.length;
    }
    /**
     * --- 记录一个已经执行的命令 ---
     * @param command 命令
     */
    push(command) {
        this._undoList.push(command);
        if (this._undoList.length > this._max) {
            this._undoList.shift();
        }
        this._redoList.length = 0;
    }
    undo() {
        const command = this._undoList.pop();
        if (!command) {
            return;
        }
        command.undo();
        this._redoList.push(command);
    }
    redo() {
        const command = this._redoList.pop();
        if (!command) {
            return;
        }
        command.redo();
        this._undoList.push(command);
    }
}

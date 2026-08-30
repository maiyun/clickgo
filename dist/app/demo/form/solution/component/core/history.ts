export interface ICommand {
    redo(): void;
    undo(): void;
}

export class CanvasSnapshotCommand implements ICommand {

    public constructor(
        private readonly _context: CanvasRenderingContext2D,
        private readonly _before: ImageData,
        private readonly _after: ImageData
    ) {
    }

    public undo(): void {
        this._context.putImageData(this._before, 0, 0);
    }

    public redo(): void {
        this._context.putImageData(this._after, 0, 0);
    }

}

export class CommandHistory {

    /** --- 最大保留操作数 --- */
    private readonly _max = 20;

    /** --- 已执行命令 --- */
    private readonly _undoList: ICommand[] = [];

    /** --- 已撤销命令 --- */
    private readonly _redoList: ICommand[] = [];

    public get undoCount(): number {
        return this._undoList.length;
    }

    public get redoCount(): number {
        return this._redoList.length;
    }

    /**
     * --- 记录一个已经执行的命令 ---
     * @param command 命令
     */
    public push(command: ICommand): void {
        this._undoList.push(command);
        if (this._undoList.length > this._max) {
            this._undoList.shift();
        }
        this._redoList.length = 0;
    }

    public undo(): void {
        const command = this._undoList.pop();
        if (!command) {
            return;
        }
        command.undo();
        this._redoList.push(command);
    }

    public redo(): void {
        const command = this._redoList.pop();
        if (!command) {
            return;
        }
        command.redo();
        this._undoList.push(command);
    }

}

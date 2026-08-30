import * as clickgo from 'clickgo';

import brushOptionsCmp from './feature/brush/options/options';
import historyStateCmp from './feature/history/history';
import pencilOptionsCmp from './feature/pencil/options/options';
import BrushTool from './feature/brush/brush';
import PencilTool from './feature/pencil/pencil';
import Editor from './core/editor';
import type { IHistoryState, IToolOptions, TToolId } from './model';

export default class extends clickgo.form.AbstractForm {

    /** --- 当前 Form 内可用的局部应用组件 --- */
    public readonly components = {
        'brush-options': brushOptionsCmp,
        'history-state': historyStateCmp,
        'pencil-options': pencilOptionsCmp
    };

    /** --- 非响应式编辑器服务 --- */
    public access: {
        'editor': Editor | null;
    } = {
            'editor': null
        };

    public activeTool: TToolId = 'brush';

    public dockExpanded = true;

    public optionTab = 'brush';

    public historyTab = 'history';

    public historyCollapsed = false;

    public brush: IToolOptions = {
        'color': '#2563eb',
        'opacity': '.35',
        'size': '18'
    };

    public pencil: IToolOptions = {
        'color': '#111827',
        'opacity': '1',
        'size': '3'
    };

    public history: IHistoryState = {
        'redo': 0,
        'stroke': 0,
        'undo': 0
    };

    /**
     * --- 选择工具 ---
     * @param id 工具 ID
     */
    public selectTool(id: TToolId): void {
        this.activeTool = id;
        this.optionTab = id;
        this.access.editor?.activate(id);
    }

    public pointerDown(event: PointerEvent): void {
        this.access.editor?.pointerDown(event);
    }

    public pointerMove(event: PointerEvent): void {
        this.access.editor?.pointerMove(event);
    }

    public pointerUp(event: PointerEvent): void {
        this.access.editor?.pointerUp(event);
    }

    public undo(): void {
        this.access.editor?.undo();
    }

    public redo(): void {
        this.access.editor?.redo();
    }

    public clear(): void {
        this.access.editor?.clear();
    }

    public onMounted(): void {
        const canvas = this.element.querySelector('canvas');
        if (!canvas) {
            throw new Error('Canvas element was not found.');
        }
        const editor = new Editor(canvas, state => {
            this.history = state;
        });
        editor.register(
            new BrushTool(() => this.brush),
            new PencilTool(() => this.pencil)
        );
        this.access.editor = editor;
        this.selectTool(this.activeTool);
    }

    public onUnmounted(): void {
        this.access.editor?.dispose();
        this.access.editor = null;
    }

}

import * as clickgo from 'clickgo';
import brushOptionsCmp from './feature/brush/options/options';
import historyStateCmp from './feature/history/history';
import pencilOptionsCmp from './feature/pencil/options/options';
import BrushTool from './feature/brush/brush';
import PencilTool from './feature/pencil/pencil';
import Editor from './core/editor';
export default class extends clickgo.form.AbstractForm {
    /** --- 当前 Form 内可用的局部应用组件 --- */
    components = {
        'brush-options': brushOptionsCmp,
        'history-state': historyStateCmp,
        'pencil-options': pencilOptionsCmp
    };
    /** --- 非响应式编辑器服务 --- */
    access = {
        'editor': null
    };
    activeTool = 'brush';
    dockExpanded = true;
    optionTab = 'brush';
    historyTab = 'history';
    historyCollapsed = false;
    brush = {
        'color': '#2563eb',
        'opacity': '.35',
        'size': '18'
    };
    pencil = {
        'color': '#111827',
        'opacity': '1',
        'size': '3'
    };
    history = {
        'redo': 0,
        'stroke': 0,
        'undo': 0
    };
    /**
     * --- 选择工具 ---
     * @param id 工具 ID
     */
    selectTool(id) {
        this.activeTool = id;
        this.optionTab = id;
        this.access.editor?.activate(id);
    }
    pointerDown(event) {
        this.access.editor?.pointerDown(event);
    }
    pointerMove(event) {
        this.access.editor?.pointerMove(event);
    }
    pointerUp(event) {
        this.access.editor?.pointerUp(event);
    }
    undo() {
        this.access.editor?.undo();
    }
    redo() {
        this.access.editor?.redo();
    }
    clear() {
        this.access.editor?.clear();
    }
    onMounted() {
        const canvas = this.element.querySelector('canvas');
        if (!canvas) {
            throw new Error('Canvas element was not found.');
        }
        const editor = new Editor(canvas, state => {
            this.history = state;
        });
        editor.register(new BrushTool(() => this.brush), new PencilTool(() => this.pencil));
        this.access.editor = editor;
        this.selectTool(this.activeTool);
    }
    onUnmounted() {
        this.access.editor?.dispose();
        this.access.editor = null;
    }
}

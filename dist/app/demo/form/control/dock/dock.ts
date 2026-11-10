import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public cache = true;

    public collapsible = true;

    public expanded = true;

    public grow = true;

    public groupCollapsed = false;

    public historyTab = 'history';

    /** --- 长历史列表用于验证展开面板和收起浮层的滚动 --- */
    public historyActions = [
        'Save workspace',
        'Export preview',
        'Rename document',
        'Update metadata',
        'Create snapshot',
        'Restore selection',
        'Move guide',
        'Add guide',
        'Adjust grid',
        'Change units',
        'Zoom to selection',
        'Fit canvas',
        'Rotate view',
        'Update background',
        'Change palette',
        'Add color',
        'Remove mask',
        'Apply mask',
        'Adjust opacity',
        'Change blend mode',
        'Unlock layer',
        'Lock layer',
        'Show layer',
        'Hide layer',
        'Rename layer',
        'Move layer',
        'Duplicate layer',
        'Create layer',
        'Deselect objects',
        'Select objects',
        'Align objects',
        'Distribute objects',
        'Group objects',
        'Move object',
        'Rotate object',
        'Flip image',
        'Crop image',
        'Adjust color',
        'Resize image',
        'Import image'
    ];

    public lazy = true;

    public multiple = true;

    public projectExpanded = true;

    public mainExpanded = true;

    public showGrid = true;

    public showCodes = false;

    public optionTab = 'project';

    public position: Array<'left' | 'right'> = ['left'];

    public width = '240';

    public projectWidth = '200';

    public optionHeight = 0;

    public historyHeight = 0;

    public displayHeight = 0;

    public resizable = true;

    public menuSelection = '';

    /**
     * --- 同时设置各组高度，0 恢复自动布局 ---
     * @param height 分组总高度，单位为像素
     * @returns 无返回值
     */
    public setHeights(height: number): void {
        this.optionHeight = height;
        this.historyHeight = height;
        this.displayHeight = height;
    }

    /**
     * --- 显示菜单操作对应的选中项 ---
     * @param name 选中项名称
     * @returns 无返回值
     */
    public runMenu(name: string): void {
        this.menuSelection = name;
    }

}

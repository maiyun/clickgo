import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    cache = true;
    collapsible = true;
    expanded = true;
    grow = true;
    groupCollapsed = false;
    historyTab = 'history';
    /** --- 长历史列表用于验证展开面板和收起浮层的滚动 --- */
    historyActions = [
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
    lazy = true;
    multiple = true;
    projectExpanded = true;
    mainExpanded = true;
    showGrid = true;
    showCodes = false;
    optionTab = 'project';
    position = ['left'];
    width = '240';
    projectWidth = '200';
    optionHeight = 0;
    historyHeight = 0;
    displayHeight = 0;
    resizable = true;
    menuSelection = '';
    /**
     * --- 同时设置各组高度，0 恢复自动布局 ---
     * @param height 分组总高度，单位为像素
     * @returns 无返回值
     */
    setHeights(height) {
        this.optionHeight = height;
        this.historyHeight = height;
        this.displayHeight = height;
    }
    /**
     * --- 显示菜单操作对应的选中项 ---
     * @param name 选中项名称
     * @returns 无返回值
     */
    runMenu(name) {
        this.menuSelection = name;
    }
}

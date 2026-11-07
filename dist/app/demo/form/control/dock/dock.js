import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    cache = true;
    collapsible = true;
    expanded = true;
    grow = true;
    groupCollapsed = false;
    historyTab = 'history';
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

import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public cache = true;

    public collapsible = true;

    public expanded = true;

    public grow = true;

    public groupCollapsed = false;

    public historyTab = 'history';

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

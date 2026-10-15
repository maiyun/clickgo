import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    /** --- 模拟可由应用管理的导航路径 --- */
    public trail = [
        { 'name': 'workspace', 'label': 'Workspace' },
        { 'name': 'orders', 'label': 'Orders' },
        { 'name': 'details', 'label': 'Order details' },
    ];

    /** --- 整组禁用状态 --- */
    public disabled = false;

    /** --- 中间层级的禁用状态 --- */
    public disabledItem = false;

    /** --- 条件渲染最后一个层级 --- */
    public showDetails = true;

    /** --- 验证较窄窗体下的长内容换行 --- */
    public longLabel = false;

    /** --- 自定义分隔文本 --- */
    public separator = ['/'];

    /** --- 最近一次选择通知 --- */
    public lastSelection = 'No selection';

    /**
     * --- 展示控件的选择通知，不自动修改当前路径 ---
     * @param event 面包屑选择事件
     * @returns 通知已展示
     */
    public select(event: clickgo.control.IBreadcrumbSelectEvent): void {
        this.lastSelection = `${event.detail.name} (index ${event.detail.index})`;
    }

    /**
     * --- 重排路径以演示当前位置和索引的自动更新 ---
     * @returns 路径已重排
     */
    public reverse(): void {
        this.trail.reverse();
    }

}

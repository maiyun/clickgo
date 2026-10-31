import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    /** --- 独立预览占满视口，Demo 内仍使用普通窗体 --- */
    public fullscreen = false;

    /** --- 当前展开项，单项和多项模式使用相同绑定类型 --- */
    public expanded = ['account'];

    /** --- 嵌套分组独立管理展开状态 --- */
    public nested = ['email'];

    /** --- 允许同时展开多个面板 --- */
    public multiple = false;

    /** --- 禁用全部标题操作 --- */
    public disabled = false;

    /** --- 禁用第二个标题 --- */
    public disabledItem = false;

    /** --- 演示操作前取消展开 --- */
    public blockChanges = false;

    /** --- 条件渲染附加项 --- */
    public showExtra = true;

    /** --- 验证长标题自动换行 --- */
    public longLabel = false;

    /** --- 折叠时保留内容和输入状态 --- */
    public account = 'Ada';

    /** --- 最近一次用户操作通知 --- */
    public lastChange = 'No changes';

    /**
     * --- 演示在状态提交前取消操作 ---
     * @param event 待提交的展开状态
     * @returns 操作继续或被取消
     */
    public beforeChange(event: clickgo.control.IAccordionBeforeChangeEvent): void {
        if (this.blockChanges) {
            event.preventDefault();
            this.lastChange = 'Change prevented';
        }
    }

    /**
     * --- 展示用户操作提交后的展开集合 ---
     * @param event 已提交的展开状态
     * @returns 通知已展示
     */
    public changed(event: clickgo.control.IAccordionChangedEvent): void {
        this.lastChange = `${event.detail.name}: ${event.detail.expanded ? 'expanded' : 'collapsed'}`;
    }

    /**
     * --- 读取独立预览的窗体模式 ---
     * @param data 启动参数
     * @returns 窗体模式已设置
     */
    public onMounted(data: { 'fullscreen'?: boolean; }): void {
        this.fullscreen = data.fullscreen ?? false;
    }

}

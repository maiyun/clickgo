import { AbstractCommon } from './base';
/** --- Panel 控件抽象类 --- */
export class AbstractPanel extends AbstractCommon {
    /** --- 当前的 panel ID --- */
    get panelId() {
        // --- panel 创建时 createPanel 自动重写本函数 ---
        return '';
    }
    /** --- 当前 panel 所在窗体的窗体对象，系统会在创建时重写本函数 --- */
    get rootForm() {
        return {};
    }
    /** --- 当前 panel 所在的 panel control 对象，系统会在创建时重写本函数 --- */
    get rootPanel() {
        return {};
    }
    /** --- 获取母窗体的 formHash --- */
    get formHash() {
        return this.rootForm.formHash;
    }
    /** --- 设置母窗体的 formHash --- */
    set formHash(fh) {
        this.rootForm.formHash = fh;
    }
    /** --- 获取 form 的 formhash with data 值 --- */
    get formHashData() {
        return this.rootForm.formHashData;
    }
    set formHashData(v) {
        this.rootForm.formHashData = v;
    }
    /** --- 将母窗体的 form hash 回退 --- */
    async formHashBack() {
        await this.rootForm.formHashBack();
    }
    /** --- 发送一段数据到自己这个 panel 控件，本质上也是调用的 panel 控件的 send 方法，主要用来实现发送给跳转后的 panel --- */
    sendToRootPanel(data) {
        this.rootPanel.send(data);
    }
    /** --- 母窗体进入 form hash 为源的步进条 --- */
    async enterStep(list) {
        return this.rootForm.enterStep(list);
    }
    /** --- 目窗体完成当前步骤 --- */
    async doneStep() {
        await this.rootForm.doneStep();
    }
    /** --- 当前的 nav（若有）传递过来的 qs --- */
    qs = {};
    /** --- 确定不再使用 qs 时可调用此方法清空，这样再次通过相同 qs 进入本 panel 依然会响应 qschange 事件 --- */
    clearQs() {
        this.qs = {};
    }
    /** --- 当前窗体是否是焦点 --- */
    get formFocus() {
        return this.rootForm.formFocus ?? false;
    }
    onShow() {
        return;
    }
    /** --- panel 已经完全显示后所要执行的 --- */
    onShowed() {
        return;
    }
    onHide() {
        return;
    }
    onMounted() {
        return;
    }
    onReceive() {
        return;
    }
    /** --- qs 变动时调用，如果只是用来做 qs 数据处理，建议用此方法 --- */
    onQsChange() {
        return;
    }
    onQsChangeShow() {
        return;
    }
}

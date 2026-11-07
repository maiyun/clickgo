import * as lControl from '../control';
import type {
    IAbstractPanelShowEvent, IAbstractPanelQsChangeShowEvent,
} from './types';
import { AbstractCommon } from './base';
import { AbstractForm } from './abstract-form';

/** --- Panel 控件抽象类 --- */
export abstract class AbstractPanel extends AbstractCommon {

    /** --- 当前的 panel ID --- */
    public get panelId(): string {
        // --- panel 创建时 createPanel 自动重写本函数 ---
        return '';
    }

    /** --- 当前 panel 所在窗体的窗体对象，系统会在创建时重写本函数 --- */
    public get rootForm(): AbstractForm & Record<string, any> {
        return {} as any;
    }

    /** --- 当前 panel 所在的 panel control 对象，系统会在创建时重写本函数 --- */
    public get rootPanel(): lControl.AbstractControl & Record<string, any> {
        return {} as any;
    }

    /** --- 获取母窗体的 formHash --- */
    public get formHash(): string {
        return this.rootForm.formHash;
    }

    /** --- 设置母窗体的 formHash --- */
    public set formHash(fh: string) {
        this.rootForm.formHash = fh;
    }

    /** --- 获取 form 的 formhash with data 值 --- */
    public get formHashData(): Record<string, any> {
        return this.rootForm.formHashData;
    }

    public set formHashData(v: Record<string, any>) {
        this.rootForm.formHashData = v;
    }

    /** --- 将母窗体的 form hash 回退 --- */
    public async formHashBack(): Promise<void> {
        await this.rootForm.formHashBack();
    }

    /** --- 发送一段数据到自己这个 panel 控件，本质上也是调用的 panel 控件的 send 方法，主要用来实现发送给跳转后的 panel --- */
    public sendToRootPanel(data: Record<string, any>): void {
        this.rootPanel.send(data);
    }

    /** --- 母窗体进入 form hash 为源的步进条 --- */
    public async enterStep(list: Array<{
        /** --- 步骤 hash，第一个必须为当前 hash --- */
        'value': string;
        'label'?: string;
        'icon'?: string;
        'desc'?: string;
    }>): Promise<boolean> {
        return this.rootForm.enterStep(list);
    }

    /** --- 目窗体完成当前步骤 --- */
    public async doneStep(): Promise<void> {
        await this.rootForm.doneStep();
    }

    /** --- 当前的 nav（若有）传递过来的 qs --- */
    public qs: Record<string, string> = {};

    /** --- 确定不再使用 qs 时可调用此方法清空，这样再次通过相同 qs 进入本 panel 依然会响应 qschange 事件 --- */
    public clearQs(): void {
        this.qs = {};
    }

    /** --- 当前窗体是否是焦点 --- */
    public get formFocus(): boolean {
        return this.rootForm.formFocus ?? false;
    }

    public onShow(e: IAbstractPanelShowEvent): void | Promise<void>;
    public onShow(): void {
        return;
    }

    public onShowed(): void | Promise<void>;
    /** --- panel 已经完全显示后所要执行的 --- */
    public onShowed(): void {
        return;
    }

    public onHide(): void | Promise<void>;
    public onHide(): void {
        return;
    }

    public onMounted(): void | Promise<void>;
    public onMounted(): void {
        return;
    }

    /** --- 接收 send 传递过来的 data 数据（是 panel 控件的 send，不是 form 的 send） --- */
    public onReceive(data: Record<string, any>): void | Promise<void>;
    public onReceive(): void {
        return;
    }

    /** --- qs 变动时调用，如果只是用来做 qs 数据处理，建议用此方法 --- */
    public onQsChange(): void | Promise<void> {
        return;
    }

    /** --- 无论是 show 还是 qschange 都会触发，优先触发 show 或 qschange 事件本身，之后触发这个 --- */
    public onQsChangeShow(e: IAbstractPanelQsChangeShowEvent): void | Promise<void>;
    public onQsChangeShow(): void {
        return;
    }

}

import * as lCore from '../core';
import * as lCommand from '../command';
import * as lTask from '../task';
import * as lControl from '../control';
import type * as lNativeEvents from '../native/events';
import { AbstractCommon } from './base';
import { confirm } from './dialog';
import { info, nextZIndex, state } from './state';
import { hideForm } from './remove';
import { beginFocusRequest, changeFocus, close, shouldFocusOnShow } from './window';

/** --- 标记置顶层；调用方决定是否同时激活窗体 --- */
export function setTopMostLayer(root: lCore.IVue): void {
    root._topMost = true;
    if (root._bottomMost) {
        root._bottomMost = false;
        root.$el.removeAttribute('data-cg-bottom-most');
    }
}

/** --- 窗体的抽象类 --- */
export abstract class AbstractForm extends AbstractCommon {

    /**
     * --- Native 普通启动及再次启动事件；网页不触发，App/Form 要求 root ---
     * @param event 业务参数、原生工作目录、来源及请求 ID
     * @returns 无；各层级独立收到通知，同一业务动作由应用选择一处执行
     */
    public onNativeLaunch(event: lNativeEvents.INativeLaunchEvent): void | Promise<void>;
    public onNativeLaunch(): void {
        return;
    }

    /**
     * --- Native 文件打开全局事件，要求宿主启用 openFiles；App/Form 要求 root ---
     * @param paths 不含 /storage/ 的 ClickGo 绝对文件路径
     * @param info startup、second-instance、association 或 drop 来源及请求 ID
     * @returns 无；各层级独立通知，业务自行确认、保存和打开
     */
    public onNativeOpenFiles(paths: string[], info: lNativeEvents.INativeOpenFilesInfo): void | Promise<void>;
    public onNativeOpenFiles(): void {
        return;
    }

    // --- 以下为窗体有，但 control 没有 ---

    /** --- 当前是否完全创建完毕 --- */
    public isReady: boolean = false;

    /** --- 是否是 native 下无边框的第一个窗体 --- */
    public isNativeNoFrameFirst: boolean = false;

    /** --- 当前的窗体创建的位数 --- */
    public get findex(): number {
        // --- 窗体创建时继承时重写本函数 ---
        return 0;
    }

    /** --- 获取 form 的 hash 值，不是浏览器的 hash --- */
    public get formHash(): string {
        return '';
    }

    public set formHash(v: string) {
        // --- 会进行重写 ---
    }

    /** --- 获取 form 的 formhash with data 值 --- */
    public get formHashData(): Record<string, any> {
        return {};
    }

    public set formHashData(v: Record<string, any>) {
        // --- 会进行重写 ---
    }

    /** --- 是否是置顶 --- */
    public get topMost(): boolean {
        // --- 将在初始化时系统自动重写本函数 ---
        return false;
    }

    public set topMost(v: boolean) {
        // --- 会进行重写 ---
    }

    /** --- 是否是置底 --- */
    public get bottomMost(): boolean {
        // --- 将在初始化时系统自动重写本函数 ---
        return false;
    }

    public set bottomMost(v: boolean) {
        // --- 会进行重写 ---
    }

    /**
     * --- 是否在本窗体上显示遮罩层 ---
     */
    public get isMask(): boolean {
        if (!lTask.getOrigin(this.taskId)) {
            return false;
        }
        const runtime = lTask.getRuntime(state.sysId, this.taskId);
        if (!runtime) {
            return false;
        }
        // --- 正在异步创建 dialog 时，屏蔽所有窗体 ---
        if (runtime.dialogCreating) {
            return true;
        }
        return !runtime.dialogFormIds.length ||
        runtime.dialogFormIds[runtime.dialogFormIds.length - 1]
            === this.formId ? false : true;
    }

    /** --- 当前窗体是否是焦点 --- */
    public get formFocus(): boolean {
        // --- _formFocus 在初始化时由系统设置 ---
        return (this as any)._formFocus;
    }

    /** --- 当前窗体是否显示在任务栏 --- */
    public get showInSystemTask(): boolean {
        // --- 将在初始化时系统自动重写本函数 ---
        return false;
    }

    public set showInSystemTask(v: boolean) {
        // --- 会进行重写 ---
    }

    /** --- 将在 form 完全装载完后执行，如果已经装载完则立即执行 --- */
    public ready(cb: () => void | Promise<void>): void {
        // --- 会进行重写 ---
        cb() as any;
    }

    /** --- form hash 回退 --- */
    public async formHashBack(): Promise<void> {
        const v = this as any;
        if (Date.now() - v.$data._lastFormHashData > 300) {
            v.$data._formHashData = {};
        }
        if (!v.$data._historyHash.length) {
            if (v.$data._formHash) {
                if (this.inStep) {
                    if (!await confirm(this, {
                        'content': info.locale[this.locale]?.confirmExitStep ?? info.locale['en'].confirmExitStep
                    })) {
                        return;
                    }
                    this._inStep = false;
                    this.refs.form.stepHide();
                }
                v.$data._formHash = '';
                await lCore.trigger('formHashChange', this.taskId, this.formId, '', v.$data._formHashData);
                return;
            }
            return;
        }
        const parent = v.$data._historyHash[v.$data._historyHash.length - 1];
        if (this.inStep) {
            if (this._stepValues.includes(parent)) {
                this.refs.form.stepValue = parent;
            }
            else {
                if (!await confirm(this, {
                    'content': info.locale[this.locale]?.confirmExitStep ?? info.locale['en'].confirmExitStep
                })) {
                    return;
                }
                this._inStep = false;
                this.refs.form.stepHide();
            }
        }
        v.$data._formHash = parent;
        v.$data._historyHash.splice(-1);
        await lCore.trigger('formHashChange', this.taskId, this.formId, parent, v.$data._formHashData);
    }

    /** --- 发送一段数据到 panel 控件，本质上也是调用的 panel 控件的 send 方法 --- */
    public sendToPanel(panel: lControl.AbstractControl & Record<string, any>, data: Record<string, any>): void {
        panel.send(data);
    }

    /** --- 覆盖整个窗体的 loading（实际值） --- */
    private _loading: boolean = false;

    /** --- 覆盖整个窗体的 loading --- */
    public get loading(): boolean {
        return this._loading;
    }

    public set loading(val: boolean) {
        if (this.lockLoading) {
            return;
        }
        this._loading = val;
    }

    /** --- 是否阻止任何人修改 loading --- */
    public lockLoading: boolean = false;

    // --- step 相关 ---

    private _inStep: boolean = false;

    /** --- 当前是否在 step 环节中 --- */
    public get inStep(): boolean {
        return this._inStep;
    }

    /** --- 序列化后的 step value 值 --- */
    private readonly _stepValues: string[] = [];

    /** --- 进入 form hash 为源的步进条 --- */
    public async enterStep(list: Array<{
        /** --- 步骤 hash，第一个必须为当前 hash --- */
        'value': string;
        'label'?: string;
        'icon'?: string;
        'desc'?: string;
    }>): Promise<boolean> {
        if (this._inStep) {
            return false;
        }
        if (list[0].value !== this.formHash) {
            return false;
        }
        // --- 进入当前页面步骤 ---
        this._inStep = true;
        this._stepValues.length = 0;
        for (const item of list) {
            this._stepValues.push(item.value);
        }
        this.refs.form.stepData = list;
        this.refs.form.stepValue = this.formHash;
        await this.nextTick();
        this.refs.form.stepShow();
        return true;
    }

    /** --- 更新步进条，用于动态改变某个项的 hash 值时使用 --- */
    public updateStep(index: number, value: string): boolean {
        if (this._inStep) {
            return false;
        }
        if (this._stepValues[index] === undefined) {
            return false;
        }
        this._stepValues[index] = value;
        return true;
    }

    /** --- 完成当前步骤条 --- */
    public async doneStep(): Promise<void> {
        if (!this._inStep) {
            return;
        }
        this._inStep = false;
        await this.refs.form.stepDone();
    }

    /** --- 每次隐藏时递增，阻止上一次尚未完成的显示继续执行 --- */
    private _showGeneration = 0;

    /** --- 上次自动居中的坐标，首次显示前未记录 --- */
    private _autoPosition?: { 'left'?: number; 'top'?: number; };

    /**
     * --- 按更新后的布局显示窗体，重新计算仍采用自动定位的坐标 ---
     */
    public async show(): Promise<void> {
        const task = lTask.getOrigin(this.taskId);
        const form = task?.forms[this.formId];
        if (!form || form.closed || task.ending || this.refs.form.$data.isShow) {
            return;
        }
        const control = this.refs.form;
        const generation = this._showGeneration;
        const revision = form.dialog ? undefined : beginFocusRequest();
        if (!control.stateMaxData && (control.left === -1 || control.top === -1)) {
            if (!form.dialog) {
                // --- 即使布局期间用户激活了其他窗体，本窗体也要占据所属层的位置 ---
                control.$data.zIndex = nextZIndex(this.topMost, this.bottomMost);
            }
            // --- 等显示前切换的内容渲染完成后再测量 ---
            await this.nextTick();
            if (generation !== this._showGeneration || form.closed || task.ending) {
                return;
            }
            // --- 同一窗体的多个 show 共用先完成的布局，各自按请求顺序判断焦点 ---
            if (!control.$data.isShow) {
                const previous = this._autoPosition;
                const position: { 'left'?: number; 'top'?: number; } = {};
                const area = control.getArea();
                for (const axis of ['left', 'top'] as const) {
                    const current = axis === 'left' ? control.leftData : control.topData;
                    if (control[axis] !== -1 || (previous && previous[axis] !== current)) {
                        continue;
                    }
                    const space = axis === 'left' ? area.width - this.element.offsetWidth :
                        area.height - this.element.offsetHeight;
                    const centered = area[axis] + space / 2;
                    position[axis] = centered;
                    if (!previous || centered !== current) {
                        control.setPropData(axis, centered);
                        // --- 位置更新会同步通知应用，应用可能在回调中隐藏或关闭窗体 ---
                        if (generation !== this._showGeneration || form.closed || task.ending) {
                            return;
                        }
                    }
                }
                this._autoPosition = position;
            }
        }
        else {
            this._autoPosition = {};
        }
        control.$data.isShow = true;
        if (revision !== undefined && !form.dialog && shouldFocusOnShow(revision)) {
            await changeFocus(this.formId);
        }
    }

    /**
     * --- 以模态显示窗体，同一轮重复调用会等待同一个结果 ---
     * @returns 隐藏或关闭时的 dialogResult，默认或显示失败时返回空字符串
     */
    public async showDialog(): Promise<string> {
        const task = lTask.getOrigin(this.taskId);
        const form = task?.forms[this.formId];
        if (!form || form.closed || task.ending) {
            return '';
        }
        if (form.dialog) {
            return form.dialog.result;
        }
        const runtime = lTask.getRuntime(state.sysId, this.taskId);
        if (!runtime) {
            return '';
        }
        let resolve!: (value: string) => void;
        const result = new Promise<string>((res) => {
            resolve = res;
        });
        const revision = beginFocusRequest(this.formId);
        // --- 按打开顺序保留置顶位置，慢显示的模态不能越过后来激活的置顶窗体 ---
        const zIndex = ++info.topLastZIndex;
        form.dialog = {
            result, 'focus': state.focusId, 'topMost': this.topMost, 'bottomMost': this.bottomMost,
            finish: () => {
                delete form.dialog;
                resolve(this.dialogResult);
            },
        };
        this.dialogResult = '';
        runtime.dialogFormIds.push(this.formId);
        try {
            const activate = (): void => {
                if (task.ending || form.closed || form.dialog?.result !== result || !this.refs.form.$data.isShow) {
                    return;
                }
                if (runtime.dialogFormIds.at(-1) === this.formId
                    && (state.focusId === this.formId || shouldFocusOnShow(revision))) {
                    this.topMost = true;
                }
                else {
                    setTopMostLayer(form.vroot);
                    this.refs.form.$data.zIndex = zIndex;
                }
            };
            let showing = this.show();
            if (this.refs.form.$data.isShow) {
                activate();
            }
            else {
                showing = showing.then(activate);
            }
            await Promise.race([showing, result]);
        }
        catch {
            if (!task.ending && !form.closed && form.dialog?.result === result) {
                this.dialogResult = '';
                hideForm(form, runtime);
            }
        }
        return result;
    }

    /**
     * --- 隐藏窗体并保留实例；模态窗体同时结束本轮 showDialog ---
     */
    public hide(): void {
        ++this._showGeneration;
        const form = lTask.getOrigin(this.taskId)?.forms[this.formId];
        if (form && !form.closed) {
            const runtime = lTask.getRuntime(state.sysId, this.taskId);
            if (runtime) {
                hideForm(form, runtime);
            }
        }
    }

    /**
     * --- 关闭当前窗体 ---
     */
    public close(): void {
        close(this.formId);
    }

    /**
     * --- 本轮模态返回值，每次开始 showDialog 时清空，hide 或 close 时返回 ---
     */
    public dialogResult: string = '';

    // --- 窗体可以接收到的事件 ---

    public onMounted(data: Record<string, any>): void | Promise<void>;
    public onMounted(): void {
        return;
    }

    /** --- 接收 send 传递过来的 data 数据 --- */
    public onReceive(data: Record<string, any>): void | Promise<void>;
    public onReceive(): void {
        return;
    }

    /**
     * --- 宿主活跃状态改变时广播；初始化不通知，内部切换 Form 不触发 ---
     * @param active 页面可见且拥有焦点时为 true；切换页签、窗口或焦点移出页面时为 false
     * @returns 无
     */
    public onActiveChanged(active: boolean): void | Promise<void>;
    public onActiveChanged(): void {
        return;
    }

    /** --- 屏幕大小改变事件 --- */
    public onScreenResize(): void | Promise<void>;
    public onScreenResize(): void {
        return;
    }

    /** --- 系统配置变更事件 --- */
    public onConfigChanged<T extends keyof lCore.IConfig>(n: keyof lCore.IConfig, v: lCore.IConfig[T]): void;
    public onConfigChanged(): void {
        return;
    }

    /** --- 窗体创建事件 --- */
    public onFormCreated(
        taskId: string, formId: string, title: string, icon: string, showInSystemTask: boolean
    ): void | Promise<void>;
    public onFormCreated(): void {
        return;
    }

    /** --- 窗体销毁事件 --- */
    public onFormRemoved(taskId: string, formId: string, title: string, icon: string): void | Promise<void>;
    public onFormRemoved(): void {
        return;
    }

    /** --- 窗体标题改变事件 --- */
    public onFormTitleChanged(taskId: string, formId: string, title: string): void | Promise<void>;
    public onFormTitleChanged(): void {
        return;
    }

    /** --- 窗体图标改变事件 --- */
    public onFormIconChanged(taskId: string, formId: string, icon: string): void | Promise<void>;
    public onFormIconChanged(): void {
        return;
    }

    /** --- 窗体最小化状态改变事件 --- */
    public onFormStateMinChanged(taskId: string, formId: string, state: boolean): void | Promise<void>;
    public onFormStateMinChanged(): void {
        return;
    }

    /** --- 窗体最大化状态改变事件 --- */
    public onFormStateMaxChanged(taskId: string, formId: string, state: boolean): void | Promise<void>;
    public onFormStateMaxChanged(): void {
        return;
    }

    /** --- 窗体显示状态改变事件 --- */
    public onFormShowChanged(taskId: string, formId: string, state: boolean): void | Promise<void>;
    public onFormShowChanged(): void {
        return;
    }

    /** --- 窗体获得焦点事件 --- */
    public onFormFocused(taskId: string, formId: string): void | Promise<void>;
    public onFormFocused(): void {
        return;
    }

    /** --- 窗体丢失焦点事件 --- */
    public onFormBlurred(taskId: string, formId: string): void | Promise<void>;
    public onFormBlurred(): void {
        return;
    }

    /** --- 窗体闪烁事件 --- */
    public onFormFlash(taskId: string, formId: string): void | Promise<void>;
    public onFormFlash(): void {
        return;
    }

    /** --- 窗体是否显示在任务栏属性改变事件 --- */
    public onFormShowInSystemTaskChange(taskId: string, formId: string, value: boolean): void | Promise<void>;
    public onFormShowInSystemTaskChange(): void {
        return;
    }

    /** --- 窗体的 formHash 改变事件 --- */
    public onFormHashChange(
        taskId: string, formId: string, value: string, data: Record<string, any>
    ): void | Promise<void>;
    public onFormHashChange(): void {
        return;
    }

    /**
     * --- 托盘注册通知；通过 task.getTrayList(this) 读取快照 ---
     * @param taskId 所属任务
     * @param trayId 托盘 ID
     * @returns 无返回值
     */
    public onTrayCreated(taskId: string, trayId: string): void | Promise<void>;
    public onTrayCreated(): void {
        return;
    }

    /**
     * --- 托盘数据变更通知 ---
     * @param taskId 所属任务
     * @param trayId 托盘 ID
     * @returns 无返回值
     */
    public onTrayChanged(taskId: string, trayId: string): void | Promise<void>;
    public onTrayChanged(): void {
        return;
    }

    /**
     * --- 托盘删除通知 ---
     * @param taskId 所属任务
     * @param trayId 托盘 ID
     * @returns 无返回值
     */
    public onTrayRemoved(taskId: string, trayId: string): void | Promise<void>;
    public onTrayRemoved(): void {
        return;
    }

    /**
     * --- 自己的托盘左键点击，只投递到所属任务 ---
     * @param trayId 托盘 ID
     * @returns 无返回值
     */
    public onTrayClick(trayId: string): void | Promise<void>;
    public onTrayClick(): void {
        return;
    }

    /**
     * --- 自己的托盘菜单命令，只投递到所属任务 ---
     * @param trayId 托盘 ID
     * @param menuId 菜单命令
     * @returns 无返回值
     */
    public onTrayMenuClick(trayId: string, menuId: string): void | Promise<void>;
    public onTrayMenuClick(): void {
        return;
    }

    /** --- 任务开始事件 --- */
    public onTaskStarted(taskId: string): void | Promise<void>;
    public onTaskStarted(): void {
        return;
    }

    /** --- 任务结束事件 --- */
    public onTaskEnded(taskId: string): void | Promise<void>;
    public onTaskEnded(): void {
        return;
    }

    /**
     * --- 页面级 WebMCP 接入状态变化，所有 Form 共用同一状态 ---
     * @param status 浏览器接入状态，与 command.getAgentInfo 的 webMcp.status 一致
     * @returns 无返回值
     */
    public onWebMcpStatusChanged(status: lCommand.TWebMcpStatus): void | Promise<void>;
    public onWebMcpStatusChanged(): void {
        return;
    }

    /**
     * --- Launcher 显示状态改变事件 ---
     * @param state 是否显示
     * @returns 无返回值
     */
    public onLauncherShowChanged(state: boolean): void | Promise<void>;
    public onLauncherShowChanged(): void {
        return;
    }

    /** --- launcher 文件夹名称修改事件 --- */
    public onLauncherFolderNameChanged(id: string, name: string): void | Promise<void>;
    public onLauncherFolderNameChanged(): void {
        return;
    }

    /** --- location hash 改变事件 --- */
    public onHashChanged(hash: string): void | Promise<void>;
    public onHashChanged(): void {
        return;
    }

    /** --- 键盘按下事件 --- */
    public onKeydown(e: KeyboardEvent): void | Promise<void>;
    public onKeydown(): void {
        return;
    }

    /** --- 键盘弹起事件 --- */
    public onKeyup(e: KeyboardEvent): void | Promise<void>;
    public onKeyup(): void {
        return;
    }

}

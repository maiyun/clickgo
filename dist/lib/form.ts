/**
 * Copyright 2007-2025 MAIYUN.NET
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import * as clickgo from '../clickgo';
import * as lCore from './core';
import * as lTask from './task';
import * as lTool from './tool';
import * as lDom from './dom';
import * as lControl from './control';
import * as lFs from './fs';
import * as lNative from './native';

/** --- 系统级 ID --- */
let sysId = '';

/**
 * --- 初始化系统级 ID，仅能设置一次 ---
 * @param id 系统级 ID
 */
export function initSysId(id: string): void {
    if (sysId) {
        return;
    }
    sysId = id;
}

/** --- 窗体创建顺序 --- */
let index = -1;

/** --- 当前有焦点的窗体 id --- */
let focusId: string | null = null;

/** --- form 相关信息 --- */
const info: {
    /** --- 最后一个置底窗体层级，1000（一千）开始 --- */
    'bottomLastZIndex': number;
    /** --- 最后一个窗体层级，1000000（百万）开始 --- */
    'lastZIndex': number;
    /** --- 最后一个置顶窗体层级，100000000（一亿）开始 --- */
    'topLastZIndex': number;
    /** --- 用到的语言包 --- */
    'locale': Record<string, {
        'ok': string;
        'yes': string;
        'no': string;
        'cancel': string;
        'search': string;
        'confirmExitStep': string;
    }>;
} = {
    'bottomLastZIndex': 999,
    'lastZIndex': 999999,
    'topLastZIndex': 99999999,
    'locale': {
        'en': {
            'ok': 'OK',
            'yes': 'Yes',
            'no': 'No',
            'cancel': 'Cancel',
            'search': 'Search',
            'confirmExitStep': 'This operation will exit the current process. Are you sure you want to exit?'
        },
        'sc': {
            'ok': '好',
            'yes': '是',
            'no': '否',
            'cancel': '取消',
            'search': '搜索',
            'confirmExitStep': '此操作将退出当前流程，确定退出吗？'
        },
        'tc': {
            'ok': '好',
            'yes': '是',
            'no': '否',
            'cancel': '取消',
            'search': '檢索',
            'confirmExitStep': '此操作將結束目前的流程，確定退出嗎？'
        },
        'ja': {
            'ok': '好',
            'yes': 'はい',
            'no': 'いいえ',
            'cancel': 'キャンセル',
            'search': '検索',
            'confirmExitStep': 'この操作は現在のプロセスを終了します。本当に終了しますか？'
        },
        'ko': {
            'ok': '확인',
            'yes': '예',
            'no': '아니오',
            'cancel': '취소',
            'search': '검색',
            'confirmExitStep': '이 작업은 현재 프로세스를 종료합니다. 종료하시겠습니까?'
        },
        'th': {
            'ok': 'ตกลง',
            'yes': 'ใช่',
            'no': 'ไม่',
            'cancel': 'ยกเลิก',
            'search': 'ค้นหา',
            'confirmExitStep': 'การดำเนินการนี้จะออกจากกระบวนการปัจจุบัน ยืนยันที่จะออกไหม？'
        },
        'es': {
            'ok': 'Aceptar',
            'yes': 'Sí',
            'no': 'No',
            'cancel': 'Cancelar',
            'search': 'Buscar',
            'confirmExitStep': 'Esta operación cerrará el proceso actual. ¿Estás seguro de que quieres salir?'
        },
        'de': {
            'ok': 'OK',
            'yes': 'Ja',
            'no': 'Nein',
            'cancel': 'Abbrechen',
            'search': 'Suchen',
            'confirmExitStep': 'Diese Aktion beendet den aktuellen Prozess. Möchten Sie wirklich beenden?'
        },
        'fr': {
            'ok': 'OK',
            'yes': 'Oui',
            'no': 'Non',
            'cancel': 'Annuler',
            'search': 'Rechercher',
            'confirmExitStep': 'Cette opération va quitter le processus en cours. Êtes-vous sûr de vouloir quitter ?'
        },
        'pt': {
            'ok': 'OK',
            'yes': 'Sim',
            'no': 'Não',
            'cancel': 'Cancelar',
            'search': 'Buscar',
            'confirmExitStep': 'Esta operação encerrará o processo atual. Você tem certeza de que deseja sair?'
        },
        'ru': {
            'ok': 'OK',
            'yes': 'Да',
            'no': 'Нет',
            'cancel': 'Отмена',
            'search': 'Поиск',
            'confirmExitStep': 'Эта операция завершит текущий процесс. Вы уверены, что хотите выйти?'
        },
        'vi': {
            'ok': 'OK',
            'yes': 'Có',
            'no': 'Không',
            'cancel': 'Hủy bỏ',
            'search': 'Tìm kiếm',
            'confirmExitStep': 'Thao tác này sẽ thoát khỏi quy trình hiện tại. Bạn có chắc chắn muốn thoát không?'
        }
    }
};

/** --- Panel 与 Form 共用的抽象类 --- */
abstract class AbstractCommon {

    /** --- 当前文件在包内的路径 --- */
    public get filename(): string {
        // --- pack 时系统自动在继承类中重写本函数 ---
        return '';
    }

    /** --- 当前控件的名字 --- */
    public get controlName(): string {
        return 'root';
    }

    public set controlName(v: string) {
        notify({
            'title': 'Error',
            'content': `The software tries to modify the system variable "controlName".\nPath: ${this.path}`,
            'type': 'danger'
        });
        return;
    }

    /** --- 当前的任务 ID --- */
    public get taskId(): string {
        // --- 窗体创建时继承时重写本函数 ---
        return '';
    }

    /** --- 当前的窗体 ID --- */
    public get formId(): string {
        // --- 窗体创建时 create 系统自动重写本函数 ---
        return '';
    }

    public set formFocus(b: boolean) {
        notify({
            'title': 'Error',
            'content': `The software tries to modify the system variable "formFocus".\nPath: ${this.path}`,
            'type': 'danger'
        });
    }

    /** --- 当前文件的包内路径不以 / 结尾 --- */
    public get path(): string {
        // --- 将在初始化时系统自动重写本函数 ---
        return '';
    }

    /** --- 样式独占前缀 --- */
    public get prep(): string {
        // --- 将在初始化时系统自动重写本函数 ---
        return '';
    }

    /** --- 当前的语言 --- */
    public get locale(): string {
        const task = lTask.getOrigin(this.taskId);
        return lTool.logicalOr(task?.locale.lang ?? '', lCore.config.locale);
    }

    /**
     * --- 获取语言内容 ---
     */
    public get l(): (key: string, data?: string[], origin?: boolean) => string {
        const task = lTask.getOrigin(this.taskId);
        return (key: string, data?: string[], origin = false): string => {
            const loc = task?.locale.data[this.locale]?.[key] ?? task?.locale.data['en']?.[key] ?? (origin ? '' : '[LocaleError]') + key;
            if (!data) {
                return loc;
            }
            let i: number = -1;
            return loc.replace(/\?/g, function() {
                ++i;
                if (!data[i]) {
                    return '';
                }
                return data[i];
            });
        };
    }

    /** --- layout 中 :class 的转义 --- */
    public get classPrepend(): (cla: any) => string {
        return (cla: any): string => {
            if (typeof cla !== 'string') {
                return cla;
            }
            // --- 没有单独的窗体样式，则只应用任务级样式 ---
            return `cg-task${this.taskId}_${cla}${this.prep ? (' ' + this.prep + cla) : ''}`;
        };
    }

    /**
     * --- 监视变动 ---
     * @param name 监视的属性
     * @param cb 回调
     * @param opt 参数
     */
    public watch<T extends this, TK extends keyof T, TR>(
        name: TK | (() => TR),
        cb: (val: T[TK] & TR, old: T[TK] & TR) => void | Promise<void>,
        opt: {
            'immediate'?: boolean;
            'deep'?: boolean;
        } = {}
    ): () => void {
        return (this as any).$watch(name, cb, opt);
    }

    /**
     * --- 获取 refs 情况 ---
     */
    public get refs(): Record<string, HTMLElement & lControl.AbstractControl & Record<string, any>> {
        return (this as any).$refs;
    }

    /** --- 获取当前的 HTML DOM --- */
    public get element(): HTMLElement {
        return (this as any).$el;
    }

    /**
     * --- 等待渲染 ---
     */
    public get nextTick(): () => Promise<void> {
        return (this as any).$nextTick;
    }

    /**
     * --- 判断当前事件可否执行 ---
     * @param e 鼠标、触摸、键盘事件
     */
    public allowEvent(e: MouseEvent | TouchEvent | KeyboardEvent): boolean {
        return lDom.allowEvent(e);
    }

    /**
     * --- 触发系统方法 ---
     * @param name 方法名
     * @param param1 参数1
     * @param param2 参数2
     */
    public async trigger(name: lCore.TGlobalEvent, param1: boolean | Error | string = '', param2: string = ''): Promise<void> {
        if (!['formTitleChanged', 'formIconChanged', 'formStateMinChanged', 'formStateMaxChanged', 'formShowChanged'].includes(name)) {
            return;
        }
        await lCore.trigger(name, this.taskId, this.formId, param1, param2);
    }

    /**
     * --- 给一个窗体发送一个对象，不会知道成功与失败状态 ---
     * @param fid formId 要接收对象的 form id
     * @param obj 要发送的对象
     */
    public send(fid: string, obj: Record<string, any>): void {
        obj.taskId = this.taskId;
        obj.formId = this.formId;
        send(fid, obj);
    }

    // --- 控件响应事件，都可由用户重写 ---

    public onBeforeCreate(): void | Promise<void> {
        return;
    }

    public onCreated(): void | Promise<void> {
        return;
    }

    public onBeforeMount(): void | Promise<void> {
        return;
    }

    public onBeforeUpdate(): void | Promise<void> {
        return;
    }

    public onUpdated(): void | Promise<void> {
        return;
    }

    public onBeforeUnmount(): void | Promise<void> {
        return;
    }

    public onUnmounted():  void | Promise<void> {
        return;
    }

}

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

/** --- 窗体的抽象类 --- */
export abstract class AbstractForm extends AbstractCommon {

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
        const runtime = lTask.getRuntime(sysId, this.taskId);
        if (!runtime) {
            return false;
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
                        'content': info.locale[this.locale].confirmExitStep
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
                    'content': info.locale[this.locale].confirmExitStep
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

    /** --- 当前是不是初次显示 --- */
    private _firstShow: boolean = true;

    /**
     * --- 显示窗体 ---
     */
    public async show(): Promise<void> {
        // --- 创建成功的窗体，可以直接显示 ---
        if (this._firstShow) {
            this._firstShow = false;
            // --- 将窗体居中 ---
            const area = lCore.getAvailArea();
            if (!this.refs.form.stateMaxData) {
                if (this.refs.form.left === -1) {
                    this.refs.form.setPropData('left', (area.width - this.element.offsetWidth) / 2);
                }
                if (this.refs.form.top === -1) {
                    this.refs.form.setPropData('top', (area.height - this.element.offsetHeight) / 2);
                }
            }
            this.refs.form.$data.isShow = true;
            await changeFocus(this.formId);
        }
        else {
            this.refs.form.$data.isShow = true;
        }
    }

    /**
     * --- 显示独占的窗体 ---
     */
    public async showDialog(): Promise<string> {
        if (!lTask.getOrigin(this.taskId)) {
            return '';
        }
        const runtime = lTask.getRuntime(sysId, this.taskId);
        if (!runtime) {
            return '';
        }
        runtime.dialogFormIds.push(this.formId);
        await this.show();
        this.topMost = true;
        return new Promise((resolve) => {
            (this as any).cgDialogCallback = () => {
                resolve(this.dialogResult);
            };
        });
    }

    /**
     * --- 让窗体隐藏 ---
     */
    public hide(): void {
        const v = this as any;
        v.$refs.form.$data.isShow = false;
    }

    /**
     * --- 关闭当前窗体 ---
     */
    public close(): void {
        close(this.formId);
    }

    /**
     * --- dialog mask 窗体返回值，在 close 之后会进行传导 ---
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

/** --- pop 相关信息 --- */
const popInfo: {
    /** --- 当前显示的 pop 列表 --- */
    'list': HTMLElement[];
    /** --- 当前显示的 pop 的母标签 --- */
    'elList': HTMLElement[];
    /** --- 当前展示的 pop 托管方式（normal、click、hover） --- */
    'wayList': Array<'normal' | 'click' | 'hover'>;
    /** --- 每个层弹出时的时间戳 --- */
    'time': number[];
    /** --- pop 最后一个层级 --- */
    'lastZIndex': number;
} = {
    'list': [],
    'elList': [],
    'wayList': [],
    'time': [],
    'lastZIndex': 0
};

export let simpleSystemTaskRoot: lCore.IVue;
export let launcherRoot: lCore.IVue;

/** --- 系统级 confirm 的用户回调函数 --- */
let superConfirmHandler: undefined | ((result: boolean) => void | Promise<void>) = undefined;

export const elements: {
    'wrap': HTMLDivElement;
    'list': HTMLDivElement;
    'popList': HTMLDivElement;
    'circular': HTMLDivElement;
    'rectangle': HTMLDivElement;
    'gesture': HTMLDivElement;
    'drag': HTMLDivElement;
    'keyboard': HTMLDivElement;
    'notify': HTMLElement;
    'alert': HTMLElement;
    'simpletask': HTMLDivElement;
    'launcher': HTMLDivElement;
    'confirm': HTMLDivElement;
    'init': () => void;
} = {
    'wrap': document.createElement('div'),
    'list': document.createElement('div'),
    'popList': document.createElement('div'),
    'circular': document.createElement('div'),
    'rectangle': document.createElement('div'),
    'gesture': document.createElement('div'),
    'drag': document.createElement('div'),
    'keyboard': document.createElement('div'),
    'notify': document.createElement('div'),
    'alert': document.createElement('div'),
    'simpletask': document.createElement('div'),
    'launcher': document.createElement('div'),
    'confirm': document.createElement('div'),
    'init': function() {
        /** --- clickgo 所有的 div wrap --- */
        this.wrap.id = 'cg-wrap';
        document.getElementsByTagName('body')[0].appendChild(this.wrap);
        this.wrap.addEventListener('touchmove', function(e): void {
            // --- 防止拖动时整个网页跟着动 ---
            if (e.target && lDom.findParentByData(e.target as HTMLElement, 'cg-scroll')) {
                return;
            }
            if (e.cancelable) {
                e.preventDefault();
            }
            // --- 为啥要在这加，因为有些设备性能不行，在 touchstart 之时添加的 touchmove 不能立马响应，导致网页还是跟着动，所以增加此函数 ---
        }, {
            'passive': false
        });
        this.wrap.addEventListener('wheel', function(e): void {
            // --- 防止不小心前进后退，或上下缓动滚动（Mac、触摸板） ---
            if (e.target && (((e.target as HTMLElement).dataset.cgScroll !== undefined) || lDom.findParentByData(e.target as HTMLElement, 'cg-scroll'))) {
                return;
            }
            e.preventDefault();
        }, {
            'passive': false
        });
        this.wrap.addEventListener('contextmenu', function(e): void {
            e.preventDefault();
        });

        /** --- form list 的 div --- */
        this.list.id = 'cg-form-list';
        this.wrap.appendChild(this.list);

        /** --- pop list 的 div --- */
        this.popList.id = 'cg-pop-list';
        this.wrap.appendChild(this.popList);

        // --- 从鼠标指针处从小到大缩放然后淡化的圆圈动画特效对象 ---=
        this.circular.id = 'cg-circular';
        this.wrap.appendChild(this.circular);

        // --- 从鼠标指针处开始从小到大缩放并铺满屏幕（或任意大小矩形）的对象 ---
        this.rectangle.setAttribute('data-pos', '');
        this.rectangle.id = 'cg-rectangle';
        this.wrap.appendChild(this.rectangle);

        // --- 手势有效无效的圆圈 ---
        this.gesture.id = 'cg-gesture';
        this.wrap.appendChild(this.gesture);

        // --- drag drop 的拖动占位符 ---
        this.drag.id = 'cg-drag';
        this.drag.innerHTML = '<svg width="16" height="16" viewBox="0 0 48 48" fill="none" stroke="#FFF" xmlns="http://www.w3.org/2000/svg"><path d="M8 8L40 40" stroke-width="4" stroke-linecap="butt" stroke-linejoin="miter"/><path d="M8 40L40 8" stroke-width="4" stroke-linecap="butt" stroke-linejoin="miter"/></svg>';
        this.wrap.appendChild(this.drag);

        // --- 添加 cg-system 的 dom ---
        this.notify.id = 'cg-notify';
        this.wrap.appendChild(this.notify);
        this.alert.id = 'cg-alert';
        this.wrap.appendChild(this.alert);

        // --- 添加 cg-simpletask 的 dom ---
        this.simpletask.id = 'cg-simpletask';
        this.wrap.appendChild(this.simpletask);
        const simpletaskApp = clickgo.modules.vue.createApp({
            'template': '<div v-for="(item, formId) of forms" class="cg-simpletask-item" @click="click(formId)"><div v-if="item.icon" class="cg-simpletask-icon" :style="{\'background-image\': \'url(\' + item.icon + \')\'}"></div><div>{{item.title}}</div></div>',
            'data': function() {
                return {
                    'forms': {}
                };
            },
            'watch': {
                'forms': {
                    handler: function(this: any) {
                        const length = Object.keys(this.forms).length;
                        if (length > 0) {
                            if (elements.simpletask.style.bottom !== '0px') {
                                elements.simpletask.style.bottom = '0px';
                                lCore.trigger('screenResize').catch(() => {});
                            }
                        }
                        else {
                            if (elements.simpletask.style.bottom === '0px') {
                                elements.simpletask.style.bottom = '-46px';
                                lCore.trigger('screenResize').catch(() => {});
                            }
                        }
                    },
                    'deep': true,
                }
            },
            'methods': {
                click: async function(formId: string): Promise<void> {
                    await changeFocus(formId);
                },
            },
            'mounted': function(this: any): void {
                simpleSystemTaskRoot = this;
            }
        });
        simpletaskApp.mount('#cg-simpletask');

        // --- cg-launcher ---
        this.launcher.id = 'cg-launcher';
        this.wrap.appendChild(this.launcher);
        // --- Vue 挂载在这里 ---
        const waiting = function(): void {
            // --- 必须在这里执行，要不然 computed 无法更新，因为 core 还没加载进来 ---
            if (!lCore.config) {
                setTimeout(function() {
                    waiting();
                }, 150);
                return;
            }
            const launcherApp = clickgo.modules.vue.createApp({
                'template': `<div class="cg-launcher-search">` +
    `<input v-if="folderName === ''" class="cg-launcher-sinput" :placeholder="search" v-model="name">` +
    `<input v-else class="cg-launcher-foldername" :value="folderName" @change="folderNameChange">` +
`</div>` +
`<div class="cg-launcher-list" @mousedown="mousedown" @click="listClick" :class="[folderName === '' ? '' : 'cg-folder-open']">` +
    `<div v-for="item of list" class="cg-launcher-item">` +
        `<div class="cg-launcher-inner">` +
            `<div v-if="!item.list || item.list.length === 0" class="cg-launcher-icon" :style="{'background-image': 'url(' + item.icon + ')'}" @click="iconClick($event, item)"></div>` +
            `<div v-else class="cg-launcher-folder" @click="openFolder($event, item)">` +
                `<div>` +
                    `<div v-for="sub of item.list" class="cg-launcher-item">` +
                        `<div class="cg-launcher-inner">` +
                            `<div class="cg-launcher-icon" :style="{'background-image': 'url(' + sub.icon + ')'}" @click="subIconClick($event, sub)"></div>` +
                            `<div class="cg-launcher-name">{{sub.name}}</div>` +
                        `</div>` +
                        `<div class="cg-launcher-space"></div>` +
                    `</div>` +
                `</div>` +
            `</div>` +
            `<div class="cg-launcher-name">{{item.name}}</div>` +
        `</div>` +
        `<div class="cg-launcher-space"></div>` +
    `</div>` +
`</div>`,
                'data': function() {
                    return {
                        'name': '',
                        'folderName': '',
                        'folderItem': {}
                    };
                },
                'computed': {
                    'search': function() {
                        return info.locale[lCore.config.locale]?.search ?? info.locale['en'].search;
                    },
                    'list': function(this: any) {
                        if (this.name === '') {
                            return lCore.config['launcher.list'];
                        }
                        const list = [];
                        for (const item of lCore.config['launcher.list']) {
                            if (item.list && item.list.length > 0) {
                                for (const sub of item.list) {
                                    if (sub.name.toLowerCase().includes(this.name.toLowerCase())) {
                                        list.push(sub);
                                    }
                                }
                            }
                            else {
                                if (item.name.toLowerCase().includes(this.name.toLowerCase())) {
                                    list.push(item);
                                }
                            }
                        }
                        return list;
                    }
                },
                'methods': {
                    mousedown: function(this: any, e: MouseEvent): void {
                        this.md = e.pageX + e.pageY;
                    },
                    listClick: function(this: any, e: MouseEvent) {
                        if (this.md !== e.pageX + e.pageY) {
                            return;
                        }
                        if (e.currentTarget !== e.target) {
                            return;
                        }
                        if (this.folderName === '') {
                            hideLauncher();
                        }
                        else {
                            this.closeFolder();
                        }
                    },
                    iconClick: async function(
                        this: any,
                        e: MouseEvent,
                        item: lCore.IConfigLauncherItem
                    ): Promise<void> {
                        if (this.md !== e.pageX + e.pageY) {
                            return;
                        }
                        hideLauncher();
                        await lTask.run(sysId, item.path!, {
                            'icon': item.icon
                        });
                    },
                    subIconClick: async function(
                        this: any,
                        e: MouseEvent,
                        item: lCore.IConfigLauncherItem
                    ): Promise<void> {
                        if (this.md !== e.pageX + e.pageY) {
                            return;
                        }
                        hideLauncher();
                        await lTask.run(sysId, item.path!, {
                            'icon': item.icon
                        });
                    },
                    closeFolder: function(this: any): void {
                        // --- 关闭文件夹 ---
                        this.folderName = '';
                        const el = this.folderEl as HTMLDivElement;
                        const rect = (el.parentNode as HTMLDivElement).getBoundingClientRect();
                        el.classList.remove('cg-show');
                        el.style.left = (rect.left + 30).toString() + 'px';
                        el.style.top = rect.top.toString() + 'px';
                        el.style.width = '';
                        el.style.height = '';
                        setTimeout(() => {
                            el.style.position = '';
                            el.style.left = '';
                            el.style.top = '';
                        }, 150);
                    },
                    openFolder: function(this: any, e: MouseEvent, item: lCore.IConfigLauncherItem): void {
                        if (this.md !== e.pageX + e.pageY) {
                            return;
                        }
                        if ((e.currentTarget as HTMLElement).childNodes[0] !== e.target) {
                            return;
                        }
                        if (this.folderName !== '') {
                            this.closeFolder();
                            return;
                        }
                        this.folderName = item.name;
                        this.folderItem = item;
                        const el = (e.currentTarget as HTMLDivElement).childNodes.item(0) as HTMLDivElement;
                        this.folderEl = el;
                        const searchEl = document.getElementsByClassName('cg-launcher-search')[0] as HTMLDivElement;
                        const rect = el.getBoundingClientRect();
                        el.style.left = rect.left.toString() + 'px';
                        el.style.top = rect.top.toString() + 'px';
                        el.style.position = 'fixed';
                        requestAnimationFrame(() => {
                            el.classList.add('cg-show');
                            el.style.left = '50px';
                            el.style.top = searchEl.offsetHeight.toString() + 'px';
                            el.style.width = 'calc(100% - 100px)';
                            el.style.height = 'calc(100% - 50px - ' + searchEl.offsetHeight.toString() + 'px)';
                        });
                    },
                    folderNameChange: function(this: any, e: InputEvent): void {
                        const input = e.target as HTMLInputElement;
                        const val = input.value.trim();
                        if (val === '') {
                            input.value = this.folderName;
                            return;
                        }
                        this.folderName = val;
                        // --- 触发 folder name change 事件 ---
                        lCore.trigger('launcherFolderNameChanged', this.folderItem.id ?? '', val).catch(() => {});
                    }
                },
                'mounted': function(this: any): void {
                    launcherRoot = this;
                }
            });
            launcherApp.mount('#cg-launcher');
        };
        waiting();

        // --- cg-confirm ---
        this.confirm.id = 'cg-confirm';
        this.wrap.appendChild(this.confirm);

        this.confirm.innerHTML = `<div class="cg-confirm-box">` +
            `<div id="cg-confirm-content"></div>` +
            `<div class="cg-confirm-controls">` +
                `<div id="cg-confirm-cancel"></div>` +
                `<div id="cg-confirm-ok"></div>` +
            `</div>` +
        `</div>`;
        this.confirm.style.display = 'none';
        document.getElementById('cg-confirm-cancel')!.addEventListener('click', () => {
            superConfirmHandler?.(false) as any;
            this.confirm.style.display = 'none';
            getMaxZIndexID(sysId).then(fid => {
                if (!fid) {
                    return;
                }
                changeFocus(fid).catch(() => {});
            }).catch(() => {});
        });
        document.getElementById('cg-confirm-ok')!.addEventListener('click', () => {
            superConfirmHandler?.(true) as any;
            this.confirm.style.display = 'none';
            getMaxZIndexID(sysId).then(fid => {
                if (!fid) {
                    return;
                }
                changeFocus(fid).catch(() => {});
            }).catch(() => {});
        });

        // --- cg-keyboard ---
        this.keyboard.id = 'cg-keyboard';
        this.wrap.appendChild(this.keyboard);
        this.keyboard.innerHTML = `<div v-for="line of list">` +
    `<div v-for="row of line" :style="{'width': row[2] ? (row[2] * 50 + 'px') : '50px'}" :class="[!row[0]&&'cg-keyboard-null',row[0]==='Caps'&&caps&&'cg-keyboard-checked',row[0]==='Shift'&&shift&&'cg-keyboard-checked']" @click="click(row)">` +
        `<div v-if="row[1]">{{row[1]}}</div>` +
        `<svg v-if="row[0] === '[x]'" width="24" height="24" viewBox="0 0 24 24" stroke="none"><path d="m7.53033 6.46967c-.29289-.29289-.76777-.29289-1.06066 0s-.29289.76777 0 1.06066l4.46963 4.46967-4.46963 4.4697c-.29289.2929-.29289.7677 0 1.0606s.76777.2929 1.06066 0l4.46967-4.4696 4.4697 4.4696c.2929.2929.7677.2929 1.0606 0s.2929-.7677 0-1.0606l-4.4696-4.4697 4.4696-4.46967c.2929-.29289.2929-.76777 0-1.06066s-.7677-.29289-1.0606 0l-4.4697 4.46963z" /></svg>` +
        `<div v-else>{{row[0]}}</div>` +
    `</div>` +
`</div>`;
        const keyboardApp = clickgo.modules.vue.createApp({
            'data': function() {
                return {
                    'caps': false,
                    'shift': false,
                    'list': [
                        [
                            ['`', '~'],
                            ['1', '!'],
                            ['2', '@'],
                            ['3', '#'],
                            ['4', '$'],
                            ['5', '%'],
                            ['6', '^'],
                            ['7', '&'],
                            ['8', '*'],
                            ['9', '('],
                            ['0', ')'],
                            ['-', '_'],
                            ['=', '+'],
                            ['Back', '', 1.2],
                        ],
                        [
                            ['Tab', '', 1.2],
                            ['q', 'Q'],
                            ['w', 'W'],
                            ['e', 'E'],
                            ['r', 'R'],
                            ['t', 'T'],
                            ['y', 'Y'],
                            ['u', 'U'],
                            ['i', 'I'],
                            ['o', 'O'],
                            ['p', 'P'],
                            ['[', '{'],
                            [']', '}'],
                            ['\\', '|'],
                        ],
                        [
                            ['Caps', '', 1.6],
                            ['a', 'A'],
                            ['s', 'S'],
                            ['d', 'D'],
                            ['f', 'F'],
                            ['g', 'G'],
                            ['h', 'H'],
                            ['j', 'J'],
                            ['k', 'K'],
                            ['l', 'L'],
                            [';', ':'],
                            ['\'', '"'],
                            ['Enter', '', 1.6],
                        ],
                        [
                            ['Shift', '', 2],
                            ['z', 'Z'],
                            ['x', 'X'],
                            ['c', 'C'],
                            ['v', 'V'],
                            ['b', 'B'],
                            ['n', 'N'],
                            ['m', 'M'],
                            [',', '<'],
                            ['.', '>'],
                            ['/', '?'],
                            ['', '', 2.2]
                        ],
                        [
                            ['', '', 4.2],
                            [' ', ' ', 5.8],
                            ['[x]', '', 4.2],
                        ]
                    ]
                };
            },
            'methods': {
                click: function(row: string[]): void {
                    if (!row[0]) {
                        return;
                    }
                    switch (row[0]) {
                        case 'Tab': {
                            document.execCommand('insertText', false, '\t');
                            break;
                        }
                        case 'Back': {
                            document.execCommand('delete');
                            break;
                        }
                        case 'Caps': {
                            this.caps = !this.caps;
                            break;
                        }
                        case 'Enter': {
                            document.execCommand('insertText', false, '\n');
                            break;
                        }
                        case 'Shift': {
                            this.shift = !this.shift;
                            break;
                        }
                        case '[x]': {
                            hideKeyboard();
                            break;
                        }
                        case '`':
                        case '1':
                        case '2':
                        case '3':
                        case '4':
                        case '5':
                        case '6':
                        case '7':
                        case '8':
                        case '9':
                        case '0':
                        case '-':
                        case '=': {
                            document.execCommand('insertText', false, row[this.shift ? 1 : 0]);
                            if (this.shift) {
                                this.shift = false;
                            }
                            break;
                        }
                        default: {
                            let n1 = this.caps;
                            if (this.shift) {
                                n1 = !n1;
                            }
                            document.execCommand('insertText', false, row[n1 ? 1 : 0]);
                            if (this.shift) {
                                this.shift = false;
                            }
                        }
                    }
                }
            },
        });
        keyboardApp.mount('#cg-keyboard');
        const down = (e: MouseEvent | TouchEvent): void => {
            e.preventDefault();
            e.stopPropagation();
            lDom.bindMove(e, {
                'object': e.currentTarget as HTMLElement,
                move: (e, o): void => {
                    this.keyboard.style.left = (parseFloat(this.keyboard.style.left) + o.ox) + 'px';
                    this.keyboard.style.top = (parseFloat(this.keyboard.style.top) + o.oy) + 'px';
                }
            });
        };
        this.keyboard.addEventListener('mousedown', down);
        this.keyboard.addEventListener('touchstart', down);
    }
};

/** --- 显示系统级询问框 --- */
export function superConfirm(current: string, html: string): Promise<boolean> {
    return new Promise((resolve) => {
        if (current !== sysId) {
            return;
        }
        if (superConfirmHandler !== undefined) {
            resolve(false);
            return;
        }
        elements.confirm.style.display = 'flex';
        document.getElementById('cg-confirm-content')!.innerHTML = html;
        document.getElementById('cg-confirm-cancel')!.innerHTML = info.locale[lCore.config.locale]?.cancel ?? info.locale['en'].cancel;
        document.getElementById('cg-confirm-ok')!.innerHTML = info.locale[lCore.config.locale]?.ok ?? info.locale['en'].ok;
        superConfirmHandler = (result: boolean) => {
            superConfirmHandler = undefined;
            resolve(result);
        };
    });
}

/** --- 显示系统级虚拟键盘 --- */
export function showKeyboard(): void {
    if (lDom.is.keyboard) {
        return;
    }
    lDom.is.keyboard = true;
    elements.keyboard.style.display = 'flex';
    requestAnimationFrame(() => {
        elements.keyboard.style.left = (window.innerWidth - elements.keyboard.offsetWidth) / 2 + 'px';
        elements.keyboard.style.top = (window.innerHeight - elements.keyboard.offsetHeight) - 50 + 'px';
        requestAnimationFrame(() => {
            elements.keyboard.style.opacity = '1';
            elements.keyboard.style.transform = 'translateY(0)';
        });
    });
}

/** --- 隐藏系统级虚拟键盘 --- */
export function hideKeyboard(): void {
    elements.keyboard.style.opacity = '0';
    elements.keyboard.style.transform = 'translateY(-10px)';
    window.setTimeout(() => {
        elements.keyboard.style.display = 'none';
        lDom.is.keyboard = false;
    }, 300);
}

/**
 * --- 修改窗体的最大化、最小化状态，外部或不可调整 state 时才调用 ---
 * @param state 最大化、最小化或关闭
 * @param formId 窗体 id
 */
function changeState(state: 'min' | 'max' | 'close', formId: string): boolean {
    const tid = getTaskId(formId);
    const t = lTask.getOrigin(tid);
    if (!t) {
        return false;
    }
    switch (state) {
        case 'max': {
            t.forms[formId].vroot.$refs.form.maxMethod();
            break;
        }
        case 'min': {
            t.forms[formId].vroot.$refs.form.minMethod();
            break;
        }
        default: {
            remove(formId);
        }
    }
    return true;
}

/**
 * --- 最小化某个窗体 ---
 * @param formId 窗体 id
 */
export function min(formId: string): boolean {
    return changeState('min', formId);
}

/**
 * --- 最大化某个窗体 ---
 * @param formId 窗体 id
 */
export function max(formId: string): boolean {
    return changeState('max', formId);
}

/**
 * --- 关闭一个窗体 ---
 * @param formId 窗体 id
 */
export function close(formId: string):  boolean {
    return changeState('close', formId);
}

/**
 * --- 绑定窗体拖动大小事件，在 mousedown、touchstart 中绑定 ---
 * @param e 事件源
 * @param border 调整大小的方位
 */
export function bindResize(e: MouseEvent | TouchEvent, border: lDom.TDomBorder): void {
    const formWrap = lDom.findParentByClass(e.target as HTMLElement, 'cg-form-wrap');
    if (!formWrap) {
        return;
    }
    const formId = formWrap.dataset.formId;
    if (!formId) {
        return;
    }
    const tid = getTaskId(formId);
    const t = lTask.getOrigin(tid);
    if (!t) {
        return;
    }
    t.forms[formId].vroot.$refs.form.resizeMethod(e, border);
}

/**
 * --- 绑定窗体拖动事件，在 mousedown、touchstart 中绑定 ---
 * @param e 事件源
 */
export function bindDrag(e: MouseEvent | TouchEvent): void {
    const formWrap = lDom.findParentByClass(e.target as HTMLElement, 'cg-form-wrap');
    if (!formWrap) {
        return;
    }
    const formId = formWrap.dataset.formId;
    if (!formId) {
        return;
    }
    const tid = getTaskId(formId);
    const t = lTask.getOrigin(tid);
    if (!t) {
        return;
    }
    t.forms[formId].vroot.$refs.form.moveMethod(e, true);
}

/**
 *  --- 重置所有已经最大化的窗体大小和位置 ---
 */
export function refreshMaxPosition(): void {
    const area = lCore.getAvailArea();
    for (let i = 0; i < elements.list.children.length; ++i) {
        const el = elements.list.children.item(i) as HTMLElement;
        const ef = el.children.item(0) as HTMLElement;
        if (ef.dataset.cgMax === undefined) {
            continue;
        }
        const taskId = el.getAttribute('data-task-id')!;
        const formId = el.getAttribute('data-form-id')!;
        const task = lTask.getOrigin(taskId);
        if (!task) {
            continue;
        }
        const vroot = task.forms[formId].vroot;
        if (ef.dataset.cgBottomMost === undefined) {
            // --- 不是置底窗体 ---
            vroot.$refs.form.setPropData('left', area.left);
            vroot.$refs.form.setPropData('top', area.top);
            vroot.$refs.form.setPropData('width', area.width);
            vroot.$refs.form.setPropData('height', area.height);
        }
        else {
            // --- 是置底窗体 ---
            vroot.$refs.form.setPropData('width', area.owidth);
            vroot.$refs.form.setPropData('height', area.oheight);
        }
    }
}

/**
 * --- 根据窗体 id 获取 task id ---
 * @param formId 窗体 id
 */
export function getTaskId(formId: string): string {
    const formElement = elements.list.querySelector(`[data-form-id='${formId}']`);
    if (!formElement) {
        return '';
    }
    // --- 获取 task id ---
    const taskIdAttr = formElement.getAttribute('data-task-id');
    if (!taskIdAttr) {
        return '';
    }
    return taskIdAttr;
}

/**
 * --- 获取窗体信息 ---
 * @param formId 窗体 id
 */
export function get(formId: string): IFormInfo | null {
    const taskId = getTaskId(formId);
    if (!taskId) {
        return null;
    }
    const task = lTask.getOrigin(taskId);
    if (!task) {
        return null;
    }
    if (!task.forms[formId]) {
        return null;
    }
    const item = task.forms[formId];
    return {
        'taskId': taskId,
        'title': item.vroot.$refs.form.title,
        'icon': item.vroot.$refs.form.iconDataUrl,
        'stateMax': item.vroot.$refs.form.stateMaxData,
        'stateMin': item.vroot.$refs.form.stateMinData,
        'show': item.vroot.$refs.form.isShow,
        'focus': item.vroot.formFocus,
        'showInSystemTask': item.vroot.showInSystemTask
    };
}

/**
 * --- 给一个窗体发送一个对象，不会知道成功与失败状态，用 this.send 替代 ---
 * @param formId 要接收对象的 form id
 * @param obj 要发送的对象
 */
export function send(formId: string, obj: Record<string, any>): void {
    const taskId = getTaskId(formId);
    if (!taskId) {
        return;
    }
    const task = lTask.getOrigin(taskId);
    if (!task) {
        return;
    }
    const item = task.forms[formId];
    item.vroot.onReceive(obj);
}

/**
 * --- 获取 form list 的简略情况 ---
 * @param taskId 任务 ID
 */
export function getList(taskId: lCore.TCurrent): Record<string, IFormInfo> {
    if (typeof taskId !== 'string') {
        taskId = taskId.taskId;
    }
    const task = lTask.getOrigin(taskId);
    if (!task) {
        return {};
    }
    const list: Record<string, IFormInfo> = {};
    for (const fid in task.forms) {
        const item = task.forms[fid];
        list[fid] = {
            'taskId': taskId,
            'title': item.vroot.$refs.form.title,
            'icon': item.vroot.$refs.form.iconDataUrl,
            'stateMax': item.vroot.$refs.form.stateMaxData,
            'stateMin': item.vroot.$refs.form.stateMinData,
            'show': item.vroot.$refs.form.isShow,
            'focus': item.vroot.formFocus,
            'showInSystemTask': item.vroot.showInSystemTask
        };
    }
    return list;
}

/**
 * --- 获取当前有焦点的窗体 form id ---
 */
export function getFocus(): string | null {
    return focusId;
}

/**
 * --- 当前活跃中的 panelId 列表 ---
 */
export const activePanels: Record<string, string[]> = {};

/**
 * --- 获取窗体当前活跃中的 panelId 列表 ---
 * @param formId 要获取的窗体 id
 */
export function getActivePanel(formId: string): string[] {
    return activePanels[formId] ?? [];
}

/**
 * --- 移除 form 中正在活跃中的 panel id （panel 本身被置于隐藏时）
 * @param current 当前任务 id
 * @param formId 所属 form id
 * @param panelId panel id
 */
export function removeActivePanel(current: lCore.TCurrent, formId: string, panelId: string): boolean {
    if (typeof current !== 'string') {
        current = current.taskId;
    }
    const task = lTask.getOrigin(current);
    if (!task) {
        return false;
    }
    if (!task.forms[formId]) {
        return false;
    }
    if (!activePanels[formId]) {
        return true;
    }
    const io = activePanels[formId].indexOf(panelId);
    if (io === -1) {
        return true;
    }
    activePanels[formId].splice(io, 1);
    if (!activePanels[formId].length) {
        delete activePanels[formId];
    }
    return true;
}

/**
 * --- 将 form 中某个 panel 设置为活动的 ---
 * @param current 当前任务 id
 * @param formId 所属 form id
 * @param panelId panel id
 */
export function setActivePanel(current: lCore.TCurrent, formId: string, panelId: string): boolean {
    if (typeof current !== 'string') {
        current = current.taskId;
    }
    const task = lTask.getOrigin(current);
    if (!task) {
        return false;
    }
    if (!task.forms[formId]) {
        return false;
    }
    if (!activePanels[formId]) {
        activePanels[formId] = [];
    }
    const io = activePanels[formId].indexOf(panelId);
    if (io !== -1) {
        return true;
    }
    activePanels[formId].push(panelId);
    return true;
}

/**
 * --- 修改窗体 hash ---
 * @param formId 要修改的窗体 ID
 * @param hash 修改的值，不含 #
 */
export function hash(formId: string, hash: string): boolean {
    const taskId = getTaskId(formId);
    if (!taskId) {
        return false;
    }
    const task = lTask.getOrigin(taskId);
    if (!task) {
        return false;
    }
    const item = task.forms[formId];
    if (!item) {
        return false;
    }
    item.vroot.formHash = hash;
    return true;
}

/**
 * --- 获取窗体的 hash ---
 */
export function getHash(formId: string): string {
    const taskId = getTaskId(formId);
    if (!taskId) {
        return '';
    }
    const task = lTask.getOrigin(taskId);
    if (!task) {
        return '';
    }
    const item = task.forms[formId];
    if (!item) {
        return '';
    }
    return item.vroot.$data._formHash;
}

/**
 * --- 将窗体的 hash 退回上一个 ---
 */
export async function hashBack(formId: string): Promise<boolean> {
    const taskId = getTaskId(formId);
    if (!taskId) {
        return false;
    }
    const task = lTask.getOrigin(taskId);
    if (!task) {
        return false;
    }
    const item = task.forms[formId];
    if (!item) {
        return false;
    }
    await item.vroot.formHashBack();
    return true;
}

/**
 * --- 改变 form 的焦点 class ---
 * @param formId 变更后的 form id
 */
export async function changeFocus(formId: string = ''): Promise<void> {
    const dataFormId = getFocus();
    if (dataFormId) {
        if (dataFormId === formId) {
            return;
        }
        else {
            const f = await lTask.getFocus(sysId);
            if (!f) {
                return;
            }
            const t = lTask.getOrigin(f);
            if (!t) {
                return;
            }
            t.forms[dataFormId].vapp._container.removeAttribute('data-form-focus');
            t.forms[dataFormId].vroot._formFocus = false;
            // --- 触发 formBlurred 事件 ---
            lCore.trigger('formBlurred', t.id, dataFormId).catch(() => {});
        }
    }
    focusId = null;
    lTask.setFocus();
    if (!formId) {
        return;
    }
    const el = elements.list.querySelector(`.cg-form-wrap[data-form-id='${formId}']`);
    if (!el) {
        return;
    }
    // --- 如果是最小化状态的话，需要还原 ---
    if ((el.children.item(0) as HTMLElement).dataset.cgMin !== undefined) {
        min(formId);
    }
    // --- 获取所属的 taskId ---
    const taskId = el.getAttribute('data-task-id') ?? '';
    if (!taskId) {
        return;
    }
    const t = lTask.getOrigin(taskId);
    if (!t) {
        return;
    }
    const rt = lTask.getRuntime(sysId, taskId);
    if (!rt) {
        return;
    }
    // --- 检测是否有 dialog mask 层 ---
    if (rt.dialogFormIds.length) {
        // --- 有 dialog ---
        const dialogFormId = rt.dialogFormIds[rt.dialogFormIds.length - 1];
        // --- 如果是最小化状态的话，需要还原 ---
        if (get(dialogFormId)!.stateMin) {
            min(dialogFormId);
        }
        if (t.forms[dialogFormId].vroot._topMost) {
            t.forms[dialogFormId].vroot.$refs.form.$data.zIndex = ++info.topLastZIndex;
        }
        else if (t.forms[dialogFormId].vroot._bottomMost) {
            t.forms[dialogFormId].vroot.$refs.form.$data.zIndex = ++info.bottomLastZIndex;
        }
        else {
            t.forms[dialogFormId].vroot.$refs.form.$data.zIndex = ++info.lastZIndex;
        }
        // --- 开启 focus ---
        t.forms[dialogFormId].vapp._container.dataset.formFocus = '';
        t.forms[dialogFormId].vroot._formFocus = true;
        focusId = dialogFormId;
        lTask.setFocus(t.id);
        // --- 触发 formFocused 事件 ---
        lCore.trigger('formFocused', taskId, dialogFormId).catch(() => {});
        // --- 判断点击的窗体是不是就是 dialog mask 窗体本身 ---
        if (dialogFormId !== formId) {
            // --- 闪烁 ---
            await flash(taskId, dialogFormId);
        }
    }
    else {
        // --- 没有 dialog，才修改 zindex ---
        if (t.forms[formId].vroot._topMost) {
            t.forms[formId].vroot.$refs.form.$data.zIndex = ++info.topLastZIndex;
        }
        else if (t.forms[formId].vroot._bottomMost) {
            t.forms[formId].vroot.$refs.form.$data.zIndex = ++info.bottomLastZIndex;
        }
        else {
            t.forms[formId].vroot.$refs.form.$data.zIndex = ++info.lastZIndex;
        }
        // --- 正常开启 focus ---
        t.forms[formId].vapp._container.dataset.formFocus = '';
        t.forms[formId].vroot._formFocus = true;
        focusId = formId;
        lTask.setFocus(t.id);
        // --- 触发 formFocused 事件 ---
        lCore.trigger('formFocused', taskId, formId).catch(() => {});
    }
}

/**
 * --- 获取当前 z-index 值最大的 form id（除了 top 模式的窗体和最小化的窗体） ---
 * @param current 当前任务 id
 * @param out 排除选项
 */
export async function getMaxZIndexID(current: lCore.TCurrent, out: {
    'taskIds'?: string[];
    'formIds'?: string[];
} = {}): Promise<string | null> {
    if (typeof current !== 'string') {
        current = current.taskId;
    }
    if (!(await lTask.checkPermission(current, 'root'))[0]) {
        return null;
    }
    let zIndex: number = 0;
    let formId: string | null = null;
    for (let i = 0; i < elements.list.children.length; ++i) {
        const formWrap = elements.list.children.item(i) as HTMLDivElement;
        const formInner = formWrap.children.item(0) as HTMLDivElement;
        if (!formInner) {
            continue;
        }
        // --- 排除 bottom most 窗体 ---
        const z = parseInt(formInner.style.zIndex);
        if (z < 1000000) {
            continue;
        }
        // --- 排除最小化窗体 ---
        if (formInner.dataset.cgMin !== undefined) {
            continue;
        }
        // --- 排除用户定义的 task id 窗体 ---
        const tid = formWrap.getAttribute('data-task-id')!;
        if (tid === lTask.systemTaskInfo.taskId) {
            // --- 系统任务排除掉 ---
            continue;
        }
        if (out.taskIds?.includes(tid)) {
            continue;
        }
        // --- 排除用户定义的 form id 窗体 ---
        const fid = formWrap.getAttribute('data-form-id')!;
        if (out.formIds?.includes(fid)) {
            continue;
        }
        if (z > zIndex) {
            zIndex = z;
            formId = fid;
        }
    }
    return formId;
}

/**
 * --- 让最大的 z index 窗体获取焦点（不含 top 和最小化的） ---
 */
export async function changeFocusMaxZIndex(): Promise<void> {
    const formId = await getMaxZIndexID(sysId);
    if (!formId) {
        return;
    }
    await changeFocus(formId ?? undefined);
}

/**
 * --- 根据 border 方向 获取理论窗体大小 ---
 * @param border 显示的位置代号
 */
export function getRectByBorder(border: lDom.TDomBorderCustom): { 'width': number; 'height': number; 'left': number; 'top': number; } {
    const area = lCore.getAvailArea();
    let width!: number, height!: number, left!: number, top!: number;
    if (typeof border === 'string') {
        switch (border) {
            case 'lt': {
                width = area.width / 2;
                height = area.height / 2;
                left = area.left;
                top = area.top;
                break;
            }
            case 't': {
                width = area.width;
                height = area.height;
                left = area.left;
                top = area.top;
                break;
            }
            case 'tr': {
                width = area.width / 2;
                height = area.height / 2;
                left = area.left + area.width / 2;
                top = area.top;
                break;
            }
            case 'r': {
                width = area.width / 2;
                height = area.height;
                left = area.left + area.width / 2;
                top = area.top;
                break;
            }
            case 'rb': {
                width = area.width / 2;
                height = area.height / 2;
                left = area.left + area.width / 2;
                top = area.top + area.height / 2;
                break;
            }
            case 'b': {
                width = area.width;
                height = area.height / 2;
                left = area.left;
                top = area.top + area.height / 2;
                break;
            }
            case 'bl': {
                width = area.width / 2;
                height = area.height / 2;
                left = area.left;
                top = area.top + area.height / 2;
                break;
            }
            case 'l': {
                width = area.width / 2;
                height = area.height;
                left = area.left;
                top = area.top;
                break;
            }
            default: {
                break;
            }
        }
    }
    else {
        width = border.width ?? area.width;
        height = border.height ?? area.height;
        left = border.left ?? area.left;
        top = border.top ?? area.top;
    }
    return {
        'width': width,
        'height': height,
        'left': left,
        'top': top
    };
}

/**
 * --- 显示从小到大的圆圈动画特效对象 ---
 * @param x X 坐标
 * @param y Y 坐标
 */
export function showCircular(x: number, y: number): void {
    elements.circular.style.transition = 'none';
    requestAnimationFrame(function() {
        elements.circular.style.width = '6px';
        elements.circular.style.height = '6px';
        elements.circular.style.left = (x - 3).toString() + 'px';
        elements.circular.style.top = (y - 3).toString() + 'px';
        elements.circular.style.opacity = '1';
        requestAnimationFrame(function() {
            elements.circular.style.transition = 'all .3s var(--g-cubic)';
            requestAnimationFrame(function() {
                elements.circular.style.width = '60px';
                elements.circular.style.height = '60px';
                elements.circular.style.left = (x - 30).toString() + 'px';
                elements.circular.style.top = (y - 30).toString() + 'px';
                elements.circular.style.opacity = '0';
            });
        });
    });
}

/**
 * --- 移动矩形到新位置 ---
 * @param border 显示的位置代号
 */
export function moveRectangle(border: lDom.TDomBorderCustom): void {
    const dataReady = elements.rectangle.getAttribute('data-ready') ?? '0';
    if (dataReady === '0') {
        return;
    }
    const dataBorder =  elements.rectangle.getAttribute('data-border') ?? '';
    const setDataBorder = typeof border === 'string' ? border : `o-${border.left}-${border.top ?? 'n'}-${border.width}-${border.height ?? 'n'}`;
    if (dataBorder === setDataBorder) {
        return;
    }
    elements.rectangle.setAttribute('data-dir', setDataBorder);
    const pos = getRectByBorder(border);
    const width = pos.width - 20;
    const height = pos.height - 20;
    const left = pos.left + 10;
    const top = pos.top + 10;
    if (width !== undefined && height !== undefined && left !== undefined && top !== undefined) {
        elements.rectangle.style.width = width.toString() + 'px';
        elements.rectangle.style.height = height.toString() + 'px';
        elements.rectangle.style.left = left.toString() + 'px';
        elements.rectangle.style.top = top.toString() + 'px';
    }
}

/**
 * --- 显示从小到大的矩形动画特效对象 ---
 * @param x 起始位置
 * @param y 起始位置
 * @param border 最大时位置代号
 */
export function showRectangle(x: number, y: number, border: lDom.TDomBorderCustom): void {
    elements.rectangle.style.transition = 'none';
    requestAnimationFrame(function() {
        elements.rectangle.style.width = '5px';
        elements.rectangle.style.height = '5px';
        elements.rectangle.style.left = (x - 10).toString() + 'px';
        elements.rectangle.style.top = (y - 10).toString() + 'px';
        elements.rectangle.style.opacity = '1';
        elements.rectangle.setAttribute('data-ready', '0');
        elements.rectangle.setAttribute('data-dir', '');
        requestAnimationFrame(function() {
            elements.rectangle.style.transition = 'all .3s var(--g-cubic)';
            requestAnimationFrame(function() {
                elements.rectangle.setAttribute('data-ready', '1');
                moveRectangle(border);
            });
        });
    });
}

/**
 * --- 结束时请隐藏矩形 ---
 */
export function hideRectangle(): void {
    elements.rectangle.style.opacity = '0';
}

// --- DRAG ---

/** --- 是否马上要隐藏的 timer --- */
let dragTimeOut: number = 0;

/**
 * --- 显示 drag 虚拟框 ---
 */
export function showDrag(opt: {
    /** --- 传入要拖动的对象，让系统仿照他的圆角等形象 --- */
    'element'?: HTMLElement;
} = {}): void {
    if (dragTimeOut) {
        clearTimeout(dragTimeOut);
        dragTimeOut = 0;
    }
    const style = opt.element ? getComputedStyle(opt.element) : undefined;
    elements.drag.style.opacity = '1';
    elements.drag.style.transform = 'perspective(100px) rotateX(15deg) translateZ(15px)';
    elements.drag.style.borderBottomWidth = '2px';
    elements.drag.style.borderRadius = style?.borderRadius ?? '3px';
}

/**
 * --- 移动 drag 到新位置 ---
 * @param opt top:顶部位置,left:左侧位置,width:宽度位置,height:高度位置
 */
export function moveDrag(opt: IMoveDragOptions): void {
    if (opt.top) {
        elements.drag.style.top = opt.top.toString() + 'px';
    }
    if (opt.left) {
        elements.drag.style.left = opt.left.toString() + 'px';
    }
    let perspective = 0;
    if (opt.width) {
        elements.drag.style.width = opt.width.toString() + 'px';
        if (perspective < opt.width) {
            perspective = opt.width;
        }
    }
    if (opt.height) {
        elements.drag.style.height = opt.height.toString() + 'px';
        if (perspective < opt.height) {
            perspective = opt.height;
        }
    }
    if (perspective) {
        elements.drag.style.transform = 'perspective(' + (perspective + 50) + 'px) rotateX(15deg) translateZ(15px)';
    }
    if (opt.icon) {
        (elements.drag.childNodes[0] as HTMLElement).style.display = 'block';
    }
    else {
        (elements.drag.childNodes[0] as HTMLElement).style.display = 'none';
    }
}

/**
 * --- 隐藏拖拽框框 ---
 */
export function hideDrag(): void {
    elements.drag.style.transform = 'initial';
    elements.drag.style.borderBottomWidth = '1px';
    dragTimeOut = window.setTimeout(() => {
        dragTimeOut = 0;
        elements.drag.style.opacity = '0';
    }, 300);
}

// --- Alert ---

let alertBottom: number = 0;
let alertId: number = 0;

/**
 * --- 从下方弹出 alert ---
 * @param content 内容
 * @param type 样式，可留空
 */
export function alert(content: string, type?: 'default' | 'primary' | 'info' | 'warning' | 'danger' | 'cg'): number {
    // --- 申请 aid ---
    const nid = ++alertId;
    // --- 设置 timeout ---
    const timeout = 3000;
    // --- 创建 notify element ---
    const el = document.createElement('div');
    const y = alertBottom;
    el.classList.add('cg-alert-wrap');
    el.classList.add('cg-' + (type ?? 'default'));
    el.setAttribute('data-alertid', nid.toString());
    el.style.transform = `translateY(${y + 10}px)`;
    el.style.opacity = '0';
    el.innerHTML = `<div class="cg-alert-content">` +
        `<div class="cg-alert-icon"></div>` +
        `<div>${lTool.escapeHTML(content)}</div>` +
    '</div>';
    elements.alert.appendChild(el);
    alertBottom -= el.offsetHeight + 10;
    requestAnimationFrame(function() {
        el.style.transform = `translateY(${y}px)`;
        el.style.opacity = '1';
        const timer = window.setTimeout(function() {
            // --- 隐藏 alert ---
            clearTimeout(timer);
            const alertHeight = el.offsetHeight;
            el.style.opacity = '0';
            setTimeout(function() {
                alertBottom += alertHeight + 10;
                const alertElementList = document.getElementsByClassName('cg-alert-wrap') as HTMLCollectionOf<HTMLDivElement>;
                let needSub = false;
                for (const alertElement of alertElementList) {
                    if (alertElement === el) {
                        // --- el 之后的 alert 都要往下移动 ---
                        needSub = true;
                        continue;
                    }
                    if (needSub) {
                        alertElement.style.transform = alertElement.style.transform.replace(/translateY\(([-0-9]+)px\)/,
                            function(t: string, t1: string): string {
                                return `translateY(${parseInt(t1) + alertHeight + 10}px)`;
                            }
                        );
                    }
                }
                el.remove();
            }, 100);
        }, timeout);
    });
    return nid;
}

// --- Notify ---

let notifyBottom: number = -10;
let notifyId: number = 0;
/**
 * --- 弹出右下角信息框 ---
 * @param opt timeout 默认 5 秒，最大 10 分钟
 * @returns notify id，一定大于 0
 */
export function notify(opt: INotifyOptions): number {
    if (opt.note && !opt.content) {
        opt.content = 'Notify';
    }
    // --- 申请 nid ---
    const nid = ++notifyId;
    // --- 设置 timeout ---
    let timeout = 5_000;
    /** --- 限定的最大 maxTimeout --- */
    const maxTimeout = 60_000 * 10;
    if (opt.timeout !== undefined) {
        if (opt.timeout < 0) {
            timeout = 5_000;
        }
        else if ((opt.timeout === 0) || (opt.timeout > maxTimeout)) {
            timeout = maxTimeout;
        }
        else {
            timeout = opt.timeout;
        }
    }
    // --- 设置 type ---
    if (opt.progress && !opt.type) {
        opt.type = 'progress';
    }
    // --- 创建 notify element ---
    const el = document.createElement('div');
    let y = notifyBottom;
    let x = -10;
    if (lTask.systemTaskInfo.taskId) {
        if (lCore.config['task.position'] === 'bottom') {
            y -= lTask.systemTaskInfo.length;
        }
        else if (lCore.config['task.position'] === 'right') {
            x -= lTask.systemTaskInfo.length;
        }
    }
    el.classList.add('cg-notify-wrap');
    el.setAttribute('data-notifyid', nid.toString());
    el.style.transform = `translateY(${y}px) translateX(280px)`;
    el.style.opacity = '0';
    el.classList.add((opt.title && opt.content) ? 'cg-notify-full' : 'cg-notify-only');
    el.innerHTML = `<div class="cg-notify-icon cg-${lTool.escapeHTML(opt.type ?? 'primary')}"></div>` +
    '<div style="flex: 1;">' +
        (opt.title ?
            `<div class="cg-notify-title">${lTool.escapeHTML(opt.title)}</div>` :
            ''
        ) +
        (opt.content ?
            `<div class="cg-notify-content">${lTool.escapeHTML(opt.content).replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\n/g, '<br>')}</div>` :
            ''
        ) +
        (opt.note ?
            `<div class="cg-notify-note">${lTool.escapeHTML(opt.note)}</div>` :
            ''
        ) +
        (opt.progress ?
            '<div class="cg-notify-progress"></div>' :
            ''
        ) +
    '</div>';
    if (opt.icon) {
        (el.childNodes.item(0) as HTMLElement).style.background = 'url(' + opt.icon + ')';
        (el.childNodes.item(0) as HTMLElement).style.backgroundSize = '14px';
    }
    elements.notify.appendChild(el);
    notifyBottom -= el.offsetHeight + 10;
    requestAnimationFrame(function() {
        el.style.transform = `translateY(${y}px) translateX(${x}px)`;
        el.style.opacity = '1';
        const timer = window.setTimeout(function() {
            hideNotify(nid);
        }, timeout);
        el.setAttribute('data-timer', timer.toString());
    });
    return nid;
}

/**
 * --- 修改 notify 的进度条进度 ---
 * @param notifyId notify id
 * @param per 进度，0 - 100 或 0% - 100% (0 - 1)
 */
export function notifyProgress(notifyId: number, per: number): void {
    const el: HTMLElement = elements.notify.querySelector(`[data-notifyid="${notifyId}"]`)!;
    if (!el) {
        return;
    }
    const progress: HTMLElement = el.querySelector('.cg-notify-progress')!;
    if (!progress) {
        return;
    }
    if (per > 100) {
        per = 100;
    }
    else if (per === 1) {
        /** --- 上次的百分比纯数字 --- */
        const o = parseFloat(progress.style.width);
        if (o > 1) {
            // --- 上次的百分比已经超过 1%，这次又是 1%，则认为是 100% ---
            per = 100;
        }
    }
    if (per === 100) {
        progress.style.transitionDelay = '.1s';
    }
    progress.style.width = (per < 1 ? per * 100 : per).toString() + '%';
}

/**
 * --- 修改 notify 的提示信息 ---
 * @param notifyId notify id
 * @param opt 参数
 */
export function notifyContent(notifyId: number, opt: INotifyContentOptions): void {
    const el: HTMLElement = elements.notify.querySelector(`[data-notifyid="${notifyId}"]`)!;
    if (!el) {
        return;
    }
    if (opt.title) {
        const title: HTMLElement = el.querySelector('.cg-notify-title')!;
        if (!title) {
            return;
        }
        title.innerHTML = lTool.escapeHTML(opt.title);
    }
    if (opt.content) {
        const content: HTMLElement = el.querySelector('.cg-notify-content')!;
        if (!content) {
            return;
        }
        content.innerHTML = lTool.escapeHTML(opt.content);
    }
    if (opt.note) {
        const note: HTMLElement = el.querySelector('.cg-notify-note')!;
        if (!note) {
            return;
        }
        note.innerHTML = lTool.escapeHTML(opt.note);
    }
    if (opt.progress) {
        notifyProgress(notifyId, opt.progress);
    }
    if (opt.timeout) {
        setTimeout(function(): void {
            hideNotify(notifyId);
        }, opt.timeout);
    }
}

/**
 * --- 隐藏 notify ---
 * @param notifyId 要隐藏的 notify id
 */
export function hideNotify(notifyId: number): void {
    const el: HTMLElement = elements.notify.querySelector(`[data-notifyid="${notifyId}"]`)!;
    if (!el) {
        return;
    }
    clearTimeout(parseInt(el.getAttribute('data-timer')!));
    const notifyHeight = el.offsetHeight;
    el.style.opacity = '0';
    setTimeout(function() {
        notifyBottom += notifyHeight + 10;
        const notifyElementList = document.getElementsByClassName('cg-notify-wrap') as HTMLCollectionOf<HTMLDivElement>;
        let needSub = false;
        for (const notifyElement of notifyElementList) {
            if (notifyElement === el) {
                // --- el 之后的 notify 都要往下移动 ---
                needSub = true;
                continue;
            }
            if (needSub) {
                notifyElement.style.transform = notifyElement.style.transform.replace(/translateY\(([-0-9]+)px\)/,
                    function(t: string, t1: string): string {
                        return `translateY(${parseInt(t1) + notifyHeight + 10}px)`;
                    }
                );
            }
        }
        el.remove();
    }, 100);
}

/**
 * --- 将标签追加到 pop 层 ---
 * @param el 要追加的标签
 */
export function appendToPop(el: HTMLElement): void {
    elements.popList.appendChild(el);
}

/**
 * --- 将标签从 pop 层移除 ---
 * @param el 要移除的标签
 */
export function removeFromPop(el: HTMLElement): void {
    elements.popList.removeChild(el);
}

/** --- 重新调整 pop 的位置 --- */
function refreshPopPosition(el: HTMLElement, pop: HTMLElement, direction: 'h' | 'v' | 't' | MouseEvent | TouchEvent | { x: number; y: number; }, size: { width?: number; height?: number; } = {}): void {
    // --- 最终 pop 的大小 ---
    const width = size.width ?? pop.offsetWidth;
    const height = size.height ?? pop.offsetHeight;
    // --- 最终显示位置 ---
    let left: number, top: number;
    if (typeof direction === 'string') {
        /** --- 母对象的位置 --- */
        const bcr = el.getBoundingClientRect();
        if (direction === 'v') {
            // --- 垂直弹出 ---
            left = bcr.left;
            top = bcr.top + bcr.height;
        }
        else if (direction === 'h') {
            // --- 水平弹出 ---
            left = bcr.left + bcr.width - 2;
            top = bcr.top - 2;
        }
        else {
            // --- 垂直水平居中 ---
            pop.removeAttribute('data-pop-t-bottom');
            left = bcr.left + bcr.width / 2 - width / 2;
            top = bcr.top - height - 10;
        }
        // --- 下面检测是否出框 ---
        // --- 检查水平是否出框 ---
        if (width + left > window.innerWidth) {
            if (direction === 'v') {
                // --- 垂直弹出 ---
                left = bcr.left + bcr.width - width;
            }
            else if (direction === 'h') {
                // --- 水平弹出，右边位置不够弹到左边 ---
                left = bcr.left - width + 2;
            }
            else {
                // --- 垂直水平居中，水平超出 ---
                left = window.innerWidth - width;
            }
        }
        // --- 检测垂直是否下侧出框 ---
        if (height + top > window.innerHeight) {
            if (direction === 'v') {
                top = bcr.top - height;
            }
            else if (direction === 'h') {
                top = bcr.top + bcr.height - height + 2;
            }
            else {
                // --- 垂直水平居中，下侧出框不管 ---
            }
        }
        else if (top < 0 && direction === 't') {
            // --- 垂直水平居中，上侧出框 ---
            top = bcr.top + bcr.height + 10;
            pop.dataset.popTBottom = '';
        }
    }
    else {
        let x: number;
        let y: number;
        if (direction instanceof MouseEvent || (direction as any).type === 'mousedown') {
            x = (direction as MouseEvent).clientX;
            y = (direction as MouseEvent).clientY;
        }
        else if (direction instanceof TouchEvent || (direction as any).type === 'touchstart') {
            x = (direction as TouchEvent).touches[0].clientX;
            y = (direction as TouchEvent).touches[0].clientY;
        }
        else {
            x = direction.x;
            y = direction.y;
        }
        left = x + 5;
        top = y + 7;
        // --- 水平 ---
        if (width + left > window.innerWidth) {
            left = x - width - 5;
        }
        // --- 垂直 ---
        if (height + top > window.innerHeight) {
            top = y - height - 5;
        }
    }
    if (left < 0) {
        left = 0;
    }
    if (top < 0) {
        top = 0;
    }
    pop.style.left = left.toString() + 'px';
    pop.style.top = top.toString() + 'px';
    pop.style.zIndex = (++popInfo.lastZIndex).toString();
    if (size.width) {
        pop.style.width = size.width.toString() + 'px';
    }
    if (size.height) {
        pop.style.height = size.height.toString() + 'px';
    }
}

/** --- 最后一次 touchstart 的时间戳 */
let lastShowPopTime: number = 0;

/**
 * --- 获取 pop 显示出来的坐标并报系统全局记录 ---
 * @param el 响应的元素
 * @param pop 要显示 pop 元素
 * @param direction 要显示方向（以 $el 为准的 h 水平 v 垂直 t 垂直水平居中）或坐标
 * @param opt width / height 显示的 pop 定义自定义宽/高度，可省略；null，true 代表为空也会显示，默认为 false; autoPosition, 因 pop 内部内容变动导致的自动更新 pop 位置，默认 false，autoScroll，因原元素位置变更导致 pop 位置变更，默认 false，flow: 是否加入 pop 流，默认加入，不加入的话将不会自动隐藏
 */
export function showPop(el: HTMLElement | lCore.IVue, pop: HTMLElement | lCore.IVue | undefined, direction: 'h' | 'v' | 't' | MouseEvent | TouchEvent | { x: number; y: number; }, opt: {
    'size'?: { width?: number; height?: number; };
    'null'?: boolean;
    'autoPosition'?: boolean;
    'autoScroll'?: boolean;
    'flow'?: boolean;
    /** --- 展示托管方式 --- */
    'way'?: 'normal' | 'click' | 'hover';
} = {}): void {
    if (!(el instanceof Element)) {
        if (!el.$el) {
            return;
        }
        el = el.$el;
    }
    if (pop && !(pop instanceof Element)) {
        if (!pop.$el) {
            return;
        }
        pop = pop.$el;
    }
    // --- opt.null 为 true 代表可为空，为空也会被显示，默认为 false ---
    opt.null ??= false;
    opt.size ??= {};
    opt.flow ??= true;
    // --- 也可能不执行本次显示 ---
    if (!pop && !opt.null) {
        return;
    }
    // --- 是否不进入 pop 流 ---
    if (pop && !opt.flow) {
        pop.removeAttribute('data-cg-pop-none');
        pop.dataset.cgFlow = '';
        lTool.sleep(34).then(() => {
            if (pop.dataset.cgFlow === undefined) {
                // --- 已经隐藏掉了 ---
                return;
            }
            refreshPopPosition(el, pop, direction, opt.size);
            if (opt.autoPosition) {
                lDom.watchSize(sysId, pop, () => {
                    refreshPopPosition(el, pop, direction, opt.size);
                });
            }
            pop.dataset.cgOpen = '';
        }).catch(() => {});
        return;
    }
    // --- 如果短时间内已经有了 pop 被展示，则可能是冒泡序列，本次则不展示 ---
    const now = Date.now();
    if (now - lastShowPopTime < 5) {
        lastShowPopTime = now;
        return;
    }
    lastShowPopTime = now;
    // --- 检测是不是已经显示了 ---
    if (el.dataset.cgPopOpen !== undefined) {
        return;
    }
    /** --- 要不要隐藏别的 pop --- */
    const parentPop = lDom.findParentByData(el, 'cg-pop');
    if (parentPop?.dataset.cgLevel !== undefined) {
        const nextlevel = parseInt(parentPop.dataset.cgLevel) + 1;
        if (popInfo.elList[nextlevel]) {
            // --- 要隐藏别的 pop ---
            hidePop(popInfo.elList[nextlevel]);
        }
    }
    else {
        // --- 本层不是 pop，因此要隐藏所有 pop ---
        hidePop();
    }
    // --- 检测如果 pop 是 undefined 还显示吗 ---
    if (!pop) {
        popInfo.elList.push(el);
        el.dataset.cgPopOpen = '';
        el.dataset.cgLevel = (popInfo.elList.length - 1).toString();
        return;
    }
    // --- 准备显示 pop ---
    pop.removeAttribute('data-cg-pop-none');
    popInfo.list.push(pop);
    popInfo.elList.push(el);
    popInfo.wayList.push(opt.way ?? 'normal');
    popInfo.time.push(Date.now());
    pop.dataset.cgLevel = (popInfo.list.length - 1).toString();
    el.dataset.cgLevel = (popInfo.elList.length - 1).toString();
    lTool.sleep(34).then(() => {
        if (pop.dataset.cgLevel === undefined) {
            // --- 已经隐藏掉了 ---
            return;
        }
        // --- 设定 pop 位置 ---
        refreshPopPosition(el, pop, direction, opt.size);
        if (opt.autoPosition && typeof direction === 'string') {
            // --- 可能要重置 pop 位置 ---
            lDom.watchSize(sysId, pop, () => {
                refreshPopPosition(el, pop, direction, opt.size);
            });
        }
        if (opt.autoScroll && typeof direction === 'string') {
            // --- 可能根据原元素重置 pop 位置 ---
            lDom.watchPosition(el, () => {
                refreshPopPosition(el, pop, direction, opt.size);
            });
        }
        pop.dataset.cgOpen = '';
        el.dataset.cgPopOpen = '';
    }).catch(() => {});
}

/**
 * --- 隐藏正在显示中的所有 pop，或指定 pop/el ---
 */
export function hidePop(pop?: HTMLElement | lCore.IVue): void {
    if (pop && !(pop instanceof HTMLElement)) {
        if (!pop.$el) {
            return;
        }
        pop = pop.$el;
    }
    if (!pop) {
        if (popInfo.elList.length === 0) {
            return;
        }
        hidePop(popInfo.elList[0]);
        return;
    }
    if (pop.dataset.cgFlow !== undefined) {
        pop.removeAttribute('data-cg-flow');
        pop.removeAttribute('data-cg-open');
        lDom.unwatchSize(pop);
        lTool.sleep(334).then(() => {
            if (pop.dataset.cgFlow !== undefined) {
                return;
            }
            pop.dataset.cgPopNone = '';
        }).catch(() => {});
        return;
    }
    if (pop.dataset.cgLevel === undefined) {
        return;
    }
    /** --- 是 pop 还是 el 基 --- */
    const isPop: boolean = pop.dataset.cgPop !== undefined ? true : false;
    /** --- 当前层级 --- */
    const level = pop.dataset.cgLevel ? parseInt(pop.dataset.cgLevel) : -1;
    if (level === -1) {
        return;
    }
    if (popInfo.elList[level + 1]) {
        hidePop(popInfo.elList[level + 1]);
    }
    if (isPop) {
        pop.removeAttribute('data-cg-open');
        pop.removeAttribute('data-cg-level');
        lDom.unwatchSize(pop);
        lDom.unwatchPosition(popInfo.elList[level]);
        popInfo.elList[level].removeAttribute('data-cg-pop-open');
        popInfo.elList[level].removeAttribute('data-cg-level');
        lTool.sleep(334).then(() => {
            if (pop.dataset.cgLevel !== undefined) {
                return;
            }
            pop.dataset.cgPopNone = '';
        }).catch(() => {
            //
        });
    }
    else {
        if (popInfo.list[level]) {
            /** --- el 对应的 pop --- */
            const opop = popInfo.list[level];
            opop.removeAttribute('data-cg-open');
            opop.removeAttribute('data-cg-level');
            lDom.unwatchSize(popInfo.list[level]);
            lDom.unwatchPosition(pop);
            lTool.sleep(334).then(() => {
                if (opop.dataset.cgLevel !== undefined) {
                    return;
                }
                opop.dataset.cgPopNone = '';
            }).catch(() => {
                //
            });
        }
        pop.removeAttribute('data-cg-pop-open');
        pop.removeAttribute('data-cg-level');
    }
    popInfo.list.splice(level);
    popInfo.elList.splice(level);
    popInfo.wayList.splice(level);
    popInfo.time.splice(level);
}

/** --- 检测 pop 是不是刚刚显示的 --- */
export function isJustPop(el: HTMLElement | number): boolean {
    if (el instanceof HTMLElement) {
        const level = el.dataset.cgLevel;
        if (!level) {
            return false;
        }
        el = parseInt(level);
    }
    const time = popInfo.time[el];
    if (Date.now() - time >= 100) {
        return false;
    }
    return true;
}

/**
 * --- 点下 (mousedown / touchstart) 屏幕任意一位置时根据点击处处理隐藏 pop 和焦点丢失事件，鼠标和 touch 只会响应一个 ---
 * @param e 事件对象
 */
export async function doFocusAndPopEvent(e: MouseEvent | TouchEvent): Promise<void> {
    if (lDom.hasTouchButMouse(e)) {
        return;
    }
    const target = e.target;
    if (!target) {
        return;
    }
    const paths: HTMLElement[] = (e as any).path ?? (e.composedPath ? e.composedPath() : []);
    // --- 检测是不是窗体内部点击 ---
    /** --- 当前点在了触发弹出层的原元素上 --- */
    let isCgPopOpen: HTMLElement | null = null;
    for (const item of paths) {
        if (!item.tagName) {
            continue;
        }
        if (item.dataset.cgLevel !== undefined && item.dataset.cgPop === undefined) {
            isCgPopOpen = item;
            continue;
        }
        if (item.classList.contains('cg-form-wrap')) {
            // --- 窗体内部点击，转换焦点到当前窗体，但触发隐藏 pop ---
            const formId = item.getAttribute('data-form-id') ?? '';
            await changeFocus(formId);
            if (isCgPopOpen) {
                if (!isJustPop(isCgPopOpen)) {
                    hidePop();
                }
            }
            else {
                hidePop();
            }
            return;
        }
        if (item.tagName.toLowerCase() === 'body') {
            break;
        }
    }
    // --- 检测是不是弹出层 ---
    for (const item of paths) {
        if (!item.tagName) {
            continue;
        }
        if (item.tagName.toLowerCase() === 'body') {
            break;
        }
        if (item.dataset.cgPop !== undefined) {
            // --- 弹出层内点击，不触发丢失焦点
            // --- normal: 不触发隐藏 pop，是否隐藏请自行处理 ---
            // --- click: 自动隐藏下一层 pop，若有 ---
            if (item.dataset.cgLevel) {
                const nextlevel = parseInt(item.dataset.cgLevel) + 1;
                if (popInfo.wayList[nextlevel] === 'click' && !isJustPop(nextlevel)) {
                    // --- 隐藏 ---
                    hidePop(popInfo.list[nextlevel]);
                }
            }
            return;
        }
    }
    // --- 普罗大众的状态，要隐藏 menu，并且丢失窗体焦点 ---
    hidePop();
    await changeFocus();
}
window.addEventListener('touchstart', (e) => {
    doFocusAndPopEvent(e).catch(() => {});
}, {
    'passive': true
});
window.addEventListener('mousedown', (e) => {
    doFocusAndPopEvent(e).catch(() => {});
});

/**
 * --- 移除一个 form（关闭窗口） ---
 * @param formId 要移除的 form id
 */
export function remove(formId: string): boolean {
    const taskId = getTaskId(formId);
    const task = lTask.getOrigin(taskId);
    if (!task?.forms[formId]) {
        return false;
    }
    if (task.forms[formId].closed) {
        return false;
    }
    const rt = lTask.getRuntime(sysId, taskId);
    if (!rt) {
        return false;
    }
    task.forms[formId].closed = true;
    const title = task.forms[formId].vroot.$refs.form.title;
    const icon = task.forms[formId].vroot.$refs.form.iconDataUrl;
    const io = rt.dialogFormIds.indexOf(formId);
    if (io > -1) {
        // --- 取消 dialog mask 记录 ---
        rt.dialogFormIds.splice(io, 1);
    }
    task.forms[formId].vroot.$refs.form.$data.isShow = false;
    setTimeout(() => {
        (async () => {
            // --- 获取最大的 z index 窗体，并让他获取焦点 ---
            const fid = await getMaxZIndexID(sysId, {
                'formIds': [formId],
            });
            if (fid) {
                await changeFocus(fid);
            }
            else {
                await changeFocus();
            }
            // --- 延长 100 秒是为了响应 100 毫秒的动画 ---
            const task = lTask.getOrigin(taskId);
            if (!task) {
                // --- 可能这时候 task 已经被结束了 ---
                return true;
            }
            task.forms[formId].vapp.unmount();
            task.forms[formId].vapp._container.remove();
            elements.popList.querySelector('[data-form-id="' + formId + '"]')?.remove();
            if (io > -1) {
                // --- 如果是 dialog 则要执行回调 ---
                task.forms[formId].vroot.cgDialogCallback();
            }
            delete task.forms[formId];
            // --- 移除 form 的 style ---
            lDom.removeStyle(taskId, 'form', formId);
            // --- 触发 formRemoved 事件 ---
            lCore.trigger('formRemoved', taskId, formId, title, icon).catch(() => {});
            lDom.clearWatchStyle(formId);
            lDom.clearWatchProperty(formId);
            lDom.clearWatchPosition(formId);
            lNative.clear(formId, taskId);
            delete activePanels[formId];
            // --- 检测是否已经没有窗体了，如果没有了的话就要结束任务了 ---
            if (Object.keys(task.forms).length === 0) {
                await lTask.end(taskId);
            }
        })().catch(() => {});
    }, 300);
    return true;
}

/**
 * --- 移除 panel 挂载，通常发生在 panel 控件的 onBeforeUnmount 中 ---
 * @param id panel id
 * @param vapp panel 的 vapp 对象 ---
 * @param el panel 控件
 */
export function removePanel(id: string, vapp: lCore.IVApp, el: HTMLElement): boolean {
    const formWrap = lDom.findParentByClass(el, 'cg-form-wrap');
    if (!formWrap) {
        return false;
    }
    const formId = formWrap.dataset.formId;
    if (!formId) {
        return false;
    }
    const taskId = formWrap.dataset.taskId;
    if (!taskId) {
        return false;
    }
    vapp.unmount();
    vapp._container.remove();
    el.querySelector('[data-panel-id="' + id + '"]')?.remove();
    // --- 移除 form 的 style ---
    lDom.removeStyle(taskId, 'form', formId, id);
    lDom.clearWatchStyle(formId, id);
    lDom.clearWatchProperty(formId, id);
    lDom.clearWatchPosition(formId, id);
    if (activePanels[formId]) {
        const io = activePanels[formId].indexOf(id);
        if (io >= 0) {
            activePanels[formId].splice(io, 1);
        }
        if (!activePanels[formId].length) {
            delete activePanels[formId];
        }
    }
    return true;
}

/**
 * --- 根据任务 id 和 form id 获取 IForm 对象 ---
 * @param taskId 任务 id
 * @param formId 窗体 id
 */
function getForm(taskId: string, formId: string): IForm | null {
    /** --- 当前的 task 对象 --- */
    const t = lTask.getOrigin(taskId);
    if (!t) {
        return null;
    }
    const form = t.forms[formId];
    if (!form) {
        return null;
    }
    return form;
}

/**
 * --- 创建 panel 对象，一般情况下无需使用 ---
 * @param rootPanel 根 panel 控件
 * @param cls 路径字符串或 AbstractPanel 类
 * @param opt 选项
 */
export async function createPanel<T extends AbstractPanel>(
    rootPanel: lControl.AbstractControl,
    cls: string | (new () => T),
    opt: {
        /** --- 布局内容 --- */
        'layout'?: string;
        /** --- 样式内容 --- */
        'style'?: string;
        /** --- cls 为 string 时，path 参数才有效，为基准路径，如果不以 / 结尾则以最后一个 / 字符为准 --- */
        'path'?: string;
    } = {},
): Promise<{
        'id': string;
        'vapp': lCore.IVApp;
        'vroot': T;
    }> {
    if (rootPanel.element.dataset.cgControl !== 'panel') {
        const err = new Error('form.createPanel: -0');
        lCore.trigger('error', '', '', err, err.message).catch(() => {});
        throw err;
    }
    const formWrap = lDom.findParentByData(rootPanel.element, 'form-id');
    if (!formWrap) {
        const err = new Error('form.createPanel: -0');
        lCore.trigger('error', '', '', err, err.message).catch(() => {});
        throw err;
    }
    const formId = formWrap.dataset.formId!;
    /** --- 当前的 task 对象 --- */
    const t = lTask.getOrigin(rootPanel.taskId);
    if (!t) {
        const err = new Error('form.createPanel: -1');
        lCore.trigger('error', '', '', err, err.message).catch(() => {});
        throw err;
    }
    /** --- 布局内容 --- */
    let layout: string = '';
    if (opt.layout) {
        layout = opt.layout;
    }
    /** --- 样式内容 --- */
    let style: string = '';
    /** --- 样式前缀 --- */
    let prep = '';
    if (opt.style) {
        style = opt.style;
    }

    /** --- 文件在包内的路径，不以 / 结尾 --- */
    let filename = '';
    if (typeof cls === 'string') {
        filename = lTool.urlResolve(opt.path ?? '/', cls) + '.js';
        if (!layout) {
            const l = t.app.files[cls + '.xml'];
            if (typeof l !== 'string') {
                const err = new Error('form.createPanel: -2');
                lCore.trigger('error', '', '', err, err.message).catch(() => {});
                throw err;
            }
            layout = l;
        }
        if (!style) {
            const s = t.app.files[cls + '.css'];
            if (typeof s === 'string') {
                style = s;
            }
        }
        cls = class extends AbstractPanel {
            public get filename(): string {
                return filename;
            }
        } as (new () => T);
    }

    // --- 申请 panelId ---
    const panelId = lTool.random(8, lTool.RANDOM_LUN);
    // --- 其实后面会重写 taskId，这里先提前赋值一下，以使初始化时就能知道 taskId  ---
    Object.defineProperty(cls.prototype, 'taskId', {
        get: () => t.id,
    });
    /** --- 要新建的 panel 类对象 --- */
    const panel = new cls();
    if (!filename) {
        filename = panel.filename;
    }
    const path = filename.slice(0, filename.lastIndexOf('/'));

    // --- 布局 ---
    if (!layout) {
        const l = t.app.files[filename.slice(0, -2) + 'xml'];
        if (typeof l !== 'string') {
            const err = new Error('form.createPanel: -3');
            lCore.trigger('error', '', '', err, err.message).catch(() => {});
            throw err;
        }
        layout = l;
    }
    // --- 样式 ---
    if (!style) {
        const s = t.app.files[filename.slice(0, -2) + 'css'];
        if (typeof s === 'string') {
            style = s;
        }
    }
    if (style) {
        // --- 将 style 中的 tag 标签转换为 class，如 button 变为 .tag-button，然后将 class 进行标准程序，添加 prep 进行区分隔离 ---
        const r = lTool.stylePrepend(style);
        prep = r.prep;
        style = await lTool.styleUrl2DataUrl(path + '/', r.style, t.app.files);
    }

    // --- 纯净化 ---
    layout = lTool.purify(layout);
    // --- 标签增加 cg- 前缀，增加 class 为 tag-xxx ---
    layout = lTool.layoutAddTagClassAndReTagName(layout, true);
    // --- 给所有控件传递窗体的 focus 信息 ---
    /*
    layout = tool.layoutInsertAttr(layout, ':form-focus=\'formFocus\'', {
        'include': [/^cg-.+/]
    });
    */
    // --- 给 layout 的 class 增加前置 ---
    const prepList = ['cg-task' + t.id + '_'];
    if (prep !== '') {
        prepList.push(prep);
    }
    layout = lTool.layoutClassPrepend(layout, prepList);
    // --- 给 event 增加包裹 ---
    layout = lTool.eventsAttrWrap(layout);
    // --- 给 teleport 做处理 ---
    if (layout.includes('<teleport')) {
        layout = lTool.teleportGlue(layout, formId);
    }
    // --- 获取要定义的控件列表 ---
    const components = lControl.buildComponents(t.id, formId, path);
    if (!components) {
        const err = new Error('form.createPanel: -4');
        lCore.trigger('error', '', '', err, err.message).catch(() => {});
        throw err;
    }
    /** --- class 对象类的属性列表 --- */
    const idata: Record<string, any> = {};
    const cdata = Object.entries(panel);
    for (const item of cdata) {
        if (item[0] === 'access') {
            // --- access 属性不放在 data 当中 ---
            continue;
        }
        idata[item[0]] = item[1];
    }
    /** --- class 对象的方法和 getter/setter 列表 --- */
    const prot = lTool.getClassPrototype(panel);
    const methods = prot.method;
    const computed = prot.access;
    computed.taskId = {
        get: function(): string {
            return t.id;
        },
        set: function(this: lCore.IVue): void {
            notify({
                'title': 'Error',
                'content': `The software tries to modify the system variable "taskId".\nPath: ${this.filename}`,
                'type': 'danger'
            });
            return;
        }
    };
    computed.formId = {
        get: function(): string {
            return formId;
        },
        set: function(this: lCore.IVue): void {
            notify({
                'title': 'Error',
                'content': `The software tries to modify the system variable "formId".\nPath: ${this.filename}`,
                'type': 'danger'
            });
            return;
        }
    };
    computed.panelId = {
        get: function(): string {
            return panelId;
        },
        set: function(this: lCore.IVue): void {
            notify({
                'title': 'Error',
                'content': `The software tries to modify the system variable "panelId".\nPath: ${this.filename}`,
                'type': 'danger'
            });
            return;
        }
    };
    computed.path = {
        get: function(): string {
            return path;
        },
        set: function(this: lCore.IVue): void {
            notify({
                'title': 'Error',
                'content': `The software tries to modify the system variable "path".\nPath: ${this.filename}`,
                'type': 'danger'
            });
            return;
        }
    };
    computed.prep = {
        get: function(): string {
            return prep;
        },
        set: function(this: lCore.IVue): void {
            notify({
                'title': 'Error',
                'content': `The software tries to modify the system variable "prep".\nPath: ${this.filename}`,
                'type': 'danger'
            });
            return;
        }
    };
    computed.rootForm = {
        get: function(): AbstractForm & Record<string, any> {
            return t.forms[formId].vroot as any;
        },
        set: function(this: lCore.IVue): void {
            notify({
                'title': 'Error',
                'content': `The software tries to modify the system variable "rootForm".\nPath: ${this.filename}`,
                'type': 'danger'
            });
            return;
        }
    };
    computed.rootPanel = {
        get: function(): lControl.AbstractControl & Record<string, any> {
            return rootPanel;
        },
        set: function(this: lCore.IVue): void {
            notify({
                'title': 'Error',
                'content': `The software tries to modify the system variable "rootPanel".\nPath: ${this.filename}`,
                'type': 'danger'
            });
            return;
        }
    };

    // --- 插入 dom ---
    rootPanel.element.insertAdjacentHTML('beforeend', `<div data-panel-id="${panelId}"></div>`);
    if (style) {
        lDom.pushStyle(t.id, style, 'form', formId, panelId);
    }
    /** --- panel wrap element 对象 --- */
    const mel: HTMLElement = rootPanel.element.children.item(rootPanel.element.children.length - 1) as HTMLElement;
    mel.style.position = 'absolute';
    /*
    mel.style.pointerEvents = 'none';
    mel.style.opacity = '0';
    */
    mel.style.display = 'none';

    // --- 创建 app 对象 ---
    const rtn: {
        'vapp': lCore.IVApp;
        'vroot': lCore.IVue;
    } = await new Promise(function(resolve) {
        const vapp = clickgo.modules.vue.createApp({
            'template': layout.replace(/^<cg-panel([\s\S]+)-panel>$/, '<cg-layout$1-layout>'),
            'data': function() {
                return lTool.clone(idata);
            },
            'methods': methods,
            'computed': computed,

            'beforeCreate': (panel as any).onBeforeCreate,
            'created': function(this: lCore.IVue) {
                if ((panel as any).access) {
                    this.access = lTool.clone((panel as any).access);
                }
                this.onCreated();
            },
            'beforeMount': function(this: lCore.IVue) {
                this.onBeforeMount();
            },
            'mounted': async function(this: lCore.IVue) {
                await this.$nextTick();
                (mel.children.item(0) as HTMLElement).style.flex = '1';
                // --- 完成 ---
                resolve({
                    'vapp': vapp as unknown as lCore.IVApp,
                    'vroot': this,
                });
            },
            'beforeUpdate': function(this: lCore.IVue) {
                this.onBeforeUpdate();
            },
            'updated': async function(this: lCore.IVue) {
                await this.$nextTick();
                this.onUpdated();
            },
            'beforeUnmount': function(this: lCore.IVue) {
                this.onBeforeUnmount();
            },
            'unmounted': async function(this: lCore.IVue) {
                await this.$nextTick();
                this.onUnmounted();
            }
        }) as unknown as lCore.IVApp;
        vapp.config.errorHandler = function(err: any, instance, info): void {
            notify({
                'title': 'Runtime Error',
                'content': `Message: ${err.message}\nTask id: ${instance?.taskId ?? ''}\nForm id: ${instance?.formId ?? ''}`,
                'type': 'danger'
            });
            console.error('Runtime Error [form.createPanel.errorHandler]', `Message: ${err.message}\nTask id: ${instance?.taskId ?? ''}\nForm id: ${instance?.formId ?? ''}`, err, info);
            lCore.trigger('error', instance?.taskId ?? '', instance?.formId ?? '', err, info + '(-3,' + (instance?.taskId ?? '') + ',' + (instance?.formId ?? '') + ')').catch(() => {});
        };
        // --- 挂载控件对象到 vapp ---
        for (const key in components) {
            vapp.component(key, components[key]);
        }
        try {
            vapp.mount(mel);
        }
        catch (err: any) {
            notify({
                'title': 'Runtime Error',
                'content': `Message: ${err.message}\nTask id: ${t.id}\nForm id: ${formId}`,
                'type': 'danger'
            });
            console.error('Runtime Error [form.createPanel.mount]', `Message: ${err.message}\nTask id: ${t.id}\nForm id: ${formId}`, err);
            lCore.trigger('error', t.id, formId, err, err.message).catch(() => {});
        }
    });
    // --- 执行 mounted ---
    await lTool.sleep(34);
    try {
        await panel.onMounted.call(rtn.vroot);
    }
    catch (err: any) {
        // --- 创建失败，做垃圾回收 ---
        lCore.trigger('error', rtn.vroot.taskId, rtn.vroot.formId, err, 'Create panel mounted error: -5.').catch(() => {});
        try {
            rtn.vapp.unmount();
        }
        catch (err: any) {
            const msg = `Message: ${err.message}\nTask id: ${t.id}\nForm id: ${formId}\nFunction: form.createPanel, unmount.`;
            notify({
                'title': 'Panel Unmount Error',
                'content': msg,
                'type': 'danger'
            });
            // console.log('Panel Unmount Error', msg, err);
        }
        rtn.vapp._container.remove();
        lDom.clearWatchStyle(rtn.vroot.formId, panelId);
        lDom.clearWatchProperty(rtn.vroot.formId, panelId);
        lDom.clearWatchPosition(rtn.vroot.formId, panelId);
        // --- 移除 style ---
        lDom.removeStyle(rtn.vroot.taskId, 'form', rtn.vroot.formId, panelId);
        throw err;
    }
    return {
        'id': panelId,
        'vapp': rtn.vapp,
        'vroot': rtn.vroot as any
    };
}

/**
 * --- 创建一个窗体 ---
 * @param current 当前任务 ID
 * @param cls 路径字符串或 AbstractForm 类
 * @param data 要传递的对象
 * @param opt 其他替换选项
 */
export async function create<T extends AbstractForm>(
    current: lCore.TCurrent,
    cls: string | (new () => T),
    data?: Record<string, any>,
    opt: {
        'layout'?: string;
        'style'?: string;
        /** --- cls 为 string 时，path 参数才有效，为基准路径，如果不以 / 结尾则以最后一个 / 字符为准 --- */
        'path'?: string;
    } = {},
): Promise<T> {
    if (typeof current !== 'string') {
        current = current.taskId;
    }
    /** --- 当前的 task 对象 --- */
    const t = lTask.getOrigin(current);
    if (!t) {
        const err = new Error('form.create: -1');
        lCore.trigger('error', '', '', err, err.message).catch(() => {});
        throw err;
    }
    /** --- 布局内容 --- */
    let layout: string = '';
    if (opt.layout) {
        layout = opt.layout;
    }
    /** --- 样式内容 --- */
    let style: string = '';
    /** --- 样式前缀 --- */
    let prep = '';
    if (opt.style) {
        style = opt.style;
    }
    /** --- 文件在包内的路径，不以 / 结尾 --- */
    let filename = '';
    if (typeof cls === 'string') {
        filename = lTool.urlResolve(opt.path ?? '/', cls);
        if (!layout) {
            const l = t.app.files[filename + '.xml'];
            if (typeof l !== 'string') {
                const err = new Error('form.create: -2');
                lCore.trigger('error', '', '', err, err.message).catch(() => {});
                throw err;
            }
            layout = l;
        }
        if (!style) {
            const s = t.app.files[filename + '.css'];
            if (typeof s === 'string') {
                style = s;
            }
        }
        filename += '.js';
        cls = class extends AbstractForm {
            public get filename(): string {
                return filename;
            }
        } as (new () => T);
    }

    // --- 申请 formId ---
    const formId = lTool.random(8, lTool.RANDOM_LUN);
    const findex = ++index;
    // --- 其实后面会重写 taskId，这里先提前赋值一下，以使初始化时就能知道 taskId  ---
    Object.defineProperty(cls.prototype, 'taskId', {
        get: () => t.id,
    });
    /** --- 要新建的窗体类对象 --- */
    const frm = new cls();
    if (!filename) {
        filename = frm.filename;
    }
    const path = filename.slice(0, filename.lastIndexOf('/'));

    // --- 布局 ---
    if (!layout) {
        const l = t.app.files[filename.slice(0, -2) + 'xml'];
        if (typeof l !== 'string') {
            const err = new Error('form.create: -3');
            lCore.trigger('error', '', '', err, err.message).catch(() => {});
            throw err;
        }
        layout = l;
    }
    // --- 样式 ---
    if (!style) {
        const s = t.app.files[filename.slice(0, -2) + 'css'];
        if (typeof s === 'string') {
            style = s;
        }
    }
    if (style) {
        // --- 将 style 中的 tag 标签转换为 class，如 button 变为 .tag-button，然后将 class 进行标准程序，添加 prep 进行区分隔离 ---
        const r = lTool.stylePrepend(style);
        prep = r.prep;
        style = await lTool.styleUrl2DataUrl(path + '/', r.style, t.app.files);
    }

    // --- 纯净化 ---
    layout = lTool.purify(layout);
    // --- 标签增加 cg- 前缀，增加 class 为 tag-xxx ---
    layout = lTool.layoutAddTagClassAndReTagName(layout, true);
    // --- 给所有控件传递窗体的 focus 信息 ---
    /*
    layout = tool.layoutInsertAttr(layout, ':form-focus=\'formFocus\'', {
        'include': [/^cg-.+/]
    });
    */
    // --- 给 layout 的 class 增加前置 ---
    const prepList = ['cg-task' + t.id + '_'];
    if (prep !== '') {
        prepList.push(prep);
    }
    layout = lTool.layoutClassPrepend(layout, prepList);
    // --- 给 event 增加包裹 ---
    layout = lTool.eventsAttrWrap(layout);
    // --- 给 touchstart 增加 .passive 防止 [Violation] Added non-passive event listener to a scroll-blocking ---
    /*
    layout = layout.replace(/@(touchstart|touchmove|wheel)=/g, '@$1.passive=');
    layout = layout.replace(/@(touchstart|touchmove|wheel)\.not=/g, '@$1=');
    */
    // --- 给 teleport 做处理 ---
    if (layout.includes('<teleport')) {
        layout = lTool.teleportGlue(layout, formId);
    }
    // --- 获取要定义的控件列表 ---
    const components = lControl.buildComponents(t.id, formId, path);
    if (!components) {
        const err = new Error('form.create: -4');
        lCore.trigger('error', '', '', err, err.message).catch(() => {});
        throw err;
    }
    /** --- class 对象类的属性列表 --- */
    const idata: Record<string, any> = {};
    const cdata = Object.entries(frm);
    for (const item of cdata) {
        if (item[0] === 'access') {
            // --- access 属性不放在 data 当中 ---
            continue;
        }
        idata[item[0]] = item[1];
    }
    idata._formFocus = false;
    // --- 判断是否是 native 且无边框的第一个窗体 ---
    if (clickgo.isNative() && (findex === 0) && !clickgo.hasFrame()) {
        idata.isNativeNoFrameFirst = true;
    }
    /** --- class 对象的方法和 getter/setter 列表 --- */
    const prot = lTool.getClassPrototype(frm);
    const methods = prot.method;
    const computed = prot.access;
    computed.findex = {
        get: function(): number {
            return findex;
        },
        set: function(this: lCore.IVue): void {
            notify({
                'title': 'Error',
                'content': `The software tries to modify the system variable "findex".\nPath: ${this.filename}`,
                'type': 'danger',
            });
            return;
        }
    };
    computed.taskId = {
        get: function(): string {
            return t.id;
        },
        set: function(this: lCore.IVue): void {
            notify({
                'title': 'Error',
                'content': `The software tries to modify the system variable "taskId".\nPath: ${this.filename}`,
                'type': 'danger'
            });
            return;
        }
    };
    computed.formId = {
        get: function(): string {
            return formId;
        },
        set: function(this: lCore.IVue): void {
            notify({
                'title': 'Error',
                'content': `The software tries to modify the system variable "formId".\nPath: ${this.filename}`,
                'type': 'danger'
            });
            return;
        }
    };
    computed.path = {
        get: function(): string {
            return path;
        },
        set: function(this: lCore.IVue): void {
            notify({
                'title': 'Error',
                'content': `The software tries to modify the system variable "path".\nPath: ${this.filename}`,
                'type': 'danger'
            });
            return;
        }
    };
    computed.prep = {
        get: function(): string {
            return prep;
        },
        set: function(this: lCore.IVue): void {
            notify({
                'title': 'Error',
                'content': `The software tries to modify the system variable "prep".\nPath: ${this.filename}`,
                'type': 'danger'
            });
            return;
        }
    };
    // --- 是否在底层的窗体 ---
    idata._bottomMost = false;
    computed.bottomMost = {
        get: function(this: lCore.IVue): boolean {
            return this._bottomMost;
        },
        set: function(this: lCore.IVue, v: boolean): void {
            if (v) {
                // --- 置底 ---
                this._bottomMost = true;
                this.$el.dataset.cgBottomMost = '';
                if (this._topMost) {
                    this._topMost = false;
                }
                this.$refs.form.$data.zIndex = ++info.bottomLastZIndex;
            }
            else {
                // --- 取消置底 ---
                this._bottomMost = false;
                this.$el.removeAttribute('data-cg-bottom-most');
                this.$refs.form.$data.zIndex = ++info.lastZIndex;
            }
        }
    };
    // --- 是否在顶层的窗体 ---
    idata._topMost = false;
    computed.topMost = {
        get: function(this: lCore.IVue): boolean {
            return this._topMost;
        },
        set: function(this: lCore.IVue, v: boolean): void {
            if (v) {
                // --- 置顶 ---
                this._topMost = true;
                if (this._bottomMost) {
                    this._bottomMost = false;
                    this.$el.removeAttribute('data-cg-bottom-most');
                }
                if (!this._formFocus) {
                    changeFocus(this.formId).catch(() => {});
                }
                else {
                    this.$refs.form.$data.zIndex = ++info.topLastZIndex;
                }
            }
            else {
                // --- 取消置顶 ---
                this._topMost = false;
                this.$refs.form.$data.zIndex = ++info.lastZIndex;
            }
        }
    };
    // --- 获取和设置 form hash ---
    idata._historyHash = [];
    idata._formHash = '';
    computed.formHash = {
        get: function(this: lCore.IVue): string {
            return this._formHash;
        },
        set: function(this: lCore.IVue, v: string): void {
            if (v === this._formHash) {
                return;
            }
            if (Date.now() - this._lastFormHashData > 300) {
                this._formHashData = {};
            }
            if (this.inStep) {
                // --- 在 step 中，要判断 step 是否正确 ---
                (async (): Promise<void> => {
                    if (this._stepValues.includes(v)) {
                        this.$refs.form.stepValue = v;
                    }
                    else {
                        // --- 不应该 ---
                        if (!await confirm(current, {
                            'content': info.locale[this.locale].confirmExitStep
                        })) {
                            return;
                        }
                        // --- 退出了 ---
                        this._inStep = false;
                        this.$refs.form.stepHide();
                    }
                    if (this._formHash) {
                        this._historyHash.push(this._formHash);
                    }
                    this._formHash = v;
                    lCore.trigger('formHashChange', t.id, formId, v, this._formHashData).catch(() => {});
                })() as any;
                return;
            }
            if (this._formHash) {
                this._historyHash.push(this._formHash);
            }
            this._formHash = v;
            lCore.trigger('formHashChange', t.id, formId, v, this._formHashData).catch(() => {});
        }
    };
    // --- 获取和设置 form hash with data 的数据 ---
    idata._lastFormHashData = 0;
    idata._formHashData = {};
    computed.formHashData = {
        get: function(this: lCore.IVue): string {
            return this._formHashData;
        },
        set: function(this: lCore.IVue, v: Record<string, any>): void {
            this._formHashData = v;
            this._lastFormHashData = Date.now();
        }
    };
    // --- 当前窗体是否显示在任务栏 ---
    idata._showInSystemTask = true;
    computed.showInSystemTask = {
        get: function(this: lCore.IVue): number {
            return this._showInSystemTask;
        },
        set: function(this: lCore.IVue, v: boolean): void {
            this._showInSystemTask = v;
            lCore.trigger('formShowInSystemTaskChange', t.id, formId, v).catch(() => {});
        }
    };
    // --- ready 方法 ---
    const cbs: Array<() => void | Promise<void>> = [];
    methods.ready = function(cb: () => void | Promise<void>): void {
        if (this.isReady) {
            cb() as any;
            return;
        }
        cbs.push(cb);
    };

    // --- 插入 dom ---
    elements.list.insertAdjacentHTML('beforeend', `<div class="cg-form-wrap" data-form-id="${formId}" data-task-id="${t.id}"></div>`);
    elements.popList.insertAdjacentHTML('beforeend', `<div data-form-id="${formId}" data-task-id="${t.id}"></div>`);
    if (style) {
        lDom.pushStyle(t.id, style, 'form', formId);
    }
    /** --- form wrap element 对象 --- */
    const el: HTMLElement = elements.list.children.item(elements.list.children.length - 1) as HTMLElement;

    // --- 创建 app 对象 ---
    const rtn: {
        'vapp': lCore.IVApp;
        'vroot': lCore.IVue;
    } = await new Promise(function(resolve) {
        const vapp = clickgo.modules.vue.createApp({
            'template': layout.replace(/^<cg-form/, '<cg-form ref="form"'),
            'data': function() {
                return lTool.clone(idata);
            },
            'methods': methods,
            'computed': computed,

            'beforeCreate': (frm as any).onBeforeCreate,
            'created': function(this: lCore.IVue) {
                if ((frm as any).access) {
                    this.access = lTool.clone((frm as any).access);
                }
                this.onCreated();
            },
            'beforeMount': function(this: lCore.IVue) {
                this.onBeforeMount();
            },
            'mounted': async function(this: lCore.IVue) {
                await this.$nextTick();
                // --- 判断是否有 icon，对 icon 进行第一次读取 ---
                // --- 为啥要在这搞，因为 form 控件中读取，将可能导致下方的 formCreate 事件获取不到 icon 图标 ---
                // --- 而如果用延迟的方式获取，将可能导致 changeFocus 的窗体焦点事件先于 formCreate 触发 ---
                if (this.$refs.form.icon) {
                    const icon = await lFs.getContent(current, this.$refs.form.icon);
                    this.$refs.form.iconDataUrl = (icon instanceof Blob) ? await lTool.blob2DataUrl(icon) : '';
                }
                // --- 完成 ---
                resolve({
                    'vapp': vapp,
                    'vroot': this
                });
            },
            'beforeUpdate': function(this: lCore.IVue) {
                this.onBeforeUpdate();
            },
            'updated': async function(this: lCore.IVue) {
                await this.$nextTick();
                this.onUpdated();
            },
            'beforeUnmount': function(this: lCore.IVue) {
                this.onBeforeUnmount();
            },
            'unmounted': async function(this: lCore.IVue) {
                await this.$nextTick();
                this.onUnmounted();
            }
        }) as unknown as lCore.IVApp;
        vapp.config.errorHandler = function(err: any, instance, info): void {
            notify({
                'title': 'Runtime Error',
                'content': `Message: ${err.message}\nTask id: ${instance?.taskId ?? ''}\nForm id: ${instance?.formId ?? ''}`,
                'type': 'danger'
            });
            console.error('Runtime Error [form.create.errorHandler]', `Message: ${err.message}\nTask id: ${instance?.taskId ?? ''}\nForm id: ${instance?.formId ?? ''}`, err, info);
            lCore.trigger('error', instance?.taskId ?? 0, instance?.formId ?? 0, err, info + '(-3,' + instance?.taskId + ',' + instance?.formId + ')').catch(() => {});
        };
        // --- 挂载控件对象到 vapp ---
        for (const key in components) {
            vapp.component(key, components[key]);
        }
        try {
            vapp.mount(el);
        }
        catch (err: any) {
            notify({
                'title': 'Runtime Error',
                'content': `Message: ${err.message}\nTask id: ${t.id}\nForm id: ${formId}`,
                'type': 'danger'
            });
            console.error('Runtime Error [form.create.mount]', `Message: ${err.message}\nTask id: ${t.id}\nForm id: ${formId}`, err);
            lCore.trigger('error', t.id, formId, err, err.message).catch(() => {});
        }
    });
    // --- 创建 form 信息对象 ---
    const nform: IForm = {
        'id': formId,
        'vapp': rtn.vapp,
        'vroot': rtn.vroot,
        'closed': false
    };
    // --- 挂载 form ---
    t.forms[formId] = nform;
    // --- 执行 mounted ---
    await lTool.sleep(34);
    try {
        await frm.onMounted.call(rtn.vroot, data ?? {});
    }
    catch (err: any) {
        // --- 窗体创建失败，做垃圾回收 ---
        lCore.trigger('error', rtn.vroot.taskId, rtn.vroot.formId, err, 'Create form mounted error: -6.').catch(() => {});
        delete t.forms[formId];
        try {
            rtn.vapp.unmount();
        }
        catch (err: any) {
            const msg = `Message: ${err.message}\nTask id: ${t.id}\nForm id: ${formId}\nFunction: form.create, unmount.`;
            notify({
                'title': 'Form Unmount Error',
                'content': msg,
                'type': 'danger'
            });
            // console.log('Form Unmount Error', msg, err);
        }
        rtn.vapp._container.remove();
        elements.popList.querySelector('[data-form-id="' + rtn.vroot.formId + '"]')?.remove();
        lDom.clearWatchStyle(rtn.vroot.formId);
        lDom.clearWatchProperty(rtn.vroot.formId);
        lDom.clearWatchPosition(rtn.vroot.formId);
        lNative.clear(formId, t.id);
        // --- 移除 style ---
        lDom.removeStyle(rtn.vroot.taskId, 'form', rtn.vroot.formId);
        throw err;
    }
    // --- 触发 formCreated 事件 ---
    lCore.trigger('formCreated', t.id, formId, rtn.vroot.$refs.form.title, rtn.vroot.$refs.form.iconDataUrl, rtn.vroot.showInSystemTask).catch(() => {});
    // --- 若无边框，且是第一个窗体，则先设置一下实体窗体大小 ---
    if (rtn.vroot.isNativeNoFrameFirst) {
        await lNative.invokeSys(sysId, 'cg-set-size', rtn.vroot.$refs.form.$el.offsetWidth, rtn.vroot.$refs.form.$el.offsetHeight);
        // --- 然后监听外面窗体的大小来设置里面的窗体 ---
        window.addEventListener('resize', function(): void {
            rtn.vroot.$refs.form.setPropData('width', window.innerWidth);
            rtn.vroot.$refs.form.setPropData('height', window.innerHeight);
        });
    }
    // --- 完全创建完毕 ---
    rtn.vroot.isReady = true;
    for (const cb of cbs) {
        cb.call(rtn.vroot) as any;
    }
    return rtn.vroot as any;
}

/**
 * --- 显示一个 dialog ---
 * @param current 当前窗体 id
 * @param opt 选项或者一段文字
 */
export function dialog(current: lCore.TCurrent, opt: string | IFormDialogOptions): Promise<string> {
    return new Promise(function(resolve) {
        if (typeof current !== 'string') {
            current = current.taskId;
        }
        if (typeof opt === 'string') {
            opt = {
                'content': opt
            };
        }
        const filename = lTool.urlResolve(opt.path ?? '/', './tmp' + lTool.random(16, lTool.RANDOM_LN) + '.js');
        const nopt = opt;
        const t = lTask.getOrigin(current);
        if (!t) {
            resolve('');
            return;
        }
        const locale = t.locale.lang || lCore.config.locale;
        nopt.buttons ??= [info.locale[locale]?.ok ?? info.locale['en'].ok];
        const cls = class extends AbstractForm {
            public buttons = nopt.buttons;

            public data = nopt.data ?? {};

            public methods = nopt.methods ?? {};

            public get filename(): string {
                return filename;
            }

            public select(button: string): void {
                const event: IFormDialogSelectEvent = {
                    'go': true,
                    preventDefault: function() {
                        this.go = false;
                    },
                    'detail': {
                        'button': button
                    }
                };
                if (nopt.select) {
                    nopt.select.call(this, event, button);
                }
                if (event.go) {
                    if (nopt.autoDialogResult !== false) {
                        this.dialogResult = button;
                    }
                    close(this.formId);
                }
            }
        };
        create(current, cls, undefined, {
            'layout': `<form title="${nopt.title ?? 'dialog'}" min="false" max="false" resize="false" height="0" width="0" border="${nopt.title ? 'normal' : 'plain'}" direction="v"><dialog :buttons="buttons" @select="select"${nopt.direction ? ` direction="${nopt.direction}"` : ''}${nopt.gutter ? ` gutter="${nopt.gutter}"` : ''}>${nopt.content}</dialog></form>`,
            'style': nopt.style
        }).then((frm) => {
            if (typeof frm === 'number') {
                resolve('');
                return;
            }
            frm.showDialog().then((v) => {
                resolve(v);
            }).catch(() => {
                resolve('');
            });
        }).catch(() => {
            resolve('');
        });
    });
}

/**
 * --- 显示一个 confirm ---
 * @param current 当前任务 id
 * @param opt 选项或者一段文字
 */
export async function confirm(current: lCore.TCurrent, opt: string | IFormConfirmOptions): Promise<boolean | number> {
    if (typeof current !== 'string') {
        current = current.taskId;
    }
    if (typeof opt === 'string') {
        opt = {
            'content': opt
        };
    }
    const t = lTask.getOrigin(current);
    if (!t) {
        return false;
    }
    const locale = t.locale.lang || lCore.config.locale;
    const buttons = [info.locale[locale]?.no ?? info.locale['en'].no, info.locale[locale]?.yes ?? info.locale['en'].yes];
    if (opt.cancel) {
        buttons.unshift(info.locale[locale]?.cancel ?? info.locale['en'].cancel);
    }
    const res = await dialog(current, {
        'title': opt.title,
        'content': opt.content,
        'buttons': buttons,
    });
    if (res === (info.locale[locale]?.yes ?? info.locale['en'].yes)) {
        return true;
    }
    if (res === (info.locale[locale]?.cancel ?? info.locale['en'].cancel)) {
        return 0;
    }
    return false;
}

/**
 * --- 显示一个输入框 dialog ---
 * @param current 当前任务 id
 * @param opt 选项或者提示文字
 */
export async function prompt(current: lCore.TCurrent, opt: string | IFormPromptOptions): Promise<string> {
    if (typeof current !== 'string') {
        current = current.taskId;
    }
    if (typeof opt === 'string') {
        opt = {
            'content': opt
        };
    }
    const t = lTask.getOrigin(current);
    if (!t) {
        return '';
    }
    const locale = t.locale.lang || lCore.config.locale;
    const buttons = [info.locale[locale]?.ok ?? info.locale['en'].ok];
    const cancelBtn = info.locale[locale]?.cancel ?? info.locale['en'].cancel;
    if (opt.cancel === true || opt.cancel === undefined) {
        buttons.unshift(cancelBtn);
    }
    const res = await dialog(current, {
        'title': opt.title,
        'direction': 'v',
        'gutter': 10,
        'content': '<block>' + opt.content + '</block><text v-model="data.text" />',
        'data': {
            'text': opt.text ?? ''
        },
        'select': function(e: IFormDialogSelectEvent, button: string) {
            const isOk = button === (info.locale[locale]?.ok ?? info.locale['en'].ok);
            const event: IFormPromptSelectEvent = {
                'go': true,
                preventDefault: function() {
                    this.go = false;
                },
                'detail': {
                    'button': isOk,
                    'value': this.data.text
                },
            };
            opt.select?.call(this, event, isOk);
            if (!event.go) {
                e.preventDefault();
            }
            if (e.detail.button === cancelBtn) {
                this.dialogResult = '';
                return;
            }
            this.dialogResult = this.data.text;
        },
        'buttons': buttons,
        'autoDialogResult': false
    });
    return res;
}

/**
 * --- 让窗体闪烁 ---
 * @param taskId 所属的 taskId
 * @param formId 要闪烁的窗体 id，必填
 */
export async function flash(current: lCore.TCurrent, formId: string): Promise<void> {
    if (typeof current !== 'string') {
        current = current.taskId;
    }
    const form = getForm(current, formId);
    if (!form) {
        return;
    }
    if (!form.vroot._formFocus) {
        await changeFocus(form.id);
    }
    if (form.vroot.$refs.form.flashTimer) {
        clearTimeout(form.vroot.$refs.form.flashTimer);
        form.vroot.$refs.form.flashTimer = undefined;
    }
    form.vroot.$refs.form.flashTimer = setTimeout(() => {
        if (form.vroot.$refs.form) {
            form.vroot.$refs.form.flashTimer = undefined;
        }
    }, 1000);
    // --- 触发 formFlash 事件 ---
    await lCore.trigger('formFlash', current, formId);
}

/**
 * --- 显示 launcher 界面 ---
 */
export function showLauncher(): void {
    elements.launcher.style.display = 'flex';
    requestAnimationFrame(function() {
        elements.launcher.classList.add('cg-show');
    });
}

/**
 * --- 隐藏 launcher 界面 ---
 */
export function hideLauncher(): void {
    elements.launcher.classList.remove('cg-show');
    setTimeout(function() {
        if (launcherRoot.folderName !== '') {
            launcherRoot.closeFolder();
        }
        launcherRoot.name = '';
        elements.launcher.style.display = 'none';
    }, 300);
}

// --- 需要初始化 ---

let inited = false;
export function init(): void {
    if (inited) {
        return;
    }
    inited = true;
    elements.init();
}

// --- 类型 ---

/** --- AbstractPanel 显示事件 --- */
export interface IAbstractPanelShowEvent {
    'detail': {
        'data': Record<string, any>;
        /** --- 是否是 nav 模式 --- */
        'nav': boolean;
        /** --- 仅 nav 联动时有效，代表是前进还是回退 --- */
        'action': 'forword' | 'back';
        /** --- 仅 nav 联动时有效，代表上一个的 formHash 的值 --- */
        'previous': string;
        /** --- 仅 nav 联动时有效，代表本次 show 的时候 qs 是否发生了变化 --- */
        'qsChange': boolean;
    };
}

/** --- AbstractPanel qsChange 显示事件 --- */
export interface IAbstractPanelQsChangeShowEvent {
    'detail': {
        'data': Record<string, any>;
        /** --- 是否是 nav 模式 --- */
        'nav': boolean;
        /** --- 仅 nav 联动时有效，代表是前进还是回退 --- */
        'action': 'forword' | 'back';
        /** --- 仅 nav 联动时有效，代表上一个的 formHash 的值 --- */
        'previous': string;
        /** --- 仅 nav 联动时有效，代表本次 qs 是否发生了变化 --- */
        'qsChange': boolean;
    };
}

/** --- 运行时 task 中的 form 对象 --- */
export interface IForm {
    'id': string;
    'vapp': lCore.IVApp;
    'vroot': lCore.IVue;
    /** --- 是否已经执行过了关闭窗体方法，此处加判断为了防止重复执行 close 导致的 bug --- */
    'closed': boolean;
}

/** --- Form 的简略情况，通常在 list 当中 --- */
export interface IFormInfo {
    'taskId': string;
    'title': string;
    'icon': string;
    'stateMax': boolean;
    'stateMin': boolean;
    'show': boolean;
    'focus': boolean;
    'showInSystemTask': boolean;
}

/** --- 移动 drag 到新位置函数的选项 --- */
export interface IMoveDragOptions {
    'top'?: number;
    'left'?: number;
    'width'?: number;
    'height'?: number;
    'icon'?: boolean;
}

/** --- 弹出 notify 信息框的选项 --- */
export interface INotifyOptions {
    'title'?: string;
    /** --- 正文 --- */
    'content'?: string;
    /** --- 浅色描述 --- */
    'note'?: string;
    'icon'?: string | null;
    'timeout'?: number;
    'type'?: 'primary' | 'info' | 'warning' | 'danger' | 'progress';
    'progress'?: boolean;
}

/** --- notify 信息框的修改选项 --- */
export interface INotifyContentOptions {
    'title'?: string;
    'content'?: string;
    'note'?: string;
    /** --- 可顺便修改进度 --- */
    'progress'?: number;
    /** --- 设置后将在 x 毫秒后隐藏，这不会大于创建时的设置的总时长 --- */
    'timeout'?: number;
}

/** --- Dialog 选项 --- */
export interface IFormDialogOptions {
    'title'?: string;
    'content': string;
    'buttons'?: string[];
    'autoDialogResult'?: boolean;

    'direction'?: 'h' | 'v';
    'gutter'?: number | string;

    /** --- 传值，需要用 data.x 读取 --- */
    'data'?: Record<string, any>;
    /** --- 传值，需要用 methods.x 读取 --- */
    'methods'?: Record<string, (...param: any) => any>;
    /** --- 样式表 --- */
    'style'?: string;
    /** --- 路径基，以 / 结束或文件路径则以文件的基路径为准，可留空 --- */
    'path'?: string;

    /**
     * --- 点击按钮触发事件 ---
     * @param e 数据事件
     * @param button 按钮的文本
     */
    'select'?: (
        this: AbstractForm & { 'data': Record<string, any>; 'methods': Record<string, (...param: any) => any>; },
        e: IFormDialogSelectEvent,
        button: string
    ) => void;
}

export interface IFormDialogSelectEvent extends lControl.ICustomEvent {
    'detail': {
        'button': string;
    };
}

/** --- Confirm 选项 --- */
export interface IFormConfirmOptions {
    'title'?: string;
    'content': string;
    'cancel'?: boolean;
}

/** --- Prompt 选项 --- */
export interface IFormPromptOptions {
    /** --- 标题 --- */
    'title'?: string;
    /** --- 内容说明 --- */
    'content': string;
    /** --- 文本默认值 --- */
    'text'?: string;
    /** --- 是否显示取消按钮，默认显示 --- */
    'cancel'?: boolean;

    /**
     * --- 点击按钮触发事件 ---
     * @param e 数据事件
     * @param button true 代表确定，false 代表取消
     */
    'select'?: (
        this: AbstractForm & { 'data': Record<string, any>; },
        e: IFormPromptSelectEvent,
        button: boolean
    ) => void;
}

export interface IFormPromptSelectEvent extends lControl.ICustomEvent {
    'detail': {
        /** --- true 代表确定，false 代表取消 --- */
        'button': boolean;
        'value': string;
    };
}

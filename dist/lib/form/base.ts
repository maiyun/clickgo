import * as clickgo from '../../clickgo';
import * as lCore from '../core';
import * as lTask from '../task';
import * as lTool from '../tool';
import * as lControl from '../control';
import { AbstractComponent } from './abstract-component';
import { notify } from './notification';
import { send } from './window';

/** --- Panel 与 Form 共用的抽象类 --- */
export abstract class AbstractCommon {

    /** --- 当前视图内局部注册的应用组件 --- */
    public readonly components: Record<string, new () => AbstractComponent> = {};

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

    /** --- 当前语言的标准 HTML lang 标签 --- */
    public get localeTag(): string {
        return lTool.lang.getTag(this.locale);
    }

    /** --- 当前语言的书写方向 --- */
    public get localeDirection(): 'ltr' | 'rtl' {
        return lTool.lang.getDirection(this.locale);
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
    public allowEvent(e: PointerEvent | KeyboardEvent): boolean {
        return clickgo.modules.pointer.allowEvent(e);
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

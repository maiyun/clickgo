import * as lTool from '../tool';
import * as lControl from '../control';
import { AbstractCommon } from './base';
import { AbstractForm } from './abstract-form';
import { notify } from './notification';

/** --- Form/Panel 内使用的应用局部组件抽象类 --- */
export abstract class AbstractComponent extends AbstractCommon {

    /** --- 当前组件内继续局部注册的应用组件 --- */
    public readonly components: Record<string, new () => AbstractComponent> = {};

    /** --- 当前组件所在窗体的创建序号 --- */
    public get findex(): number {
        return 0;
    }

    /** --- 当前组件所在窗体的窗体对象 --- */
    private _rootForm: (AbstractForm & Record<string, any>) | null = null;

    public get rootForm(): AbstractForm & Record<string, any> {
        if (!this._rootForm) {
            this._rootForm = this.parentByName('root') as AbstractForm & Record<string, any>;
            if (!this._rootForm) {
                notify({
                    'title': 'Error',
                    'content': `The "rootForm" is not ready yet.\nComponent: "${this.controlName}".`,
                    'type': 'danger'
                });
            }
        }
        return this._rootForm;
    }

    /** --- 当前组件是否跟随宿主窗体获得焦点 --- */
    public get formFocus(): boolean {
        return this.rootForm?.formFocus ?? false;
    }

    /** --- 获取宿主 Form/Panel 的语言内容 --- */
    public override get l(): (key: string, data?: string[]) => string {
        return (key: string, data?: string[]): string => {
            return this.rootForm.l(key, data);
        };
    }

    /** --- 获取宿主窗体语言内容 --- */
    public get fl(): (key: string, data?: string[]) => string {
        return (key: string, data?: string[]): string => {
            if (!key.startsWith('l:')) {
                return key;
            }
            return this.rootForm.l(key.slice(2), data, true);
        };
    }

    /** --- 应用组件动态 class 的隔离前缀 --- */
    public override get classPrepend(): (cla: any) => string {
        return (cla: any): string => {
            if (typeof cla !== 'string') {
                return cla;
            }
            return `cg-task${this.taskId}_${cla}${this.prep ? (' ' + this.prep + cla) : ''}`;
        };
    }

    /** --- 组件内部文件，由系统重写 --- */
    public readonly packageFiles: Record<string, Blob | string> = {};

    /** --- 组件参数，由用户定义重写 --- */
    public readonly props = {};

    /** --- 组件事件，由用户定义重写 --- */
    public readonly emits: Record<string, null | ((payload: any) => boolean)> = {};

    /** --- 组件的子插槽 --- */
    public readonly slots: Record<string, () => any[]> = {};

    /** --- 获取某插槽所有子项 --- */
    public get slotsAll(): (name: string) => any[] {
        return (name: string): any[] => {
            if (!this.slots[name]) {
                return [];
            }
            const rtn: any[] = [];
            for (const slot of this.slots[name]()) {
                if (slot.props) {
                    rtn.push(slot);
                    continue;
                }
                if ((typeof slot.children !== 'string') && slot.children.length) {
                    rtn.push(...slot.children);
                }
            }
            return rtn;
        };
    }

    /** --- 获取 props 中的 boolean 类型值 --- */
    public get propBoolean(): (name: keyof this['props']) => boolean {
        return (name: keyof this['props']): boolean => lTool.getBoolean((this.props as any)[name]);
    }

    /** --- 获取 props 中的 number 类型值 --- */
    public get propNumber(): (name: keyof this['props']) => number {
        return (name: keyof this['props']): number => lTool.getNumber((this.props as any)[name]);
    }

    /** --- 获取 props 中的 int 类型值 --- */
    public get propInt(): (name: keyof this['props']) => number {
        return (name: keyof this['props']): number => Math.round(this.propNumber(name));
    }

    /** --- 获取 props 中的 array 类型值 --- */
    public get propArray(): (name: keyof this['props']) => any[] {
        return (name: keyof this['props']): any[] => lTool.getArray((this.props as any)[name]);
    }

    /** --- 向上触发组件事件 --- */
    public emit(name: string, ...v: any[]): void {
        (this as any).$emit(name, ...v);
    }

    /** --- 获取上层控件或组件 --- */
    public get parent(): lControl.AbstractControl & AbstractComponent & AbstractForm & Record<string, any> {
        return (this as any).$parent;
    }

    /** --- 根据 controlName 查询上层对象 --- */
    public get parentByName(): (controlName: string) => Record<string, any> | null {
        return (controlName: string): Record<string, any> | null => {
            let parent = (this as any).$parent;
            while (parent) {
                if (parent.controlName === controlName) {
                    return parent;
                }
                parent = parent.$parent;
            }
            return null;
        };
    }

    /** --- 根据 access 查询上层对象 --- */
    public get parentByAccess(): (name: string, val: string) => Record<string, any> | null {
        return (name: string, val: string): Record<string, any> | null => {
            let parent = (this as any).$parent;
            while (parent) {
                if (parent.access?.[name] === val) {
                    return parent;
                }
                parent = parent.$parent;
            }
            return null;
        };
    }

    /** --- 组件挂载好后触发 --- */
    public onMounted(): void | Promise<void> {
        return;
    }

}

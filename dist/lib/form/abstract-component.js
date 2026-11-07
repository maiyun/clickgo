import * as lTool from '../tool';
import { AbstractCommon } from './base';
import { notify } from './notification';
/** --- Form/Panel 内使用的应用局部组件抽象类 --- */
export class AbstractComponent extends AbstractCommon {
    /** --- 当前组件内继续局部注册的应用组件 --- */
    components = {};
    /** --- 当前组件所在窗体的创建序号 --- */
    get findex() {
        return 0;
    }
    /** --- 当前组件所在窗体的窗体对象 --- */
    _rootForm = null;
    get rootForm() {
        if (!this._rootForm) {
            this._rootForm = this.parentByName('root');
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
    get formFocus() {
        return this.rootForm?.formFocus ?? false;
    }
    /** --- 获取宿主 Form/Panel 的语言内容 --- */
    get l() {
        return (key, data) => {
            return this.rootForm.l(key, data);
        };
    }
    /** --- 获取宿主窗体语言内容 --- */
    get fl() {
        return (key, data) => {
            if (!key.startsWith('l:')) {
                return key;
            }
            return this.rootForm.l(key.slice(2), data, true);
        };
    }
    /** --- 应用组件动态 class 的隔离前缀 --- */
    get classPrepend() {
        return (cla) => {
            if (typeof cla !== 'string') {
                return cla;
            }
            return `cg-task${this.taskId}_${cla}${this.prep ? (' ' + this.prep + cla) : ''}`;
        };
    }
    /** --- 组件内部文件，由系统重写 --- */
    packageFiles = {};
    /** --- 组件参数，由用户定义重写 --- */
    props = {};
    /** --- 组件事件，由用户定义重写 --- */
    emits = {};
    /** --- 组件的子插槽 --- */
    slots = {};
    /** --- 获取某插槽所有子项 --- */
    get slotsAll() {
        return (name) => {
            if (!this.slots[name]) {
                return [];
            }
            const rtn = [];
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
    get propBoolean() {
        return (name) => lTool.getBoolean(this.props[name]);
    }
    /** --- 获取 props 中的 number 类型值 --- */
    get propNumber() {
        return (name) => lTool.getNumber(this.props[name]);
    }
    /** --- 获取 props 中的 int 类型值 --- */
    get propInt() {
        return (name) => Math.round(this.propNumber(name));
    }
    /** --- 获取 props 中的 array 类型值 --- */
    get propArray() {
        return (name) => lTool.getArray(this.props[name]);
    }
    /** --- 向上触发组件事件 --- */
    emit(name, ...v) {
        this.$emit(name, ...v);
    }
    /** --- 获取上层控件或组件 --- */
    get parent() {
        return this.$parent;
    }
    /** --- 根据 controlName 查询上层对象 --- */
    get parentByName() {
        return (controlName) => {
            let parent = this.$parent;
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
    get parentByAccess() {
        return (name, val) => {
            let parent = this.$parent;
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
    onMounted() {
        return;
    }
}

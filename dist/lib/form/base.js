import * as clickgo from '../../clickgo';
import * as lCore from '../core';
import * as lTask from '../task';
import * as lTool from '../tool';
import { notify } from './notification';
import { send } from './window';
/** --- Panel 与 Form 共用的抽象类 --- */
export class AbstractCommon {
    /** --- 当前视图内局部注册的应用组件 --- */
    components = {};
    /** --- 当前文件在包内的路径 --- */
    get filename() {
        // --- pack 时系统自动在继承类中重写本函数 ---
        return '';
    }
    /** --- 当前控件的名字 --- */
    get controlName() {
        return 'root';
    }
    set controlName(v) {
        notify({
            'title': 'Error',
            'content': `The software tries to modify the system variable "controlName".\nPath: ${this.path}`,
            'type': 'danger'
        });
        return;
    }
    /** --- 当前的任务 ID --- */
    get taskId() {
        // --- 窗体创建时继承时重写本函数 ---
        return '';
    }
    /** --- 当前的窗体 ID --- */
    get formId() {
        // --- 窗体创建时 create 系统自动重写本函数 ---
        return '';
    }
    set formFocus(b) {
        notify({
            'title': 'Error',
            'content': `The software tries to modify the system variable "formFocus".\nPath: ${this.path}`,
            'type': 'danger'
        });
    }
    /** --- 当前文件的包内路径不以 / 结尾 --- */
    get path() {
        // --- 将在初始化时系统自动重写本函数 ---
        return '';
    }
    /** --- 样式独占前缀 --- */
    get prep() {
        // --- 将在初始化时系统自动重写本函数 ---
        return '';
    }
    /** --- 当前的语言 --- */
    get locale() {
        const task = lTask.getOrigin(this.taskId);
        return lTool.logicalOr(task?.locale.lang ?? '', lCore.config.locale);
    }
    /** --- 当前语言的标准 HTML lang 标签 --- */
    get localeTag() {
        return lTool.lang.getTag(this.locale);
    }
    /** --- 当前语言的书写方向 --- */
    get localeDirection() {
        return lTool.lang.getDirection(this.locale);
    }
    /**
     * --- 获取语言内容 ---
     */
    get l() {
        const task = lTask.getOrigin(this.taskId);
        return (key, data, origin = false) => {
            const loc = task?.locale.data[this.locale]?.[key] ?? task?.locale.data['en']?.[key] ?? (origin ? '' : '[LocaleError]') + key;
            if (!data) {
                return loc;
            }
            let i = -1;
            return loc.replace(/\?/g, function () {
                ++i;
                if (!data[i]) {
                    return '';
                }
                return data[i];
            });
        };
    }
    /** --- layout 中 :class 的转义 --- */
    get classPrepend() {
        return (cla) => {
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
    watch(name, cb, opt = {}) {
        return this.$watch(name, cb, opt);
    }
    /**
     * --- 获取 refs 情况 ---
     */
    get refs() {
        return this.$refs;
    }
    /** --- 获取当前的 HTML DOM --- */
    get element() {
        return this.$el;
    }
    /**
     * --- 等待渲染 ---
     */
    get nextTick() {
        return this.$nextTick;
    }
    /**
     * --- 判断当前事件可否执行 ---
     * @param e 鼠标、触摸、键盘事件
     */
    allowEvent(e) {
        return clickgo.modules.pointer.allowEvent(e);
    }
    /**
     * --- 触发系统方法 ---
     * @param name 方法名
     * @param param1 参数1
     * @param param2 参数2
     */
    async trigger(name, param1 = '', param2 = '') {
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
    send(fid, obj) {
        obj.taskId = this.taskId;
        obj.formId = this.formId;
        send(fid, obj);
    }
    // --- 控件响应事件，都可由用户重写 ---
    onBeforeCreate() {
        return;
    }
    onCreated() {
        return;
    }
    onBeforeMount() {
        return;
    }
    onBeforeUpdate() {
        return;
    }
    onUpdated() {
        return;
    }
    onBeforeUnmount() {
        return;
    }
    onUnmounted() {
        return;
    }
}

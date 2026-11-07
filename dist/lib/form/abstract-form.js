import * as lCore from '../core';
import * as lTask from '../task';
import { AbstractCommon } from './base';
import { confirm } from './dialog';
import { info, state } from './state';
import { changeFocus, close } from './window';
/** --- 窗体的抽象类 --- */
export class AbstractForm extends AbstractCommon {
    onNativeLaunch() {
        return;
    }
    onNativeOpenFiles() {
        return;
    }
    // --- 以下为窗体有，但 control 没有 ---
    /** --- 当前是否完全创建完毕 --- */
    isReady = false;
    /** --- 是否是 native 下无边框的第一个窗体 --- */
    isNativeNoFrameFirst = false;
    /** --- 当前的窗体创建的位数 --- */
    get findex() {
        // --- 窗体创建时继承时重写本函数 ---
        return 0;
    }
    /** --- 获取 form 的 hash 值，不是浏览器的 hash --- */
    get formHash() {
        return '';
    }
    set formHash(v) {
        // --- 会进行重写 ---
    }
    /** --- 获取 form 的 formhash with data 值 --- */
    get formHashData() {
        return {};
    }
    set formHashData(v) {
        // --- 会进行重写 ---
    }
    /** --- 是否是置顶 --- */
    get topMost() {
        // --- 将在初始化时系统自动重写本函数 ---
        return false;
    }
    set topMost(v) {
        // --- 会进行重写 ---
    }
    /** --- 是否是置底 --- */
    get bottomMost() {
        // --- 将在初始化时系统自动重写本函数 ---
        return false;
    }
    set bottomMost(v) {
        // --- 会进行重写 ---
    }
    /**
     * --- 是否在本窗体上显示遮罩层 ---
     */
    get isMask() {
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
    get formFocus() {
        // --- _formFocus 在初始化时由系统设置 ---
        return this._formFocus;
    }
    /** --- 当前窗体是否显示在任务栏 --- */
    get showInSystemTask() {
        // --- 将在初始化时系统自动重写本函数 ---
        return false;
    }
    set showInSystemTask(v) {
        // --- 会进行重写 ---
    }
    /** --- 将在 form 完全装载完后执行，如果已经装载完则立即执行 --- */
    ready(cb) {
        // --- 会进行重写 ---
        cb();
    }
    /** --- form hash 回退 --- */
    async formHashBack() {
        const v = this;
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
    sendToPanel(panel, data) {
        panel.send(data);
    }
    /** --- 覆盖整个窗体的 loading（实际值） --- */
    _loading = false;
    /** --- 覆盖整个窗体的 loading --- */
    get loading() {
        return this._loading;
    }
    set loading(val) {
        if (this.lockLoading) {
            return;
        }
        this._loading = val;
    }
    /** --- 是否阻止任何人修改 loading --- */
    lockLoading = false;
    // --- step 相关 ---
    _inStep = false;
    /** --- 当前是否在 step 环节中 --- */
    get inStep() {
        return this._inStep;
    }
    /** --- 序列化后的 step value 值 --- */
    _stepValues = [];
    /** --- 进入 form hash 为源的步进条 --- */
    async enterStep(list) {
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
    updateStep(index, value) {
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
    async doneStep() {
        if (!this._inStep) {
            return;
        }
        this._inStep = false;
        await this.refs.form.stepDone();
    }
    /** --- 当前是不是初次显示 --- */
    _firstShow = true;
    /**
     * --- 显示窗体 ---
     */
    async show() {
        // --- 创建成功的窗体，可以直接显示 ---
        if (this._firstShow) {
            this._firstShow = false;
            // --- 将窗体居中 ---
            const area = this.refs.form.getArea();
            if (!this.refs.form.stateMaxData) {
                if (this.refs.form.left === -1) {
                    this.refs.form.setPropData('left', area.left + (area.width - this.element.offsetWidth) / 2);
                }
                if (this.refs.form.top === -1) {
                    this.refs.form.setPropData('top', area.top + (area.height - this.element.offsetHeight) / 2);
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
    async showDialog() {
        if (!lTask.getOrigin(this.taskId)) {
            return '';
        }
        const runtime = lTask.getRuntime(state.sysId, this.taskId);
        if (!runtime) {
            return '';
        }
        runtime.dialogFormIds.push(this.formId);
        await this.show();
        this.topMost = true;
        return new Promise(resolve => {
            this.cgDialogCallback = () => {
                resolve(this.dialogResult);
            };
        });
    }
    /**
     * --- 让窗体隐藏 ---
     */
    hide() {
        const v = this;
        v.$refs.form.$data.isShow = false;
    }
    /**
     * --- 关闭当前窗体 ---
     */
    close() {
        close(this.formId);
    }
    /**
     * --- dialog mask 窗体返回值，在 close 之后会进行传导 ---
     */
    dialogResult = '';
    onMounted() {
        return;
    }
    onReceive() {
        return;
    }
    onActiveChanged() {
        return;
    }
    onScreenResize() {
        return;
    }
    onConfigChanged() {
        return;
    }
    onFormCreated() {
        return;
    }
    onFormRemoved() {
        return;
    }
    onFormTitleChanged() {
        return;
    }
    onFormIconChanged() {
        return;
    }
    onFormStateMinChanged() {
        return;
    }
    onFormStateMaxChanged() {
        return;
    }
    onFormShowChanged() {
        return;
    }
    onFormFocused() {
        return;
    }
    onFormBlurred() {
        return;
    }
    onFormFlash() {
        return;
    }
    onFormShowInSystemTaskChange() {
        return;
    }
    onFormHashChange() {
        return;
    }
    onTrayCreated() {
        return;
    }
    onTrayChanged() {
        return;
    }
    onTrayRemoved() {
        return;
    }
    onTrayClick() {
        return;
    }
    onTrayMenuClick() {
        return;
    }
    onTaskStarted() {
        return;
    }
    onTaskEnded() {
        return;
    }
    onWebMcpStatusChanged() {
        return;
    }
    onLauncherShowChanged() {
        return;
    }
    onLauncherFolderNameChanged() {
        return;
    }
    onHashChanged() {
        return;
    }
    onKeydown() {
        return;
    }
    onKeyup() {
        return;
    }
}

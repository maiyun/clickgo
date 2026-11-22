import * as lCore from '../core';
import * as lTask from '../task';
import { AbstractCommon } from './base';
import { confirm } from './dialog';
import { info, nextZIndex, state } from './state';
import { hideForm } from './remove';
import { beginFocusRequest, changeFocus, close, shouldFocusOnShow } from './window';
/** --- 标记置顶层；调用方决定是否同时激活窗体 --- */
export function setTopMostLayer(root) {
    root._topMost = true;
    if (root._bottomMost) {
        root._bottomMost = false;
        root.$el.removeAttribute('data-cg-bottom-most');
    }
}
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
    /** --- 每次隐藏时递增，阻止上一次尚未完成的显示继续执行 --- */
    _showGeneration = 0;
    /** --- 上次自动居中的坐标，首次显示前未记录 --- */
    _autoPosition;
    /**
     * --- 按更新后的布局显示窗体，重新计算仍采用自动定位的坐标 ---
     */
    async show() {
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
                const position = {};
                const area = control.getArea();
                for (const axis of ['left', 'top']) {
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
    async showDialog() {
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
        let resolve;
        const result = new Promise((res) => {
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
            const activate = () => {
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
    hide() {
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
    close() {
        close(this.formId);
    }
    /**
     * --- 本轮模态返回值，每次开始 showDialog 时清空，hide 或 close 时返回 ---
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

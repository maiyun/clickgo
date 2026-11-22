import * as lCore from '../core';
import * as lTask from '../task';
import * as lDom from '../dom';
import { remove } from './remove';
import { elements } from './system';
import { nextZIndex, state } from './state';
/**
 * --- 修改窗体的最大化、最小化状态，外部或不可调整 state 时才调用 ---
 * @param state 最大化、最小化或关闭
 * @param formId 窗体 id
 */
function changeState(state, formId) {
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
export function min(formId) {
    return changeState('min', formId);
}
/**
 * --- 最大化某个窗体 ---
 * @param formId 窗体 id
 */
export function max(formId) {
    return changeState('max', formId);
}
/**
 * --- 关闭一个窗体 ---
 * @param formId 窗体 id
 */
export function close(formId) {
    return changeState('close', formId);
}
/**
 * --- 绑定窗体拖动大小事件，在 pointerdown 中绑定 ---
 * @param e 事件源
 * @param border 调整大小的方位
 */
export function bindResize(e, border) {
    const formWrap = lDom.findParentByClass(e.target, 'cg-form-wrap');
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
 * --- 绑定窗体拖动事件，在 pointerdown 中绑定 ---
 * @param e 事件源
 */
export function bindDrag(e) {
    const formWrap = lDom.findParentByClass(e.target, 'cg-form-wrap');
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
export function refreshMaxPosition() {
    for (let i = 0; i < elements.list.children.length; ++i) {
        const el = elements.list.children.item(i);
        const ef = el.children.item(0);
        if (ef?.dataset.cgMax === undefined) {
            continue;
        }
        const taskId = el.getAttribute('data-task-id');
        const formId = el.getAttribute('data-form-id');
        const task = lTask.getOrigin(taskId);
        const form = task?.forms[formId];
        if (!form || form.closed) {
            continue;
        }
        const vroot = form.vroot;
        vroot.$refs.form.refreshMaxPosition();
    }
}
/**
 * --- 根据窗体 id 获取 task id ---
 * @param formId 窗体 id
 */
export function getTaskId(formId) {
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
export function get(formId) {
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
export function send(formId, obj) {
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
export function getList(taskId) {
    if (typeof taskId !== 'string') {
        taskId = taskId.taskId;
    }
    const task = lTask.getOrigin(taskId);
    if (!task) {
        return {};
    }
    const list = {};
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
export function getFocus() {
    return state.focusId;
}
/**
 * --- 当前活跃中的 panelId 列表 ---
 */
export const activePanels = {};
/**
 * --- 获取窗体当前活跃中的 panelId 列表 ---
 * @param formId 要获取的窗体 id
 */
export function getActivePanel(formId) {
    return activePanels[formId] ?? [];
}
/**
 * --- 移除 form 中正在活跃中的 panel id （panel 本身被置于隐藏时）
 * @param current 当前任务 id
 * @param formId 所属 form id
 * @param panelId panel id
 */
export function removeActivePanel(current, formId, panelId) {
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
export function setActivePanel(current, formId, panelId) {
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
export function hash(formId, hash) {
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
export function getHash(formId) {
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
export async function hashBack(formId) {
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
/** --- 点击窗体外部前持有焦点的模态窗体，可在退出时交还焦点 --- */
let blurredModalId = null;
/** --- 尚在等待布局的模态窗体，外部点击时由它负责在退出后交还焦点 --- */
let pendingModalId = null;
/** --- 后来的请求可使尚未完成的激活失效 --- */
let focusRevision = 0;
/** --- 自动交接没有候选窗体时，允许正在显示的窗体随后接管 --- */
let waitingForVisibleForm = false;
/** --- 记录显示开始时的焦点选择，异步布局结束后可检查用户是否已切换 --- */
export function beginFocusRequest(modalId) {
    pendingModalId = modalId ?? null;
    waitingForVisibleForm = false;
    return ++focusRevision;
}
/** --- 已退出的窗体没有可用的接替者时，允许随后完成显示的窗体接管 --- */
export function shouldFocusOnShow(revision) {
    return revision === focusRevision || waitingForVisibleForm;
}
/** --- 撤下当前焦点；点击窗体外部时，记住仍可交还焦点的模态窗体 --- */
function blurFocus(outside) {
    const previousId = getFocus();
    const taskId = previousId ? getTaskId(previousId) : '';
    const previous = previousId ? getForm(taskId, previousId) : null;
    if (!outside) {
        blurredModalId = null;
    }
    else if (pendingModalId || previousId) {
        blurredModalId = pendingModalId ?? (previous?.dialog ? previousId : null);
    }
    pendingModalId = null;
    if (previous) {
        previous.vapp._container.removeAttribute('data-form-focus');
        previous.vroot._formFocus = false;
        lCore.trigger('formBlurred', taskId, previous.id).catch(() => { });
    }
    state.focusId = null;
    lTask.setFocus();
}
/** --- 自动交接要求窗体已显示且未最小化；主动激活也可还原窗体、选中等待布局的顶层模态 --- */
function getFocusCandidate(task, formId, activate = false, modalId) {
    const form = task?.forms[formId];
    const control = form?.vroot.$refs.form;
    if (!form || form.closed || task.ending || !control) {
        return null;
    }
    if (activate) {
        return control.$data.isShow || formId === modalId ? form : null;
    }
    return control.$data.isShow && !control.stateMinData ? form : null;
}
/** --- 只有原窗体仍可选时，才将焦点转给同任务的顶层模态 --- */
function getFocusTarget(task, formId, activate = false) {
    const runtime = task && lTask.getRuntime(state.sysId, task.id);
    if (!runtime) {
        return null;
    }
    const modalId = runtime.dialogFormIds.at(-1);
    const requested = getFocusCandidate(task, formId, activate, modalId);
    if (requested && modalId && modalId !== formId) {
        return getFocusCandidate(task, modalId, activate, modalId);
    }
    return requested;
}
/** --- 阻止还原事件回调再次还原同一个窗体 --- */
const restoringForms = new Set();
/**
 * --- 将键盘焦点和任务焦点切换到目标窗体 ---
 * @param formId 变更后的 form id
 * @param mode activate 主动激活并提到本层最前，restore 在现有可见窗体之间恢复焦点
 */
export async function changeFocus(formId = '', mode = 'activate') {
    if (!formId) {
        ++focusRevision;
        waitingForVisibleForm = mode === 'restore';
        blurFocus(mode === 'activate');
        return;
    }
    const taskId = getTaskId(formId);
    const task = lTask.getOrigin(taskId);
    const requested = task?.forms[formId];
    const activate = mode === 'activate';
    const target = getFocusTarget(task, formId, activate);
    if (!requested || !target || restoringForms.has(requested) || restoringForms.has(target)) {
        return;
    }
    const revision = beginFocusRequest();
    for (const form of [requested, target]) {
        if (!form.vroot.$refs.form.stateMinData) {
            continue;
        }
        // --- 还原会同步调用应用的 min 监听器，它可以关闭窗体、打开模态或选择别的焦点 ---
        restoringForms.add(form);
        try {
            form.vroot.$refs.form.minMethod();
        }
        finally {
            restoringForms.delete(form);
        }
        if (revision !== focusRevision || getFocusTarget(task, formId, activate) !== target
            || form.vroot.$refs.form.stateMinData) {
            return;
        }
    }
    const targetId = target.id;
    const control = target.vroot.$refs.form;
    if (targetId !== getFocus()) {
        blurFocus(false);
        if (mode === 'restore') {
            restoreStackOrder(target);
        }
        else {
            control.$data.zIndex = nextZIndex(target.vroot._topMost, target.vroot._bottomMost);
        }
        target.vapp._container.dataset.formFocus = '';
        target.vroot._formFocus = true;
        state.focusId = targetId;
        lTask.setFocus(taskId);
        lCore.trigger('formFocused', taskId, targetId).catch(() => { });
    }
    if (targetId !== formId) {
        await flash(taskId, targetId);
    }
}
/** --- 枚举可接收焦点的已显示窗体，读取运行时状态以包含尚未渲染的变化 --- */
function* visibleForms(unmaskedOnly = false) {
    for (const element of elements.list.children) {
        const { taskId, formId } = element.dataset;
        if (!taskId || !formId || taskId === lTask.systemTaskInfo.taskId) {
            continue;
        }
        const task = lTask.getOrigin(taskId);
        const form = unmaskedOnly ? getFocusTarget(task, formId) : getFocusCandidate(task, formId);
        if (form?.id === formId) {
            yield form;
        }
    }
}
/** --- 仅当同层可见窗体挡在目标前方时调整顺序，退场窗体保留原来的位置 --- */
function restoreStackOrder(target) {
    const root = target.vroot;
    const control = root.$refs.form.$data;
    const above = [];
    for (const form of visibleForms()) {
        const peer = form.vroot;
        if (Boolean(peer._topMost) === Boolean(root._topMost) && Boolean(peer._bottomMost) === Boolean(root._bottomMost)
            && peer.$refs.form.$data.zIndex > control.zIndex) {
            above.push(peer.$refs.form.$data);
        }
    }
    // --- 只轮换这些窗体已经占用的位置，其余窗体之间的顺序保持不变 ---
    above.sort((a, b) => a.zIndex - b.zIndex);
    for (const peer of above) {
        const next = peer.zIndex;
        peer.zIndex = control.zIndex;
        control.zIndex = next;
    }
}
/**
 * --- 获取可见且未置底的窗体中 z-index 最大的 form id ---
 * @param current 当前任务 id
 * @param out 排除选项
 */
export async function getMaxZIndexID(current, out = {}) {
    if (typeof current !== 'string') {
        current = current.taskId;
    }
    if (!(await lTask.checkPermission(current, 'root'))[0]) {
        return null;
    }
    return findMaxZIndexID(out);
}
/** --- 从可见窗体中选择下一焦点，跳过正在关闭或已隐藏的窗体 --- */
function findMaxZIndexID(out, restore) {
    let highest = 0;
    let id = null;
    for (const form of visibleForms(restore !== undefined)) {
        if ((restore !== 'includeBottom' && form.vroot._bottomMost) || out.formIds?.includes(form.id)
            || out.taskIds?.includes(form.vroot.taskId)) {
            continue;
        }
        const z = form.vroot.$refs.form.$data.zIndex;
        if (z > highest) {
            highest = z;
            id = form.id;
        }
    }
    return id;
}
/** --- 窗体退出后恢复焦点，优先返回上一层模态或打开前的可见窗体 --- */
export function restoreFocusAfterHide(formId, parent, previous) {
    if (pendingModalId === formId) {
        pendingModalId = null;
    }
    if ((state.focusId ?? blurredModalId) !== formId) {
        return;
    }
    for (const ownerId of [parent, previous]) {
        const owner = ownerId && getFocusTarget(lTask.getOrigin(getTaskId(ownerId)), ownerId);
        if (owner) {
            changeFocus(owner.id, 'restore').catch(() => { });
            return;
        }
    }
    const next = findMaxZIndexID({}, 'includeBottom');
    changeFocus(next ?? undefined, 'restore').catch(() => { });
}
/** --- 退出的任务持有窗体焦点时，将焦点交给其他任务中最靠前的窗体 --- */
export function restoreFocusAfterTaskEnd(taskId) {
    if (pendingModalId && getTaskId(pendingModalId) === taskId) {
        pendingModalId = null;
    }
    const focus = state.focusId ?? blurredModalId;
    if (!focus || getTaskId(focus) !== taskId) {
        return;
    }
    const next = findMaxZIndexID({}, 'normal');
    changeFocus(next ?? undefined, 'restore').catch(() => { });
}
/**
 * --- 让最大的 z index 窗体获取焦点（不含 top 和最小化的） ---
 */
export async function changeFocusMaxZIndex() {
    const formId = findMaxZIndexID({}, 'normal');
    if (formId) {
        await changeFocus(formId, 'restore');
    }
    else if (state.focusId && getForm(getTaskId(state.focusId), state.focusId)?.vroot.$refs.form.stateMinData) {
        await changeFocus(undefined, 'restore');
    }
}
/**
 * --- 根据任务 id 和 form id 获取 IForm 对象 ---
 * @param taskId 任务 id
 * @param formId 窗体 id
 */
export function getForm(taskId, formId) {
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
 * --- 让窗体闪烁 ---
 * @param current 所属的 taskId
 * @param formId 要闪烁的窗体 id，必填
 */
export async function flash(current, formId) {
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

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
import * as lCore from '../core';
import * as lCommand from '../command';
import * as lTask from '../task';
import * as lDom from '../dom';
import * as lControl from '../control';
import * as lNative from '../native';
import { state } from './state';
import { elements } from './system';
import { getTaskId, getMaxZIndexID, changeFocus, activePanels } from './window';
import { cleanupPop } from './popup';

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
    const rt = lTask.getRuntime(state.sysId, taskId);
    if (!rt) {
        return false;
    }
    task.forms[formId].closed = true;
    // --- 关闭动画开始即撤销命令，不等 DOM 延迟卸载 ---
    lCommand.clearOwner(taskId, formId);
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
            const fid = await getMaxZIndexID(state.sysId, {
                'formIds': [formId],
            });
            if (fid) {
                await changeFocus(fid);
            }
            else {
                await changeFocus();
            }
            // --- 等待关闭动画后清理窗体 ---
            const task = lTask.getOrigin(taskId);
            if (!task) {
                // --- 可能这时候 task 已经被结束了 ---
                return true;
            }
            if (!task.forms[formId]) {
                return;
            }
            cleanupPop(task.forms[formId].vapp._container);
            const popElement = elements.popList.querySelector<HTMLElement>('[data-form-id="' + formId + '"]');
            if (popElement) {
                cleanupPop(popElement);
            }
            task.forms[formId].vapp.unmount();
            task.forms[formId].vapp._container.remove();
            popElement?.remove();
            if (io > -1) {
                // --- 如果是 dialog 则要执行回调 ---
                task.forms[formId].vroot.cgDialogCallback();
            }
            delete task.forms[formId];
            if ((lTask.systemTaskInfo.taskId === taskId) && (lTask.systemTaskInfo.formId === formId)) {
                await lTask.clearSystem(taskId);
            }
            lControl.clearComponents(taskId, formId);
            // --- 移除 form 的 style ---
            lDom.removeStyle(taskId, 'form', formId);
            // --- 触发 formRemoved 事件 ---
            lCore.trigger('formRemoved', taskId, formId, title, icon).catch(() => {});
            lDom.clearWatchStyle(formId);
            lDom.clearWatchProperty(formId);
            lDom.clearWatchPosition(formId);
            lNative.clear(taskId, formId);
            delete activePanels[formId];
            // --- 检测是否已经没有窗体了，如果没有了的话就要结束任务了 ---
            if (Object.keys(task.forms).length === 0) {
                await lTask.end(taskId);
            }
        })().catch(() => {});
    }, lDom.is.transition ? 300 : 0);
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
    cleanupPop(vapp._container);
    const formPop = elements.popList.querySelector<HTMLElement>('[data-form-id="' + formId + '"]');
    for (const pop of formPop?.querySelectorAll<HTMLElement>('[data-cg-panel-owner="' + id + '"]') ?? []) {
        cleanupPop(pop);
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

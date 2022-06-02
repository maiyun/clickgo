/**
 * Copyright 2022 Han Guoshuai <zohegs@gmail.com>
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
import * as types from '../../types';
import * as clickgo from '../clickgo';
import * as core from './core';
import * as task from './task';
import * as tool from './tool';
import * as dom from './dom';
import * as control from './control';
import * as native from './native';

/** --- form 相关信息 --- */
const info: {
    /** --- 最后一个窗体 id --- */
    lastId: number;
    /** --- 最后一个窗体层级，1000（一千）开始 --- */
    lastZIndex: number;
    /** --- 最后一个置顶窗体层级，10000000（一千万）开始 --- */
    topLastZIndex: number;
    /** --- 用到的语言包 --- */
    locale: Record<string, {
        'ok': string;
        'yes': string;
        'no': string;
        'cancel': string;
    }>;
} = {
    'lastId': 0,
    'lastZIndex': 999,
    'topLastZIndex': 9999999,
    'locale': {
        'sc': {
            'ok': '好',
            'yes': '是',
            'no': '否',
            'cancel': '取消'
        },
        'tc': {
            'ok': '好',
            'yes': '是',
            'no': '否',
            'cancel': '取消'
        },
        'en': {
            'ok': 'OK',
            'yes': 'Yes',
            'no': 'No',
            'cancel': 'Cancel'
        },
        'ja': {
            'ok': '好',
            'yes': 'はい',
            'no': 'いいえ',
            'cancel': 'キャンセル'
        }
    }
};

/** --- pop 相关信息 --- */
const popInfo: {
    /** --- 当前显示的 pop 列表 --- */
    'list': HTMLElement[];
    /** --- 当前显示的 pop 的母标签 --- */
    'elList': HTMLElement[];
    /** --- pop 最后一个层级 --- */
    'lastZIndex': number;
} = {
    'list': [],
    'elList': [],
    'lastZIndex': 0
};

export let simpleSystemTaskRoot: types.IVue;
const elements: {
    'wrap': HTMLDivElement;
    'list': HTMLDivElement;
    'popList': HTMLDivElement;
    'circular': HTMLDivElement;
    'rectangle': HTMLDivElement;
    'gesture': HTMLDivElement;
    'drag': HTMLDivElement;
    'dragIcon'?: HTMLElement;
    'system': HTMLElement;
    'simpleSystemtask': HTMLDivElement;
    'init': () => void;
} = {
    'wrap': document.createElement('div'),
    'list': document.createElement('div'),
    'popList': document.createElement('div'),
    'circular': document.createElement('div'),
    'rectangle': document.createElement('div'),
    'gesture': document.createElement('div'),
    'drag': document.createElement('div'),
    'dragIcon': undefined,
    'system': document.createElement('div'),
    'simpleSystemtask': document.createElement('div'),
    'init': function() {
        /** --- clickgo 所有的 div wrap --- */
        this.wrap.id = 'cg-wrap';
        document.getElementsByTagName('body')[0].appendChild(this.wrap);
        if (clickgo.getNative()) {
            this.wrap.addEventListener('mouseenter', function() {
                native.send('cg-mouse-ignore', 'false');
            });
            this.wrap.addEventListener('mouseleave', function() {
                native.send('cg-mouse-ignore', 'true');
            });
        }

        /** --- form list 的 div --- */
        this.list.id = 'cg-form-list';
        this.wrap.appendChild(this.list);
        this.list.addEventListener('touchmove', function(e): void {
            // --- 防止拖动时整个网页跟着动 ---
            if (e.cancelable) {
                e.preventDefault();
            }
            // --- 为啥要在这加，因为有些设备性能不行，在 touchstart 之时添加的 touchmove 不能立马响应，导致网页还是跟着动，所以增加此函数 ---
        }, {
            'passive': false
        });
        this.list.addEventListener('wheel', function(e): void {
            // --- 防止不小心前进后退，或上下缓动滚动（Mac） ---
            e.preventDefault();
        }, {
            'passive': false
        });
        this.list.addEventListener('contextmenu', function(e): void {
            e.preventDefault();
        });

        /** --- pop list 的 div --- */
        this.popList.id = 'cg-pop-list';
        this.popList.addEventListener('contextmenu', function(e): void {
            e.preventDefault();
        });
        this.wrap.appendChild(this.popList);
        this.popList.addEventListener('touchmove', function(e): void {
            // --- 防止拖动时整个网页跟着动 ---
            e.preventDefault();
        }, {
            'passive': false
        });

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
        this.drag.innerHTML = '<svg width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 8L40 40" stroke="#FFF" stroke-width="4" stroke-linecap="butt" stroke-linejoin="miter"/><path d="M8 40L40 8" stroke="#FFF" stroke-width="4" stroke-linecap="butt" stroke-linejoin="miter"/></svg>';
        this.dragIcon = this.drag.childNodes[0] as HTMLElement;
        this.wrap.appendChild(this.drag);

        // --- 添加 cg-system 的 dom ---
        this.system.id = 'cg-system';
        this.system.addEventListener('contextmenu', function(e): void {
            e.preventDefault();
        });
        this.wrap.appendChild(this.system);
        this.system.addEventListener('touchmove', function(e): void {
            // --- 防止拖动时整个网页跟着动 ---
            e.preventDefault();
        }, {
            'passive': false
        });

        // --- 添加 cg-simplesystemtask 的 dom ---
        this.simpleSystemtask.id = 'cg-simplesystemtask';
        this.simpleSystemtask.addEventListener('contextmenu', function(e): void {
            e.preventDefault();
        });
        this.wrap.appendChild(this.simpleSystemtask);
        this.simpleSystemtask.addEventListener('touchmove', function(e): void {
            // --- 防止拖动时整个网页跟着动 ---
            e.preventDefault();
        }, {
            'passive': false
        });
        const simpleSystemtaskApp = Vue.createApp({
            'template': '<div v-for="(item, formId) of forms" class="cg-simplesystemtask-item" @click="click(parseInt(formId))"><div v-if="item.icon" class="cg-simplesystemtask-icon" :style="{\'background-image\': \'url(\' + item.icon + \')\'}"></div><div>{{item.title}}</div></div>',
            'data': function() {
                return {
                    'forms': {}
                };
            },
            'watch': {
                'forms': {
                    handler: function(this: types.IVue) {
                        const length = Object.keys(this.forms).length;
                        if (length > 0) {
                            if (elements.simpleSystemtask.style.bottom !== '0px') {
                                elements.simpleSystemtask.style.bottom = '0px';
                                core.trigger('screenResize');
                            }
                        }
                        else {
                            if (elements.simpleSystemtask.style.bottom === '0px') {
                                elements.simpleSystemtask.style.bottom = '-46px';
                                core.trigger('screenResize');
                            }
                        }
                    },
                    'deep': true
                }
            },
            'methods': {
                click: function(this: types.IVue, formId: number): void {
                    changeFocus(formId);
                }
            },
            'mounted': function(this: types.IVue): void {
                simpleSystemTaskRoot = this;
            }
        });
        simpleSystemtaskApp.mount('#cg-simplesystemtask');
    }
};
elements.init();

/**
 * --- 修改窗体的最大化、最小化状态，外部或不可调整 state 时才调用 ---
 * @param state 最大化、最小化或关闭
 * @param formId 窗体 id
 */
function changeState(state: 'min' | 'max' | 'close', formId?: number): boolean {
    if (!formId) {
        return false;
    }
    const tid: number = getTaskId(formId);
    const t = task.list[tid];
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
 * @param formId 窗体 id，App 模式下可省略
 */
export function min(formId?: number): boolean {
    return changeState('min', formId);
}

/**
 * --- 最大化某个窗体 ---
 * @param formId formId 窗体 id，App 模式下可省略
 */
export function max(formId?: number): boolean {
    return changeState('max', formId);
}

/**
 * --- 关闭一个窗体 ---
 * @param formId formId 窗体 id，App 模式下可省略
 */
export function close(formId?: number):  boolean {
    return changeState('close', formId);
}

/**
 * --- 绑定窗体拖动大小事件，在 mousedown、touchstart 中绑定 ---
 * @param e 事件源
 * @param border 调整大小的方位
 */
export function bindResize(e: MouseEvent | TouchEvent, border: types.TBorder): void {
    const formWrap = dom.findParentByClass(e.target as HTMLElement, 'cg-form-wrap');
    if (!formWrap) {
        return;
    }
    const formId = formWrap.dataset.formId;
    if (!formId) {
        return;
    }
    const fid = parseInt(formId);
    const tid = getTaskId(fid);
    const t = task.list[tid];
    if (!t) {
        return;
    }
    t.forms[fid].vroot.$refs.form.resizeMethod(e, border);
}

/**
 * --- 绑定窗体拖动事件，在 mousedown、touchstart 中绑定 ---
 * @param e 事件源
 */
export function bindDrag(e: MouseEvent | TouchEvent): void {
    const formWrap = dom.findParentByClass(e.target as HTMLElement, 'cg-form-wrap');
    if (!formWrap) {
        return;
    }
    const formId = formWrap.dataset.formId;
    if (!formId) {
        return;
    }
    const fid = parseInt(formId);
    const tid = getTaskId(fid);
    const t = task.list[tid];
    if (!t) {
        return;
    }
    t.forms[fid].vroot.$refs.form.moveMethod(e, true);
}

/**
 *  --- 重置所有已经最大化的窗体大小和位置 ---
 */
export function refreshMaxPosition(): void {
    const area = core.getAvailArea();
    for (let i = 0; i < elements.list.children.length; ++i) {
        const el = elements.list.children.item(i) as HTMLElement;
        const ef = el.children.item(0) as HTMLElement;
        if (ef.dataset.cgMax === undefined) {
            continue;
        }
        const taskId = parseInt(el.getAttribute('data-task-id')!);
        const formId = parseInt(el.getAttribute('data-form-id')!);
        if (!task.list[taskId]) {
            continue;
        }
        const vroot = task.list[taskId].forms[formId].vroot;
        vroot.$refs.form.setPropData('left', area.left);
        vroot.$refs.form.setPropData('top', area.top);
        vroot.$refs.form.setPropData('width', area.width);
        vroot.$refs.form.setPropData('height', area.height);
    }
}

/**
 * --- 根据窗体 id 获取 task id ---
 * @param formId 窗体 id
 */
export function getTaskId(formId: number): number {
    const formElement = elements.list.querySelector(`[data-form-id='${formId}']`);
    if (!formElement) {
        return 0;
    }
    // --- 获取 task id ---
    const taskIdAttr = formElement.getAttribute('data-task-id');
    if (!taskIdAttr) {
        return 0;
    }
    return parseInt(taskIdAttr);
}

/**
 * --- 获取窗体信息 ---
 * @param formId 窗体 id
 */
export function get(formId: number): types.IFormInfo | null {
    const taskId: number = getTaskId(formId);
    if (taskId === 0) {
        return null;
    }
    const item = task.list[taskId].forms[formId];
    return {
        'taskId': taskId,
        'title': item.vroot.$refs.form.title,
        'icon': item.vroot.$refs.form.iconData,
        'stateMax': item.vroot.$refs.form.stateMaxData,
        'stateMin': item.vroot.$refs.form.stateMinData,
        'show': item.vroot.$refs.form.showData,
        'focus': item.vroot.cgFocus
    };
}

/**
 * --- 给一个窗体发送一个对象，不会知道成功与失败状态 ---
 * @param formId 要接收对象的 form id
 * @param obj 要发送的对象
 */
export function send(formId: number, obj: Record<string, any>): void {
    const taskId: number = getTaskId(formId);
    if (taskId === 0) {
        return;
    }
    const item = task.list[taskId].forms[formId];
    if (!item.vroot.cgReceive) {
        return;
    }
    item.vroot.cgReceive(obj);
}

/**
 * --- 获取 form list 的简略情况 ---
 * @param taskId 任务 ID
 */
export function getList(taskId: number): Record<string, types.IFormInfo> {
    if (!task.list[taskId]) {
        return {};
    }
    const list: Record<string, types.IFormInfo> = {};
    for (const fid in task.list[taskId].forms) {
        const item = task.list[taskId].forms[fid];
        list[fid] = {
            'taskId': taskId,
            'title': item.vroot.$refs.form.title,
            'icon': item.vroot.$refs.form.iconData,
            'stateMax': item.vroot.$refs.form.stateMaxData,
            'stateMin': item.vroot.$refs.form.stateMinData,
            'show': item.vroot.$refs.form.showData,
            'focus': item.vroot.cgFocus
        };
    }
    return list;
}

/**
 * --- 改变 form 的焦点 class ---
 * @param formId 变更后的 form id
 */
export function changeFocus(formId: number = 0): void {
    if (typeof formId !== 'number') {
        notify({
            'title': 'Warning',
            'content': 'The "formId" of "changeFocus" must be a number type.',
            'type': 'warning'
        });
        return;
    }
    const focusElement = document.querySelector('#cg-form-list > [data-cg-focus]');
    if (focusElement) {
        const dataFormId = focusElement.getAttribute('data-form-id');
        if (dataFormId) {
            const dataFormIdNumber = parseInt(dataFormId);
            if (dataFormIdNumber === formId) {
                return;
            }
            else {
                const taskId = parseInt(focusElement.getAttribute('data-task-id') ?? '0');
                const t = task.list[taskId];
                t.forms[dataFormIdNumber].vapp._container.removeAttribute('data-cg-focus');
                t.forms[dataFormIdNumber].vroot._cgFocus = false;
                // --- 触发 formBlurred 事件 ---
                core.trigger('formBlurred', taskId, dataFormIdNumber);
            }
        }
        else {
            return;
        }
    }
    if (formId === 0) {
        return;
    }
    const el = document.querySelector(`#cg-form-list > [data-form-id='${formId}']`);
    if (!el) {
        return;
    }
    // --- 如果是最小化状态的话，需要还原 ---
    if ((el.children.item(0) as HTMLElement).dataset.cgMin !== undefined) {
        min(formId);
    }
    // --- 获取所属的 taskId ---
    const taskId: number = parseInt(el.getAttribute('data-task-id') ?? '0');
    const t = task.list[taskId];
    // --- 如果不是自定义的 zindex，则设置 zIndex 为最大 ---
    if (!t.forms[formId].vroot.cgCustomZIndex) {
        if (t.forms[formId].vroot.cgTopMost) {
            t.forms[formId].vroot.$refs.form.setPropData('zIndex', ++info.topLastZIndex);
        }
        else {
            t.forms[formId].vroot.$refs.form.setPropData('zIndex', ++info.lastZIndex);
        }
    }
    // --- 检测 maskFor ---
    const maskFor = t.forms[formId].vroot.$refs.form.maskFor;
    if ((typeof maskFor === 'number') && (task.list[taskId].forms[maskFor])) {
        // --- 有 maskFor 窗体 ---
        // --- 如果是最小化状态的话，需要还原 ---
        if (get(maskFor)!.stateMin) {
            min(maskFor);
        }
        // --- 如果不是自定义的 zindex，则设置 zIndex 为最大 ---
        if (!task.list[taskId].forms[maskFor].vroot.cgCustomZIndex) {
            if (task.list[taskId].forms[maskFor].vroot.cgTopMost) {
                task.list[taskId].forms[maskFor].vroot.$refs.form.setPropData('zIndex', ++info.topLastZIndex);
            }
            else {
                task.list[taskId].forms[maskFor].vroot.$refs.form.setPropData('zIndex', ++info.lastZIndex);
            }
        }
        // --- 开启 focus ---
        task.list[taskId].forms[maskFor].vapp._container.dataset.cgFocus = '';
        task.list[taskId].forms[maskFor].vroot._cgFocus = true;
        // --- 触发 formFocused 事件 ---
        core.trigger('formFocused', taskId, maskFor);
        // --- 闪烁 ---
        clickgo.form.flash(maskFor, taskId);
    }
    else {
        // --- 正常开启 focus ---
        t.forms[formId].vapp._container.dataset.cgFocus = '';
        t.forms[formId].vroot._cgFocus = true;
        // --- 触发 formFocused 事件 ---
        core.trigger('formFocused', taskId, formId);
    }
}

/**
 * --- 获取当前 z-index 值最大的 form id（除了 top 模式的窗体和最小化的窗体） ---
 * @param out 排除选项
 */
export function getMaxZIndexID(out: {
    'taskIds'?: number[];
    'formIds'?: number[];
} = {}): number | null {
    let zIndex: number = 0;
    let formId: number | null = null;
    for (let i = 0; i < elements.list.children.length; ++i) {
        const formWrap = elements.list.children.item(i) as HTMLDivElement;
        const formInner = formWrap.children.item(0) as HTMLDivElement;
        // --- 排除 top most 窗体 ---
        const z = parseInt(formInner.style.zIndex);
        if (z > 9999999) {
            continue;
        }
        // --- 排除最小化窗体 ---
        if (formInner.dataset.cgMin !== undefined) {
            continue;
        }
        // --- 排除用户定义的 task id 窗体 ---
        const tid = parseInt(formWrap.getAttribute('data-task-id')!);
        if (out.taskIds?.includes(tid)) {
            continue;
        }
        // --- 排除用户定义的 form id 窗体 ---
        const fid = parseInt(formWrap.getAttribute('data-form-id')!);
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
 * --- 根据 border 方向 获取理论窗体大小 ---
 * @param border 显示的位置代号
 */
export function getRectByBorder(border: types.TBorder): { 'width': number; 'height': number; 'left': number; 'top': number; } {
    const area = core.getAvailArea();
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
            elements.circular.style.transition = 'all .3s ease-out';
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
export function moveRectangle(border: types.TBorder): void {
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
export function showRectangle(x: number, y: number, border: types.TBorder): void {
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
            elements.rectangle.style.transition = 'all .2s ease-out';
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

/**
 * --- 显示 drag 虚拟框 ---
 */
export function showDrag(): void {
    elements.drag.style.opacity = '1';
}

/**
 * --- 移动 drag 到新位置 ---
 * @param opt top:顶部位置,left:左侧位置,width:宽度位置,height:高度位置
 */
export function moveDrag(opt: types.IMoveDragOptions): void {
    if (opt.top) {
        elements.drag.style.top = opt.top.toString() + 'px';
    }
    if (opt.left) {
        elements.drag.style.left = opt.left.toString() + 'px';
    }
    if (opt.width) {
        elements.drag.style.width = opt.width.toString() + 'px';
    }
    if (opt.height) {
        elements.drag.style.height = opt.height.toString() + 'px';
    }
    if (opt.icon) {
        if (elements.dragIcon) {
            elements.dragIcon.style.display = 'block';
        }
    }
    else {
        if (elements.dragIcon) {
            elements.dragIcon.style.display = 'none';
        }
    }
}

/**
 * --- 隐藏拖拽框框 ---
 */
export function hideDrag(): void {
    elements.drag.style.opacity = '0';
}

let notifyTop: number = 10;
let notifyId: number = 0;
/**
 * --- 弹出右上角信息框 ---
 * @param opt timeout 默认 5 秒
 */
export function notify(opt: types.INotifyOptions): number {
    // --- 申请 nid ---
    const nid = ++notifyId;
    // --- 设置 timeout ---
    let timeout = 5000;
    if (opt.timeout !== undefined) {
        if (opt.timeout <= 0 || opt.timeout > 30000) {
            timeout = 30000;
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
    const y = notifyTop;
    el.classList.add('cg-system-notify');
    el.setAttribute('data-notifyid', nid.toString());
    el.style.transform = `translateY(${y}px) translateX(280px)`;
    el.style.opacity = '1';
    el.innerHTML = `<div class="cg-system-icon cg-${tool.escapeHTML(opt.type ?? 'primary')}"></div>
<div style="flex: 1;">
    <div class="cg-system-notify-title">${tool.escapeHTML(opt.title)}</div>
    <div class="cg-system-notify-content">${tool.escapeHTML(opt.content).replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\n/g, '<br>')}</div>
    ${opt.progress ? '<div class="cg-system-notify-progress"></div>' : ''}
</div>`;
    if (opt.icon) {
        (el.childNodes.item(0) as HTMLElement).style.background = 'url(' + opt.icon + ')';
        (el.childNodes.item(0) as HTMLElement).style.backgroundSize = '16px';
    }
    elements.system.appendChild(el);
    notifyTop += el.offsetHeight + 10;
    requestAnimationFrame(function() {
        el.style.transform = `translateY(${y}px) translateX(-10px)`;
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
    const el: HTMLElement = elements.system.querySelector(`[data-notifyid="${notifyId}"]`)!;
    if (!el) {
        return;
    }
    const progress: HTMLElement = el.querySelector('.cg-system-notify-progress')!;
    if (!progress) {
        return;
    }
    if (per > 100) {
        per = 100;
    }
    if (per === 1) {
        const o = parseFloat(progress.style.width);
        if (o > 1) {
            per = 100;
        }
    }
    if (per === 100) {
        progress.style.transitionDelay = '.1s';
    }
    progress.style.width = (per < 1 ? per * 100 : per).toString() + '%';
}

/**
 * --- 隐藏 notify ---
 * @param notifyId 要隐藏的 notify id
 */
export function hideNotify(notifyId: number): void {
    const el: HTMLElement = elements.system.querySelector(`[data-notifyid="${notifyId}"]`)!;
    if (!el) {
        return;
    }
    clearTimeout(parseInt(el.getAttribute('data-timer')!));
    const notifyHeight = el.offsetHeight;
    el.style.opacity = '0';
    setTimeout(function() {
        notifyTop -= notifyHeight + 10;
        const notifyElementList = document.getElementsByClassName('cg-system-notify') as HTMLCollectionOf<HTMLDivElement>;
        let needSub = false;
        for (const notifyElement of notifyElementList) {
            if (notifyElement === el) {
                // --- el 之后的 notify 都要往上移动 ---
                needSub = true;
                continue;
            }
            if (needSub) {
                notifyElement.style.transform = notifyElement.style.transform.replace(/translateY\(([0-9]+)px\)/,
                    function(t: string, t1: string): string {
                        return `translateY(${parseInt(t1) - notifyHeight - 10}px)`;
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

/** --- 最后一次 touchstart 的时间戳 */
let lastShowPopTime: number = 0;
/**
 * --- 获取 pop 显示出来的坐标并报系统全局记录 ---
 * @param el 响应的元素
 * @param pop 要显示 pop 元素
 * @param direction 要显示方向（以 $el 为准的 h 水平和 v 垂直）或坐标
 * @param opt width / height 显示的 pop 定义自定义宽/高度，可省略；null，true 代表为空也会显示，默认为 false
 */
export function showPop(el: HTMLElement, pop: HTMLElement | undefined, direction: 'h' | 'v' | MouseEvent | TouchEvent | { x: number; y: number; }, opt: { 'size'?: { width?: number; height?: number; }; 'null'?: boolean; } = {}): void {
    // --- opt.null 为 true 代表可为空，为空也会被显示，默认为 false ---
    if (opt.null === undefined) {
        opt.null = false;
    }
    if (opt.size === undefined) {
        opt.size = {};
    }
    // --- 也可能不执行本次显示 ---
    if (!pop && !opt.null) {
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
    const parentPop = dom.findParentByData(el, 'cg-pop');
    if (parentPop) {
        for (let i = 0; i < popInfo.list.length; ++i) {
            if (popInfo.list[i] !== parentPop) {
                continue;
            }
            if (!popInfo.elList[i + 1]) {
                continue;
            }
            hidePop(popInfo.elList[i + 1]);
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
    // --- 最终 pop 的大小 ---
    const width = opt.size.width ?? (pop ? pop.offsetWidth : 0);
    const height = opt.size.height ?? (pop ? pop.offsetHeight : 0);
    // --- 最终显示位置 ---
    let left: number, top: number;
    if (typeof direction === 'string') {
        const bcr = el.getBoundingClientRect();
        if (direction === 'v') {
            // --- 垂直弹出 ---
            left = bcr.left;
            top = bcr.top + bcr.height;
        }
        else {
            // --- 水平弹出 ---
            left = bcr.left + bcr.width - 2;
            top = bcr.top - 2;
        }
        // --- 检查水平是否出框 ---
        if (width + left > document.body.clientWidth) {
            if (direction === 'v') {
                // --- 垂直弹出 ---
                left = bcr.left + bcr.width - width;
            }
            else {
                // --- 水平弹出，右边位置不够弹到左边 ---
                left = bcr.left - width + 2;
            }
        }
        // --- 检测垂直是否出框 ---
        if (height + top > document.body.clientHeight) {
            if (direction === 'v') {
                top = bcr.top - height;
            }
            else {
                top = bcr.top + bcr.height - height + 2;
            }
        }
    }
    else {
        let x: number;
        let y: number;
        if (direction instanceof MouseEvent) {
            x = direction.clientX;
            y = direction.clientY;
        }
        else if (direction instanceof TouchEvent) {
            x = direction.touches[0].clientX;
            y = direction.touches[0].clientY;
        }
        else {
            x = direction.x;
            y = direction.y;
        }
        left = x + 5;
        top = y + 7;
        // --- 水平 ---
        if (width + left > document.body.clientWidth) {
            left = x - width - 5;
        }
        // --- 垂直 ---
        if (height + top > document.body.clientHeight) {
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
    if (opt.size.width) {
        pop.style.width = opt.size.width.toString() + 'px';
    }
    if (opt.size.height) {
        pop.style.height = opt.size.height.toString() + 'px';
    }
    popInfo.list.push(pop);
    popInfo.elList.push(el);
    pop.dataset.cgOpen = '';
    pop.dataset.cgLevel = (popInfo.list.length - 1).toString();
    el.dataset.cgPopOpen = '';
    el.dataset.cgLevel = (popInfo.elList.length - 1).toString();
}

/**
 * --- 隐藏正在显示中的所有 pop，或指定 pop/el ---
 */
export function hidePop(pop?: HTMLElement): void {
    if (!pop) {
        if (popInfo.elList.length === 0) {
            return;
        }
        hidePop(popInfo.elList[0]);
        return;
    }
    let isPop: boolean = false;
    if (pop.dataset.cgPopOpen !== undefined) {
        // --- el ---
    }
    else if (pop.dataset.cgOpen !== undefined) {
        // --- pop ---
        isPop = true;
    }
    else {
        return;
    }
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
        popInfo.elList[level].removeAttribute('data-cg-pop-open');
        popInfo.elList[level].removeAttribute('data-cg-level');
    }
    else {
        if (popInfo.list[level]) {
            popInfo.list[level].removeAttribute('data-cg-open');
            popInfo.list[level].removeAttribute('data-cg-level');
        }
        pop.removeAttribute('data-cg-pop-open');
        pop.removeAttribute('data-cg-level');
    }
    popInfo.list.splice(level);
    popInfo.elList.splice(level);
}

/**
 * --- 点下 (mousedown / touchstart) 屏幕任意一位置时根据点击处处理隐藏 pop 和焦点丢失事件，鼠标和 touch 只会响应一个 ---
 * @param e 事件对象
 */
export function doFocusAndPopEvent(e: MouseEvent | TouchEvent): void {
    if (dom.hasTouchButMouse(e)) {
        return;
    }
    const target = e.target;
    if (!target) {
        return;
    }
    const element: HTMLElement | null = target as HTMLElement;
    if (element.dataset.cgPopOpen !== undefined) {
        // --- 此对象为已打开 pop 的组件，不做处理，组件自行处理 ---
        return;
    }
    const paths: HTMLElement[] = (e as any).path ?? (e.composedPath ? e.composedPath() : []);
    // --- 检测是不是弹出层 ---
    for (const item of paths) {
        if (!item.tagName) {
            continue;
        }
        if (item.tagName.toLowerCase() === 'body') {
            break;
        }
        if (item.id === 'cg-pop-list') {
            // --- 弹出层点击，不触发丢失焦点，也不触发隐藏 pop，是否隐藏请自行处理 ---
            return;
        }
        if (item.dataset.cgPopOpen !== undefined) {
            return;
        }
    }
    // --- 检测是不是窗体内部点击 ---
    for (const item of paths) {
        if (!item.tagName) {
            continue;
        }
        if (item.tagName.toLowerCase() === 'body') {
            break;
        }
        if (item.classList.contains('cg-form-wrap')) {
            // --- 窗体内部点击，转换焦点到当前窗体，但触发隐藏 pop ---
            const formId = parseInt(item.getAttribute('data-form-id') ?? '0');
            changeFocus(formId);
            hidePop();
            return;
        }
    }
    // --- 普罗大众的状态，要隐藏 menu，并且丢失窗体焦点 ---
    hidePop();
    changeFocus();
}
window.addEventListener('touchstart', doFocusAndPopEvent);
window.addEventListener('mousedown', doFocusAndPopEvent);

/**
 * --- 移除一个 form（关闭窗口） ---
 * @param formId 要移除的 form id
 */
export function remove(formId: number): boolean {
    const taskId: number = getTaskId(formId);
    let title = '';
    let icon = '';
    if (task.list[taskId].forms[formId]) {
        title = task.list[taskId].forms[formId].vroot.$refs.form.title;
        icon = task.list[taskId].forms[formId].vroot.$refs.form.iconData;
        if (task.list[taskId].forms[formId].vroot.$refs.form.maskFrom !== undefined) {
            const fid = task.list[taskId].forms[formId].vroot.$refs.form.maskFrom;
            task.list[taskId].forms[fid].vroot.$refs.form.maskFor = undefined;
        }
        task.list[taskId].forms[formId].vroot.$refs.form.$data.showData = false;
        setTimeout(function() {
            // --- 获取最大的 z index 窗体，并让他获取焦点 ---
            const fid = getMaxZIndexID({
                'formIds': [formId]
            });
            if (fid) {
                changeFocus(fid);
            }
            else {
                changeFocus();
            }
            // --- 延长 100 秒是为了响应 100 毫秒的动画 ---
            if (!task.list[taskId]) {
                // --- 可能这时候 task 已经被结束了 ---
                return true;
            }
            task.list[taskId].forms[formId].vapp.unmount();
            task.list[taskId].forms[formId].vapp._container.remove();
            delete task.list[taskId].forms[formId];
            // --- 移除 form 的 style ---
            dom.removeStyle(taskId, 'form', formId);
            // --- 触发 formRemoved 事件 ---
            core.trigger('formRemoved', taskId, formId, title, icon);
            // --- 检测是否已经没有窗体了，如果没有了的话就要结束任务了 ---
            if (Object.keys(task.list[taskId].forms).length === 0) {
                task.end(taskId);
            }
        }, 100);
        return true;
    }
    else {
        return false;
    }
}

/**
 * --- 根据任务 id 和 form id 获取 IForm 对象 ---
 * @param taskId 任务 id
 * @param formId 窗体 id
 */
function getForm(taskId?: number, formId?: number): types.IForm | null {
    if (!taskId) {
        return null;
    }
    /** --- 当前的 task 对象 --- */
    const t = task.list[taskId];
    if (!t) {
        return null;
    }
    if (!formId) {
        return null;
    }
    const form = t.forms[formId];
    if (!form) {
        return null;
    }
    return form;
}

/**
 * --- 直接创建一个窗体（需要验证传入 code、layout 等是否能成功创建) ---
 * @param opt 创建窗体的配置对象
 */
export async function create(opt: string | types.IFormCreateOptions): Promise<number | types.IForm> {
    if (typeof opt === 'string') {
        return 0;
    }
    if (!opt.taskId) {
        return -1;
    }
    if (opt.path && (!opt.path.endsWith('/') || !opt.path?.startsWith('/'))) {
        return -2;
    }
    const taskId = opt.taskId;
    /** --- 当前的 task 对象 --- */
    const t = task.list[taskId];
    if (!t) {
        return -3;
    }
    let form: types.IForm | null = null;
    if (opt.formId) {
        if (!t.forms[opt.formId]) {
            return -4;
        }
        form = t.forms[opt.formId];
    }
    /** --- 是否创建置顶的窗体 --- */
    let topMost = opt.topMost ?? false;
    if (form?.vroot.cgTopMost) {
        topMost = true;
    }
    // --- 是否要给原窗体增加遮罩 ---
    if (opt.mask && form) {
        form.vroot.$refs.form.maskFor = 0;
    }
    /** --- 当前父 form 的路径（以 / 结尾）或 /（没有基路径的话） --- */
    const base: string = form ? form.vroot.cgPath : '/';
    /** --- 要新建的 form 的文件路径 --- */
    let filePath = '', newBase = '';
    if (opt.file) {
        filePath = clickgo.tool.urlResolve(base, opt.file);
        newBase = filePath.slice(0, filePath.lastIndexOf('/') + 1);
    }
    else {
        newBase = opt.path ?? base;
    }

    /** --- 当前的 APP 对象 --- */
    const app: types.IApp = t.app;
    // ---  申请 formId ---
    const formId = ++info.lastId;
    // --- 注入的参数，屏蔽浏览器全局对象，注入新的对象 ---
    const invoke: Record<string, any> = {};
    if (clickgo.getSafe()) {
        invoke.window = undefined;
        invoke.loader = undefined;
        const ks = Object.getOwnPropertyNames(window);
        for (const k of ks) {
            if (k.includes('Event')) {
                continue;
            }
            if (k.includes('-')) {
                continue;
            }
            if (/^[0-9]+$/.test(k)) {
                continue;
            }
            if ([
                'require',
                '__awaiter', 'eval', 'Math', 'Array', 'Blob', 'Infinity', 'parseInt', 'parseFloat', 'Promise', 'Date', 'JSON', 'fetch'].includes(k)) {
                continue;
            }
            invoke[k] = undefined;
        }
        // --- console ---
        invoke.console = {
            log: function(message?: any, ...optionalParams: any[]) {
                console.log(message, ...optionalParams);
            }
        };
        // --- loader ---
        invoke.loader = {
            require: function(paths: string | string[], files: Record<string, Blob | string>, opt?: {
                'executed'?: Record<string, any>;
                'map'?: Record<string, string>;
                'dir'?: string;
                'style'?: string;
                'invoke'?: Record<string, any>;
                'preprocess'?: (code: string, path: string) => string;
            }): any[] {
                return loader.require(paths, files, opt);
            }
        };
        // --- Object ---
        invoke.Object = {
            defineProperty: function(): void {
                return;
            },
            keys: function(o: any): string[] {
                return Object.keys(o);
            },
            assign: function(o: any, o2: any): any {
                if (o.controlName !== undefined) {
                    return o;
                }
                return Object.assign(o, o2);
            }
        };
        invoke.navigator = {};
        if (navigator.clipboard) {
            invoke.navigator.clipboard = navigator.clipboard;
        }
        // --- ClickGo 相关 ---
        invoke.invokeClickgo = {
            getVersion: function(): string {
                return clickgo.getVersion();
            },
            getNative(): boolean {
                return clickgo.getNative();
            },
            getSafe(): boolean {
                return clickgo.getSafe();
            },
            getCdn(): string {
                return clickgo.getCdn();
            },
            'control': {
                read: function(blob: Blob): Promise<false | types.TControl> {
                    return clickgo.control.read(blob);
                }
            },
            'core': {
                'config': clickgo.core.config,
                initModules: function(names: string | string[]): Promise<number> {
                    return clickgo.core.initModules(names);
                },
                getModule: function(name: string): null | any {
                    return clickgo.core.getModule(name);
                },
                setSystemEventListener: function(
                    name: types.TGlobalEvent,
                    func: (...any: any) => void | Promise<void>,
                    fid?: number
                ): void {
                    clickgo.core.setSystemEventListener(name, func, fid ?? formId, taskId);
                },
                removeSystemEventListener: function(
                    name: types.TGlobalEvent,
                    fid?: number
                ): void {
                    clickgo.core.removeSystemEventListener(name, fid ?? formId, taskId);
                },
                trigger: function(name: types.TGlobalEvent, param1: boolean | Error | string = '', param2: string = ''): void {
                    if (!['formTitleChanged', 'formIconChanged', 'formStateMinChanged', 'formStateMaxChanged', 'formShowChanged'].includes(name)) {
                        return;
                    }
                    clickgo.core.trigger(name, taskId, formId, param1, param2);
                },
                readApp: function(blob: Blob): Promise<false | types.IApp> {
                    return clickgo.core.readApp(blob);
                },
                getAvailArea: function(): types.IAvailArea {
                    return clickgo.core.getAvailArea();
                }
            },
            'dom': {
                setGlobalCursor: function(type?: string): void {
                    clickgo.dom.setGlobalCursor(type);
                },
                hasTouchButMouse: function(e: MouseEvent | TouchEvent | PointerEvent): boolean {
                    return clickgo.dom.hasTouchButMouse(e);
                },
                getStyleCount: function(taskId: number, type: 'theme' | 'control' | 'form'): number {
                    return clickgo.dom.getStyleCount(taskId, type);
                },
                getSize: function(el: HTMLElement): types.IDomSize {
                    return clickgo.dom.getSize(el);
                },
                watchSize: function(
                    el: HTMLElement,
                    cb: (size: types.IDomSize) => Promise<void> | void,
                    immediate: boolean = false
                ): types.IDomSize {
                    return clickgo.dom.watchSize(el, cb, immediate, taskId);
                },
                unwatchSize: function(el: HTMLElement): void {
                    clickgo.dom.unwatchSize(el, taskId);
                },
                clearWatchSize(): void {
                    clickgo.dom.clearWatchSize(taskId);
                },
                watch: function(el: HTMLElement, cb: () => void, mode: 'child' | 'childsub' | 'style' | 'default' = 'default', immediate: boolean = false): void {
                    clickgo.dom.watch(el, cb, mode, immediate, taskId);
                },
                unwatch: function(el: HTMLElement): void {
                    clickgo.dom.unwatch(el, taskId);
                },
                clearWatch: function(): void {
                    clickgo.dom.clearWatch(taskId);
                },
                watchStyle: function(
                    el: HTMLElement,
                    name: string | string[],
                    cb: (name: string, value: string) => void,
                    immediate: boolean = false
                ): void {
                    clickgo.dom.watchStyle(el, name, cb, immediate);
                },
                isWatchStyle: function(el: HTMLElement): boolean {
                    return clickgo.dom.isWatchStyle(el);
                },
                bindDown: function(oe: MouseEvent | TouchEvent, opt: types.IBindDownOptions) {
                    clickgo.dom.bindDown(oe, opt);
                },
                bindGesture: function(e: MouseEvent | TouchEvent | WheelEvent | { 'x'?: number; 'y'?: number; }, opt: types.IBindGestureOptions): void {
                    clickgo.dom.bindGesture(e, opt);
                },
                bindLong: function(
                    e: MouseEvent | TouchEvent,
                    long: (e: MouseEvent | TouchEvent) => void | Promise<void>
                ): void {
                    clickgo.dom.bindLong(e, long);
                },
                bindDrag: function(e: MouseEvent | TouchEvent, opt: { 'el': HTMLElement; 'data'?: any; }): void {
                    clickgo.dom.bindDrag(e, opt);
                },
                'is': clickgo.dom.is,
                bindMove: function(e: MouseEvent | TouchEvent, opt: types.IBindMoveOptions): types.IBindMoveResult {
                    return clickgo.dom.bindMove(e, opt);
                },
                bindResize: function(e: MouseEvent | TouchEvent, opt: types.IBindResizeOptions): void {
                    clickgo.dom.bindResize(e, opt);
                },
                findParentByData: function(el: HTMLElement, name: string): HTMLElement | null {
                    return clickgo.dom.findParentByData(el, name);
                },
                findParentByClass: function(el: HTMLElement, name: string): HTMLElement | null {
                    return clickgo.dom.findParentByClass(el, name);
                },
                siblings: function(el: HTMLElement): HTMLElement[] {
                    return clickgo.dom.siblings(el);
                },
                siblingsData: function(el: HTMLElement, name: string): HTMLElement[] {
                    return clickgo.dom.siblingsData(el, name);
                },
                fullscreen: function(): boolean {
                    return clickgo.dom.fullscreen();
                }
            },
            'form': {
                min: function(fid?: number): boolean {
                    return clickgo.form.min(fid ?? formId);
                },
                max: function max(fid?: number): boolean {
                    return clickgo.form.max(fid ?? formId);
                },
                close: function(fid?: number): boolean {
                    return clickgo.form.close(fid ?? formId);
                },
                bindResize: function(e: MouseEvent | TouchEvent, border: types.TBorder): void {
                    clickgo.form.bindResize(e, border);
                },
                bindDrag: function(e: MouseEvent | TouchEvent): void {
                    clickgo.form.bindDrag(e);
                },
                getTaskId: function(fid: number): number {
                    return clickgo.form.getTaskId(fid);
                },
                get: function(fid: number): types.IFormInfo | null {
                    return clickgo.form.get(fid);
                },
                send: function(fid: number, obj: Record<string, any>): void {
                    obj.taskId = taskId;
                    obj.formId = formId;
                    clickgo.form.send(fid, obj);
                },
                getList: function(tid: number): Record<string, types.IFormInfo> {
                    return clickgo.form.getList(tid);
                },
                changeFocus: function(fid: number = 0): void {
                    clickgo.form.changeFocus(fid);
                },
                getMaxZIndexID: function(out?: {
                    'taskIds'?: number[];
                    'formIds'?: number[];
                }): number | null {
                    return clickgo.form.getMaxZIndexID(out);
                },
                getRectByBorder: function(border: types.TBorder): { 'width': number; 'height': number; 'left': number; 'top': number; } {
                    return clickgo.form.getRectByBorder(border);
                },
                showCircular: function(x: number, y: number): void {
                    clickgo.form.showCircular(x, y);
                },
                moveRectangle: function(border: types.TBorder): void {
                    clickgo.form.moveRectangle(border);
                },
                showRectangle: function(x: number, y: number, border: types.TBorder): void {
                    clickgo.form.showRectangle(x, y, border);
                },
                hideRectangle: function(): void {
                    clickgo.form.hideRectangle();
                },
                showDrag: function(): void {
                    clickgo.form.showDrag();
                },
                moveDrag: function(opt: types.IMoveDragOptions): void {
                    clickgo.form.moveDrag(opt);
                },
                hideDrag: function(): void {
                    clickgo.form.hideDrag();
                },
                notify: function(opt: types.INotifyOptions): number {
                    return clickgo.form.notify(opt);
                },
                notifyProgress: function(notifyId: number, per: number): void {
                    clickgo.form.notifyProgress(notifyId, per);
                },
                hideNotify: function(notifyId: number): void {
                    clickgo.form.hideNotify(notifyId);
                },
                showPop: function(el: HTMLElement, pop: HTMLElement | undefined, direction: 'h' | 'v' | MouseEvent | TouchEvent | { x: number; y: number; }, opt: { 'size'?: { width?: number; height?: number; }; 'null'?: boolean; } = {}): void {
                    clickgo.form.showPop(el, pop, direction, opt);
                },
                hidePop: function(pop?: HTMLElement): void {
                    clickgo.form.hidePop(pop);
                },
                create: function(opt: string | types.IFormCreateOptions): Promise<number | types.IForm> {
                    if (typeof opt === 'string') {
                        opt = {
                            'file': opt
                        };
                    }
                    opt.taskId = taskId;
                    opt.formId = formId;
                    return clickgo.form.create(opt);
                },
                dialog: function(opt: string | types.IFormDialogOptions): Promise<string> {
                    if (typeof opt === 'string') {
                        opt = {
                            'content': opt
                        };
                    }
                    opt.formId = formId;
                    return clickgo.form.dialog(opt);
                },
                confirm: function(opt: string | types.IFormConfirmOptions): Promise<boolean | number> {
                    if (typeof opt === 'string') {
                        opt = {
                            'content': opt
                        };
                    }
                    opt.formId = formId;
                    return clickgo.form.confirm(opt);
                },
                setTopMost: function(top: boolean, opt: types.IFormSetTopMostOptions = {}): void {
                    opt.taskId = taskId;
                    opt.formId = formId;
                    clickgo.form.setTopMost(top, opt);
                },
                flash: function(fid?: number): void {
                    clickgo.form.flash(fid ?? formId, taskId);
                },
                show: function(fid?: number): void {
                    clickgo.form.show(fid ?? formId, taskId);
                },
                hide: function(fid?: number): void {
                    clickgo.form.hide(fid ?? formId, taskId);
                }
            },
            'fs': {
                getContent: function(
                    path: string,
                    options: any = {}
                ): Promise<Blob | string | null> {
                    if (!options.files) {
                        options.files = t.files;
                    }
                    if (!options.current) {
                        options.current = t.path;
                    }
                    return clickgo.fs.getContent(path, options);
                },
                putContent: function(path: string, data: string | Buffer, options: any = {}) {
                    if (!options.current) {
                        options.current = t.path;
                    }
                    return clickgo.fs.putContent(path, data, options);
                },
                readLink: function(path: string, options: any = {}): Promise<string | null> {
                    if (!options.current) {
                        options.current = t.path;
                    }
                    return clickgo.fs.readLink(path, options);
                },
                symlink: function(fPath: string, linkPath: string, options: any = {}): Promise<boolean> {
                    if (!options.current) {
                        options.current = t.path;
                    }
                    return clickgo.fs.symlink(fPath, linkPath, options);
                },
                unlink: function(path: string, options: any = {}): Promise<boolean> {
                    if (!options.current) {
                        options.current = t.path;
                    }
                    return clickgo.fs.unlink(path, options);
                },
                stats: function(path: string, options: any = {}): Promise<types.IStats | null> {
                    if (!options.files) {
                        options.files = t.files;
                    }
                    if (!options.current) {
                        options.current = t.path;
                    }
                    return clickgo.fs.stats(path, options);
                },
                isDir: function(path: string, options: any = {}): Promise<types.IStats | false> {
                    if (!options.files) {
                        options.files = t.files;
                    }
                    if (!options.current) {
                        options.current = t.path;
                    }
                    return clickgo.fs.isDir(path, options);
                },
                isFile: function(path: string, options: any = {}): Promise<types.IStats | false> {
                    if (!options.files) {
                        options.files = t.files;
                    }
                    if (!options.current) {
                        options.current = t.path;
                    }
                    return clickgo.fs.isFile(path, options);
                },
                mkdir: function(path: string, mode?: number, options: any = {}): Promise<boolean> {
                    if (!options.current) {
                        options.current = t.path;
                    }
                    return clickgo.fs.mkdir(path, mode, options);
                },
                rmdir: function(path: string, options: any = {}): Promise<boolean> {
                    if (!options.current) {
                        options.current = t.path;
                    }
                    return clickgo.fs.rmdir(path, options);
                },
                rmdirDeep: function(path: string, options: any = {}): Promise<boolean> {
                    if (!options.current) {
                        options.current = t.path;
                    }
                    return clickgo.fs.rmdirDeep(path, options);
                },
                chmod: function(path: string, mod: string | number, options: any = {}): Promise<boolean> {
                    if (!options.current) {
                        options.current = t.path;
                    }
                    return clickgo.fs.chmod(path, mod, options);
                },
                rename(oldPath: string, newPath: string, options: any = {}): Promise<boolean> {
                    if (!options.current) {
                        options.current = t.path;
                    }
                    return clickgo.fs.rename(oldPath, newPath, options);
                },
                readDir(path: string, options: any = {}): Promise<types.IDirent[]> {
                    if (!options.files) {
                        options.files = t.files;
                    }
                    if (!options.current) {
                        options.current = t.path;
                    }
                    return clickgo.fs.readDir(path, options);
                },
                copyFolder(from: string, to: string, options: any = {}): Promise<number> {
                    if (!options.current) {
                        options.current = t.path;
                    }
                    return clickgo.fs.copyFolder(from, to, options);
                },
                copyFile(src: string, dest: string, options: any = {}): Promise<boolean> {
                    if (!options.current) {
                        options.current = t.path;
                    }
                    return clickgo.fs.copyFile(src, dest, options);
                }
            },
            'native': {
                getListeners: function(): Array<{ 'id': number; 'name': string; 'once': boolean; 'taskId'?: number; }> {
                    return clickgo.native.getListeners();
                },
                send: function(
                    name: string,
                    param?: string,
                    handler?: (param?: string) => void | Promise<void>
                ): number {
                    return clickgo.native.send(name, param, handler, taskId);
                },
                on: function(
                    name: string,
                    handler: (param?: string) => void | Promise<void>,
                    id?: number,
                    once: boolean = false
                ): void {
                    clickgo.native.on(name, handler, id, once, taskId);
                },
                once: function(
                    name: string,
                    handler: (param?: string) => void | Promise<void>,
                    id?: number
                ): void {
                    clickgo.native.once(name, handler, id, taskId);
                },
                off: function(name: string, handler: (param?: string) => void | Promise<void>): void {
                    clickgo.native.off(name, handler, taskId);
                },
                clearListener: function(): void {
                    clickgo.native.clearListener(taskId);
                }
            },
            'task': {
                onFrame: function(fun: () => void | Promise<void>, opt: {
                    'scope'?: 'form' | 'task';
                    'count'?: number;
                    'taskId'?: number;
                    'formId'?: number;
                } = {}): number {
                    opt.taskId = taskId;
                    opt.formId = formId;
                    return clickgo.task.onFrame(fun, opt);
                },
                offFrame: function(ft: number, opt: {
                    'taskId'?: number;
                } = {}): void {
                    opt.taskId = taskId;
                    clickgo.task.offFrame(ft, opt);
                },
                get: function(tid: number): types.ITaskInfo | null {
                    return clickgo.task.get(tid);
                },
                getList: function(): Record<string, types.ITaskInfo> {
                    return clickgo.task.getList();
                },
                run: function(url: string, opt: types.ITaskRunOptions = {}): Promise<number> {
                    opt.taskId = taskId;
                    return clickgo.task.run(url, opt);
                },
                end: function(tid: number): boolean {
                    return clickgo.task.end(tid ?? taskId);
                },
                loadLocaleData: function(lang: string, data: Record<string, any>, pre: string = ''): void {
                    clickgo.task.loadLocaleData(lang, data, pre, taskId);
                },
                loadLocale: function(lang: string, path: string): Promise<boolean> {
                    return clickgo.task.loadLocale(lang, path, taskId, formId);
                },
                clearLocale: function(): void {
                    clickgo.task.clearLocale(taskId);
                },
                setLocale: function(lang: string, path: string): Promise<boolean> {
                    return clickgo.task.setLocale(lang, path, taskId, formId);
                },
                setLocaleLang: function(lang: string): void {
                    clickgo.task.setLocaleLang(lang, taskId);
                },
                clearLocaleLang: function(): void {
                    clickgo.task.clearLocaleLang(taskId);
                },
                createTimer: function(
                    fun: () => void | Promise<void>,
                    delay: number,
                    opt: types.ICreateTimerOptions = {}
                ): number {
                    opt.taskId = taskId;
                    if (!opt.formId) {
                        opt.formId = formId;
                    }
                    return clickgo.task.createTimer(fun, delay, opt);
                },
                removeTimer: function(timer: number): void {
                    clickgo.task.removeTimer(timer, taskId);
                },
                sleep: function(fun: () => void | Promise<void>, delay: number): number {
                    return clickgo.task.sleep(fun, delay, taskId, formId);
                },
                systemTaskInfo: clickgo.task.systemTaskInfo,
                setSystem: function(fid?: number): boolean {
                    return clickgo.task.setSystem(fid ?? formId, taskId);
                },
                clearSystem: function(): boolean {
                    return clickgo.task.clearSystem(taskId);
                }
            },
            'theme': {
                read: function(blob: Blob): Promise<types.ITheme | false> {
                    return clickgo.theme.read(blob);
                },
                load: async function(theme?: types.ITheme): Promise<boolean> {
                    if (!theme) {
                        return false;
                    }
                    return clickgo.theme.load(theme, taskId);
                },
                remove: function(name: string): Promise<void> {
                    return clickgo.theme.remove(name, taskId);
                },
                clear: function(): Promise<void> {
                    return clickgo.theme.clear(taskId);
                },
                setGlobal: function(theme: types.ITheme): Promise<void> {
                    return clickgo.theme.setGlobal(theme);
                },
                clearGlobal: function(): void {
                    clickgo.theme.clearGlobal();
                }
            },
            'tool': {
                blob2ArrayBuffer: function(blob: Blob): Promise<ArrayBuffer> {
                    return clickgo.tool.blob2ArrayBuffer(blob);
                },
                clone: function(obj: Record<string, any> | any[]): any[] | any {
                    return clickgo.tool.clone(obj);
                },
                sleep: function(ms: number = 0): Promise<boolean> {
                    return clickgo.tool.sleep(ms);
                },
                purify: function(text: string): string {
                    return clickgo.tool.purify(text);
                },
                createObjectURL: function(object: Blob): string {
                    return clickgo.tool.createObjectURL(object, taskId);
                },
                revokeObjectURL: function(url: string): void {
                    clickgo.tool.revokeObjectURL(url, taskId);
                },
                rand: function(min: number, max: number): number {
                    return clickgo.tool.rand(min, max);
                },
                'RANDOM_N': clickgo.tool.RANDOM_N,
                'RANDOM_U': clickgo.tool.RANDOM_U,
                'RANDOM_L': clickgo.tool.RANDOM_L,
                'RANDOM_UN': clickgo.tool.RANDOM_UN,
                'RANDOM_LN': clickgo.tool.RANDOM_LN,
                'RANDOM_LU': clickgo.tool.RANDOM_LU,
                'RANDOM_LUN': clickgo.tool.RANDOM_LUN,
                'RANDOM_V': clickgo.tool.RANDOM_V,
                'RANDOM_LUNS': clickgo.tool.RANDOM_LUNS,
                random: function(length: number = 8, source: string = clickgo.tool.RANDOM_LN, block: string = ''): string {
                    return clickgo.tool.random(length, source, block);
                },
                getBoolean: function(param: boolean | string | number): boolean {
                    return clickgo.tool.getBoolean(param);
                },
                escapeHTML: function(html: string): string {
                    return clickgo.tool.escapeHTML(html);
                },
                request: function(url: string, opt: types.IRequestOptions): Promise<null | any> {
                    return clickgo.tool.request(url, opt);
                },
                parseUrl: function(url: string): ILoaderUrl {
                    return clickgo.tool.parseUrl(url);
                },
                urlResolve: function(from: string, to: string): string {
                    return clickgo.tool.urlResolve(from, to);
                },
                blob2Text: function(blob: Blob): Promise<string> {
                    return clickgo.tool.blob2Text(blob);
                },
                blob2DataUrl: function(blob: Blob): Promise<string> {
                    return clickgo.tool.blob2DataUrl(blob);
                },
                execCommand: function(ac: string): void {
                    clickgo.tool.execCommand(ac);
                }
            },
            'zip': {
                get: function(data?: types.TZipInputFileFormat) {
                    return clickgo.zip.get(data);
                }
            }
        };
    }
    else {
        invoke.invokeClickgo = clickgo;
    }
    // --- 代码预处理 ---
    const preprocess = clickgo.getSafe() ? function(code: string, path: string): string {
        const exec = /eval\W/.exec(code);
        if (exec) {
            notify({
                'title': 'Error',
                'content': `The "eval" is prohibited.\nFile: "${path}".`,
                'type': 'danger'
            });
            return '';
        }
        return code;
    } : undefined;
    // --- 获取要定义的控件列表 ---
    const components = await control.init(t.id, formId, newBase, preprocess, invoke);
    if (!components) {
        if (form?.vroot.$refs.form.maskFor !== undefined) {
            form.vroot.$refs.form.maskFor = undefined;
        }
        return -5;
    }
    // --- 获取 style、layout ---
    let style = opt.style;
    let layout: string | undefined = opt.layout;
    if (filePath) {
        if (!filePath.startsWith('/package/')) {
            return -6;
        }
        const file = filePath.slice(8);
        const layoutFile = app.files[file + '.xml'] as string;
        if (layoutFile) {
            layout = layoutFile.replace(/^\ufeff/, '');
        }
        const styleFile = app.files[file + '.css'] as string;
        if (styleFile) {
            style = styleFile.replace(/^\ufeff/, '');
        }
    }
    if (layout === undefined) {
        if (form?.vroot.$refs.form.maskFor !== undefined) {
            form.vroot.$refs.form.maskFor = undefined;
        }
        return -7;
    }
    // --- 准备相关变量 ---
    let data: Record<string, any> = {};
    let methods: any = {};
    let computed: any = {};
    let watch = {};
    let beforeCreate: (() => void) | undefined = undefined;
    let created: (() => void) | undefined = undefined;
    let beforeMount: (() => void) | undefined = undefined;
    let mounted: ((data?: Record<string, any>) => void | Promise<void>) | undefined = undefined;
    let beforeUpdate: (() => void) | undefined = undefined;
    let updated: (() => void) | undefined = undefined;
    let beforeUnmount: (() => void) | undefined = undefined;
    let unmounted: (() => void) | undefined = undefined;
    let receive: ((obj: Record<string, any>) => void) | undefined = undefined;
    // --- 检测是否有 js ---
    let expo = opt.code;
    if (filePath?.startsWith('/package/') && app.files[filePath.slice(8) + '.js']) {
        const file = filePath.slice(8);
        if (app.files[file + '.js']) {
            app.files['/invoke/clickgo.js'] = `module.exports = invokeClickgo;`;
            expo = loader.require(file, app.files, {
                'dir': '/',
                'invoke': invoke,
                'preprocess': preprocess,
                'map': {
                    'clickgo': '/invoke/clickgo'
                }
            })[0];
        }
    }
    if (expo) {
        data = expo.data ?? {};
        methods = expo.methods || {};
        computed = expo.computed || {};
        watch = expo.watch || {};
        beforeCreate = expo.beforeCreate;
        created = expo.created;
        beforeMount = expo.beforeMount;
        mounted = expo.mounted;
        beforeUpdate = expo.beforeUpdate;
        updated = expo.updated;
        beforeUnmount = expo.beforeUnmount;
        unmounted = expo.unmounted;
        receive = expo.receive;
    }
    // --- 应用样式表 ---
    let prep = '';
    if (style) {
        // --- 将 style 中的 tag 标签转换为 class，如 button 变为 .tag-button，然后将 class 进行标准程序，添加 prep 进行区分隔离 ---
        const r = tool.stylePrepend(style);
        prep = r.prep;
        style = await tool.styleUrl2DataUrl(newBase, r.style, app.files);
    }
    // --- 要创建的 form 的 layout 所有标签增加 cg 前缀，并增加新的 class 为 tag-xxx ---
    layout = tool.purify(layout);
    // --- 标签增加 cg- 前缀，增加 class 为 tag-xxx ---
    layout = tool.layoutAddTagClassAndReTagName(layout, true);
    // --- 给所有控件传递窗体的 focus 信息 ---
    layout = tool.layoutInsertAttr(layout, ':cg-focus=\'cgFocus\'', {
        'include': [/^cg-.+/]
    });
    // --- 给 layout 的 class 增加前置 ---
    const prepList = ['cg-task' + opt.taskId.toString() + '_'];
    if (prep !== '') {
        prepList.push(prep);
    }
    layout = tool.layoutClassPrepend(layout, prepList);
    // --- 给 event 增加包裹 ---
    layout = tool.eventsAttrWrap(layout);
    // --- 插入 HTML 到 Element ---
    elements.list.insertAdjacentHTML('beforeend', `<div class="cg-form-wrap" data-form-id="${formId.toString()}" data-task-id="${opt.taskId.toString()}"></div>`);
    // --- 获取刚才的 form wrap element 对象 ---
    const el: HTMLElement = elements.list.children.item(elements.list.children.length - 1) as HTMLElement;
    // --- 创建窗体对象 ---
    // --- 初始化系统初始 data ---
    computed.taskId = {
        get: function(): number {
            return taskId;
        },
        set: function(): void {
            notify({
                'title': 'Error',
                'content': `The software tries to modify the system variable "taskId".\nPath: ${this.cgPath}`,
                'type': 'danger'
            });
            return;
        }
    };
    computed.formId = {
        get: function(): number {
            return formId;
        },
        set: function(): void {
            notify({
                'title': 'Error',
                'content': `The software tries to modify the system variable "formId".\nPath: ${this.cgPath}`,
                'type': 'danger'
            });
            return;
        }
    };
    computed.controlName = {
        get: function(): string {
            return 'root';
        },
        set: function(): void {
            notify({
                'title': 'Error',
                'content': `The software tries to modify the system variable "controlName".\nPath: ${this.cgPath}`,
                'type': 'danger'
            });
            return;
        }
    };
    data._cgFocus = false;
    computed.cgFocus = {
        get: function(): number {
            return this._cgFocus;
        },
        set: function(): void {
            notify({
                'title': 'Error',
                'content': `The software tries to modify the system variable "cgFocus".\nPath: ${this.cgPath}`,
                'type': 'danger'
            });
            return;
        }
    };
    computed.cgPath = {
        get: function(): string {
            return newBase;
        },
        set: function(): void {
            notify({
                'title': 'Error',
                'content': `The software tries to modify the system variable "cgPath".\nPath: ${this.cgPath}`,
                'type': 'danger'
            });
            return;
        }
    };
    computed.cgPrep = {
        get: function(): string {
            return prep;
        },
        set: function(): void {
            notify({
                'title': 'Error',
                'content': `The software tries to modify the system variable "cgPrep".\nPath: ${this._cgPath}`,
                'type': 'danger'
            });
            return;
        }
    };
    data._cgCustomZIndex = false;
    computed.cgCustomZIndex = {
        get: function(): number {
            return this._cgCustomZIndex;
        },
        set: function(): void {
            notify({
                'title': 'Error',
                'content': `The software tries to modify the system variable "cgCustomZIndex".\nPath: ${this.cgPath}`,
                'type': 'danger'
            });
            return;
        }
    };
    if (topMost) {
        data._cgTopMost = true;
    }
    else {
        data._cgTopMost = false;
    }
    computed.cgTopMost = {
        get: function(): number {
            return this._cgTopMost;
        },
        set: function(): void {
            notify({
                'title': 'Error',
                'content': `The software tries to modify the system variable "cgTopMost".\nPath: ${this.cgPath}`,
                'type': 'danger'
            });
            return;
        }
    };
    // --- 预设 computed ---
    computed.cgLocale = function(this: types.IVForm): string {
        if (task.list[this.taskId].locale.lang === '') {
            return core.config.locale;
        }
        return task.list[this.taskId].locale.lang;
    };
    // --- 获取语言 ---
    computed.l = function(this: types.IVForm): (key: string) => string {
        return (key: string): string => {
            return task.list[this.taskId].locale.data[this.cgLocale]?.[key] ?? task.list[this.taskId].locale.data['en']?.[key] ?? 'LocaleError';
        };
    };
    // --- layout 中 :class 的转义 ---
    methods.cgClassPrepend = function(this: types.IVForm, cla: any): string {
        if (typeof cla !== 'string') {
            return cla;
        }
        /*
        if (cla.startsWith('cg-')) {
            return cla;
        }
        */
        return `cg-task${this.taskId}_${cla} ${this.cgPrep}${cla}`;
    };
    // --- 判断当前事件可否执行 ---
    methods.cgAllowEvent = function(this: types.IVForm, e: MouseEvent | TouchEvent | KeyboardEvent): boolean {
        return dom.allowEvent(e);
    };
    // --- 窗体接收 send 事件 ---
    methods.cgReceive = function(obj: Record<string, any>) {
        receive?.call(this, obj);
    };
    // --- 挂载 style ---
    if (style) {
        // --- 窗体的 style ---
        dom.pushStyle(taskId, style, 'form', formId);
    }
    // --- 创建 app 对象 ---
    const rtn: {
        'vapp': types.IVueApp;
        'vroot': types.IVForm;
    } = await new Promise(function(resolve) {
        const vapp = Vue.createApp({
            'template': layout!.replace(/^<cg-form/, '<cg-form ref="form"'),
            'data': function() {
                return tool.clone(data);
            },
            'methods': methods,
            'computed': computed,
            'watch': watch,

            'beforeCreate': beforeCreate,
            'created': created,
            'beforeMount': beforeMount,
            'mounted': async function(this: types.IVForm) {
                await this.$nextTick();
                // --- 判断是否有 icon，对 icon 进行第一次读取 ---
                // --- 为啥要在这搞，因为 form 控件中读取，将可能导致下方的 formCreate 事件获取不到 icon 图标 ---
                // --- 而如果用延迟的方式获取，将可能导致 changeFocus 的窗体焦点事件先于 formCreate 触发 ---
                if (this.$refs.form.icon !== '') {
                    const icon = await clickgo.fs.getContent(this.$refs.form.icon);
                    this.$refs.form.iconData = (icon instanceof Blob) ? await clickgo.tool.blob2DataUrl(icon) : '';
                }
                // --- 完成 ---
                resolve({
                    'vapp': vapp,
                    'vroot': this
                });
            },
            'beforeUpdate': beforeUpdate,
            'updated': async function(this: types.IVue) {
                await this.$nextTick();
                updated?.call(this);
            },
            'beforeUnmount': beforeUnmount,
            'unmounted': unmounted,
        });
        vapp.config.errorHandler = function(err: Error, vm: types.IVForm, info: string): void {
            notify({
                'title': 'Runtime Error',
                'content': `Message: ${err.message}\ntask id: ${vm.taskId}\nForm id: ${vm.formId}`,
                'type': 'danger'
            });
            core.trigger('error', vm.taskId, vm.formId, err, info);
        };
        // --- 挂载控件对象到 vapp ---
        for (const key in components) {
            vapp.component(key, components[key]);
        }
        vapp.mount(el);
    });
    // --- 创建 form 信息对象 ---
    const nform: types.IForm = {
        'id': formId,
        'vapp': rtn.vapp,
        'vroot': rtn.vroot,
        'events': {}
    };
    // --- 挂载 form ---
    t.forms[formId] = nform;
    // --- 检测 mask ---
    if (opt.mask && form) {
        form.vroot.$refs.form.maskFor = formId;
        nform.vroot.$refs.form.maskFrom = form.id;
    }
    // --- 执行 mounted ---
    await tool.sleep(34);
    if (mounted) {
        try {
            await mounted.call(rtn.vroot, opt.data);
        }
        catch (err: any) {
            if (nform?.vroot.$refs.form.maskFor !== undefined) {
                nform.vroot.$refs.form.maskFor = undefined;
            }
            core.trigger('error', rtn.vroot.taskId, rtn.vroot.formId, err, 'Create form mounted error.');
            t.forms[formId] = undefined as any;
            delete t.forms[formId];
            rtn.vapp.unmount();
            rtn.vapp._container.remove();
            dom.removeStyle(rtn.vroot.taskId, 'form', rtn.vroot.formId);
            return -8;
        }
    }
    // --- 将窗体居中 ---
    const area = core.getAvailArea();
    if (!rtn.vroot.$refs.form.stateMaxData) {
        if (rtn.vroot.$refs.form.left === -1) {
            rtn.vroot.$refs.form.setPropData('left', (area.width - rtn.vroot.$el.offsetWidth) / 2);
        }
        if (rtn.vroot.$refs.form.top === -1) {
            rtn.vroot.$refs.form.setPropData('top', (area.height - rtn.vroot.$el.offsetHeight) / 2);
        }
    }
    if (rtn.vroot.$refs.form.zIndex !== -1) {
        rtn.vroot._cgCustomZIndex = true;
    }
    if (rtn.vroot.$refs.form.$data.show !== false) {
        rtn.vroot.$refs.form.$data.showData = true;
    }
    // --- 触发 formCreated 事件 ---
    core.trigger('formCreated', taskId, formId, rtn.vroot.$refs.form.title, rtn.vroot.$refs.form.iconData);
    // --- 绑定获取焦点事件 ---
    changeFocus(formId);
    return nform;
}

/**
 * --- 显示一个 dialog ---
 * @param opt 选项或者一段文字
 */
export function dialog(opt: string | types.IFormDialogOptions): Promise<string> {
    return new Promise(function(resolve) {
        if (typeof opt === 'string') {
            opt = {
                'content': opt
            };
        }
        const formId = opt.formId;
        if (!formId) {
            resolve('');
            return;
        }
        const taskId = getTaskId(formId);
        const t = task.list[taskId];
        if (!t) {
            resolve('');
            return;
        }
        const locale = t.forms[formId].vroot.cgLocale;
        if (opt.buttons === undefined) {
            opt.buttons = [info.locale[locale]?.ok ?? info.locale['en'].ok];
        }
        create({
            'taskId': taskId,
            'formId': formId,
            'layout': `<form title="${opt.title ?? 'dialog'}" width="auto" height="auto" :min="false" :max="false" :resize="false" border="${opt.title ? 'normal' : 'plain'}" direction="v"><dialog :buttons="buttons" @select="select">${opt.content}</dialog></form>`,
            'code': {
                data: {
                    'buttons': opt.buttons
                },
                methods: {
                    select: function(this: types.IVForm, button: string) {
                        const event = {
                            'go': true,
                            preventDefault: function() {
                                this.go = false;
                            }
                        };
                        (opt as types.IFormDialogOptions).select?.(event as unknown as Event, button);
                        if (event.go) {
                            close(this.formId);
                            resolve(button);
                        }
                    }
                }
            },
            'mask': true
        }).catch((e) => {
            throw e;
        });
    });
}

/**
 * --- 显示一个 confirm ---
 * @param opt 选项或者一段文字
 */
export async function confirm(opt: string | types.IFormConfirmOptions): Promise<boolean | number> {
    if (typeof opt === 'string') {
        opt = {
            'content': opt
        };
    }
    const formId = opt.formId;
    if (!formId) {
        return false;
    }
    const taskId = getTaskId(formId);
    const t = task.list[taskId];
    if (!t) {
        return false;
    }
    const locale = t.forms[formId].vroot.cgLocale;
    const buttons = [info.locale[locale]?.yes ?? info.locale['en'].yes, info.locale[locale]?.no ?? info.locale['en'].no];
    if (opt.cancel) {
        buttons.push(info.locale[locale]?.cancel ?? info.locale['en'].cancel);
    }
    const res = await dialog({
        'formId': formId,

        'content': opt.content,
        'buttons': buttons
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
 * --- 设置窗体置顶和取消置顶 ---
 * @param top true: 置顶, false: 不置顶
 * @param opt 选项
 */
export function setTopMost(top: boolean, opt: types.IFormSetTopMostOptions = {}): void {
    const form = getForm(opt.taskId, opt.formId);
    if (!form) {
        return;
    }
    form.vroot.$data._cgCustomZIndex = false;
    if (top) {
        // --- 置顶 ---
        form.vroot.$data._cgTopMost = true;
        if (!form.vroot.cgFocus) {
            changeFocus(form.id);
        }
        else {
            form.vroot.$refs.form.setPropData('zIndex', ++info.topLastZIndex);
        }
    }
    else {
        // --- 取消置顶 ---
        form.vroot.$data._cgTopMost = false;
        form.vroot.$refs.form.setPropData('zIndex', ++info.lastZIndex);
    }
}

/**
 * --- 让窗体闪烁 ---
 * @param formId 要闪烁的窗体 id，必填，但 App 模式下留空为当前窗体
 * @param taskId 所属的 taskId，必填，但 App 模式下无效
 */
export function flash(formId?: number, taskId?: number): void {
    const form = getForm(taskId, formId);
    if (!form) {
        return;
    }
    if (!form.vroot.cgFocus) {
        changeFocus(form.id);
    }
    if (form.vroot.$refs.form?.flashTimer) {
        clearTimeout(form.vroot.$refs.form.flashTimer);
        form.vroot.$refs.form.flashTimer = undefined;
    }
    form.vroot.$refs.form.flashTimer = setTimeout(() => {
        if (form.vroot.$refs.form) {
            form.vroot.$refs.form.flashTimer = undefined;
        }
    }, 1000);
    // --- 触发 formFlash 事件 ---
    core.trigger('formFlash', taskId, formId);
}

/**
 * --- 让窗体显示 ---
 * @param formId 要显示的窗体 id，App 模式下留空为当前窗体
 * @param taskId 所属的 taskId，App 模式下无效
 */
export function show(formId?: number, taskId?: number): void {
    const form = getForm(taskId, formId);
    if (!form) {
        return;
    }
    form.vroot.$refs.form.$data.showData = true;
}

/**
 * --- 让窗体隐藏 ---
 * @param formId 要隐藏的窗体 id，App 模式下留空为当前窗体
 * @param taskId 所属的 taskId，App 模式下无效
 */
export function hide(formId?: number, taskId?: number): void {
    const form = getForm(taskId, formId);
    if (!form) {
        return;
    }
    form.vroot.$refs.form.$data.showData = false;
}

// --- 绑定 resize 事件 ---
window.addEventListener('resize', function(): void {
    // --- 触发 screenResize 事件 ---
    task.refreshSystemPosition(); // 会在里面自动触发 screenResize 事件
});

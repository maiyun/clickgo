/**
 * Copyright 2021 Han Guoshuai <zohegs@gmail.com>
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

/** --- 当前显示的 pop 列表 --- */
const popList: HTMLElement[] = [];
const popElList: HTMLElement[] = [];
/** --- 最后一个窗体 id --- */
let lastFormId: number = 0;
/** --- 最后一个层级 --- */
let lastZIndex: number = 999;
/** --- top 的最后一个层级 --- */
let lastTopZIndex: number = 9999999;
/** --- pop 最后一个层级 --- */
let lastPopZIndex: number = 0;

/** --- form lib 用到的语言包 --- */
const localeData: Record<string, {
    'ok': string;
    'yes': string;
    'no': string;
    'cancel': string;
}> = {
    'en': {
        'ok': 'OK',
        'yes': 'Yes',
        'no': 'No',
        'cancel': 'Cancel'
    },
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
    'ja': {
        'ok': '好',
        'yes': 'はい',
        'no': 'いいえ',
        'cancel': 'キャンセル'
    }
};

/** --- clickgo 所有的 div wrap --- */
const wrapElement: HTMLDivElement = document.createElement('div');
wrapElement.id = 'cg-wrap';
document.getElementsByTagName('body')[0].appendChild(wrapElement);
if (clickgo.native) {
    wrapElement.addEventListener('mouseenter', function() {
        clickgo.core.sendNative('cg-mouse-ignore', 'false');
    });
    wrapElement.addEventListener('mouseleave', function() {
        clickgo.core.sendNative('cg-mouse-ignore', 'true');
    });
}

/** --- form list 的 div --- */
const formListElement: HTMLDivElement = document.createElement('div');
formListElement.id = 'cg-form-list';
wrapElement.appendChild(formListElement);
formListElement.addEventListener('touchmove', function(e): void {
    // --- 防止拖动时整个网页跟着动 ---
    if (e.cancelable) {
        e.preventDefault();
    }
    // --- 为啥要在这加，因为有些设备性能不行，在 touchstart 之时添加的 touchmove 不能立马响应，导致网页还是跟着动，所以增加此函数 ---
}, {
    'passive': false
});
formListElement.addEventListener('wheel', function(e): void {
    // --- 防止不小心前进后退，或上下缓动滚动（Mac） ---
    e.preventDefault();
}, {
    'passive': false
});
formListElement.addEventListener('contextmenu', function(e): void {
    e.preventDefault();
});

/** --- pop list 的 div --- */
const popListElement: HTMLDivElement = document.createElement('div');
popListElement.id = 'cg-pop-list';
popListElement.addEventListener('contextmenu', function(e): void {
    e.preventDefault();
});
wrapElement.appendChild(popListElement);
popListElement.addEventListener('touchmove', function(e): void {
    // --- 防止拖动时整个网页跟着动 ---
    e.preventDefault();
}, {
    'passive': false
});

// --- 从鼠标指针处从小到大缩放然后淡化的圆圈动画特效对象 ---
const circularElement: HTMLDivElement = document.createElement('div');
circularElement.id = 'cg-circular';
wrapElement.appendChild(circularElement);

// --- 从鼠标指针处开始从小到大缩放并铺满屏幕（或任意大小矩形）的对象 ---
const rectangleElement: HTMLDivElement = document.createElement('div');
rectangleElement.setAttribute('data-pos', '');
rectangleElement.id = 'cg-rectangle';
wrapElement.appendChild(rectangleElement);

// --- 手势有效无效的圆圈 ---
const gestureElement: HTMLDivElement = document.createElement('div');
gestureElement.id = 'cg-gesture';
wrapElement.appendChild(gestureElement);

// --- 添加 cg-simpletask 的 dom ---
const simpletaskElement: HTMLDivElement = document.createElement('div');
simpletaskElement.id = 'cg-simpletask';
simpletaskElement.addEventListener('contextmenu', function(e): void {
    e.preventDefault();
});
wrapElement.appendChild(simpletaskElement);
simpletaskElement.addEventListener('touchmove', function(e): void {
    // --- 防止拖动时整个网页跟着动 ---
    e.preventDefault();
}, {
    'passive': false
});
export let simpletaskRoot: IVue;
const simpletaskApp = Vue.createApp({
    'template': '<div v-for="(item, formId) of forms" class="cg-simpletask-item" @click="click(parseInt(formId))"><div v-if="item.icon" class="cg-simpletask-icon" :style="{\'background-image\': \'url(\' + item.icon + \')\'}"></div><div>{{item.title}}</div></div>',
    'data': function() {
        return {
            'forms': {}
        };
    },
    'watch': {
        'forms': {
            handler: function(this: IVue) {
                const length = Object.keys(this.forms).length;
                if (length > 0) {
                    if (simpletaskElement.style.bottom !== '0px') {
                        simpletaskElement.style.bottom = '0px';
                        clickgo.core.trigger('screenResize');
                    }
                }
                else {
                    if (simpletaskElement.style.bottom === '0px') {
                        simpletaskElement.style.bottom = '-46px';
                        clickgo.core.trigger('screenResize');
                    }
                }
            },
            'deep': true
        }
    },
    'methods': {
        click: function(this: IVue, formId: number): void {
            changeFocus(formId);
        }
    },
    'mounted': function(this: IVue): void {
        simpletaskRoot = this;
    }
});
simpletaskApp.mount('#cg-simpletask');

/** --- task 的信息 --- */
export const taskInfo: ICGFormTaskInfo = Vue.reactive({
    'taskId': 0,
    'formId': 0,
    'length': 0
});

/**
 * --- 将任务注册为系统 task ---
 * @param taskId task id
 * @param formId tasb bar 的 form id
 */
export function setTask(taskId: number, formId: number): boolean {
    const task = clickgo.task.list[taskId];
    if (!task) {
        return false;
    }
    const form = task.forms[formId];
    if (!form) {
        return false;
    }
    if (form.vroot.position === undefined) {
        notify({
            'title': 'Warning',
            'content': `Task id is "${taskId}" app is not an available task app, position not found.`,
            'type': 'warning'
        });
        return false;
    }
    if (taskInfo.taskId > 0) {
        notify({
            'title': 'Info',
            'content': 'More than 1 system-level task application is currently running.',
            'type': 'info'
        });
    }
    taskInfo.taskId = taskId;
    taskInfo.formId = formId;
    simpletaskRoot.forms = {};
    refreshTaskPosition();
    return true;
}

/**
 * --- 清除 task bar 设定 ---
 * @param taskId 清除的 taskid 为 task id 才能清除
 */
export function clearTask(taskId: number): boolean {
    if (typeof taskId !== 'number') {
        notify({
            'title': 'Warning',
            'content': 'The "formId" of "clearTask" must be a number type.',
            'type': 'warning'
        });
        return false;
    }
    if (taskInfo.taskId !== taskId) {
        return false;
    }
    taskInfo.taskId = 0;
    taskInfo.formId = 0;
    taskInfo.length = 0;
    clickgo.core.trigger('screenResize');
    // --- 如果此时已经有最小化的窗体，那么他将永远“不见天日”，需要将他们传递给 simpletask ---
    const tasks = clickgo.task.getList();
    for (const taskId in tasks) {
        const forms = getList(parseInt(taskId));
        for (const formId in forms) {
            const form = forms[formId];
            if (!form.stateMin) {
                continue;
            }
            simpletaskRoot.forms[formId] = {
                'title': form.title,
                'icon': form.icon
            };
        }
    }
    return true;
}

/**
 * --- 刷新 task bar 的 form 的位置以及 length ---
 */
export function refreshTaskPosition(): void {
    if (taskInfo.taskId > 0) {
        const form = clickgo.task.list[taskInfo.taskId].forms[taskInfo.formId];
        // --- 更新 task bar 的位置 ---
        switch (clickgo.core.config['task.position']) {
            case 'left':
            case 'right': {
                form.vroot.$refs.form.setPropData('width', 'auto');
                form.vroot.$refs.form.setPropData('height', document.body.clientHeight);
                break;
            }
            case 'top':
            case 'bottom': {
                form.vroot.$refs.form.setPropData('width', document.body.clientWidth);
                form.vroot.$refs.form.setPropData('height', 'auto');
                break;
            }
        }
        setTimeout(function() {
            switch (clickgo.core.config['task.position']) {
                case 'left': {
                    taskInfo.length = form.vroot.$el.offsetWidth;
                    form.vroot.$refs.form.setPropData('left', 0);
                    form.vroot.$refs.form.setPropData('top', 0);
                    break;
                }
                case 'right': {
                    taskInfo.length = form.vroot.$el.offsetWidth;
                    form.vroot.$refs.form.setPropData('left', document.body.clientWidth - taskInfo.length);
                    form.vroot.$refs.form.setPropData('top', 0);
                    break;
                }
                case 'top': {
                    taskInfo.length = form.vroot.$el.offsetHeight;
                    form.vroot.$refs.form.setPropData('left', 0);
                    form.vroot.$refs.form.setPropData('top', 0);
                    break;
                }
                case 'bottom': {
                    taskInfo.length = form.vroot.$el.offsetHeight;
                    form.vroot.$refs.form.setPropData('left', 0);
                    form.vroot.$refs.form.setPropData('top', document.body.clientHeight - taskInfo.length);
                    break;
                }
            }
            clickgo.core.trigger('screenResize');
        }, 50);
    }
    else {
        clickgo.core.trigger('screenResize');
    }
}

/**
 * --- 获取屏幕可用区域 ---
 */
export function getAvailArea(): ICGFormAvailArea {
    if (Object.keys(simpletaskRoot.forms).length > 0) {
        return {
            'left': 0,
            'top': 0,
            'width': document.body.clientWidth,
            'height': document.body.clientHeight - 46
        };
    }
    else {
        let left: number = 0;
        let top: number = 0;
        let width: number = 0;
        let height: number = 0;
        switch (clickgo.core.config['task.position']) {
            case 'left': {
                left = taskInfo.length;
                top = 0;
                width = document.body.clientWidth - taskInfo.length;
                height = document.body.clientHeight;
                break;
            }
            case 'right': {
                left = 0;
                top = 0;
                width = document.body.clientWidth - taskInfo.length;
                height = document.body.clientHeight;
                break;
            }
            case 'top': {
                left = 0;
                top = taskInfo.length;
                width = document.body.clientWidth;
                height = document.body.clientHeight - taskInfo.length;
                break;
            }
            case 'bottom': {
                left = 0;
                top = 0;
                width = document.body.clientWidth;
                height = document.body.clientHeight - taskInfo.length;
            }
        }
        return {
            'left': left,
            'top': top,
            'width': width,
            'height': height
        };
    }
}

/**
 *  --- 将所有已经最大化的窗体的大小重置 ---
 */
export function refreshMaxPosition(): void {
    const area = getAvailArea();
    for (let i = 0; i < formListElement.children.length; ++i) {
        const el = formListElement.children.item(i) as HTMLElement;
        const ef = el.children.item(0) as HTMLElement;
        if (ef.dataset.cgMax === undefined) {
            continue;
        }
        const taskId = parseInt(el.getAttribute('data-task-id')!);
        const formId = parseInt(el.getAttribute('data-form-id')!);
        if (!clickgo.task.list[taskId]) {
            continue;
        }
        const vroot = clickgo.task.list[taskId].forms[formId].vroot;
        vroot.$refs.form.setPropData('left', area.left);
        vroot.$refs.form.setPropData('top', area.top);
        vroot.$refs.form.setPropData('width', area.width);
        vroot.$refs.form.setPropData('height', area.height);
    }
}

export function getTaskId(formId: number): number {
    const formElement = formListElement.querySelector(`[data-form-id='${formId}']`);
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

export function min(formId: number): boolean {
    const taskId: number = getTaskId(formId);
    const task = clickgo.task.list[taskId];
    if (!task) {
        return false;
    }
    task.forms[formId].vroot.cgMin();
    return true;
}

export function get(formId: number): ICGFormItem | null {
    const taskId: number = getTaskId(formId);
    if (taskId === 0) {
        return null;
    }
    const item = clickgo.task.list[taskId].forms[formId];
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
    const item = clickgo.task.list[taskId].forms[formId];
    if (!item.vroot.cgReceive) {
        return;
    }
    item.vroot.cgReceive(obj);
}

/**
 * --- 获取 form list 的简略情况 ---
 * @param taskId 任务 ID
 */
export function getList(taskId: number): Record<string, ICGFormItem> {
    if (!clickgo.task.list[taskId]) {
        return {};
    }
    const list: Record<string, ICGFormItem> = {};
    for (const fid in clickgo.task.list[taskId].forms) {
        const item = clickgo.task.list[taskId].forms[fid];
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
                const task = clickgo.task.list[taskId];
                task.forms[dataFormIdNumber].vapp._container.removeAttribute('data-cg-focus');
                task.forms[dataFormIdNumber].vroot._cgFocus = false;
                // --- 触发 formBlurred 事件 ---
                clickgo.core.trigger('formBlurred', taskId, dataFormIdNumber);
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
    if ((el.childNodes.item(0) as HTMLElement).dataset.cgMin !== undefined) {
        min(formId);
    }
    // --- 获取所属的 taskId ---
    const taskId: number = parseInt(el.getAttribute('data-task-id') ?? '0');
    const task = clickgo.task.list[taskId];
    // --- 如果不是自定义的 zindex，则设置 zIndex 为最大 ---
    if (!task.forms[formId].vroot.cgCustomZIndex) {
        if (task.forms[formId].vroot.cgTopMost) {
            task.forms[formId].vroot.$refs.form.setPropData('zIndex', ++lastTopZIndex);
        }
        else {
            task.forms[formId].vroot.$refs.form.setPropData('zIndex', ++lastZIndex);
        }
    }
    // --- 检测 maskFor ---
    const maskFor = task.forms[formId].vroot.$refs.form.maskFor;
    if ((typeof maskFor === 'number') && (clickgo.task.list[taskId].forms[maskFor])) {
        // --- 有 maskFor 窗体 ---
        // --- 如果是最小化状态的话，需要还原 ---
        if (get(maskFor)!.stateMin) {
            min(maskFor);
        }
        // --- 如果不是自定义的 zindex，则设置 zIndex 为最大 ---
        if (!clickgo.task.list[taskId].forms[maskFor].vroot.cgCustomZIndex) {
            if (clickgo.task.list[taskId].forms[maskFor].vroot.cgTopMost) {
                clickgo.task.list[taskId].forms[maskFor].vroot.$refs.form.setPropData('zIndex', ++lastTopZIndex);
            }
            else {
                clickgo.task.list[taskId].forms[maskFor].vroot.$refs.form.setPropData('zIndex', ++lastZIndex);
            }
        }
        // --- 开启 focus ---
        clickgo.task.list[taskId].forms[maskFor].vapp._container.dataset.cgFocus = '';
        clickgo.task.list[taskId].forms[maskFor].vroot._cgFocus = true;
        // --- 触发 formFocused 事件 ---
        clickgo.core.trigger('formFocused', taskId, maskFor);
        // --- 闪烁 ---
        clickgo.task.list[taskId].forms[maskFor].vroot.cgFlash();
    }
    else {
        // --- 正常开启 focus ---
        task.forms[formId].vapp._container.dataset.cgFocus = '';
        task.forms[formId].vroot._cgFocus = true;
        // --- 触发 formFocused 事件 ---
        clickgo.core.trigger('formFocused', taskId, formId);
    }
}

/**
 * --- 获取当前 z-index 值最大的 form id（除了 top 模式的窗体和最小化的窗体） --- TODO 排除 task 或者 form id
 */
export function getMaxZIndexFormID(out: {
    'taskIds'?: number[];
    'formIds'?: number[];
} = {}): number | null {
    let zIndex: number = 0;
    let formId: number | null = null;
    for (let i = 0; i < formListElement.children.length; ++i) {
        const root = formListElement.children.item(i) as HTMLDivElement;
        const formWrap = root.children.item(0) as HTMLDivElement;
        // --- 排除 top most 窗体 ---
        const z = parseInt(formWrap.style.zIndex);
        if (z > 9999999) {
            continue;
        }
        // --- 排除最小化窗体 ---
        if (formWrap.dataset.cgMin !== undefined) {
            continue;
        }
        // --- 排除用户定义的 task id 窗体 ---
        const tid = parseInt(root.getAttribute('data-task-id')!);
        if (out.taskIds?.includes(tid)) {
            continue;
        }
        // --- 排除用户定义的 form id 窗体 ---
        const fid = parseInt(root.getAttribute('data-form-id')!);
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
export function getRectByBorder(border: TCGBorder): { 'width': number; 'height': number; 'left': number; 'top': number; } {
    const area = getAvailArea();
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
    circularElement.style.transition = 'none';
    requestAnimationFrame(function() {
        circularElement.style.width = '6px';
        circularElement.style.height = '6px';
        circularElement.style.left = (x - 3).toString() + 'px';
        circularElement.style.top = (y - 3).toString() + 'px';
        circularElement.style.opacity = '1';
        requestAnimationFrame(function() {
            circularElement.style.transition = 'all .3s ease-out';
            requestAnimationFrame(function() {
                circularElement.style.width = '60px';
                circularElement.style.height = '60px';
                circularElement.style.left = (x - 30).toString() + 'px';
                circularElement.style.top = (y - 30).toString() + 'px';
                circularElement.style.opacity = '0';
            });
        });
    });
}

/**
 * --- 移动矩形到新位置 ---
 * @param border 显示的位置代号
 */
export function moveRectangle(border: TCGBorder): void {
    const dataReady = rectangleElement.getAttribute('data-ready') ?? '0';
    if (dataReady === '0') {
        return;
    }
    const dataBorder = rectangleElement.getAttribute('data-border') ?? '';
    const setDataBorder = typeof border === 'string' ? border : `o-${border.left}-${border.top ?? 'n'}-${border.width}-${border.height ?? 'n'}`;
    if (dataBorder === setDataBorder) {
        return;
    }
    rectangleElement.setAttribute('data-dir', setDataBorder);
    const pos = getRectByBorder(border);
    const width = pos.width - 20;
    const height = pos.height - 20;
    const left = pos.left + 10;
    const top = pos.top + 10;
    if (width !== undefined && height !== undefined && left !== undefined && top !== undefined) {
        rectangleElement.style.width = width.toString() + 'px';
        rectangleElement.style.height = height.toString() + 'px';
        rectangleElement.style.left = left.toString() + 'px';
        rectangleElement.style.top = top.toString() + 'px';
    }
}

/**
 * --- 显示从小到大的矩形动画特效对象 ---
 * @param x 起始位置
 * @param y 起始位置
 * @param border 最大时位置代号
 */
export function showRectangle(x: number, y: number, border: TCGBorder): void {
    rectangleElement.style.transition = 'none';
    requestAnimationFrame(function() {
        rectangleElement.style.width = '5px';
        rectangleElement.style.height = '5px';
        rectangleElement.style.left = (x - 10).toString() + 'px';
        rectangleElement.style.top = (y - 10).toString() + 'px';
        rectangleElement.style.opacity = '1';
        rectangleElement.setAttribute('data-ready', '0');
        rectangleElement.setAttribute('data-dir', '');
        requestAnimationFrame(function() {
            rectangleElement.style.transition = 'all .2s ease-out';
            requestAnimationFrame(function() {
                rectangleElement.setAttribute('data-ready', '1');
                moveRectangle(border);
            });
        });
    });
}

/**
 * --- 结束时请隐藏矩形 ---
 */
export function hideRectangle(): void {
    rectangleElement.style.opacity = '0';
}

// --- 添加 cg-system 的 dom ---
const systemElement: HTMLDivElement = document.createElement('div');
systemElement.id = 'cg-system';
systemElement.addEventListener('contextmenu', function(e): void {
    e.preventDefault();
});
wrapElement.appendChild(systemElement);
systemElement.addEventListener('touchmove', function(e): void {
    // --- 防止拖动时整个网页跟着动 ---
    e.preventDefault();
}, {
    'passive': false
});
let notifyTop: number = 10;
let notifyId: number = 0;
export function notify(opt: {
    'title': string;
    'content': string;
    'icon'?: string;
    'timeout'?: number;
    'type'?: 'primary' | 'info' | 'warning' | 'danger' | 'progress';
    'progress'?: boolean;
}): number {
    // --- 申请 nid ---
    const nid = ++notifyId;
    // --- 设置 timeout ---
    let timeout = 5000;
    if (opt.timeout !== undefined) {
        if (opt.timeout <= 0 || opt.timeout > 300000) {
            timeout = 300000;
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
    el.innerHTML = `<div class="cg-system-icon cg-system-icon-${clickgo.tool.escapeHTML(opt.type ?? 'primary')}"></div>
<div style="flex: 1;">
    <div class="cg-system-notify-title">${clickgo.tool.escapeHTML(opt.title)}</div>
    <div class="cg-system-notify-content">${clickgo.tool.escapeHTML(opt.content).replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\n/g, '<br>')}</div>
    ${opt.progress ? '<div class="cg-system-notify-progress"></div>' : ''}
</div>`;
    if (opt.icon) {
        (el.childNodes.item(0) as HTMLElement).style.background = 'url(' + opt.icon + ')';
        (el.childNodes.item(0) as HTMLElement).style.backgroundSize = '16px';
    }
    systemElement.appendChild(el);
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

export function notifyProgress(notifyId: number, per: number): void {
    const el: HTMLElement = systemElement.querySelector(`[data-notifyid="${notifyId}"]`)!;
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

export function hideNotify(notifyId: number): void {
    const el: HTMLElement = systemElement.querySelector(`[data-notifyid="${notifyId}"]`)!;
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
    popListElement.appendChild(el);
}

/**
 * --- 将标签从 pop 层移除 ---
 * @param el 要移除的标签
 */
export function removeFromPop(el: HTMLElement): void {
    popListElement.removeChild(el);
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
    const parentPop = clickgo.dom.findParentByData(el, 'cg-pop');
    if (parentPop) {
        for (let i = 0; i < popList.length; ++i) {
            if (popList[i] !== parentPop) {
                continue;
            }
            if (!popElList[i + 1]) {
                continue;
            }
            hidePop(popElList[i + 1]);
        }
    }
    else {
        // --- 本层不是 pop，因此要隐藏所有 pop ---
        hidePop();
    }
    // --- 检测如果 pop 是 undefined 还显示吗 ---
    if (!pop) {
        popElList.push(el);
        el.dataset.cgPopOpen = '';
        el.dataset.cgLevel = (popElList.length - 1).toString();
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
    pop.style.zIndex = (++lastPopZIndex).toString();
    if (opt.size.width) {
        pop.style.width = opt.size.width.toString() + 'px';
    }
    if (opt.size.height) {
        pop.style.height = opt.size.height.toString() + 'px';
    }
    popList.push(pop);
    popElList.push(el);
    pop.dataset.cgOpen = '';
    pop.dataset.cgLevel = (popList.length - 1).toString();
    el.dataset.cgPopOpen = '';
    el.dataset.cgLevel = (popElList.length - 1).toString();
}

/**
 * --- 隐藏正在显示中的所有 pop，或指定 pop/el ---
 */
export function hidePop(pop?: HTMLElement): void {
    if (!pop) {
        if (popElList.length === 0) {
            return;
        }
        hidePop(popElList[0]);
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
    if (popElList[level + 1]) {
        hidePop(popElList[level + 1]);
    }
    if (isPop) {
        pop.removeAttribute('data-cg-open');
        pop.removeAttribute('data-cg-level');
        popElList[level].removeAttribute('data-cg-pop-open');
        popElList[level].removeAttribute('data-cg-level');
    }
    else {
        if (popList[level]) {
            popList[level].removeAttribute('data-cg-open');
            popList[level].removeAttribute('data-cg-level');
        }
        pop.removeAttribute('data-cg-pop-open');
        pop.removeAttribute('data-cg-level');
    }
    popList.splice(level);
    popElList.splice(level);
}

/**
 * --- 点下 (mousedown / touchstart) 屏幕任意一位置时根据点击处处理隐藏 pop 和焦点丢失事件，鼠标和 touch 只会响应一个 ---
 * @param e 事件对象
 */
export function doFocusAndPopEvent(e: MouseEvent | TouchEvent): void {
    if (clickgo.dom.hasTouchButMouse(e)) {
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
    if (clickgo.task.list[taskId].forms[formId]) {
        title = clickgo.task.list[taskId].forms[formId].vroot.$refs.form.title;
        icon = clickgo.task.list[taskId].forms[formId].vroot.$refs.form.iconData;
        if (clickgo.task.list[taskId].forms[formId].vroot.$refs.form.maskFrom !== undefined) {
            const fid = clickgo.task.list[taskId].forms[formId].vroot.$refs.form.maskFrom;
            clickgo.task.list[taskId].forms[fid].vroot.$refs.form.maskFor = undefined;
        }
        clickgo.task.list[taskId].forms[formId].vroot.$refs.form.$data.showData = false;
        setTimeout(function() {
            // --- 获取最大的 z index 窗体，并让他获取焦点 ---
            const fid = getMaxZIndexFormID({
                'formIds': [formId]
            });
            if (fid) {
                changeFocus(fid);
            }
            else {
                changeFocus();
            }
            // --- 延长 100 秒是为了响应 100 毫秒的动画 ---
            if (!clickgo.task.list[taskId]) {
                // --- 可能这时候 task 已经被结束了 ---
                return true;
            }
            clickgo.task.list[taskId].forms[formId].vapp.unmount();
            clickgo.task.list[taskId].forms[formId].vapp._container.remove();
            delete clickgo.task.list[taskId].forms[formId];
            // --- 移除 form 的 style ---
            clickgo.dom.removeStyle(taskId, 'form', formId);
            // --- 触发 formRemoved 事件 ---
            clickgo.core.trigger('formRemoved', taskId, formId, title, icon);
            // --- 检测是否已经没有窗体了，如果没有了的话就要结束任务了 ---
            if (Object.keys(clickgo.task.list[taskId].forms).length === 0) {
                clickgo.task.end(taskId);
            }
        }, 100);
        return true;
    }
    else {
        return false;
    }
}

/**
 * --- 直接创建一个窗体(需要验证传入 code、layout 等是否能成功创建) ---
 * @param opt 创建窗体的配置对象
 */
export async function create(taskId: number, opt: ICGFormCreateOptions): Promise<number | ICGForm> {
    const cgPath: string = opt.file ?? opt.path ?? '/';
    /** --- 当前的 Task 对象 --- */
    const task = clickgo.task.list[taskId];
    if (!task) {
        return -1;
    }
    /** --- 当前的 APP PKG --- */
    const appPkg: ICGAppPkg = task.appPkg;
    // ---  申请 formId ---
    const formId = ++lastFormId;
    // --- 注入的参数，屏蔽浏览器全局对象，注入新的对象 ---
    const invoke: Record<string, any> = {};
    if (clickgo.safe) {
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
            if ([
                'require',
                '__awaiter', 'eval', 'Math', 'Array', 'Blob', 'Infinity', 'parseInt', 'parseFloat', 'Promise', 'Date', 'JSON', 'fetch'].includes(k)) {
                continue;
            }
            invoke[k] = undefined;
        }
        invoke.clickgo = {
            'core': {},
            'dom': {},
            'form': {},
            'task': {},
            'tool': {},
            'zip': {}
        };
        for (const k in clickgo.core) {
            if (!['config', 'getNativeListeners', 'regModule', 'initModules', 'getModule', 'trigger'].includes(k)) {
                continue;
            }
            invoke.clickgo.core[k] = (clickgo.core as any)[k];
        }
        for (const k in clickgo.dom) {
            if (!['setGlobalCursor', 'hasTouchButMouse', 'getStyleCount', 'getSize', 'watchSize', 'watch', 'watchStyle', 'bindDown', 'bindGesture', 'bindLong', 'is', 'bindMove', 'bindResize', 'findParentByData', 'siblings', 'siblingsData', 'fullscreen'].includes(k)) {
                continue;
            }
            invoke.clickgo.dom[k] = (clickgo.dom as any)[k];
        }
        for (const k in clickgo.form) {
            if (!['taskInfo', 'setTask', 'clearTask', 'getAvailArea', 'getTaskId', 'min', 'get', 'send', 'getList', 'changeFocus', 'getMaxZIndexFormID', 'getRectByBorder', 'showCircular', 'moveRectangle', 'showRectangle', 'hideRectangle', 'notify', 'notifyProgress', 'hideNotify', 'showPop', 'hidePop', 'remove'].includes(k)) {
                continue;
            }
            invoke.clickgo.form[k] = (clickgo.form as any)[k];
        }
        for (const k in clickgo.task) {
            if (!['get', 'getList', 'run', 'end'].includes(k)) {
                continue;
            }
            invoke.clickgo.task[k] = (clickgo.task as any)[k];
        }
        for (const k in clickgo.tool) {
            if (!['blob2ArrayBuffer', 'clone', 'sleep', 'purify', 'getMimeByPath', 'rand', 'getBoolean', 'escapeHTML', 'request', 'parseUrl', 'urlResolve', 'blob2Text', 'blob2DataUrl', 'execCommand'].includes(k)) {
                continue;
            }
            invoke.clickgo.tool[k] = (clickgo.tool as any)[k];
        }
        for (const k in clickgo.zip) {
            if (!['get'].includes(k)) {
                continue;
            }
            invoke.clickgo.zip[k] = (clickgo.zip as any)[k];
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
    }
    // --- 代码预处理 ---
    const preprocess = function(code: string, path: string): string {
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
    };
    // --- 获取要定义的控件列表 ---
    const components: any = {};
    for (const controlPath of appPkg.config.controls) {
        let controlPkg: false | ICGControlPkg;
        if (controlPath.startsWith('/clickgo/')) {
            const path = controlPath.slice(8);
            if (clickgo.control.clickgoControlPkgs[path + '.cgc']) {
                controlPkg = clickgo.control.clickgoControlPkgs[path + '.cgc'];
            }
            else {
                return -2;
            }
        }
        else if (task.controlPkgs[controlPath + '.cgc']) {
            controlPkg = task.controlPkgs[controlPath + '.cgc'];
        }
        else {
            return -3;
        }
        // --- 遍历控件包中的每一个控件 ---
        for (const name in controlPkg) {
            const item: ICGControl = controlPkg[name];
            // --- 准备相关变量 ---
            let props: any = {};
            let data: any = {};
            let methods: any = {};
            let computed: any = {};
            let watch: any = {};
            let beforeCreate: (() => void) | undefined = undefined;
            let created: (() => void) | undefined = undefined;
            let beforeMount: (() => void) | undefined = undefined;
            let mounted: (() => void) | undefined = undefined;
            let beforeUpdate: (() => void) | undefined = undefined;
            let updated: (() => void) | undefined = undefined;
            let beforeUnmount: (() => void) | undefined = undefined;
            let unmounted: (() => void) | undefined = undefined;
            // --- 检测是否有 js ---
            if (item.files[item.config.code + '.js']) {
                const expo = loader.require(item.config.code, item.files, {
                    'dir': '/',
                    'invoke': invoke,
                    'preprocess': preprocess
                })[0];
                if (expo) {
                    props = expo.props || {};
                    data = expo.data || {};
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
                }
            }
            // --- 控件样式表以及布局文件 ---
            let layout = '';
            let prep = '';
            if (task.initControls[name]) {
                layout = task.initControls[name].layout;
                prep = task.initControls[name].prep;
            }
            else {
                const style = item.files[item.config.style + '.css'] as string;
                if (style) {
                    const r = clickgo.tool.stylePrepend(style);
                    prep = r.prep;
                    clickgo.dom.pushStyle(task.id, await clickgo.tool.styleUrl2ObjectOrDataUrl(item.config.style, r.style, item), 'control', name);
                }
                // --- 要创建的 control 的 layout ---
                layout = item.files[item.config.layout + '.html'] as string;
                if (!layout) {
                    return -4;
                }
                // --- 给 layout 增加 data-cg-control-xxx ---
                layout = layout.replace(/^(<[a-zA-Z0-9-]+)( |>)/, '$1 data-cg-control-' + name + '$2');
                // --- 给控件的 layout 的 class 增加前置 ---
                const prepList = [
                    'cg-theme-task' + taskId.toString() + '-' + name + '_'
                ];
                if (prep !== '') {
                    prepList.push(prep);
                }
                // --- 增加 class 为 tag-xxx ---
                layout = clickgo.tool.layoutAddTagClassAndReTagName(layout, false);
                // --- 给 layout 的 class 增加前置 ---
                layout = clickgo.tool.layoutClassPrepend(layout, prepList);
                // --- 给 cg 对象增加 :cg-focus 传递 ---
                if (layout.includes('<cg-')) {
                    layout = clickgo.tool.layoutInsertAttr(layout, ':cg-focus=\'cgFocus\'', {
                        'include': [/^cg-.+/]
                    });
                }
                // --- 给 event 增加包裹 ---
                layout = clickgo.tool.eventsAttrWrap(layout);
                task.initControls[name] = {
                    'layout': layout,
                    'prep': prep
                };
            }
            // --- 组成 props ---
            props.cgFocus = {
                'default': false
            };
            // --- 组成 data ---
            computed.taskId = {
                get: function(): number {
                    return taskId;
                },
                set: function(): void {
                    notify({
                        'title': 'Error',
                        'content': `The control tries to modify the system variable "taskId".\nPath: ${this.cgPath}\nControl: ${name}`,
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
                        'content': `The control tries to modify the system variable "formId".\nPath: ${this.cgPath}\nControl: ${name}`,
                        'type': 'danger'
                    });
                    return;
                }
            };
            computed.controlName = {
                get: function(): string {
                    return name;
                },
                set: function(): void {
                    notify({
                        'title': 'Error',
                        'content': `The control tries to modify the system variable "controlName".\nPath: ${this.cgPath}\nControl: ${name}`,
                        'type': 'danger'
                    });
                    return;
                }
            };
            computed.cgPath = {
                get: function(): string {
                    return cgPath;
                },
                set: function(): void {
                    notify({
                        'title': 'Error',
                        'content': `The control tries to modify the system variable "cgPath".\nPath: ${this.cgPath}\nControl: ${name}`,
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
                        'content': `The control tries to modify the system variable "cgPrep".\nPath: ${this.cgPath}\nControl: ${name}`,
                        'type': 'danger'
                    });
                    return;
                }
            };
            // --- 获取目前现存的子 slots ---
            computed.cgSlots = function(this: IVControl): (name?: string) => IVueVNode[] {
                return (name: string = 'default'): IVueVNode[] => {
                    const d = this.$slots[name];
                    if (!d) {
                        return [];
                    }
                    const slots = [];
                    const list = d();
                    for (const item of list) {
                        if (typeof item.type === 'symbol') {
                            // --- 动态的 slot，例如 v-for 产生的 slot ---
                            for (const item2 of item.children) {
                                slots.push(item2);
                            }
                        }
                        else {
                            slots.push(item);
                        }
                    }
                    return slots;
                };
            };
            // --- 预设 computed ---
            computed.cgLocale = function(this: IVControl): string {
                if (clickgo.task.list[this.taskId].locale.name === '') {
                    return clickgo.core.config.locale;
                }
                return clickgo.task.list[this.taskId].locale.name;
            };
            // --- 获取语言 ---
            computed.l = function(this: IVControl): (
                key: string,
                data?: Record<string, Record<string, string>>
            ) => string {
                return (key: string, data?: Record<string, Record<string, string>>): string => {
                    if (data) {
                        return data[this.cgLocale]?.[key] ?? data['en'][key] ?? 'LocaleError';
                    }
                    else if (this.localeData) {
                        return this.localeData[this.cgLocale]?.[key] ?? this.localeData['en'][key] ?? 'LocaleError';
                    }
                    else {
                        return 'LocaleError';
                    }
                };
            };
            // --- 根据 control name 查询上级序列 ---
            computed.cgParentByName = function(this: IVControl): (controlName: string) => IVControl | null {
                return (controlName: string): IVControl | null => {
                    let parent = this.$parent;
                    while (true) {
                        if (!parent) {
                            return null;
                        }
                        if (parent.controlName === controlName) {
                            return parent;
                        }
                        parent = parent.$parent;
                    }
                };
            };
            methods.cgClose = function(this: IVControl): void {
                remove(this.formId);
            };
            methods.cgBindFormResize = function(this: IVControl, e: MouseEvent | TouchEvent, border: TCGBorder): void {
                this.cgParentByName('form').resizeMethod(e, border);
            };
            // --- 获取文件 blob 或 string 对象 ---
            methods.cgGetFile = async function(this: IVControl, path: string): Promise<string | Blob | null> {
                if (path.startsWith('/clickgo/')) {
                    return clickgo.core.fetchClickGoFile(path.slice(8));
                }
                else {
                    path = clickgo.tool.urlResolve(this.cgPath, path);
                    return task.appPkg.files[path] ?? null;
                }
            };
            // --- 获取本 task 的 object url ---
            methods.cgGetObjectUrl = function(this: IVControl, file: string): string | null {
                file = clickgo.tool.urlResolve(this.cgPath, file);
                if (file.startsWith('/clickgo/')) {
                    return clickgo.cgRootPath + file.slice(9);
                }
                return clickgo.tool.file2ObjectUrl(file, clickgo.task.list[this.taskId]);
            };
            methods.cgGetDataUrl = async function(this: IVControl, file: string): Promise<string | null> {
                const f = await this.cgGetFile(file);
                if (!f) {
                    return null;
                }
                return f && f instanceof Blob ? clickgo.tool.blob2DataUrl(f) : null;
            };
            // --- layout 中 :class 的转义 ---
            methods.cgClassPrepend = function(this: IVControl, cla: any): string {
                if (typeof cla !== 'string') {
                    return cla;
                }
                /*
                if (cla.startsWith('cg-')) {
                    return cla;
                }
                */
                return `cg-theme-task${this.taskId}-${this.controlName}_${cla} ${this.cgPrep}${cla}`;
            };
            // --- 设置 timer ---
            methods.cgCreateTimer = function(this: IVControl, fun: () => void | Promise<void>, delay: number, opt: {
                'immediate'?: boolean;
                'scope'?: 'form' | 'task';
                'count'?: number;
            } = {}): number {
                return clickgo.task.createTimer(this.taskId, this.formId, fun, delay, opt);
            };
            methods.cgRemoveTimer = function(this: IVControl, timer: number): void {
                clickgo.task.removeTimer(this.taskId, timer);
            };
            methods.cgSleep = function(this: IVControl, fun: () => void | Promise<void>, delay: number): number {
                return this.cgCreateTimer(fun, delay, {
                    'count': 1
                });
            };
            // --- 帧 ---
            methods.cgOnFrame = function(this: IVControl, fun: () => void | Promise<void>, opt: {
                'scope'?: 'form' | 'task';
                'count'?: number;
            } = {}): number {
                return clickgo.task.onFrame(this.taskId, this.formId, fun, opt);
            };
            methods.cgOffFrame = function(this: IVControl, ft: number): void {
                clickgo.task.offFrame(this.taskId, ft);
            };
            // --- 判断当前事件可否执行 ---
            methods.cgAllowEvent = function(this: IVControl, e: MouseEvent | TouchEvent | KeyboardEvent): boolean {
                return clickgo.dom.allowEvent(e);
            };
            // --- 组成 component ---
            components['cg-' + name] = {
                'template': layout,
                'props': props,
                'data': function() {
                    return clickgo.tool.clone(data);
                },
                'methods': methods,
                'computed': computed,
                'watch': watch,

                'beforeCreate': beforeCreate,
                'created': created,
                'beforeMount': beforeMount,
                'mounted': async function(this: IVControl) {
                    await this.$nextTick();
                    mounted?.call(this);
                },
                'beforeUpdate': beforeUpdate,
                'updated': async function(this: IVue) {
                    await this.$nextTick();
                    updated?.call(this);
                },
                'beforeUnmount': function(this: IVControl) {
                    beforeUnmount?.call(this);
                },
                'unmounted': async function(this: IVControl) {
                    await this.$nextTick();
                    unmounted?.call(this);
                }
            };
        }
    }
    // --- 获取 style、layout ---
    let style = opt.style;
    let layout: string | undefined = opt.layout;
    if (opt.file) {
        const layoutFile = appPkg.files[opt.file + '.xml'] as string;
        if (layoutFile) {
            layout = layoutFile.replace(/^\ufeff/, '');
        }
        const styleFile = appPkg.files[opt.file + '.css'] as string;
        if (styleFile) {
            style = styleFile.replace(/^\ufeff/, '');
        }
    }
    if (layout === undefined) {
        return -5;
    }
    // --- 准备相关变量 ---
    let data: Record<string, any> = {};
    let methods: any = {};
    let computed: any = {};
    let watch = {};
    let beforeCreate: (() => void) | undefined = undefined;
    let created: (() => void) | undefined = undefined;
    let beforeMount: (() => void) | undefined = undefined;
    let mounted: (() => void | Promise<void>) | undefined = undefined;
    let beforeUpdate: (() => void) | undefined = undefined;
    let updated: (() => void) | undefined = undefined;
    let beforeUnmount: (() => void) | undefined = undefined;
    let unmounted: (() => void) | undefined = undefined;
    // --- 检测是否有 js ---
    let expo = opt.code;
    if (opt.file && appPkg.files[opt.file + '.js']) {
        expo = loader.require(opt.file, appPkg.files, {
            'dir': '/',
            'invoke': invoke,
            'preprocess': preprocess
        })[0];
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
    }
    // --- 应用样式表 ---
    let prep = '';
    if (style) {
        // --- 将 style 中的 tag 标签转换为 class，如 button 变为 .tag-button，然后将 class 进行标准程序，添加 prep 进行区分隔离 ---
        const r = clickgo.tool.stylePrepend(style);
        prep = r.prep;
        style = await clickgo.tool.styleUrl2ObjectOrDataUrl(opt.file ?? opt.path ?? '/', r.style, task);
    }
    // --- 要创建的 form 的 layout 所有标签增加 cg 前缀，并增加新的 class 为 tag-xxx ---
    layout = clickgo.tool.purify(layout);
    // --- 标签增加 cg- 前缀，增加 class 为 tag-xxx ---
    layout = clickgo.tool.layoutAddTagClassAndReTagName(layout, true);
    // --- 给所有控件传递窗体的 focus 信息 ---
    layout = clickgo.tool.layoutInsertAttr(layout, ':cg-focus=\'cgFocus\'', {
        'include': [/^cg-.+/]
    });
    // --- 给 layout 的 class 增加前置 ---
    const prepList = ['cg-task' + taskId.toString() + '_'];
    if (prep !== '') {
        prepList.push(prep);
    }
    layout = clickgo.tool.layoutClassPrepend(layout, prepList);
    // --- 给 event 增加包裹 ---
    layout = clickgo.tool.eventsAttrWrap(layout);
    // --- 插入 HTML 到 Element ---
    formListElement.insertAdjacentHTML('beforeend', `<div class="cg-form-wrap" data-form-id="${formId.toString()}" data-task-id="${taskId.toString()}"></div>`);
    // --- 获取刚才的 form wrap element 对象 ---
    const el: HTMLElement = formListElement.children.item(formListElement.children.length - 1) as HTMLElement;
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
            return cgPath;
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
    if (opt.topMost) {
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
    computed.cgLocale = function(this: IVForm): string {
        if (clickgo.task.list[this.taskId].locale.name === '') {
            return clickgo.core.config.locale;
        }
        return clickgo.task.list[this.taskId].locale.name;
    };
    // --- 获取语言 ---
    computed.l = function(this: IVForm): (key: string) => string {
        return (key: string): string => {
            return clickgo.task.list[this.taskId].locale.data[this.cgLocale]?.[key] ?? clickgo.task.list[this.taskId].locale.data['en']?.[key] ?? 'LocaleError';
        };
    };
    // --- 初始化系统方法 ---
    methods.cgCreateForm = async function(this: IVForm, paramOpt: string | ICGFormCreateOptions & { 'mask'?: boolean; } = {}): Promise<number> {
        const inOpt: ICGFormCreateOptions = {
            'path': this.cgPath
        };
        if (typeof paramOpt === 'string') {
            inOpt.file = clickgo.tool.urlResolve(this.cgPath, paramOpt);
        }
        else {
            if (paramOpt.file) {
                inOpt.file = clickgo.tool.urlResolve(this.cgPath, paramOpt.file);
            }
            if (paramOpt.path) {
                inOpt.path = paramOpt.path;
            }
            if (paramOpt.code) {
                inOpt.code = paramOpt.code;
            }
            if (paramOpt.layout) {
                inOpt.layout = paramOpt.layout;
            }
            if (paramOpt.style) {
                inOpt.style = paramOpt.style;
            }
            if (paramOpt.topMost) {
                inOpt.topMost = paramOpt.topMost;
            }
            if (paramOpt.mask) {
                this.$refs.form.maskFor = true;
            }
        }
        if (this.cgTopMost) {
            inOpt.topMost = true;
        }
        /** --- 创建的新 IForm 对象 --- */
        const form = await create(taskId, inOpt);
        if (typeof form === 'number') {
            if (this.$refs.form) {
                this.$refs.form.maskFor = undefined;
            }
            return form;
        }
        else {
            if (this.$refs.form?.maskFor) {
                this.$refs.form.maskFor = form.id;
                form.vroot.$refs.form.maskFrom = this.formId;
            }
            return form.id;
        }
    };
    methods.cgClose = function(this: IVForm): void {
        remove(this.formId);
    };
    methods.cgMax = function(this: IVForm): void {
        // --- 平时同 state 传值，这个是外围调用的时候才会用到 ---
        this.$refs.form.maxMethod();
    };
    methods.cgMin = function(this: IVForm): void {
        this.$refs.form.minMethod();
    };
    methods.cgBindFormDrag = function(this: IVForm, e: MouseEvent | TouchEvent): void {
        this.$refs.form.moveMethod(e, true);
    };
    methods.cgBindFormResize = function(this: IVForm, e: MouseEvent | TouchEvent, border: TCGBorder): void {
        this.$refs.form.resizeMethod(e, border);
    };
    methods.cgSetSystemEventListener = function(
        this: IVForm,
        name: TCGGlobalEvent,
        func: (...any: any) => void | Promise<void>
    ): void {
        clickgo.task.list[this.taskId].forms[this.formId].events[name] = func;
    };
    methods.cgRemoveSystemEventListener = function(this: IVForm, name: TCGGlobalEvent): void {
        delete clickgo.task.list[this.taskId].forms[this.formId].events[name];
    };
    methods.cgDialog = function(this: IVForm, opt: string | ICGFormDialog): Promise<string> {
        return new Promise((resolve) => {
            if (typeof opt === 'string' || typeof opt === 'number') {
                opt = {
                    'content': opt
                };
            }
            if (opt.buttons === undefined) {
                opt.buttons = [localeData[this.cgLocale]?.ok ?? localeData['en'].ok];
            }
            this.cgCreateForm({
                'layout': `<form title="${opt.title ?? 'dialog'}" width="auto" height="auto" :min="false" :max="false" :resize="false" border="${opt.title ? 'normal' : 'plain'}" direction="v"><dialog :buttons="buttons" @select="select">${opt.content}</dialog></form>`,
                'code': {
                    data: {
                        'buttons': opt.buttons
                    },
                    methods: {
                        select: function(this: IVForm, button: string) {
                            const event = {
                                'go': true,
                                preventDefault: function() {
                                    this.go = false;
                                }
                            };
                            (opt as ICGFormDialog).select?.(event as unknown as Event, button);
                            if (event.go) {
                                this.cgClose();
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
    };
    methods.cgConfirm = async function(
        this: IVForm,
        content: string,
        cancel: boolean = false
    ): Promise<boolean | number> {
        const buttons = [localeData[this.cgLocale]?.yes ?? localeData['en'].yes, localeData[this.cgLocale]?.no ?? localeData['en'].no];
        if (cancel) {
            buttons.push(localeData[this.cgLocale]?.cancel ?? localeData['en'].cancel);
        }
        const res = await this.cgDialog({
            'content': content,
            'buttons': buttons
        });
        if (res === (localeData[this.cgLocale]?.yes ?? localeData['en'].yes)) {
            return true;
        }
        if (res === (localeData[this.cgLocale]?.cancel ?? localeData['en'].cancel)) {
            return 0;
        }
        return false;
    };
    // --- 获取文件 blob 对象 ---
    methods.cgGetFile = async function(this: IVForm, path: string): Promise<Blob | string | null> {
        if (path.startsWith('/clickgo/')) {
            return clickgo.core.fetchClickGoFile(path.slice(8));
        }
        else {
            path = clickgo.tool.urlResolve(this.cgPath, path);
            return task.appPkg.files[path] ?? null;
        }
    };
    // --- 获取本 task 的 object url ---
    methods.cgGetObjectUrl = function(this: IVForm, file: string): string | null {
        file = clickgo.tool.urlResolve(this.cgPath, file);
        if (file.startsWith('/clickgo/')) {
            return clickgo.cgRootPath + file.slice(9);
        }
        return clickgo.tool.file2ObjectUrl(file, clickgo.task.list[this.taskId]);
    };
    methods.cgGetDataUrl = async function(this: IVForm, file: string): Promise<string | null> {
        const f = await this.cgGetFile(file);
        if (!f) {
            return null;
        }
        return f && f instanceof Blob ? clickgo.tool.blob2DataUrl(f) : null;
    };
    // --- 加载主题 ---
    methods.cgLoadTheme = async function(this: IVForm, path: string): Promise<boolean> {
        path = clickgo.tool.urlResolve(this.cgPath, path);
        return clickgo.theme.load(this.taskId, path);
    };
    // --- 卸载主题 ---
    methods.cgRemoveTheme = async function(this: IVForm, path: string): Promise<void> {
        path = clickgo.tool.urlResolve(this.cgPath, path);
        await clickgo.theme.remove(this.taskId, path);
    };
    // --- 加载全新主题（老主题会被清除） ---
    methods.cgSetTheme = async function(this: IVForm, path: string): Promise<void> {
        path = clickgo.tool.urlResolve(this.cgPath, path);
        await clickgo.theme.clear(this.taskId);
        await clickgo.theme.load(this.taskId, path);
    };
    // --- 清除主题 ---
    methods.cgClearTheme = async function(this: IVForm): Promise<void> {
        await clickgo.theme.clear(this.taskId);
    };
    // --- 加载全局主题 ---
    methods.cgSetGlobalTheme = async function(this: IVForm, path: string | Blob): Promise<void> {
        if (typeof path === 'string') {
            const blob = await this.cgGetFile(path);
            if (blob instanceof Blob) {
                await clickgo.theme.setGlobal(blob);
            }
        }
        else {
            await clickgo.theme.setGlobal(path);
        }
    };
    // --- 清除全局主题 ---
    methods.cgClearGlobalTheme = async function(): Promise<void> {
        await clickgo.theme.clearGlobal();
    };
    // --- 设置窗体置顶/取消置顶 ---
    methods.cgSetTopMost = function(this: IVForm, top: boolean): void {
        this.$data._cgCustomZIndex = false;
        if (top) {
            // --- 要置顶 ---
            this.$data._cgTopMost = true;
            if (!this.cgFocus) {
                changeFocus(this.formId);
            }
            else {
                this.$refs.form.setPropData('zIndex', ++lastTopZIndex);
            }
        }
        else {
            // --- 取消置顶 ---
            this.$data._cgTopMost = false;
            this.$refs.form.setPropData('zIndex', ++lastZIndex);
        }
    };
    // --- 让窗体闪烁 ---
    methods.cgFlash = function(this: IVForm): void {
        if (!this.cgFocus) {
            changeFocus(this.formId);
        }
        if (this.$refs.form?.flashTimer) {
            clearTimeout(this.$refs.form.flashTimer);
            this.$refs.form.flashTimer = undefined;
        }
        this.$refs.form.flashTimer = setTimeout(() => {
            if (this.$refs.form) {
                this.$refs.form.flashTimer = undefined;
            }
        }, 1000);
        // --- 触发 formFlash 事件 ---
        clickgo.core.trigger('formFlash', taskId, formId);
    };
    // --- 让窗体显示出来 ---
    methods.cgShow = function(this: IVForm): void {
        this.$refs.form.$data.showData = true;
    };
    // --- 让窗体隐藏 ---
    methods.cgHide = function(this: IVForm): void {
        this.$refs.form.$data.showData = false;
    };
    // --- 加载 locale 文件 json ---
    methods.cgLoadLocale = function(this: IVForm, name: string, path: string): boolean {
        path = clickgo.tool.urlResolve(this.cgPath, path + '.json');
        if (!task.files[path]) {
            return false;
        }
        try {
            const data = JSON.parse(task.files[path] as string);
            this.cgLoadLocaleData(name, data);
            return true;
        }
        catch {
            return false;
        }
    };
    // --- 加载全新 locale（老 locale 的所以语言的缓存会被卸载） ---
    methods.cgSetLocale = function(this: IVForm, name: string, path: string): Promise<boolean> {
        this.cgClearLocale();
        return this.cgLoadLocale(name, path);
    };
    // --- 清除所有语言文件 ---
    methods.cgClearLocale = function(this: IVForm): void {
        clickgo.task.list[this.taskId].locale.data = {};
    };
    // --- 加载 locale data 对象到 task ---
    methods.cgLoadLocaleData = function(this: IVForm, name: string, data: Record<string, any>, pre: string = ''): void {
        clickgo.task.loadLocaleData(this.taskId, name, data, pre);
    };
    // --- 设置本 task 的语言 name ---
    methods.cgSetLocaleName = function(this: IVForm, name: string): void {
        clickgo.task.list[this.taskId].locale.name = name;
    };
    methods.cgClearLocaleName = function(this: IVForm): void {
        clickgo.task.list[this.taskId].locale.name = '';
    };
    // --- layout 中 :class 的转义 ---
    methods.cgClassPrepend = function(this: IVForm, cla: any): string {
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
    // --- 设置 timer ---
    methods.cgCreateTimer = function(this: IVForm, fun: () => void | Promise<void>, delay: number, opt: {
        'immediate'?: boolean;
        'scope'?: 'form' | 'task';
        'count'?: number;
    } = {}): number {
        return clickgo.task.createTimer(this.taskId, this.formId, fun, delay, opt);
    };
    methods.cgRemoveTimer = function(this: IVForm, timer: number): void {
        clickgo.task.removeTimer(this.taskId, timer);
    };
    methods.cgSleep = function(this: IVForm, fun: () => void | Promise<void>, delay: number): number {
        return this.cgCreateTimer(fun, delay, {
            'count': 1
        });
    };
    // --- 帧 ---
    methods.cgOnFrame = function(this: IVForm, fun: () => void | Promise<void>, opt: {
        'scope'?: 'form' | 'task';
        'count'?: number;
    } = {}): number {
        return clickgo.task.onFrame(this.taskId, this.formId, fun, opt);
    };
    methods.cgOffFrame = function(this: IVForm, ft: number): void {
        clickgo.task.offFrame(this.taskId, ft);
    };
    // --- 判断当前事件可否执行 ---
    methods.cgAllowEvent = function(this: IVForm, e: MouseEvent | TouchEvent | KeyboardEvent): boolean {
        return clickgo.dom.allowEvent(e);
    };
    // --- 挂载 style ---
    if (style) {
        // --- 窗体的 style ---
        clickgo.dom.pushStyle(taskId, style, 'form', formId);
    }
    // --- 创建 app 对象 ---
    const rtn: {
        'vapp': IVueApp;
        'vroot': IVForm;
    } = await new Promise(function(resolve) {
        const vapp = Vue.createApp({
            'template': layout!.replace(/^<cg-form/, '<cg-form ref="form"'),
            'data': function() {
                return clickgo.tool.clone(data);
            },
            'methods': methods,
            'computed': computed,
            'watch': watch,
            'components': components,

            'beforeCreate': beforeCreate,
            'created': created,
            'beforeMount': beforeMount,
            'mounted': async function(this: IVForm) {
                await this.$nextTick();
                // --- 判断是否有 icon，对 icon 进行第一次读取 ---
                // --- 为啥要在这搞，因为 form 控件中读取，将可能导致下方的 formCreate 事件获取不到 icon 图标 ---
                // --- 而如果用延迟的方式获取，将可能导致 changeFocus 的窗体焦点事件先于 formCreate 触发 ---
                if (this.$refs.form.icon !== '') {
                    this.$refs.form.iconData = await this.cgGetDataUrl(this.$refs.form.icon) ?? '';
                }
                // --- 完成 ---
                resolve({
                    'vapp': vapp,
                    'vroot': this
                });
            },
            'beforeUpdate': beforeUpdate,
            'updated': async function(this: IVue) {
                await this.$nextTick();
                updated?.call(this);
            },
            'beforeUnmount': beforeUnmount,
            'unmounted': unmounted,
        });
        vapp.config.errorHandler = function(err: Error, vm: IVForm, info: string): void {
            notify({
                'title': 'Runtime Error',
                'content': `Message: ${err.message}\nTask id: ${vm.taskId}\nForm id: ${vm.formId}`,
                'type': 'danger'
            });
            clickgo.core.trigger('error', vm.taskId, vm.formId, err, info);
        };
        // --- 挂载控件对象到 vapp ---
        for (const key in components) {
            vapp.component(key, components[key]);
        }
        vapp.mount(el);
    });
    // --- 创建 form 信息对象 ---
    const form: ICGForm = {
        'id': formId,
        'vapp': rtn.vapp,
        'vroot': rtn.vroot,
        'win': null,
        'events': {}
    };
    // --- 挂载 form ---
    task.forms[formId] = form;
    // --- 执行 mounted ---
    await clickgo.tool.sleep(34);
    if (mounted) {
        try {
            await mounted.call(rtn.vroot);
        }
        catch (err: any) {
            clickgo.core.trigger('error', rtn.vroot.taskId, rtn.vroot.formId, err, 'Create form mounted error.');
            task.forms[formId] = undefined as any;
            delete task.forms[formId];
            rtn.vapp.unmount();
            rtn.vapp._container.remove();
            clickgo.dom.removeStyle(rtn.vroot.taskId, 'form', rtn.vroot.formId);
            return -6;
        }
    }
    // --- 将窗体居中 ---
    const area = getAvailArea();
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
        rtn.vroot.cgShow();
    }
    // --- 触发 formCreated 事件 ---
    // console.log('x', rtn.vroot.$refs.form.iconData, formId);
    clickgo.core.trigger('formCreated', taskId, formId, rtn.vroot.$refs.form.title, rtn.vroot.$refs.form.iconData);
    // --- 绑定获取焦点事件 ---
    changeFocus(formId);
    return form;
}

// --- 绑定 resize 事件 ---
window.addEventListener('resize', function(): void {
    // --- 触发 screenResize 事件 ---
    refreshTaskPosition(); // 会在里面自动触发 screenResize 事件
});

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

/** --- 当前显示的总 pop 母级的 vue 对象 --- */
export let popShowing: null | IVueControl;
/** --- 最后一个窗体 id --- */
export let lastFormId: number = 0;
/** --- 最后一个层级 --- */
export let lastZIndex: number = 999;
/** --- top 的最后一个层级 --- */
export let lastTopZIndex: number = 9999999;
/** --- pop 最后一个层级 --- */
export let lastPopZIndex: number = 0;

/** --- form lib 用到的语言包 --- */
let localData: Record<string, {
    'ok': string;
    'yes': string;
    'no': string;
    'cancel': string;
}> = {
    'en-us': {
        'ok': 'OK',
        'yes': 'Yes',
        'no': 'No',
        'cancel': 'Cancel'
    },
    'zh-cn': {
        'ok': '好',
        'yes': '是',
        'no': '否',
        'cancel': '取消'
    },
    'zh-tw': {
        'ok': '好',
        'yes': '是',
        'no': '否',
        'cancel': '取消'
    },
    'ja-jp': {
        'ok': '好',
        'yes': 'はい',
        'no': 'いいえ',
        'cancel': 'キャンセル'
    }
};

/** --- form list 的 div --- */
let formListElement: HTMLDivElement = document.createElement('div');
formListElement.classList.add('cg-form-list');
document.getElementsByTagName('body')[0].appendChild(formListElement);
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

/** --- pop list 的 div --- */
let popListElement: HTMLDivElement = document.createElement('div');
popListElement.id = 'cg-pop-list';
popListElement.classList.add('cg-pop-list');
popListElement.addEventListener('contextmenu', function(e): void {
    e.preventDefault();
});
document.getElementsByTagName('body')[0].appendChild(popListElement);
popListElement.addEventListener('touchmove', function(e): void {
    // --- 防止拖动时整个网页跟着动 ---
    e.preventDefault();
}, {
    'passive': false
});

// --- 从鼠标指针处从小到大缩放然后淡化的圆圈动画特效对象 ---
let circularElement: HTMLDivElement = document.createElement('div');
circularElement.classList.add('cg-circular');
document.getElementsByTagName('body')[0].appendChild(circularElement);

// --- 从鼠标指针处开始从小到大缩放并铺满屏幕（或任意大小矩形）的对象 ---
let rectangleElement: HTMLDivElement = document.createElement('div');
rectangleElement.setAttribute('data-pos', '');
rectangleElement.classList.add('cg-rectangle');
document.getElementsByTagName('body')[0].appendChild(rectangleElement);

/** --- task 的信息 --- */
let taskInfo: ICGFormTaskInfo = {
    'taskId': 0,
    'formId': 0,
    'length': 0
};

/**
 * --- 获取当前已设置的 task 信息 ---
 */
export function getTask(): ICGFormTaskInfo {
    return {
        'taskId': taskInfo.taskId,
        'formId': taskInfo.formId,
        'length': taskInfo.length
    };
}

/**
 * --- 将任务注册为系统 task ---
 * @param taskId task id
 * @param formId tasb bar 的 form id
 */
export function setTask(taskId: number, formId: number): boolean {
    let task = clickgo.task.list[taskId];
    if (!task) {
        return false;
    }
    let form = task.forms[formId];
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
    let tasks = clickgo.task.getList();
    for (let taskId in tasks) {
        let forms = getList(parseInt(taskId));
        for (let formId in forms) {
            let form = forms[formId];
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
        let form = clickgo.task.list[taskInfo.taskId].forms[taskInfo.formId];
        // --- 更新 task bar 的位置 ---
        switch (clickgo.core.config['task.position']) {
            case 'left':
            case 'right': {
                form.vroot.$refs.form.setPropData('width', 'auto');
                form.vroot.$refs.form.setPropData('height', window.innerHeight);
                break;
            }
            case 'top':
            case 'bottom': {
                form.vroot.$refs.form.setPropData('width', window.innerWidth);
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
                    form.vroot.$refs.form.setPropData('left', window.innerWidth - taskInfo.length);
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
                    form.vroot.$refs.form.setPropData('top', window.innerHeight - taskInfo.length);
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
    let left: number = 0;
    let top: number = 0;
    let width: number = 0;
    let height: number = 0;
    switch (clickgo.core.config['task.position']) {
        case 'left': {
            left = taskInfo.length;
            top = 0;
            width = window.innerWidth - taskInfo.length;
            height = window.innerHeight;
            break;
        }
        case 'right': {
            left = 0;
            top = 0;
            width = window.innerWidth - taskInfo.length;
            height = window.innerHeight;
            break;
        }
        case 'top': {
            left = 0;
            top = taskInfo.length;
            width = window.innerWidth;
            height = window.innerHeight - taskInfo.length;
            break;
        }
        case 'bottom': {
            left = 0;
            top = 0;
            width = window.innerWidth;
            height = window.innerHeight - taskInfo.length;
        }
    }
    return {
        'left': left,
        'top': top,
        'width': width,
        'height': height
    };
}

/**
 *  --- 将所有已经最大化的窗体的大小重置 ---
 */
export function refreshMaxPosition(): void {
    let area = getAvailArea();
    for (let i = 0; i < formListElement.children.length; ++i) {
        let el = formListElement.children.item(i) as HTMLElement;
        let ef = el.children.item(0) as HTMLElement;
        if (!ef.className.includes('cg-state-max')) {
            continue;
        }
        let taskId = parseInt(el.getAttribute('data-task-id') as string);
        let formId = parseInt(el.getAttribute('data-form-id') as string);
        if (!clickgo.task.list[taskId]) {
            continue;
        }
        let vroot = clickgo.task.list[taskId].forms[formId].vroot;
        vroot.$refs.form.setPropData('left', area.left);
        vroot.$refs.form.setPropData('top', area.top);
        vroot.$refs.form.setPropData('width', area.width);
        vroot.$refs.form.setPropData('height', area.height);
    }
}

export function getTaskId(formId: number): number {
    let formElement = formListElement.querySelector(`[data-form-id='${formId}']`);
    if (!formElement) {
        return 0;
    }
    // --- 获取 task id ---
    let taskIdAttr = formElement.getAttribute('data-task-id');
    if (!taskIdAttr) {
        return 0;
    }
    return parseInt(taskIdAttr);
}

export function min(formId: number): boolean {
    let taskId: number = getTaskId(formId);
    let task = clickgo.task.list[taskId];
    if (!task) {
        return false;
    }
    task.forms[formId].vroot.cgMin();
    return true;
}

export function get(formId: number): ICGFormItem | null {
    let taskId: number = getTaskId(formId);
    let item = clickgo.task.list[taskId].forms[formId];
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
 * --- 获取 form list 的简略情况 ---
 * @param taskId 任务 ID
 */
export function getList(taskId: number): Record<string, ICGFormItem> {
    if (!clickgo.task.list[taskId]) {
        return {};
    }
    let list: Record<string, ICGFormItem> = {};
    for (let fid in clickgo.task.list[taskId].forms) {
        let item = clickgo.task.list[taskId].forms[fid];
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
    let focusElement = document.querySelector('.cg-form-list > .cg-focus');
    if (focusElement) {
        let dataFormId = focusElement.getAttribute('data-form-id');
        if (dataFormId) {
            let dataFormIdNumber = parseInt(dataFormId);
            if (dataFormIdNumber === formId) {
                return;
            }
            else {
                let taskId = parseInt(focusElement.getAttribute('data-task-id') ?? '0');
                let task = clickgo.task.list[taskId];
                task.forms[dataFormIdNumber].vapp._container.classList.remove('cg-focus');
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
    let el = document.querySelector(`.cg-form-list > [data-form-id='${formId}']`);
    if (!el) {
        return;
    }
    // --- 如果是最小化状态的话，需要还原 ---
    if ((el.childNodes.item(0) as HTMLElement).classList.contains('cg-state-min')) {
        min(formId);
    }
    // --- 获取所属的 taskId ---
    let taskId: number = parseInt(el.getAttribute('data-task-id') ?? '0');
    let task = clickgo.task.list[taskId];
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
    let maskFor = task.forms[formId].vroot.$refs.form.maskFor;
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
        clickgo.task.list[taskId].forms[maskFor].vapp._container.classList.add('cg-focus');
        clickgo.task.list[taskId].forms[maskFor].vroot._cgFocus = true;
        // --- 触发 formFocused 事件 ---
        clickgo.core.trigger('formFocused', taskId, maskFor);
        // --- 闪烁 ---
        clickgo.task.list[taskId].forms[maskFor].vroot.cgFlash();
    }
    else {
        // --- 正常开启 focus ---
        task.forms[formId].vapp._container.classList.add('cg-focus');
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
        let root = formListElement.children.item(i) as HTMLDivElement;
        let formWrap = root.children.item(0) as HTMLDivElement;
        // --- 排除 top most 窗体 ---
        let z = parseInt(formWrap.style.zIndex);
        if (z > 9999999) {
            continue;
        }
        // --- 排除最小化窗体 ---
        if (formWrap.classList.contains('cg-state-min')) {
            continue;
        }
        // --- 排除用户定义的 task id 窗体 ---
        let tid = parseInt(root.getAttribute('data-task-id')!);
        if (out.taskIds?.includes(tid)) {
            continue;
        }
        // --- 排除用户定义的 form id 窗体 ---
        let fid = parseInt(root.getAttribute('data-form-id')!);
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
    let area = getAvailArea();
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
        circularElement.style.left = x - 3 + 'px';
        circularElement.style.top = y - 3 + 'px';
        circularElement.style.opacity = '1';
        requestAnimationFrame(function() {
            circularElement.style.transition = 'all .3s ease-out';
            requestAnimationFrame(function() {
                circularElement.style.width = '60px';
                circularElement.style.height = '60px';
                circularElement.style.left = x - 30 + 'px';
                circularElement.style.top = y - 30 + 'px';
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
    let dataReady = rectangleElement.getAttribute('data-ready') ?? '0';
    if (dataReady === '0') {
        return;
    }
    let dataBorder = rectangleElement.getAttribute('data-border') ?? '';
    let setDataBorder = typeof border === 'string' ? border : 'o-' + border.left + '-' + (border.top ?? 'n') + '-' + border.width + '-' + (border.height ?? 'n');
    if (dataBorder === setDataBorder) {
        return;
    }
    rectangleElement.setAttribute('data-dir', setDataBorder);
    let pos = getRectByBorder(border);
    let width = pos.width - 20;
    let height = pos.height - 20;
    let left = pos.left + 10;
    let top = pos.top + 10;
    if (width !== undefined && height !== undefined && left !== undefined && top !== undefined) {
        rectangleElement.style.width = width + 'px';
        rectangleElement.style.height = height + 'px';
        rectangleElement.style.left = left + 'px';
        rectangleElement.style.top = top + 'px';
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
        rectangleElement.style.left = x - 10 + 'px';
        rectangleElement.style.top = y - 10 + 'px';
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
let systemElement: HTMLDivElement = document.createElement('div');
systemElement.id = 'cg-system';
systemElement.classList.add('cg-system');
systemElement.addEventListener('contextmenu', function(e): void {
    e.preventDefault();
});
document.getElementsByTagName('body')[0].appendChild(systemElement);
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
    let nid = ++notifyId;
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
    let el = document.createElement('div');
    let y = notifyTop;
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
        let timer = window.setTimeout(function() {
            hideNotify(nid);
        }, timeout);
        el.setAttribute('data-timer', timer.toString());
    });
    return nid;
}

export function notifyProgress(notifyId: number, per: number): void {
    let el = systemElement.querySelector(`[data-notifyid="${notifyId}"]`) as HTMLElement;
    if (!el) {
        return;
    }
    let progress = el.querySelector('.cg-system-notify-progress') as HTMLElement;
    if (!progress) {
        return;
    }
    if (per > 100) {
        per = 100;
    }
    if (per === 1) {
        let o = parseFloat(progress.style.width);
        if (o > 1) {
            per = 100;
        }
    }
    if (per === 100) {
        progress.style.transitionDelay = '.1s';
    }
    progress.style.width = (per < 1 ? per * 100 : per) + '%';
}

export function hideNotify(notifyId: number): void {
    let el = systemElement.querySelector(`[data-notifyid="${notifyId}"]`) as HTMLElement;
    if (!el) {
        return;
    }
    clearTimeout(parseInt(el.getAttribute('data-timer')!));
    let notifyHeight = el.offsetHeight;
    el.style.opacity = '0';
    setTimeout(function() {
        notifyTop -= notifyHeight + 10;
        let notifyElementList = document.getElementsByClassName('cg-system-notify') as HTMLCollectionOf<HTMLDivElement>;
        let needSub = false;
        for (let notifyElement of notifyElementList) {
            if (notifyElement === el) {
                // --- el 之后的 notify 都要往上移动 ---
                needSub = true;
                continue;
            }
            if (needSub) {
                notifyElement.style.transform = notifyElement.style.transform.replace(/translateY\(([0-9]+)px\)/, function(t: string, t1: string): string {
                    return `translateY(${parseInt(t1) - notifyHeight - 10}px)`;
                });
            }
        }
        el.remove();
    }, 100);
}

// --- 添加 cg-simpletask 的 dom ---
let simpletaskElement: HTMLDivElement = document.createElement('div');
simpletaskElement.id = 'cg-simpletask';
simpletaskElement.classList.add('cg-simpletask');
simpletaskElement.addEventListener('contextmenu', function(e): void {
    e.preventDefault();
});
document.getElementsByTagName('body')[0].appendChild(simpletaskElement);
simpletaskElement.addEventListener('touchmove', function(e): void {
    // --- 防止拖动时整个网页跟着动 ---
    e.preventDefault();
}, {
    'passive': false
});
export let simpletaskRoot: IVue;
const simpletaskApp = Vue.createApp({
    'template': '<div v-for="(item, formId) of forms" class="cg-simpletask-item" @click="tap(parseInt(formId))"><div v-if="item.icon" class="cg-simpletask-icon" :style="{\'background-image\': \'url(\' + item.icon + \')\'}"></div><div>{{item.title}}</div></div>',
    'data': function() {
        return {
            'forms': {}
        };
    },
    'watch': {
        'forms': {
            handler: function(this: IVue) {
                let length = Object.keys(this.forms).length;
                if (length > 0) {
                    if (simpletaskElement.style.bottom !== '0px') {
                        simpletaskElement.style.bottom = '0px';
                    }
                }
                else {
                    if (simpletaskElement.style.bottom === '0px') {
                        simpletaskElement.style.bottom = '-46px';
                    }
                }
            },
            'deep': true
        }
    },
    'methods': {
        tap: function(this: IVue, formId: number): void {
            changeFocus(formId);
        }
    },
    'mounted': function(this: IVue): void {
        simpletaskRoot = this;
    }
});
simpletaskApp.mount('#cg-simpletask');

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

/**
 * --- 获取 pop 显示出来的坐标并报系统全局记录 ---
 * @param pop 要显示 pop 的母层对象
 * @param direction 要显示方向（以 $el 为准的 h 水平和 v 垂直）或坐标
 * @param size 显示的 pop 定义自定义宽度，可省略
 */
export function showPop(pop: IVueControl, direction: 'h' | 'v' | MouseEvent | TouchEvent | { x: number; y: number; }, opt: { 'size'?: { width?: number; height?: number; }; 'null'?: boolean; } = {}): void {
    if (pop.cgSelfPopOpen) {
        return;
    }
    // --- opt.null 为 true 代表可为空，为空也会被显示，默认为 false ---
    if (opt.null === undefined) {
        opt.null = false;
    }
    if (opt.size === undefined) {
        opt.size = {};
    }
    /** --- 是否显示本 pop --- */
    let doShow: boolean = (pop.cgSelfPop !== undefined) ? true : opt.null;
    if (!clickgo.dom.findParentByClass(pop.$el, 'cg-pop-list')) {
        // --- 本层不是 pop，因此要弹出 current pop ---
        if (popShowing) {
            popShowing.cgHidePop();
        }
        if (doShow) {
            popShowing = pop;
        }
    }
    // --- 有本 layer 的其他子层显示的话则隐藏 ---
    pop.cgParentPopLayer.cgChildPopItemShowing?.cgHidePop();
    if (doShow) {
        // --- 显示前一些变量的处理 ---
        pop.cgSelfPopOpen = true;
        // --- 然后将本 layer 的子层显示设置为自己 ---
        pop.cgParentPopLayer.cgChildPopItemShowing = pop;
    }
    // --- 没有子层直接返回 ---
    if (pop.cgSelfPop === undefined) {
        pop.cgPopPosition = {
            'left': '-5000px',
            'top': '0px',
            'zIndex': '0'
        };
        return;
    }
    // --- 最终 pop 的大小 ---
    let width = opt.size.width ?? pop.cgSelfPop.$el.offsetWidth;
    let height = opt.size.height ?? pop.cgSelfPop.$el.offsetHeight;
    // --- 最终显示位置 ---
    let left: number, top: number;
    if (typeof direction === 'string') {
        let bcr = pop.$el.getBoundingClientRect();
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
        if (width + left > window.innerWidth) {
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
        if (height + top > window.innerHeight) {
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
        if (width + left > window.innerWidth) {
            left = x - width - 5;
        }
        // --- 垂直 ---
        if (height + top > window.innerHeight) {
            top = y - height - 5;
        }
    }
    if (left < 0) {
        left = 0;
    }
    if (top < 0) {
        top = 0;
    }
    pop.cgPopPosition = {
        'left': left + 'px',
        'top': top + 'px',
        'zIndex': (++lastPopZIndex).toString()
    };
    if (opt.size.width) {
        pop.cgPopPosition.width = opt.size.width + 'px';
    }
    if (opt.size.height) {
        pop.cgPopPosition.width = opt.size.height + 'px';
    }
}

/**
 * --- 隐藏正在显示中的顶级 pop 母层，或指定 pop 母层 ---
 */
export function hidePop(pop: IVueControl | null = null): void {
    if (!pop) {
        if (!popShowing) {
            return;
        }
        if (!popShowing.cgSelfPopOpen) {
            return;
        }
        popShowing.cgHidePop();
        // --- cgHidePop 中会自动执行下面的（会被执行 hidePop(pop)） ---
        return;
    }
    if (!pop.cgSelfPopOpen) {
        return;
    }
    pop.cgSelfPopOpen = false;
    if (pop.cgParentPopLayer.cgChildPopItemShowing === pop) {
    // --- 如果在母层上还显示着的 pop 层是自己，则注销他，因为自己已经隐藏 ---
        pop.cgParentPopLayer.cgChildPopItemShowing = undefined;
    }
    if (pop.cgSelfPop?.cgChildPopItemShowing) {
        // --- 如果自己的 pop 还显示着 pop，也要一并 hidePop ---
        pop.cgSelfPop.cgChildPopItemShowing.cgHidePop();
    }
    if (pop === popShowing) {
        popShowing = null;
    }
}

/**
 * --- 点下 (mousedown / touchstart) 屏幕任意一位置时根据点击处处理隐藏 pop 和焦点丢失事件，鼠标和 touch 只会响应一个 ---
 * @param e 事件对象
 */
export function doFocusAndPopEvent(e: MouseEvent | TouchEvent): void {
    if (clickgo.dom.isMouseAlsoTouchEvent(e)) {
        return;
    }
    let target = e.target;
    if (!target) {
        return;
    }
    let element: HTMLElement | null = target as HTMLElement;
    if (element.classList.contains('cg-pop-open')) {
        // --- 此对象为已打开 pop 的组件，不做处理，因为 down 时不能处理隐藏等情况 ---
        return;
    }
    let parent: HTMLElement | null;
    if (clickgo.dom.findParentByClass(element, ['cg-pop-list', 'cg-pop-open'])) {
        // --- 弹出层点击，不触发丢失焦点，也不触发隐藏 pop，是否隐藏请自行处理 ---
        return;
    }
    if ((parent = clickgo.dom.findParentByClass(element, 'cg-form-wrap'))) {
        // --- 窗体内部点击，转换焦点到当前窗体，但触发隐藏 pop ---
        let formId = parseInt(parent.getAttribute('data-form-id') ?? '0');
        changeFocus(formId);
        hidePop();
        return;
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
    let taskId: number = getTaskId(formId);
    let title = '';
    let icon = '';
    if (clickgo.task.list[taskId].forms[formId]) {
        title = clickgo.task.list[taskId].forms[formId].vroot.$refs.form.title;
        icon = clickgo.task.list[taskId].forms[formId].vroot.$refs.form.iconData;
        if (clickgo.task.list[taskId].forms[formId].vroot.$refs.form.maskFrom !== undefined) {
            let fid = clickgo.task.list[taskId].forms[formId].vroot.$refs.form.maskFrom;
            clickgo.task.list[taskId].forms[fid].vroot.$refs.form.maskFor = undefined;
        }
        clickgo.task.list[taskId].forms[formId].vroot.$refs.form.$data.showData = false;
        setTimeout(function() {
            // --- 获取最大的 z index 窗体，并让他获取焦点 ---
            let fid = getMaxZIndexFormID({
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
            delete(clickgo.task.list[taskId].forms[formId]);
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
    let cgPath: string = opt.file ?? opt.path ?? '/';
    /** --- 当前的 Task 对象 --- */
    let task = clickgo.task.list[taskId];
    if (!task) {
        return -1;
    }
    /** --- 当前的 APP PKG --- */
    let appPkg: ICGAppPkg = task.appPkg;
    // ---  申请 formId ---
    let formId = ++lastFormId;
    // --- 注入的参数，屏蔽浏览器全局对象，注入新的对象 ---
    let invoke: Record<string, any> = {
        'window': undefined,
        'loader': undefined
    };
    let ks = Object.getOwnPropertyNames(window);
    for (let k of ks) {
        if (k.includes('Event')) {
            continue;
        }
        if (['__awaiter', 'requestAnimationFrame', 'eval', 'Math', 'Array', 'Blob', 'Infinity', 'parseInt', 'parseFloat', 'Promise', 'Date', 'JSON'].includes(k)) {
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
    for (let k in clickgo.core) {
        if (!['config', 'trigger'].includes(k)) {
            continue;
        }
        invoke.clickgo.core[k] = (clickgo.core as any)[k];
    }
    for (let k in clickgo.dom) {
        if (!['setGlobalCursor', 'isMouseAlsoTouchEvent', 'getStyleCount', 'getSize', 'watchSize', 'watch', 'bindDown', 'bindLong', 'is', 'bindMove', 'bindResize'].includes(k)) {
            continue;
        }
        invoke.clickgo.dom[k] = (clickgo.dom as any)[k];
    }
    for (let k in clickgo.form) {
        if (!['getTask', 'setTask', 'clearTask', 'getAvailArea', 'refreshMaxPosition', 'getTaskId', 'min', 'get', 'getList', 'changeFocus', 'getMaxZIndexFormID', 'getRectByBorder', 'showCircular', 'moveRectangle', 'showRectangle', 'hideRectangle', 'notify', 'notifyProgress', 'hideNotify', 'showPop', 'hidePop', 'remove'].includes(k)) {
            continue;
        }
        invoke.clickgo.form[k] = (clickgo.form as any)[k];
    }
    for (let k in clickgo.task) {
        if (!['get', 'getList', 'run', 'end'].includes(k)) {
            continue;
        }
        invoke.clickgo.task[k] = (clickgo.task as any)[k];
    }
    for (let k in clickgo.tool) {
        if (!['blob2ArrayBuffer', 'clone', 'sleep', 'purify', 'getMimeByPath', 'rand', 'getBoolean', 'escapeHTML', 'includes', 'replace', 'parseUrl', 'urlResolve', 'blob2Text', 'blob2DataUrl'].includes(k)) {
            continue;
        }
        invoke.clickgo.tool[k] = (clickgo.tool as any)[k];
    }
    for (let k in clickgo.zip) {
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
    // --- 代码预处理 ---
    let preprocess = function(code: string, path: string): string {
        let exec = /eval\W/.exec(code);
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
    let components: any = {};
    for (let controlPath of appPkg.config.controls) {
        let controlPkg: false | ICGControlPkg;
        if (controlPath.startsWith('/clickgo/')) {
            let path = controlPath.slice(8);
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
        for (let name in controlPkg) {
            let item: ICGControl = controlPkg[name];
            // --- 准备相关变量 ---
            let props: any = {};
            let data: any = {};
            let methods: any = {};
            let computed: any = {};
            let watch = {};
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
                let expo = loader.require(item.config.code, item.files, {
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
                let style = item.files[item.config.style + '.css'] as string;
                if (style) {
                    let r = clickgo.tool.stylePrepend(style.replace(/^\ufeff/, ''));
                    prep = r.prep;
                    clickgo.dom.pushStyle(task.id, await clickgo.tool.styleUrl2ObjectOrDataUrl(item.config.style, r.style, item), 'control', name);
                }
                // --- 要创建的 control 的 layout ---
                layout = item.files[item.config.layout + '.html'] as string;
                if (!layout) {
                    return -4;
                }
                layout = layout.replace(/^\ufeff/, '');
                // --- 给控件的 layout 的 class 增加前置 ---
                let prepList = [
                    'cg-theme-task' + taskId + '-' + name + '_'
                ];
                if (prep !== '') {
                    prepList.push(prep);
                }
                // --- 增加 class 为 tag-xxx ---
                layout = clickgo.tool.layoutAddTagClassAndReTagName(layout, false);
                // --- 给 layout 的 class 增加前置 ---
                layout = clickgo.tool.layoutClassPrepend(layout, prepList);
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
            computed.cgSlots = function(this: IVueControl): (name?: string) => IVueVNode[] {
                return (name: string = 'default'): IVueVNode[] => {
                    let d = this.$slots[name];
                    if (!d) {
                        return [];
                    }
                    let slots = [];
                    let list = d();
                    for (let item of list) {
                        if (typeof item.type === 'symbol') {
                            // --- 动态的 slot，例如 v-for 产生的 slot ---
                            for (let item2 of item.children) {
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
            // --- data ---
            if (data.cgNest === undefined) {
                data.cgNest = false;
            }
            // --- pop start ---
            if (data.cgSelfIsPopLayer === undefined) {
                data.cgSelfIsPopLayer = false;
            }
            data.cgChildPopItemShowing = undefined;
            data.cgSelfPop = undefined;
            data.cgSelfPopOpen = false;
            data.cgPopPosition = {
                'left': '-5000px',
                'top': '0px',
                'zIndex': '0'
            };
            // --- pop end ---
            data.cgRealHover = false;
            data.cgActive = false;
            // --- 预设 computed ---
            computed.cgHover = function(this: IVueControl): boolean {
                if (clickgo.dom.is.move) {
                    return false;
                }
                return this.cgRealHover;
            };
            computed.cgWidthPx = function(this: IVueControl): string | undefined {
                if (this.width !== undefined) {
                    return this.width + 'px';
                }
                if (this.flex !== '') {
                    let parent = this.cgParent;
                    return parent ? (parent.direction === 'v' ? undefined : '0') : undefined;
                }
            };
            computed.cgHeightPx = function(this: IVueControl): string | undefined {
                if (this.height !== undefined) {
                    return this.height + 'px';
                }
                if (this.flex !== '') {
                    let parent = this.cgParent;
                    return parent ? (parent.direction === 'v' ? '0' : undefined) : undefined;
                }
            };
            computed.cgLocal = function(this: IVueControl): string {
                if (clickgo.task.list[this.taskId].local.name === '') {
                    return clickgo.core.config.local;
                }
                return clickgo.task.list[this.taskId].local.name;
            };
            // --- 获取语言 ---
            computed.l = function(this: IVueControl): (key: string, data?: Record<string, Record<string, string>>) => string {
                return (key: string, data?: Record<string, Record<string, string>>): string => {
                    if (data) {
                        return data[this.cgLocal]?.[key] ?? data['en-us'][key] ?? 'LocaleError';
                    }
                    else if (this.localData) {
                        return this.localData[this.cgLocal]?.[key] ?? this.localData['en-us'][key] ?? 'LocaleError';
                    }
                    else {
                        return 'LocaleError';
                    }
                };
            };
            // --- 获取正常非 nest 上级 ---
            computed.cgParent = function(this: IVueControl): IVueControl | null {
                let parent = this.$parent;
                while (true) {
                    if (!parent) {
                        return null;
                    }
                    if (parent.cgNest) {
                        parent = parent.$parent;
                        continue;
                    }
                    return parent;
                }
            };
            // --- 根据 control name 查询上级序列 ---
            computed.cgParentByName = function(this: IVueControl): (controlName: string) => IVueControl | null {
                return (controlName: string): IVueControl | null => {
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
            // --- 上级最近的一层的 pop layer 组件 ---
            computed.cgParentPopLayer = function(this: IVueControl): IVueControl {
                let parent = this.$parent;
                while (true) {
                    if (!parent) {
                        return this;
                    }
                    if (parent.controlName === 'form') {
                        return parent;
                    }
                    if (parent.cgSelfIsPopLayer) {
                        return parent;
                    }
                    parent = parent.$parent;
                }
            };
            methods.cgClose = function(this: IVueControl): void {
                remove(this.formId);
            };
            methods.cgBindFormResize = function(this: IVueControl, e: MouseEvent | TouchEvent, border: TCGBorder): void {
                this.cgParentByName('form').resizeMethod(e, border);
            };
            // --- 预设 methods ---
            methods.cgDown = function(this: IVueControl, e: MouseEvent | TouchEvent) {
                if (clickgo.dom.isMouseAlsoTouchEvent(e)) {
                    return;
                }
                if (e instanceof TouchEvent) {
                    this.cgRealHover = true;
                    this.$emit('enter', e);
                }
                else {
                    let up = (): void => {
                        window.removeEventListener('mouseup', up);
                        this.cgActive = false;
                        this.$emit('up', e);
                    };
                    window.addEventListener('mouseup', up);
                }
                // --- 触发自定义 down 事件 ---
                this.cgActive = true;
                this.$emit('down', e);
            };
            methods.cgUp = function(this: IVueControl, e: MouseEvent | TouchEvent) {
                if (e instanceof MouseEvent) {
                    return;
                }
                this.cgRealHover = false;
                this.$emit('leave', e);
                this.cgActive = false;
                this.$emit('up', e);
            };
            methods.cgCancel = function(this: IVueControl, e: TouchEvent) {
                this.cgRealHover = false;
                this.cgActive = false;
                this.$emit('leave', e);
                this.$emit('up', e);
            };
            methods.cgEnter = function(this: IVueControl, e: MouseEvent) {
                if (clickgo.dom.isMouseAlsoTouchEvent(e)) {
                    return;
                }
                this.cgRealHover = true;
                this.$emit('enter', e);
            };
            methods.cgLeave = function(this: IVueControl, e: MouseEvent) {
                if (!this.cgRealHover) {
                    return;
                }
                this.cgRealHover = false;
                this.$emit('leave', e);
            };
            methods.cgTap = function(this: IVueControl, e: MouseEvent | TouchEvent | KeyboardEvent) {
                if (this.$el.className.includes('cg-disabled')) {
                    return;
                }
                this.$emit('tap', e);
            };
            methods.cgDblclick = function(this: IVueControl, e: MouseEvent) {
                e.stopPropagation();
                if (this.$el.className.includes('cg-disabled')) {
                    return;
                }
                this.$emit('dblclick', e);
            };
            // --- 获取文件 blob 或 string 对象 ---
            methods.cgGetFile = async function(this: IVueControl, path: string): Promise<Blob | string | null> {
                if (path.startsWith('/clickgo/')) {
                    return await clickgo.core.fetchClickGoFile(path.slice(8));
                }
                else {
                    path = clickgo.tool.urlResolve(this.cgPath, path);
                    return task.appPkg.files[path] ?? null;
                }
            };
            // --- 获取本 task 的 object url ---
            methods.cgGetObjectUrl = function(this: IVueControl, file: string): string | null {
                file = clickgo.tool.urlResolve(this.cgPath, file);
                if (file.startsWith('/clickgo/')) {
                    return clickgo.cgRootPath + file.slice(9);
                }
                return clickgo.tool.file2ObjectUrl(file, clickgo.task.list[this.taskId]);
            };
            methods.cgGetDataUrl = async function(this: IVueControl, file: string): Promise<string | null> {
                let f = await this.cgGetFile(file);
                if (!f) {
                    return null;
                }
                return f && f instanceof Blob ? await clickgo.tool.blob2DataUrl(f) : null;
            };
            // --- layout 中 :class 的转义 ---
            methods.cgClassPrepend = function(this: IVueControl, cla: any): string {
                if (typeof cla !== 'string') {
                    return cla;
                }
                if (cla.startsWith('cg-')) {
                    return cla;
                }
                return `cg-theme-task${this.taskId}-${this.controlName}_${cla} ${this.cgPrep}${cla}`;
            };
            // --- 设置 timer ---
            methods.cgCreateTimer = function(this: IVueControl, fun: () => void | Promise<void>, delay: number, interval: boolean = false): number {
                let timer: number;
                if (interval) {
                    timer = window.setInterval(() => {
                        fun() as void;
                    }, delay);
                }
                else {
                    timer = window.setTimeout(() => {
                        let i = clickgo.task.list[this.taskId].timers.indexOf(timer);
                        if (i === -1) {
                            return;
                        }
                        clickgo.task.list[this.taskId].timers.splice(i, 1);
                        fun() as void;
                    }, delay);
                }
                clickgo.task.list[this.taskId].timers.push(timer);
                return timer;
            };
            methods.cgRemoveTimer = function(this: IVueControl, timer: number): void {
                let i = clickgo.task.list[this.taskId].timers.indexOf(timer);
                if (i === -1) {
                    return;
                }
                clickgo.task.list[this.taskId].timers.splice(i, 1);
                clearTimeout(timer);
            };
            // --- pop 相关操作 ---
            if (!methods.cgShowPop) {
                methods.cgShowPop = function(this: IVueControl, direction: 'h' | 'v' | MouseEvent | TouchEvent | { x: number; y: number; }, opt?: { 'size'?: { width?: number; height?: number; }; 'null'?: boolean; }): void {
                    clickgo.form.showPop(this, direction, opt);
                };
            }
            if (!methods.cgHidePop) {
                methods.cgHidePop = function(this: IVueControl): void {
                    clickgo.form.hidePop(this);
                };
            }
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
                'mounted': async function(this: IVueControl) {
                    await this.$nextTick();
                    // --- 检测本控件是否是 pop 层的控件 ---
                    if ((this.$el.parentNode?.parentNode as HTMLDivElement | undefined)?.id === 'cg-pop-list') {
                        this.cgSelfIsPopLayer = true;
                        if (this.$parent) {
                            this.$parent.cgSelfPop = this;
                        }
                    }
                    mounted?.call(this);
                },
                'beforeUpdate': beforeUpdate,
                'updated': async function(this: IVue) {
                    await this.$nextTick();
                    updated?.call(this);
                },
                'beforeUnmount': function(this: IVueControl) {
                    beforeUnmount?.call(this);
                    // --- before 不能 nextTick ---
                    // --- 如果自己是 pop 层并且有上层，则吧上层的 cgSelfPop 注销 ---
                    if (this.cgSelfIsPopLayer && this.$parent) {
                        this.$parent.cgSelfPop = undefined;
                    }
                    // --- 如果自己还在上层显示，则取消 ---
                    if (this.cgParentPopLayer.cgChildPopItemShowing === this) {
                        this.cgHidePop();
                    }
                },
                'unmounted': async function(this: IVueControl) {
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
        let layoutFile = appPkg.files[opt.file + '.xml'] as string;
        if (layoutFile) {
            layout = layoutFile.replace(/^\ufeff/, '');
        }
        let styleFile = appPkg.files[opt.file + '.css'] as string;
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
    if (appPkg.files[opt.file + '.js']) {
        expo = loader.require(opt.file!, appPkg.files, {
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
        let r = clickgo.tool.stylePrepend(style);
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
    let prepList = ['cg-task' + taskId + '_'];
    if (prep !== '') {
        prepList.push(prep);
    }
    layout = clickgo.tool.layoutClassPrepend(layout, prepList);
    formListElement.insertAdjacentHTML('beforeend', `<div class="cg-form-wrap" data-form-id="${formId.toString()}" data-task-id="${taskId.toString()}"></div>`);
    // --- 获取刚才的 form wrap element 对象 ---
    let el: HTMLElement = formListElement.children.item(formListElement.children.length - 1) as HTMLElement;
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
    computed.cgLocal = function(this: IVueForm): string {
        if (clickgo.task.list[this.taskId].local.name === '') {
            return clickgo.core.config.local;
        }
        return clickgo.task.list[this.taskId].local.name;
    };
    // --- 获取语言 ---
    computed.l = function(this: IVueForm): (key: string) => string {
        return (key: string): string => {
            return clickgo.task.list[this.taskId].local.data[this.cgLocal]?.[key] ?? 'LocaleError';
        };
    };
    // --- 初始化系统方法 ---
    methods.cgCreateForm = async function(this: IVueForm, paramOpt: string | ICGFormCreateOptions & { 'mask'?: boolean; } = {}): Promise<void> {
        let inOpt: ICGFormCreateOptions = {
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
        let form = await create(taskId, inOpt);
        if (typeof form === 'number') {
            if (this.$refs.form) {
                this.$refs.form.maskFor = undefined;
            }
        }
        else {
            if (this.$refs.form?.maskFor) {
                this.$refs.form.maskFor = form.id;
                form.vroot.$refs.form.maskFrom = this.formId;
            }
        }
    };
    methods.cgClose = function(this: IVueForm): void {
        remove(this.formId);
    };
    methods.cgMax = function(this: IVueForm): void {
        // --- 平时同 state 传值，这个是外围调用的时候才会用到 ---
        this.$refs.form.maxMethod();
    };
    methods.cgMin = function(this: IVueForm): void {
        this.$refs.form.minMethod();
    };
    methods.cgBindFormDrag = function(this: IVueForm, e: MouseEvent | TouchEvent): void {
        this.$refs.form.moveMethod(e, true);
    };
    methods.cgBindFormResize = function(this: IVueForm, e: MouseEvent | TouchEvent, border: TCGBorder): void {
        this.$refs.form.resizeMethod(e, border);
    };
    methods.cgSetSystemEventListener = function(this: IVueForm, name: TCGGlobalEvent, func: (...any: any) => void | Promise<void>): void {
        clickgo.task.list[this.taskId].forms[this.formId].events[name] = func;
    };
    methods.cgRemoveSystemEventListener = function(this: IVueForm, name: TCGGlobalEvent): void {
        delete(clickgo.task.list[this.taskId].forms[this.formId].events[name]);
    };
    methods.cgDialog = function(this: IVueForm, opt: string | ICGFormDialog): Promise<string> {
        return new Promise((resolve) => {
            if (typeof opt === 'string' || typeof opt === 'number') {
                opt = {
                    'content': opt
                };
            }
            if (opt.buttons === undefined) {
                opt.buttons = [localData[this.cgLocal]?.ok ?? localData['en-us'].ok];
            }
            this.cgCreateForm({
                'layout': `<form title="${opt.title ?? 'dialog'}" width="auto" height="auto" :min="false" :max="false" :resize="false" :min-height="50" border="${opt.title ? 'normal' : 'plain'}"><dialog :buttons="buttons" @select="select">${opt.content}</dialog></form>`,
                'code': {
                    data: {
                        'buttons': opt.buttons
                    },
                    methods: {
                        select: function(this: IVueForm, button: string) {
                            let event = {
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
    methods.cgConfirm = async function(this: IVueForm, content: string, cancel: boolean = false): Promise<boolean | number> {
        let buttons = [localData[this.cgLocal]?.yes ?? localData['en-us'].yes, localData[this.cgLocal]?.no ?? localData['en-us'].no];
        if (cancel) {
            buttons.push(localData[this.cgLocal]?.cancel ?? localData['en-us'].cancel);
        }
        let res = await this.cgDialog({
            'content': content,
            'buttons': buttons
        });
        if (res === (localData[this.cgLocal]?.yes ?? localData['en-us'].yes)) {
            return true;
        }
        if (res === (localData[this.cgLocal]?.cancel ?? localData['en-us'].cancel)) {
            return 0;
        }
        return false;
    };
    // --- 获取文件 blob 对象 ---
    methods.cgGetFile = async function(this: IVueForm, path: string): Promise<Blob | string | null> {
        if (path.startsWith('/clickgo/')) {
            return await clickgo.core.fetchClickGoFile(path.slice(8));
        }
        else {
            path = clickgo.tool.urlResolve(this.cgPath, path);
            return task.appPkg.files[path] ?? null;
        }
    };
    // --- 获取本 task 的 object url ---
    methods.cgGetObjectUrl = function(this: IVueForm, file: string): string | null {
        file = clickgo.tool.urlResolve(this.cgPath, file);
        if (file.startsWith('/clickgo/')) {
            return clickgo.cgRootPath + file.slice(9);
        }
        return clickgo.tool.file2ObjectUrl(file, clickgo.task.list[this.taskId]);
    };
    methods.cgGetDataUrl = async function(this: IVueForm, file: string): Promise<string | null> {
        let f = await this.cgGetFile(file);
        if (!f) {
            return null;
        }
        return f && f instanceof Blob ? await clickgo.tool.blob2DataUrl(f) : null;
    };
    // --- 加载主题 ---
    methods.cgLoadTheme = async function(this: IVueForm, path: string): Promise<boolean> {
        path = clickgo.tool.urlResolve(this.cgPath, path);
        return await clickgo.theme.load(this.taskId, path);
    };
    // --- 卸载主题 ---
    methods.cgRemoveTheme = async function(this: IVueForm, path: string): Promise<void> {
        path = clickgo.tool.urlResolve(this.cgPath, path);
        await clickgo.theme.remove(this.taskId, path);
    };
    // --- 加载全新主题（老主题会被清除） ---
    methods.cgSetTheme = async function(this: IVueForm, path: string): Promise<void> {
        path = clickgo.tool.urlResolve(this.cgPath, path);
        await clickgo.theme.clear(this.taskId);
        await clickgo.theme.load(this.taskId, path);
    };
    // --- 清除主题 ---
    methods.cgClearTheme = async function(this: IVueForm): Promise<void> {
        await clickgo.theme.clear(this.taskId);
    };
    // --- 加载全局主题 ---
    methods.cgSetGlobalTheme = async function(this: IVueForm, path: string | Blob): Promise<void> {
        if (typeof path === 'string') {
            let blob = await this.cgGetFile(path);
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
    methods.cgSetTopMost = function(this: IVueForm, top: boolean): void {
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
    methods.cgFlash = function(this: IVueForm): void {
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
    methods.cgShow = function(this: IVueForm): void {
        this.$refs.form.$data.showData = true;
    };
    // --- 让窗体隐藏 ---
    methods.cgHide = function(this: IVueForm): void {
        this.$refs.form.$data.showData = false;
    };
    // --- 加载 local 文件 json ---
    methods.cgLoadLocal = async function(this: IVueForm, name: string, path: string): Promise<boolean> {
        path = clickgo.tool.urlResolve(this.cgPath, path + '.json');
        if (!task.files[path]) {
            return false;
        }
        try {
            let data = JSON.parse(task.files[path] as string);
            this.cgLoadLocalData(name, data);
            return true;
        }
        catch {
            return false;
        }
    };
    // --- 加载全新 local（老 local 的所以语言的缓存会被卸载） ---
    methods.cgSetLocal = async function(this: IVueForm, name: string, path: string): Promise<boolean> {
        this.cgClearLocal();
        return await this.cgLoadLocal(name, path);
    };
    // --- 清除所有语言文件 ---
    methods.cgClearLocal = function(this: IVueForm): void {
        clickgo.task.list[this.taskId].local.data = {};
    };
    // --- 加载 local data 对象到 task ---
    methods.cgLoadLocalData = function(this: IVueForm, name: string, data: Record<string, any>, pre: string = ''): void {
        clickgo.task.loadLocalData(this.taskId, name, data, pre);
    };
    // --- 设置本 task 的语言 name ---
    methods.cgSetLocalName = function(this: IVueForm, name: string): void {
        clickgo.task.list[this.taskId].local.name = name;
    };
    // --- layout 中 :class 的转义 ---
    methods.cgClassPrepend = function(this: IVueForm, cla: any): string {
        if (typeof cla !== 'string') {
            return cla;
        }
        if (cla.startsWith('cg-')) {
            return cla;
        }
        return `cg-task${this.taskId}_${cla} ${this.cgPrep}${cla}`;
    };
    // --- 设置 timer ---
    methods.cgCreateTimer = function(this: IVueForm, fun: () => void | Promise<void>, delay: number, interval: boolean = false): number {
        let timer: number;
        if (interval) {
            timer = window.setInterval(() => {
                fun() as void;
            }, delay);
        }
        else {
            timer = window.setTimeout(() => {
                let i = clickgo.task.list[this.taskId].timers.indexOf(timer);
                if (i === -1) {
                    return;
                }
                clickgo.task.list[this.taskId].timers.splice(i, 1);
                fun() as void;
            }, delay);
        }
        clickgo.task.list[this.taskId].timers.push(timer);
        return timer;
    };
    methods.cgRemoveTimer = function(this: IVueForm, timer: number): void {
        let i = clickgo.task.list[this.taskId].timers.indexOf(timer);
        if (i === -1) {
            return;
        }
        clickgo.task.list[this.taskId].timers.splice(i, 1);
        clearTimeout(timer);
    };
    // --- 挂载 style ---
    if (style) {
        // --- 窗体的 style ---
        clickgo.dom.pushStyle(taskId, style, 'form', formId);
    }
    // --- 创建 app 对象 ---
    let rtn: {
        'vapp': IVueApp;
        'vroot': IVueForm;
    } = await new Promise(function(resolve) {
        const vapp = Vue.createApp({
            'template': (layout as string).replace(/^<cg-form/, '<cg-form ref="form"'),
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
            'mounted': async function(this: IVueForm) {
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
        vapp.config.errorHandler = function(err: Error, vm: IVueForm, info: string): void {
            notify({
                'title': 'Runtime Error',
                'content': `Message: ${err.message}\nTask id: ${vm.taskId}\nForm id: ${vm.formId}`,
                'type': 'danger'
            });
            clickgo.core.trigger('error', vm.taskId, vm.formId, err, info);
        };
        // --- 挂载控件对象到 vapp ---
        for (let key in components) {
            vapp.component(key, components[key]);
        }
        vapp.mount(el);
    });
    // --- 创建 form 信息对象 ---
    let form: ICGForm = {
        'id': formId,
        'vapp': rtn.vapp,
        'vroot': rtn.vroot,
        'win': null,
        'events': {}
    };
    // --- 挂载 form ---
    task.forms[formId] = form;
    // --- 执行 mounted ---
    await clickgo.tool.sleep(5);
    if (mounted) {
        try {
            await mounted.call(rtn.vroot);
        }
        catch (err) {
            clickgo.core.trigger('error', rtn.vroot.taskId, rtn.vroot.formId, err, 'Create form mounted error.');
            task.forms[formId] = undefined as any;
            delete(task.forms[formId]);
            rtn.vapp.unmount();
            rtn.vapp._container.remove();
            clickgo.dom.removeStyle(rtn.vroot.taskId, 'form', rtn.vroot.formId);
            return -6;
        }
    }
    // --- 将窗体居中 ---
    let area = getAvailArea();
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
    refreshTaskPosition();
});

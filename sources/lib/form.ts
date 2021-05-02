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

/**
 * --- 改变 form 的焦点 class ---
 * @param formId 变更后的 form id
 */
export function changeFocus(formId: number = 0, vm?: IVue): void {
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
                task.forms[dataFormIdNumber].vroot.focus = false;
                // --- 触发 formBlurred 事件 ---
                clickgo.core.trigger('formBlurred', taskId, dataFormIdNumber);
            }
        }
        else {
            return;
        }
    }
    if (formId !== 0) {
        let el = document.querySelector(`.cg-form-list > [data-form-id='${formId}']`);
        if (el) {
            let taskId: number;
            if (vm) {
                if (!vm.$data._customZIndex) {
                    if (vm.$data._topMost) {
                        vm.$refs.form.setPropData('zIndex', ++lastTopZIndex);
                    }
                    else {
                        vm.$refs.form.setPropData('zIndex', ++lastZIndex);
                    }
                }
                (vm.$el.parentNode as HTMLDivElement).classList.add('cg-focus');
                vm.focus = true;
                taskId = vm.taskId;
            }
            else {
                taskId = parseInt(el.getAttribute('data-task-id') ?? '0');
                let task = clickgo.task.list[taskId];
                if (!task.forms[formId].vroot.$data._customZIndex) {
                    if (task.forms[formId].vroot.$data._topMost) {
                        task.forms[formId].vroot.$refs.form.setPropData('zIndex', ++lastTopZIndex);
                    }
                    else {
                        task.forms[formId].vroot.$refs.form.setPropData('zIndex', ++lastZIndex);
                    }
                }
                task.forms[formId].vapp._container.classList.add('cg-focus');
                task.forms[formId].vroot.focus = true;
            }
            // --- 触发 formFocused 事件 ---
            clickgo.core.trigger('formFocused', taskId, formId);
        }
    }
}

/**
 * --- 获取当前 z-index 值最大的 form id（除了 top 模式的窗体） ---
 */
export function getMaxZIndexFormID(): number | null {
    let zIndex: number = 0;
    let formId: number | null = null;
    let fl = document.querySelector('.cg-form-list') as HTMLDivElement;
    for (let i = 0; i < fl.children.length; ++i) {
        let root = fl.children.item(i) as HTMLDivElement;
        let formWrap = root.children.item(0) as HTMLDivElement;
        let z = parseInt(formWrap.style.zIndex);
        if (z > 9999999) {
            continue;
        }
        if (z > zIndex) {
            zIndex = z;
            formId = parseInt(root.getAttribute('data-form-id')!);
        }
    }
    return formId;
}

/**
 * --- 根据 border 方向 获取理论窗体大小 ---
 * @param border 显示的位置代号
 */
export function getRectByBorder(border: TCGBorder): { 'width': number; 'height': number; 'left': number; 'top': number; } {
    let position = clickgo.getPosition();
    let width!: number, height!: number, left!: number, top!: number;
    if (typeof border === 'string') {
        switch (border) {
            case 'lt': {
                width = position.width / 2;
                height = position.height / 2;
                left = position.left;
                top = position.top;
                break;
            }
            case 't': {
                width = position.width;
                height = position.height;
                left = position.left;
                top = position.top;
                break;
            }
            case 'tr': {
                width = position.width / 2;
                height = position.height / 2;
                left = position.left + position.width / 2;
                top = position.top;
                break;
            }
            case 'r': {
                width = position.width / 2;
                height = position.height;
                left = position.left + position.width / 2;
                top = position.top;
                break;
            }
            case 'rb': {
                width = position.width / 2;
                height = position.height / 2;
                left = position.left + position.width / 2;
                top = position.top + position.height / 2;
                break;
            }
            case 'b': {
                width = position.width;
                height = position.height / 2;
                left = position.left;
                top = position.top + position.height / 2;
                break;
            }
            case 'bl': {
                width = position.width / 2;
                height = position.height / 2;
                left = position.left;
                top = position.top + position.height / 2;
                break;
            }
            case 'l': {
                width = position.width / 2;
                height = position.height;
                left = position.left;
                top = position.top;
                break;
            }
        }
    }
    else {
        width = border.width ?? position.width;
        height = border.height ?? position.height;
        left = border.left ?? position.left;
        top = border.top ?? position.top;
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
        rectangleElement.style.width = '20px';
        rectangleElement.style.height = '20px';
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
 * @param x 要显示的 left，或根据 $el 的方向，h 为水平，v 为垂直
 * @param y 要显示的 top
 */
export function showPop(pop: IVueControl, x: number | 'h' | 'v', y: number = 0): { 'left': string; 'top': string; 'zIndex': string; } {
    if (!clickgo.dom.findParentByClass(pop.$el, 'cg-pop-list')) {
        // --- 本层不是 pop，因此要弹出 current pop ---
        if (popShowing) {
            popShowing.hidePop();
        }
        popShowing = pop;
    }
    // --- 没有子层直接返回 ---
    if (pop.selfPop === undefined) {
        return {
            'left': '-5000px',
            'top': '0px',
            'zIndex': '0'
        };
    }
    // --- 获取限定区域 ---
    let position = clickgo.getPosition();
    // --- 最终显示位置 ---
    let left: number, top: number;
    if (typeof x === 'string') {
        let bcr = pop.$el.getBoundingClientRect();
        if (x === 'v') {
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
        if (pop.selfPop.$el.offsetWidth + left > position.width) {
            if (x === 'v') {
                // --- 垂直弹出 ---
                left = position.width - pop.selfPop.$el.offsetWidth;
            }
            else {
                // --- 水平弹出，右边位置不够弹到左边 ---
                left = bcr.left - pop.selfPop.$el.offsetWidth + 2;
            }
        }
        // --- 检测垂直是否出框 ---
        if (pop.selfPop.$el.offsetHeight + top > position.height) {
            if (x === 'v') {
                top = bcr.top - pop.selfPop.$el.offsetHeight;
            }
            else {
                top = position.height - pop.selfPop.$el.offsetHeight;
            }
        }
    }
    else {
        left = x + 5;
        top = y + 7;
        // --- 水平 ---
        if (pop.selfPop.$el.offsetWidth + left > position.width) {
            left = x - pop.selfPop.$el.offsetWidth - 5;
        }
        // --- 垂直 ---
        if (pop.selfPop.$el.offsetHeight + top > position.height) {
            top = y - pop.selfPop.$el.offsetHeight - 5;
        }
    }
    if (left < 0) {
        left = 0;
    }
    if (top < 0) {
        top = 0;
    }
    return {
        'left': left + 'px',
        'top': top + 'px',
        'zIndex': (++lastPopZIndex).toString()
    };
}

/**
 * --- 隐藏正在显示中的顶级 pop 母层，或指定 pop 母层 ---
 */
export function hidePop(pop: IVueControl | null = null): void {
    if (!pop) {
        if (!popShowing) {
            return;
        }
        pop = popShowing;
        popShowing = null;
    }
    else if (pop === popShowing) {
        popShowing = null;
    }
    pop.hidePop();
}

/**
 * --- 点下 (mousedown / touchstart) 屏幕任意一位置时根据点击处处理隐藏 pop 和焦点丢失事件，鼠标和 touch 只会响应一个 ---
 * @param e 事件对象
 */
export function doFocusAndPopEvent(e: MouseEvent | TouchEvent): void {
    if (e instanceof MouseEvent && clickgo.hasTouch) {
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
if ('ontouchstart' in document.documentElement) {
    window.addEventListener('touchstart', doFocusAndPopEvent);
}
else {
    window.addEventListener('mousedown', doFocusAndPopEvent);
}

/**
 * --- 移除一个 form（关闭窗口） ---
 * @param formId 要移除的 form id
 */
export function remove(formId: number): boolean {
    // --- 获取要移除的窗体 element ---
    let formElement = formListElement.querySelector(`[data-form-id='${formId}']`);
    if (!formElement) {
        return false;
    }
    // --- 获取 task id ---
    let taskIdAttr = formElement.getAttribute('data-task-id');
    if (!taskIdAttr) {
        return false;
    }
    let taskId: number = parseInt(taskIdAttr);
    // --- 移除 formList 中的相关 form 对象 ---
    if (Object.keys(clickgo.task.list[taskId].forms).length === 1) {
        // --- 就一个窗体，那肯定就是自己，直接结束 task ---
        return clickgo.task.end(taskId);
    }
    // --- 多个窗体 ---
    let title = '';
    let icon = '';
    if (clickgo.task.list[taskId].forms[formId]) {
        title = clickgo.task.list[taskId].forms[formId].vroot.$refs.form.title;
        icon = clickgo.task.list[taskId].forms[formId].vroot.$refs.form.iconData;
        if (clickgo.task.list[taskId].forms[formId].vroot.$refs.form.maskFrom !== undefined) {
            let fid = clickgo.task.list[taskId].forms[formId].vroot.$refs.form.maskFrom;
            clickgo.task.list[taskId].forms[fid].vroot.$refs.form.maskFor = undefined;
        }
        clickgo.task.list[taskId].forms[formId].vapp.unmount();
        clickgo.task.list[taskId].forms[formId].vapp._container.remove();
        delete(clickgo.task.list[taskId].forms[formId]);
    }
    // --- 移除 form 的 style ---
    clickgo.dom.removeStyle(taskId, 'form', formId);
    // --- 触发 formRemoved 事件 ---
    clickgo.core.trigger('formRemoved', taskId, formId, title, icon);
    // --- 获取最大的 z index 窗体，并让他获取焦点 ---
    let fid = getMaxZIndexFormID();
    if (fid) {
        changeFocus(fid);
    }
    return true;
}

/**
 * --- 直接创建一个窗体(需要验证传入 code、layout 等是否能成功创建) ---
 * @param opt 创建窗体的配置对象
 */
export async function create(taskId: number, opt: ICGFormCreateOptions): Promise<number | ICGForm> {
    /** --- 当前的 Task 对象 --- */
    let task = clickgo.task.list[taskId];
    if (!task) {
        return -1;
    }
    /** --- 当前的 APP PKG --- */
    let appPkg: ICGAppPkg = task.appPkg;
    // ---  申请 formId ---
    let formId = ++lastFormId;
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
                let [expo] = await loader.requireMemory(item.config.code, item.files) ?? [];
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
                let styleBlob = item.files[item.config.style + '.css'];
                if (styleBlob) {
                    let r = clickgo.tool.stylePrepend(await clickgo.tool.blob2Text(styleBlob));
                    prep = r.prep;
                    clickgo.dom.pushStyle(task.id, await clickgo.tool.styleUrl2ObjectOrDataUrl(item.config.style, r.style, item), 'control', name);
                }
                // --- 要创建的 control 的 layout ---
                let layoutBlob = item.files[item.config.layout + '.html'];
                if (!layoutBlob) {
                    return -4;
                }
                // --- 给控件的 layout 的 class 增加前置 ---
                let prepList = [
                    'cg-theme-task' + taskId + '-' + name + '_'
                ];
                if (prep !== '') {
                    prepList.push(prep);
                }
                layout = await clickgo.tool.blob2Text(layoutBlob);
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
            props.focus = {
                'focus': {
                    'default': false
                }
            };
            // --- 组成 data ---
            data.taskId = taskId;
            data.formId = formId;
            data.controlName = name;
            data._path = opt.file ?? opt.path ?? '/';
            data._prep = prep;
            if (data.cgNest === undefined) {
                data.cgNest = false;
            }
            data.cgHasTouch = clickgo.hasTouch;
            data.cgRealHover = false;
            data.cgActive = false;
            // --- 预设 computed ---
            computed.cgHover = function(this: IVueControl): boolean {
                if (clickgo.dom.is.move) {
                    return false;
                }
                return this.cgRealHover;
            };
            // --- 预设 methods ---
            methods.cgDown = function(this: IVueControl, e: MouseEvent | TouchEvent) {
                if (e instanceof MouseEvent && clickgo.hasTouch) {
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
                if (this.cgHasTouch) {
                    return;
                }
                this.cgRealHover = true;
                this.$emit('enter', e);
            };
            methods.cgLeave = function(this: IVueControl, e: MouseEvent) {
                if (this.cgHasTouch) {
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
            // --- 获取文件 blob 对象 ---
            methods.cgGetBlob = async function(this: IVueControl, path: string): Promise<Blob | null> {
                if (path.startsWith('/clickgo/')) {
                    return await clickgo.core.fetchClickGoFile(path.slice(8));
                }
                else {
                    path = clickgo.tool.urlResolve(this.$data._path, path);
                    return task.appPkg.files[path] ?? null;
                }
            };
            // --- 获取本 task 的 object url ---
            methods.cgGetObjectUrl = function(this: IVueControl, file: string): string | null {
                file = clickgo.tool.urlResolve(this.$data._path, file);
                return clickgo.tool.file2ObjectUrl(file, clickgo.task.list[this.taskId]);
            };
            methods.cgGetDataUrl = async function(this: IVueControl, file: string): Promise<string | null> {
                let f = await this.cgGetBlob(file);
                return f ? await clickgo.tool.blob2DataUrl(f) : null;
            };
            // --- layout 中 :class 的转义 ---
            methods.cgClassPrepend = function(this: IVueControl, cla: any): string {
                if (typeof cla !== 'string') {
                    return cla;
                }
                if (cla.startsWith('cg-')) {
                    return cla;
                }
                return `cg-theme-task${this.taskId}-${this.$data.controlName}_${cla} ${this.$data._prep}${cla}`;
            };
            // --- 获取目前现存的子 slots ---
            methods.cgSlots = function(this: IVueControl, name: string = 'default'): IVueVNode[] {
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
            // --- 获取正常非 nest 上级 ---
            methods.cgParent = function(this: IVueControl): IVueControl | null {
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
            methods.cgFindParent = function(this: IVueControl, controlName: string): IVueControl | null {
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
                'mounted': async function(this: IVue) {
                    await this.$nextTick();
                    mounted?.call(this);
                },
                'beforeUpdate': beforeUpdate,
                'updated': async function(this: IVue) {
                    await this.$nextTick();
                    updated?.call(this);
                },
                'beforeUnmount': beforeUnmount,
                'unmounted': unmounted
            };
        }
    }
    // --- 获取 style、layout ---
    let style = opt.style;
    let layout: string | undefined = opt.layout;
    if (opt.file) {
        let layoutBlob = appPkg.files[opt.file + '.xml'];
        if (layoutBlob) {
            layout = await clickgo.tool.blob2Text(layoutBlob);
        }
        let styleBlob = appPkg.files[opt.file + '.css'];
        if (styleBlob) {
            style = await clickgo.tool.blob2Text(styleBlob);
        }
    }
    if (layout === undefined) {
        return -5;
    }
    // --- 准备相关变量 ---
    let data: Record<string, any> = {};
    let methods: any = {};
    let computed = {};
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
    let expo = undefined;
    if (appPkg.files[opt.file + '.js']) {
        [expo] = await loader.requireMemory(opt.file ?? '', appPkg.files) ?? [];
    }
    else if (opt.code) {
        expo = opt.code;
    }
    if (expo) {
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
    layout = clickgo.tool.layoutInsertAttr(layout, ':focus=\'focus\'', {
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
    data.taskId = taskId;
    data.formId = formId;
    data.controlName = 'root';
    data.focus = false;
    data._path = opt.file ?? opt.path ?? '/';
    data._prep = prep;
    data._customZIndex = false;
    data.cgHasTouch = clickgo.hasTouch;
    if (opt.topMost) {
        data._topMost = true;
    }
    else {
        data._topMost = false;
    }
    // --- 初始化系统方法 ---
    methods.cgCreateForm = async function(this: IVueForm, paramOpt: string | ICGFormCreateOptions & { 'mask'?: boolean; } = {}): Promise<void> {
        let inOpt: ICGFormCreateOptions = {
            'path': this._path
        };
        if (typeof paramOpt === 'string') {
            inOpt.file = paramOpt;
        }
        else {
            if (paramOpt.file) {
                inOpt.file = paramOpt.file;
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
            if (paramOpt.mask) {
                this.$refs.form.maskFor = true;
            }
        }
        if (this.$data._topMost) {
            inOpt.topMost = true;
        }
        /** --- 创建的新 IForm 对象 --- */
        let form = await create(taskId, inOpt);
        if (typeof form === 'number') {
            this.$refs.form.maskFor = undefined;
        }
        else {
            if (this.$refs.form.maskFor) {
                this.$refs.form.maskFor = form.id;
                form.vroot.$refs.form.maskFrom = this.formId;
            }
        }
    };
    methods.cgCloseForm = function(this: IVueForm): void {
        remove(this.formId);
    };
    methods.cgBindFormDrag = function(this: IVueForm, e: MouseEvent | TouchEvent): void {
        this.$refs.form.moveMethod(e, true);
    };
    methods.cgSetSystemEventListener = function(this: IVueForm, name: TCGGlobalEvent, func: any): void {
        this.cgEventList[name] = func;
    };
    methods.cgRemoveSystemEventListener = function(this: IVueForm, name: TCGGlobalEvent): void {
        delete(this.cgEventList[name]);
    };
    methods.cgDialog = function(this: IVueForm, opt: string | ICGFormDialog): Promise<string> {
        return new Promise((resolve) => {
            if (typeof opt === 'string' || typeof opt === 'number') {
                opt = {
                    'content': opt
                };
            }
            if (opt.buttons === undefined) {
                opt.buttons = ['OK'];
            }
            this.cgCreateForm({
                'layout': `<form title="${opt.title}" width="auto" height="auto" :min="false" :max="false" :resize="false" :min-height="50" border="${!opt.title ? 'none' : 'normal'}"><dialog :buttons="buttons" @select="select">${opt.content}</dialog></form>`,
                'code': {
                    data: {
                        'buttons': opt.buttons
                    },
                    methods: {
                        select: function(this: IVueForm, button: string) {
                            this.cgCloseForm();
                            resolve(button);
                        }
                    }
                },
                'mask': true
            }).catch((e) => {
                throw e;
            });
        });
    };
    // --- 获取文件 blob 对象 ---
    methods.cgGetBlob = async function(this: IVueForm, path: string): Promise<Blob | null> {
        if (path.startsWith('/clickgo/')) {
            return await clickgo.core.fetchClickGoFile(path.slice(8));
        }
        else {
            path = clickgo.tool.urlResolve(this.$data._path, path);
            return task.appPkg.files[path] ?? null;
        }
    };
    // --- 获取本 task 的 object url ---
    methods.cgGetObjectUrl = function(this: IVueForm, file: string): string | null {
        file = clickgo.tool.urlResolve(this.$data._path, file);
        return clickgo.tool.file2ObjectUrl(file, clickgo.task.list[this.taskId]);
    };
    methods.cgGetDataUrl = async function(this: IVueForm, file: string): Promise<string | null> {
        let f = await this.cgGetBlob(file);
        return f ? await clickgo.tool.blob2DataUrl(f) : null;
    };
    // --- 加载主题 ---
    methods.cgLoadTheme = async function(this: IVueForm, path: string): Promise<void> {
        await clickgo.theme.load(this.taskId, path);
    };
    // --- 卸载主题 ---
    methods.cgRemoveTheme = async function(this: IVueForm, path: string): Promise<void> {
        await clickgo.theme.remove(this.taskId, path);
    };
    // --- 加载全新主题（老主题会被清除） ---
    methods.cgSetTheme = async function(this: IVueForm, path: string): Promise<void> {
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
            let blob = await this.cgGetBlob(path);
            if (blob) {
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
        this.$data._customZIndex = false;
        if (top) {
            // --- 要置顶 ---
            this.$data._topMost = true;
            if (!this.focus) {
                changeFocus(this.formId, this);
            }
            else {
                this.$refs.form.setPropData('zIndex', ++lastTopZIndex);
            }
        }
        else {
            // --- 取消置顶 ---
            this.$data._topMost = false;
            this.$refs.form.setPropData('zIndex', ++lastZIndex);
        }
    };
    // --- 让窗体闪烁 ---
    methods.cgFlash = function(this: IVueForm): void {
        if (!this.focus) {
            changeFocus(this.formId);
        }
        if (this.$refs.form.flashTimer) {
            clearTimeout(this.$refs.form.flashTimer);
            this.$refs.form.flashTimer = undefined;
        }
        this.$refs.form.flashTimer = setTimeout(() => {
            this.$refs.form.flashTimer = undefined;
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
    // --- layout 中 :class 的转义 ---
    methods.cgClassPrepend = function(this: IVueForm, cla: any): string {
        if (typeof cla !== 'string') {
            return cla;
        }
        if (cla.startsWith('cg-')) {
            return cla;
        }
        return `cg-task${this.taskId}_${cla} ${this.$data._prep}${cla}`;
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
        // --- 挂载控件对象到 vapp ---
        for (let key in components) {
            vapp.component(key, components[key]);
        }
        vapp.mount(el);
    });
    // --- 全局事件来遍历执行的响应 ---
    rtn.vapp.config.globalProperties.cgEventList = {};
    // --- 执行 mounted ---
    await clickgo.tool.sleep(5);
    if (mounted) {
        try {
            await mounted.call(rtn.vroot);
        }
        catch (err) {
            if (clickgo.core.globalEvents.errorHandler) {
                clickgo.core.globalEvents.errorHandler(rtn.vroot.taskId, rtn.vroot.formId, err, 'Create form mounted error.');
            }
            else {
                console.log(err);
            }
            formListElement.removeChild(rtn.vroot.$el);
            clickgo.dom.removeStyle(rtn.vroot.taskId, 'form', rtn.vroot.formId);
            return -6;
        }
    }
    // --- 将窗体居中 ---
    let position = clickgo.getPosition();
    if (!rtn.vroot.$refs.form.stateMaxData) {
        if (rtn.vroot.$refs.form.left === -1) {
            rtn.vroot.$refs.form.setPropData('left', (position.width - rtn.vroot.$el.offsetWidth) / 2);
        }
        if (rtn.vroot.$refs.form.top === -1) {
            rtn.vroot.$refs.form.setPropData('top', (position.height - rtn.vroot.$el.offsetHeight) / 2);
        }
    }
    if (rtn.vroot.$refs.form.zIndex !== -1) {
        rtn.vroot.$data._customZIndex = true;
    }
    if (rtn.vroot.$refs.form.$data.show !== false) {
        rtn.vroot.cgShow();
    }
    // --- 绑定获取焦点事件 ---
    changeFocus(formId, rtn.vroot);
    // --- 将 form 挂载到 task 当中 ---
    let form: ICGForm = {
        'id': formId,
        'vapp': rtn.vapp,
        'vroot': rtn.vroot,
        'win': null,
        'events': {}
    };
    // --- 挂载 form ---
    task.forms[formId] = form;
    // --- 触发 formCreated 事件 ---
    clickgo.core.trigger('formCreated', taskId, formId, rtn.vroot.$refs.form.title, rtn.vroot.$refs.form.iconData);
    return form;
}

// --- 绑定 resize 事件 ---
window.addEventListener('resize', function(): void {
    // --- 将所有已经最大化的窗体的大小重置 ---
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
        let position = clickgo.getPosition();
        vroot.$refs.form.setPropData('width', position.width);
        vroot.$refs.form.setPropData('height', position.height);
    }
    // --- 触发 screenResize 事件 ---
    clickgo.core.trigger('screenResize');
});

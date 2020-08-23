/**
 * Copyright 2020 Han Guoshuai <zohegs@gmail.com>
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

/** --- 当前 pop 的 vue 对象 --- */
export let currentPop: null | IVue;
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
formListElement.style.zoom = clickgo.zoom.toString();
formListElement.classList.add('cg-form-list');
document.getElementsByTagName('body')[0].appendChild(formListElement);
formListElement.addEventListener('touchmove', function(e): void {
    // --- 防止拖动时整个网页跟着动 ---
    e.preventDefault();
    // --- 为啥要在这加，因为有些设备性能不行，在 touchstart 之时添加的 touchmove 不能立马响应，导致网页还是跟着动，所以增加此函数 ---
}, {
    'passive': false
});

/** --- pop list 的 div --- */
let popListElement: HTMLDivElement = document.createElement('div');
popListElement.style.zoom = clickgo.zoom.toString();
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
circularElement.style.zoom = clickgo.zoom.toString();
circularElement.classList.add('cg-circular');
document.getElementsByTagName('body')[0].appendChild(circularElement);

// --- 从鼠标指针处开始从小到大缩放并铺满屏幕（或任意矩形）的对象 ---
let rectangleElement: HTMLDivElement = document.createElement('div');
rectangleElement.style.zoom = clickgo.zoom.toString();
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
                let task = clickgo.core.tasks[taskId];
                task.forms[dataFormIdNumber].vue.focus = false;
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
                        vm.$children[0].setPropData('zIndex', ++lastTopZIndex);
                    }
                    else {
                        vm.$children[0].setPropData('zIndex', ++lastZIndex);
                    }
                }
                vm.focus = true;
                taskId = vm.taskId;
            }
            else {
                taskId = parseInt(el.getAttribute('data-task-id') ?? '0');
                let task = clickgo.core.tasks[taskId];
                if (!task.forms[formId].vue.$data._customZIndex) {
                    if (task.forms[formId].vue.$data._topMost) {
                        task.forms[formId].vue.$children[0].setPropData('zIndex', ++lastTopZIndex);
                    }
                    else {
                        task.forms[formId].vue.$children[0].setPropData('zIndex', ++lastZIndex);
                    }
                }
                task.forms[formId].vue.focus = true;
            }
            // --- 触发 formFocused 事件 ---
            clickgo.core.trigger('formFocused', taskId, formId);
        }
    }
}

/**
 * --- 根据 border dir 获取理论窗体大小 ---
 * @param dir 显示的位置代号
 */
export function getRectByDir(dir: TBorderDir): { 'width': number; 'height': number; 'left': number; 'top': number; } {
    let position = clickgo.getPosition();
    let width!: number, height!: number, left!: number, top!: number;
    if (typeof dir === 'string') {
        switch (dir) {
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
        width = dir.width ?? position.width;
        height = dir.height ?? position.height;
        left = dir.left ?? position.left;
        top = dir.top ?? position.top;
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
    circularElement.style.width = '6px';
    circularElement.style.height = '6px';
    circularElement.style.left = x - 3 + 'px';
    circularElement.style.top = y - 3 + 'px';
    circularElement.style.opacity = '1';
    requestAnimationFrame(function() {
        circularElement.style.transition = 'all .3s ease-out';
        circularElement.style.width = '60px';
        circularElement.style.height = '60px';
        circularElement.style.left = x - 30 + 'px';
        circularElement.style.top = y - 30 + 'px';
        circularElement.style.opacity = '0';
    });
}

/**
 * --- 移动矩形到新位置 ---
 * @param dir 显示的位置代号
 */
export function moveRectangle(dir: TBorderDir): void {
    let dataReady = rectangleElement.getAttribute('data-ready') ?? '0';
    if (dataReady === '0') {
        return;
    }
    let dataDir = rectangleElement.getAttribute('data-dir') ?? '';
    let setDataDir = typeof dir === 'string' ? dir : 'o-' + dir.left + '-' + (dir.top ?? 'n') + '-' + dir.width + '-' + (dir.height ?? 'n');
    if (dataDir === setDataDir) {
        return;
    }
    rectangleElement.setAttribute('data-dir', setDataDir);
    let pos = getRectByDir(dir);
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
 * @param pos 最大时位置代号
 */
export function showRectangle(x: number, y: number, pos: TBorderDir): void {
    rectangleElement.style.transition = 'none';
    rectangleElement.style.width = '20px';
    rectangleElement.style.height = '20px';
    rectangleElement.style.left = x - 10 + 'px';
    rectangleElement.style.top = y - 10 + 'px';
    rectangleElement.style.opacity = '1';
    rectangleElement.setAttribute('data-ready', '0');
    rectangleElement.setAttribute('data-dir', '');
    requestAnimationFrame(function() {
        rectangleElement.style.transition = 'all .2s ease-out';
        rectangleElement.setAttribute('data-ready', '1');
        moveRectangle(pos);
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
 * --- 将 pop 显示出来 ---
 * @param el 要显示的 pop
 * @param x 要显示的 left，或 htmlelement 对象
 * @param y 要显示的 top，或 element 方向，0 为垂直，1 为水平
 */
export function showPop(pop: IVue, x: number | HTMLElement, y: number = 0): void {
    if (!currentPop) {
        currentPop = pop;
    }
    pop.$parent.popOpen = true;
    pop.open = true;
    // --- 获取限定区域 ---
    let position = clickgo.getPosition();
    // --- 最终显示位置 ---
    let left: number, top: number;
    if (x instanceof HTMLElement) {
        let bcr = x.getBoundingClientRect();
        if (y === 0) {
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
        if (pop.$el.offsetWidth + left > position.width) {
            if (y === 0) {
                // --- 垂直弹出 ---
                left = position.width - pop.$el.offsetWidth;
            }
            else {
                // --- 水平弹出，右边位置不够弹到左边 ---
                left = bcr.left - pop.$el.offsetWidth + 2;
            }
        }
        // --- 检测垂直是否出框 ---
        if (pop.$el.offsetHeight + top > position.height) {
            if (y === 0) {
                top = bcr.top - pop.$el.offsetHeight;
            }
            else {
                top = position.height - pop.$el.offsetHeight;
            }
        }
    }
    else {
        left = x + 5;
        top = y + 7;
        // --- 水平 ---
        if (pop.$el.offsetWidth + left > position.width) {
            left = x - pop.$el.offsetWidth - 5;
        }
        // --- 垂直 ---
        if (pop.$el.offsetHeight + top > position.height) {
            top = y - pop.$el.offsetHeight - 5;
        }
    }
    if (left < 0) {
        left = 0;
    }
    if (top < 0) {
        top = 0;
    }
    pop.leftData = left;
    pop.topData = top;
    pop.zIndexData = (++lastPopZIndex).toString();
}

/**
 * --- 隐藏正在显示中的 pop，或指定 pop ---
 */
export function hidePop(pop: IVue | null = null): void {
    if (!pop) {
        pop = currentPop;
        if (!pop) {
            return;
        }
        currentPop = null;
    }
    pop.$parent.popOpen = false;
    pop.open = false;
    setTimeout(() => {
        if (!pop) {
            return;
        }
        pop.leftData = -20070831;
        pop.topData = -20070831;
    }, 100);
    pop.onHide?.();
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
        // --- 此对象为要打开 pop 的组件，不做处理，因为 down 时不能处理隐藏等情况 ---
        return;
    }
    element = element.parentNode as HTMLElement | null;
    while (element) {
        if (!element.classList) {
            break;
        }
        if (element.classList.contains('cg-form-wrap')) {
            // --- 窗体内部点击，转换焦点到当前窗体，但触发隐藏 pop ---
            let formId = parseInt(element.getAttribute('data-form-id') ?? '0');
            changeFocus(formId);
            hidePop();
            return;
        }
        if (element.classList.contains('cg-pop-list') || element.classList.contains('cg-pop-open')) {
            // --- 弹出层点击，不触发丢失焦点，也不触发隐藏 pop，是否隐藏请自行处理 ---
            return;
        }
        element = element.parentNode as HTMLElement | null;
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
 * --- 移除一个 form ---
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
    if (Object.keys(clickgo.core.tasks[taskId].forms).length === 1) {
        // --- 就一个窗体，那肯定就是自己，直接结束 task ---
        return clickgo.core.endTask(taskId);
    }
    // --- 多个窗体 ---
    let title = '';
    if (clickgo.core.tasks[taskId].forms[formId]) {
        title = clickgo.core.tasks[taskId].forms[formId].vue.$children[0].title;
        clickgo.core.tasks[taskId].forms[formId].vue.$destroy();
        if (clickgo.core.tasks[taskId].forms[formId].vue.$children[0].maskFrom !== undefined) {
            let fid = clickgo.core.tasks[taskId].forms[formId].vue.$children[0].maskFrom;
            clickgo.core.tasks[taskId].forms[fid].vue.$children[0].maskFor = undefined;
        }
        delete(clickgo.core.tasks[taskId].forms[formId]);
    }
    // --- 移除 form 的 style ---
    clickgo.tool.removeStyle(taskId, formId);
    // --- 移除 element ---
    formListElement.removeChild(formElement);
    // --- 触发 formRemoved 事件 ---
    clickgo.core.trigger('formRemoved', taskId, formId, {'title': title});
    return true;
}

/**
 * --- 直接创建一个窗体 ---
 * @param opt 创建窗体的配置对象
 */
export async function create(opt: ICreateFormOptions): Promise<number | IForm> {
    if (!opt.taskId) {
        return - 109;
    }
    if (!opt.dir) {
        opt.dir = opt.file;
    }
    /** --- 当前的 APP PKG --- */
    let appPkg: IAppPkg = clickgo.core.tasks[opt.taskId].appPkg;
    // ---  申请 formId ---
    let formId = ++lastFormId;
    /** --- 要 push 的本 form 的样式内容 --- */
    let controlsStyle: string = '';
    // --- 获取要定义的控件列表 ---
    let components: any = {};
    for (let controlPath of appPkg.config.controls) {
        let controlPkg: false | IControlPkg;
        if (controlPath.slice(0, 9) === '/clickgo/') {
            let path = controlPath.slice(8);
            if (clickgo.core.clickgoControlPkgs[path + '.cgc']) {
                controlPkg = clickgo.core.clickgoControlPkgs[path + '.cgc'];
            }
            else {
                return -108;
            }
        }
        else if (clickgo.core.tasks[opt.taskId].controlPkgs[controlPath + '.cgc']) {
            controlPkg = clickgo.core.tasks[opt.taskId].controlPkgs[controlPath + '.cgc'];
        }
        else {
            let controlBlob = appPkg.files[controlPath + '.cgc'];
            if (!controlBlob) {
                return -101;
            }
            controlPkg = await clickgo.tool.controlBlob2Pkg(controlBlob);
            if (!controlPkg) {
                return -102;
            }
            clickgo.core.tasks[opt.taskId].controlPkgs[controlPath + '.cgc'] = controlPkg;
        }
        // --- 遍历控件包中的每一个控件 ---
        for (let name in controlPkg) {
            let item: IControl = controlPkg[name];
            // --- 准备相关变量 ---
            let props = {};
            let data: any = {};
            let methods: any = {};
            let computed = {};
            let watch = {};
            let beforeCreate: (() => void) | undefined = undefined;
            let created: (() => void) | undefined = undefined;
            let beforeMount: (() => void) | undefined = undefined;
            let mounted: (() => void) | undefined = undefined;
            let beforeUpdate: (() => void) | undefined = undefined;
            let updated: (() => void) | undefined = undefined;
            let beforeDestroy: (() => void) | undefined = undefined;
            let destroyed: (() => void) | undefined = undefined;
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
                    beforeDestroy = expo.beforeDestroy;
                    destroyed = expo.destroyed;
                }
            }
            // --- 控件样式表 ---
            let rand = '';
            let styleBlob = item.files[item.config.style + '.css'];
            if (styleBlob) {
                let r = clickgo.tool.stylePrepend(await clickgo.tool.blob2Text(styleBlob));
                rand = r.rand;
                controlsStyle += await clickgo.tool.styleUrl2DataUrl(item.config.style, r.style, item.files);
            }
            // --- 要创建的 control 的 layout ---
            let layoutBlob = item.files[item.config.layout + '.html'];
            if (!layoutBlob) {
                return -103;
            }
            // --- 给控件的 layout 的 class 增加前置 ---
            let randList = [
                'cg-theme-global-' + name + '_',
                'cg-theme-task' + opt.taskId + '-' + name + '_'
            ];
            if (rand !== '') {
                randList.push(rand);
            }
            let r = clickgo.tool.layoutClassPrepend(await clickgo.tool.blob2Text(layoutBlob), randList);
            let layout = r.layout;
            // --- 组成 data ---
            data.taskId = opt.taskId;
            data.formId = formId;
            data._dir = opt.dir ?? '/';
            data._scope = rand;
            data._controlName = name;
            // --- 预设 methods ---
            methods.cgStopPropagation = function(this: IVue, e: MouseEvent | TouchEvent) {
                if (e instanceof MouseEvent && clickgo.hasTouch) {
                    return;
                }
                e.stopPropagation();
                doFocusAndPopEvent(e);
            };
            methods.cgDown = function(this: IVue, e?: MouseEvent | TouchEvent) {
                if (e instanceof MouseEvent && clickgo.hasTouch) {
                    return;
                }
                // --- 触发自定义 down 事件 ---
                this.$emit('down', e);
            };
            methods.cgTap = function(this: IVue, e: MouseEvent | TouchEvent | KeyboardEvent) {
                if (this.$el.className.indexOf('cg-disabled') !== -1) {
                    return;
                }
                this.$emit('tap', e);
            };
            methods.cgDblclick = function(this: IVue, e: MouseEvent) {
                e.stopPropagation();
                if (this.$el.className.indexOf('cg-disabled') !== -1) {
                    return;
                }
                this.$emit('dblclick', e);
            };
            // --- 获取文件 blob 对象 ---
            methods.cgGetBlob = function(this: IVue, file: string): Blob | null {
                file = clickgo.tool.pathResolve(this.$data._dir, file);
                return clickgo.core.tasks[this.taskId].appPkg.files[file] ?? null;
            };
            methods.cgGetDataUrl = async function(this: IVueControl, file: string): Promise<string | null> {
                let f = this.cgGetBlob(file);
                return f ? await clickgo.tool.blob2DataUrl(f) : null;
            };
            // --- layout 中 :class 的转义 ---
            methods._classPrepend = function(this: IVue, cla: any): string {
                if (typeof cla !== 'string') {
                    return cla;
                }
                if (cla.slice(0, 3) === 'cg-') {
                    return cla;
                }
                return `cg-theme-global-${this.$data._controlName}_${cla} cg-theme-task${this.taskId}-${this.$data._controlName}_${cla} ${this.$data._scope}${cla}`;
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
                'mounted': function(this: IVue): void {
                    this.$nextTick(function(this: IVue) {
                        mounted?.call(this);
                    });
                },
                'beforeUpdate': beforeUpdate,
                'updated': function(this: IVue): void {
                    this.$nextTick(function(this: IVue) {
                        updated?.call(this);
                    });
                },
                'beforeDestroy': beforeDestroy,
                'destroyed': destroyed,

                'components': {}
            };
        }
    }
    // --- 处理控件中包含的子组件 ---
    for (let name in components) {
        let reg = /<cg-(.+?)[ >]/g;
        let match: RegExpExecArray | null;
        while ((match = reg.exec(components[name].template))) {
            if (!components['cg-' + match[1]]) {
                continue;
            }
            components[name].components['cg-' + match[1]] = components['cg-' + match[1]];
        }
    }
    // --- 获取 style、layout ---
    let style = opt.style;
    let layout = opt.layout;
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
    if (!layout) {
        return -104;
    }
    // --- 准备相关变量 ---
    let data: Record<string, any> = {};
    let methods: any = {};
    let computed = {};
    let watch = {};
    let beforeCreate: (() => void) | undefined = undefined;
    let created: (() => void) | undefined = undefined;
    let beforeMount: (() => void) | undefined = undefined;
    let mounted: (() => void) | undefined = undefined;
    let beforeUpdate: (() => void) | undefined = undefined;
    let updated: (() => void) | undefined = undefined;
    let beforeDestroy: (() => void) | undefined = undefined;
    let destroyed: (() => void) | undefined = undefined;
    // --- 检测是否有 js ---
    if (appPkg.files[opt.file + '.js']) {
        let [expo] = await loader.requireMemory(opt.file ?? '', appPkg.files) ?? [];
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
            beforeDestroy = expo.beforeDestroy;
            destroyed = expo.destroyed;
        }
    }
    // --- 应用样式表 ---
    let rand = '';
    if (style) {
        let r = clickgo.tool.stylePrepend(style);
        rand = r.rand;
        style = await clickgo.tool.styleUrl2DataUrl(opt.dir ?? '/', r.style, appPkg.files);
    }
    // --- 要创建的 form 的 layout ---
    layout = clickgo.tool.layoutInsertAttr(layout, ':focus=\'focus\'');
    layout = clickgo.tool.purify(layout.replace(/<(\/{0,1})(.+?)>/g, function(t, t1, t2): string {
        if (t2 === 'template') {
            return t;
        }
        else {
            return '<' + t1 + 'cg-' + t2 + '>';
        }
    }));
    // --- 给 layout 的 class 增加前置 ---
    let randList = ['cg-task' + opt.taskId + '_'];
    if (rand !== '') {
        randList.push(rand);
    }
    let r = clickgo.tool.layoutClassPrepend(layout, randList);
    formListElement.insertAdjacentHTML('beforeend', r.layout);
    // --- 获取刚才的 form 对象 ---
    let el: HTMLElement = formListElement.children.item(formListElement.children.length - 1) as HTMLElement;
    el.classList.add('cg-form-wrap');
    el.setAttribute('data-form-id', formId.toString());
    el.setAttribute('data-task-id', opt.taskId.toString());
    // --- 创建窗体对象 ---
    // --- 初始化系统初始 data ---
    data.taskId = opt.taskId;
    data.formId = formId;
    data._dir = opt.dir ?? '/';
    data._scope = rand;
    data.focus = false;
    data._customZIndex = false;
    if (opt.topMost) {
        data._topMost = true;
    }
    else {
        data._topMost = false;
    }
    // --- 初始化系统方法 ---
    methods.createForm = async function(this: IVue, paramOpt: string | ICreateFormOptions, cfOpt: { 'mask'?: boolean; } = {}): Promise<void> {
        let inOpt: ICreateFormOptions = {
            'taskId': opt.taskId
        };
        if (typeof paramOpt === 'string') {
            inOpt.file = paramOpt;
        }
        else {
            if (paramOpt.dir) {
                inOpt.dir = paramOpt.dir;
            }
            if (paramOpt.file) {
                inOpt.file = paramOpt.file;
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
        }
        if (cfOpt.mask) {
            this.$children[0].maskFor = true;
        }
        if (this.$data._topMost) {
            inOpt.topMost = true;
        }
        let form = await create(inOpt);
        if (typeof form === 'number') {
            this.$children[0].maskFor = undefined;
        }
        else {
            if (this.$children[0].maskFor) {
                this.$children[0].maskFor = form.id;
                form.vue.$children[0].maskFrom = this.formId;
            }
        }
    };
    methods.closeForm = function(this: IVue): void {
        remove(this.formId);
    };
    methods.bindFormDrag = function(this: IVue, e: MouseEvent | TouchEvent): void {
        this.$children[0].moveMethod(e);
    };
    methods.setSystemEventListener = function(this: IVue, name: TGlobalEvent, func: any): void {
        this.eventList[name] = func;
    };
    methods.removeSystemEventListener = function(this: IVue, name: TGlobalEvent): void {
        delete(this.eventList[name]);
    };
    // --- 获取文件 blob 对象 ---
    methods.getBlob = function(this: IVue, file: string): Blob | null {
        file = clickgo.tool.pathResolve(this.$data._dir, file);
        return clickgo.core.tasks[this.taskId].appPkg.files[file] ?? null;
    };
    methods.getDataUrl = async function(this: IVueControl, file: string): Promise<string | null> {
        let f = this.cgGetBlob(file);
        return f ? await clickgo.tool.blob2DataUrl(f) : null;
    };
    // --- 加载主题 ---
    methods.loadTheme = async function(this: IVue, path: string | ITheme): Promise<void> {
        await clickgo.theme.load(path, this.taskId);
    };
    // --- 清除主题 ---
    methods.clearTheme = async function(this: IVue): Promise<void> {
        await clickgo.theme.clear(this.taskId);
    };
    // --- 加载全新主题（老主题会被清除） ---
    methods.setTheme = async function(this: IVue, path: string | ITheme): Promise<void> {
        await clickgo.theme.clear(this.taskId);
        await clickgo.theme.load(path, this.taskId);
    };
    // --- 设置窗体置顶/取消置顶 ---
    methods.setTopMost = function(this: IVue, top: boolean): void {
        this.$data._customZIndex = false;
        if (top) {
            // --- 要置顶 ---
            this.$data._topMost = true;
            if (!this.focus) {
                changeFocus(this.formId, this);
            }
            else {
                this.$children[0].setPropData('zIndex', ++lastTopZIndex);
            }
        }
        else {
            // --- 取消置顶 ---
            this.$data._topMost = false;
            this.$children[0].setPropData('zIndex', ++lastZIndex);
        }
    };
    // --- 让窗体闪烁 ---
    methods.flash = function(this: IVue): void {
        if (!this.focus) {
            changeFocus(this.formId);
        }
        if (this.$children[0].flashTimer) {
            clearTimeout(this.$children[0].flashTimer);
            this.$children[0].flashTimer = undefined;
        }
        this.$children[0].flashTimer = setTimeout(() => {
            this.$children[0].flashTimer = undefined;
        }, 1000);
        // --- 触发 formFlash 事件 ---
        clickgo.core.trigger('formFlash', opt.taskId, formId);
    };
    // --- layout 中 :class 的转义 ---
    methods._classPrepend = function(this: IVue, cla: any): string {
        if (typeof cla !== 'string') {
            return cla;
        }
        if (cla.slice(0, 3) === 'cg-') {
            return cla;
        }
        return `cg-task${this.taskId}_${cla} ${this.$data._scope}${cla}`;
    };
    let $vm: IVue | false = await new Promise(function(resolve) {
        new Vue({
            'el': el,
            'data': data,
            'methods': methods,
            'computed': computed,
            'watch': watch,
            'components': components,

            'beforeCreate': beforeCreate,
            'created': created,
            'beforeMount': beforeMount,
            'mounted': function() {
                this.$nextTick(function(this: IVue) {
                    if (this.$el.getAttribute !== undefined) {
                        resolve(this);
                    }
                    else {
                        if (this.$el.parentNode) {
                            this.$destroy();
                            clickgo.tool.removeStyle(this.taskId, this.formId);
                            formListElement.removeChild(this.$el);
                        }
                        resolve(false);
                    }
                });
            },
            'beforeUpdate': beforeUpdate,
            'updated': function(this: IVue): void {
                this.$nextTick(function(this: IVue) {
                    updated?.call(this);
                });
            },
            'beforeDestroy': beforeDestroy,
            'destroyed': destroyed,
        });
    });
    if (!$vm) {
        return -106;
    }
    // --- 全局事件来遍历执行的响应 ---
    $vm.eventList = {};
    // --- 部署本窗体控件 css ---
    if (controlsStyle !== '') {
        // --- 将这些窗体的控件样式追加到网页 ---
        clickgo.tool.pushStyle(controlsStyle, opt.taskId, 'controls', formId);
    }
    if (style) {
        // --- 窗体的 style ---
        clickgo.tool.pushStyle(style, opt.taskId, 'forms', formId);
    }
    // --- 将窗体居中 ---
    let position = clickgo.getPosition();
    if (!$vm.$children[0].stateMaxData) {
        if ($vm.$children[0].left === -1) {
            $vm.$children[0].setPropData('left', (position.width - $vm.$el.offsetWidth) / 2);
        }
        if ($vm.$children[0].top === -1) {
            $vm.$children[0].setPropData('top', (position.height - $vm.$el.offsetHeight) / 2);
        }
    }
    if ($vm.$children[0].zIndex !== -1) {
        $vm.$data._customZIndex = true;
    }
    // --- 执行 mounted ---
    if (mounted) {
        try {
            mounted.call($vm);
        }
        catch (err) {
            formListElement.removeChild($vm.$el);
            clickgo.tool.removeStyle($vm.taskId, $vm.formId);
            if (clickgo.core.globalEvents.errorHandler) {
                clickgo.core.globalEvents.errorHandler($vm.taskId, $vm.formId, err, 'Create form mounted error.');
            }
            else {
                console.log(err);
            }
            return -105;
        }
    }
    // --- 绑定获取焦点事件 ---
    changeFocus(formId, $vm);
    // --- 将 form 挂载到 task 当中 ---
    let form: IForm = {
        'id': formId,
        'vue': $vm,
        'win': null,
        'events': {}
    };
    // --- 挂载 form ---
    if (!clickgo.core.tasks[opt.taskId]) {
        $vm.$destroy();
        clickgo.tool.removeStyle(opt.taskId, formId);
        formListElement.removeChild($vm.$el);
        return -107;
    }
    clickgo.core.tasks[opt.taskId].forms[formId] = form;
    // --- 触发 formCreated 事件 ---
    clickgo.core.trigger('formCreated', opt.taskId, formId, {'title': $vm.$children[0].title, 'icon': $vm.$children[0].iconData});
    return form;
}

// --- 绑定 resize 事件 ---
window.addEventListener('resize', function(): void {
    // --- 将所有已经最大化的窗体的大小重置 ---
    for (let i = 0; i < formListElement.children.length; ++i) {
        let el = formListElement.children.item(i) as HTMLElement;
        if (el.className.indexOf('cg-state-max') === -1) {
            continue;
        }
        let taskId = parseInt(el.getAttribute('data-task-id') as string);
        let formId = parseInt(el.getAttribute('data-form-id') as string);
        if (!clickgo.core.tasks[taskId]) {
            continue;
        }
        let $vm = clickgo.core.tasks[taskId].forms[formId].vue;
        let position = clickgo.getPosition();
        $vm.$children[0].setPropData('width', position.width);
        $vm.$children[0].setPropData('height', position.height);
    }
    // --- 触发 screenResize 事件 ---
    clickgo.core.trigger('screenResize');
});

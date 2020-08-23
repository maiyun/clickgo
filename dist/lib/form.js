"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = exports.remove = exports.doFocusAndPopEvent = exports.hidePop = exports.showPop = exports.removeFromPop = exports.appendToPop = exports.hideRectangle = exports.showRectangle = exports.moveRectangle = exports.showCircular = exports.getRectByDir = exports.changeFocus = exports.lastPopZIndex = exports.lastTopZIndex = exports.lastZIndex = exports.lastFormId = exports.currentPop = void 0;
exports.lastFormId = 0;
exports.lastZIndex = 999;
exports.lastTopZIndex = 9999999;
exports.lastPopZIndex = 0;
var formListElement = document.createElement('div');
formListElement.style.zoom = clickgo.zoom.toString();
formListElement.classList.add('cg-form-list');
document.getElementsByTagName('body')[0].appendChild(formListElement);
formListElement.addEventListener('touchmove', function (e) {
    e.preventDefault();
}, {
    'passive': false
});
var popListElement = document.createElement('div');
popListElement.style.zoom = clickgo.zoom.toString();
popListElement.classList.add('cg-pop-list');
popListElement.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});
document.getElementsByTagName('body')[0].appendChild(popListElement);
popListElement.addEventListener('touchmove', function (e) {
    e.preventDefault();
}, {
    'passive': false
});
var circularElement = document.createElement('div');
circularElement.style.zoom = clickgo.zoom.toString();
circularElement.classList.add('cg-circular');
document.getElementsByTagName('body')[0].appendChild(circularElement);
var rectangleElement = document.createElement('div');
rectangleElement.style.zoom = clickgo.zoom.toString();
rectangleElement.setAttribute('data-pos', '');
rectangleElement.classList.add('cg-rectangle');
document.getElementsByTagName('body')[0].appendChild(rectangleElement);
function changeFocus(formId, vm) {
    var _a, _b;
    if (formId === void 0) { formId = 0; }
    var focusElement = document.querySelector('.cg-form-list > .cg-focus');
    if (focusElement) {
        var dataFormId = focusElement.getAttribute('data-form-id');
        if (dataFormId) {
            var dataFormIdNumber = parseInt(dataFormId);
            if (dataFormIdNumber === formId) {
                return;
            }
            else {
                var taskId = parseInt((_a = focusElement.getAttribute('data-task-id')) !== null && _a !== void 0 ? _a : '0');
                var task = clickgo.core.tasks[taskId];
                task.forms[dataFormIdNumber].vue.focus = false;
                clickgo.core.trigger('formBlurred', taskId, dataFormIdNumber);
            }
        }
        else {
            return;
        }
    }
    if (formId !== 0) {
        var el = document.querySelector(".cg-form-list > [data-form-id='" + formId + "']");
        if (el) {
            var taskId = void 0;
            if (vm) {
                if (!vm.$data._customZIndex) {
                    if (vm.$data._topMost) {
                        vm.$children[0].setPropData('zIndex', ++exports.lastTopZIndex);
                    }
                    else {
                        vm.$children[0].setPropData('zIndex', ++exports.lastZIndex);
                    }
                }
                vm.focus = true;
                taskId = vm.taskId;
            }
            else {
                taskId = parseInt((_b = el.getAttribute('data-task-id')) !== null && _b !== void 0 ? _b : '0');
                var task = clickgo.core.tasks[taskId];
                if (!task.forms[formId].vue.$data._customZIndex) {
                    if (task.forms[formId].vue.$data._topMost) {
                        task.forms[formId].vue.$children[0].setPropData('zIndex', ++exports.lastTopZIndex);
                    }
                    else {
                        task.forms[formId].vue.$children[0].setPropData('zIndex', ++exports.lastZIndex);
                    }
                }
                task.forms[formId].vue.focus = true;
            }
            clickgo.core.trigger('formFocused', taskId, formId);
        }
    }
}
exports.changeFocus = changeFocus;
function getRectByDir(dir) {
    var _a, _b, _c, _d;
    var position = clickgo.getPosition();
    var width, height, left, top;
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
        width = (_a = dir.width) !== null && _a !== void 0 ? _a : position.width;
        height = (_b = dir.height) !== null && _b !== void 0 ? _b : position.height;
        left = (_c = dir.left) !== null && _c !== void 0 ? _c : position.left;
        top = (_d = dir.top) !== null && _d !== void 0 ? _d : position.top;
    }
    return {
        'width': width,
        'height': height,
        'left': left,
        'top': top
    };
}
exports.getRectByDir = getRectByDir;
function showCircular(x, y) {
    circularElement.style.transition = 'none';
    circularElement.style.width = '6px';
    circularElement.style.height = '6px';
    circularElement.style.left = x - 3 + 'px';
    circularElement.style.top = y - 3 + 'px';
    circularElement.style.opacity = '1';
    requestAnimationFrame(function () {
        circularElement.style.transition = 'all .3s ease-out';
        circularElement.style.width = '60px';
        circularElement.style.height = '60px';
        circularElement.style.left = x - 30 + 'px';
        circularElement.style.top = y - 30 + 'px';
        circularElement.style.opacity = '0';
    });
}
exports.showCircular = showCircular;
function moveRectangle(dir) {
    var _a, _b, _c, _d;
    var dataReady = (_a = rectangleElement.getAttribute('data-ready')) !== null && _a !== void 0 ? _a : '0';
    if (dataReady === '0') {
        return;
    }
    var dataDir = (_b = rectangleElement.getAttribute('data-dir')) !== null && _b !== void 0 ? _b : '';
    var setDataDir = typeof dir === 'string' ? dir : 'o-' + dir.left + '-' + ((_c = dir.top) !== null && _c !== void 0 ? _c : 'n') + '-' + dir.width + '-' + ((_d = dir.height) !== null && _d !== void 0 ? _d : 'n');
    if (dataDir === setDataDir) {
        return;
    }
    rectangleElement.setAttribute('data-dir', setDataDir);
    var pos = getRectByDir(dir);
    var width = pos.width - 20;
    var height = pos.height - 20;
    var left = pos.left + 10;
    var top = pos.top + 10;
    if (width !== undefined && height !== undefined && left !== undefined && top !== undefined) {
        rectangleElement.style.width = width + 'px';
        rectangleElement.style.height = height + 'px';
        rectangleElement.style.left = left + 'px';
        rectangleElement.style.top = top + 'px';
    }
}
exports.moveRectangle = moveRectangle;
function showRectangle(x, y, pos) {
    rectangleElement.style.transition = 'none';
    rectangleElement.style.width = '20px';
    rectangleElement.style.height = '20px';
    rectangleElement.style.left = x - 10 + 'px';
    rectangleElement.style.top = y - 10 + 'px';
    rectangleElement.style.opacity = '1';
    rectangleElement.setAttribute('data-ready', '0');
    rectangleElement.setAttribute('data-dir', '');
    requestAnimationFrame(function () {
        rectangleElement.style.transition = 'all .2s ease-out';
        rectangleElement.setAttribute('data-ready', '1');
        moveRectangle(pos);
    });
}
exports.showRectangle = showRectangle;
function hideRectangle() {
    rectangleElement.style.opacity = '0';
}
exports.hideRectangle = hideRectangle;
function appendToPop(el) {
    popListElement.appendChild(el);
}
exports.appendToPop = appendToPop;
function removeFromPop(el) {
    popListElement.removeChild(el);
}
exports.removeFromPop = removeFromPop;
function showPop(pop, x, y) {
    if (y === void 0) { y = 0; }
    if (!exports.currentPop) {
        exports.currentPop = pop;
    }
    pop.$parent.popOpen = true;
    pop.open = true;
    var position = clickgo.getPosition();
    var left, top;
    if (x instanceof HTMLElement) {
        var bcr = x.getBoundingClientRect();
        if (y === 0) {
            left = bcr.left;
            top = bcr.top + bcr.height;
        }
        else {
            left = bcr.left + bcr.width - 2;
            top = bcr.top - 2;
        }
        if (pop.$el.offsetWidth + left > position.width) {
            if (y === 0) {
                left = position.width - pop.$el.offsetWidth;
            }
            else {
                left = bcr.left - pop.$el.offsetWidth + 2;
            }
        }
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
        if (pop.$el.offsetWidth + left > position.width) {
            left = x - pop.$el.offsetWidth - 5;
        }
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
    pop.zIndexData = (++exports.lastPopZIndex).toString();
}
exports.showPop = showPop;
function hidePop(pop) {
    var _a;
    if (pop === void 0) { pop = null; }
    if (!pop) {
        pop = exports.currentPop;
        if (!pop) {
            return;
        }
        exports.currentPop = null;
    }
    pop.$parent.popOpen = false;
    pop.open = false;
    setTimeout(function () {
        if (!pop) {
            return;
        }
        pop.leftData = -20070831;
        pop.topData = -20070831;
    }, 100);
    (_a = pop.onHide) === null || _a === void 0 ? void 0 : _a.call(pop);
}
exports.hidePop = hidePop;
function doFocusAndPopEvent(e) {
    var _a;
    if (e instanceof MouseEvent && clickgo.hasTouch) {
        return;
    }
    var target = e.target;
    if (!target) {
        return;
    }
    var element = target;
    if (element.classList.contains('cg-pop-open')) {
        return;
    }
    element = element.parentNode;
    while (element) {
        if (!element.classList) {
            break;
        }
        if (element.classList.contains('cg-form-wrap')) {
            var formId = parseInt((_a = element.getAttribute('data-form-id')) !== null && _a !== void 0 ? _a : '0');
            changeFocus(formId);
            hidePop();
            return;
        }
        if (element.classList.contains('cg-pop-list') || element.classList.contains('cg-pop-open')) {
            return;
        }
        element = element.parentNode;
    }
    hidePop();
    changeFocus();
}
exports.doFocusAndPopEvent = doFocusAndPopEvent;
if ('ontouchstart' in document.documentElement) {
    window.addEventListener('touchstart', doFocusAndPopEvent);
}
else {
    window.addEventListener('mousedown', doFocusAndPopEvent);
}
function remove(formId) {
    var formElement = formListElement.querySelector("[data-form-id='" + formId + "']");
    if (!formElement) {
        return false;
    }
    var taskIdAttr = formElement.getAttribute('data-task-id');
    if (!taskIdAttr) {
        return false;
    }
    var taskId = parseInt(taskIdAttr);
    if (Object.keys(clickgo.core.tasks[taskId].forms).length === 1) {
        return clickgo.core.endTask(taskId);
    }
    var title = '';
    if (clickgo.core.tasks[taskId].forms[formId]) {
        title = clickgo.core.tasks[taskId].forms[formId].vue.$children[0].title;
        clickgo.core.tasks[taskId].forms[formId].vue.$destroy();
        if (clickgo.core.tasks[taskId].forms[formId].vue.$children[0].maskFrom !== undefined) {
            var fid = clickgo.core.tasks[taskId].forms[formId].vue.$children[0].maskFrom;
            clickgo.core.tasks[taskId].forms[fid].vue.$children[0].maskFor = undefined;
        }
        delete (clickgo.core.tasks[taskId].forms[formId]);
    }
    clickgo.tool.removeStyle(taskId, formId);
    formListElement.removeChild(formElement);
    clickgo.core.trigger('formRemoved', taskId, formId, { 'title': title });
    return true;
}
exports.remove = remove;
function create(opt) {
    var _a, _b, _c, _d, _e, _f;
    return __awaiter(this, void 0, void 0, function () {
        var appPkg, formId, controlsStyle, components, _i, _g, controlPath, controlPkg, path, controlBlob, _loop_1, _h, _j, _k, name_1, state_1, name_2, reg, match, style, layout, layoutBlob, styleBlob, data, methods, computed, watch, beforeCreate, created, beforeMount, mounted, beforeUpdate, updated, beforeDestroy, destroyed, expo, rand, r_1, randList, r, el, $vm, position, form;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0:
                    if (!opt.taskId) {
                        return [2, -109];
                    }
                    if (!opt.dir) {
                        opt.dir = opt.file;
                    }
                    appPkg = clickgo.core.tasks[opt.taskId].appPkg;
                    formId = ++exports.lastFormId;
                    controlsStyle = '';
                    components = {};
                    _i = 0, _g = appPkg.config.controls;
                    _l.label = 1;
                case 1:
                    if (!(_i < _g.length)) return [3, 10];
                    controlPath = _g[_i];
                    controlPkg = void 0;
                    if (!(controlPath.slice(0, 9) === '/clickgo/')) return [3, 2];
                    path = controlPath.slice(8);
                    if (clickgo.core.clickgoControlPkgs[path + '.cgc']) {
                        controlPkg = clickgo.core.clickgoControlPkgs[path + '.cgc'];
                    }
                    else {
                        return [2, -108];
                    }
                    return [3, 5];
                case 2:
                    if (!clickgo.core.tasks[opt.taskId].controlPkgs[controlPath + '.cgc']) return [3, 3];
                    controlPkg = clickgo.core.tasks[opt.taskId].controlPkgs[controlPath + '.cgc'];
                    return [3, 5];
                case 3:
                    controlBlob = appPkg.files[controlPath + '.cgc'];
                    if (!controlBlob) {
                        return [2, -101];
                    }
                    return [4, clickgo.tool.controlBlob2Pkg(controlBlob)];
                case 4:
                    controlPkg = _l.sent();
                    if (!controlPkg) {
                        return [2, -102];
                    }
                    clickgo.core.tasks[opt.taskId].controlPkgs[controlPath + '.cgc'] = controlPkg;
                    _l.label = 5;
                case 5:
                    _loop_1 = function (name_1) {
                        var item, props, data_1, methods_1, computed_1, watch_1, beforeCreate_1, created_1, beforeMount_1, mounted_1, beforeUpdate_1, updated_1, beforeDestroy_1, destroyed_1, expo, rand_1, styleBlob, r_2, _a, _b, _c, layoutBlob, randList_1, r_3, _d, _e, layout_1;
                        return __generator(this, function (_f) {
                            switch (_f.label) {
                                case 0:
                                    item = controlPkg[name_1];
                                    props = {};
                                    data_1 = {};
                                    methods_1 = {};
                                    computed_1 = {};
                                    watch_1 = {};
                                    beforeCreate_1 = undefined;
                                    created_1 = undefined;
                                    beforeMount_1 = undefined;
                                    mounted_1 = undefined;
                                    beforeUpdate_1 = undefined;
                                    updated_1 = undefined;
                                    beforeDestroy_1 = undefined;
                                    destroyed_1 = undefined;
                                    if (!item.files[item.config.code + '.js']) return [3, 2];
                                    return [4, loader.requireMemory(item.config.code, item.files)];
                                case 1:
                                    expo = ((_a = _f.sent()) !== null && _a !== void 0 ? _a : [])[0];
                                    if (expo) {
                                        props = expo.props || {};
                                        data_1 = expo.data || {};
                                        methods_1 = expo.methods || {};
                                        computed_1 = expo.computed || {};
                                        watch_1 = expo.watch || {};
                                        beforeCreate_1 = expo.beforeCreate;
                                        created_1 = expo.created;
                                        beforeMount_1 = expo.beforeMount;
                                        mounted_1 = expo.mounted;
                                        beforeUpdate_1 = expo.beforeUpdate;
                                        updated_1 = expo.updated;
                                        beforeDestroy_1 = expo.beforeDestroy;
                                        destroyed_1 = expo.destroyed;
                                    }
                                    _f.label = 2;
                                case 2:
                                    rand_1 = '';
                                    styleBlob = item.files[item.config.style + '.css'];
                                    if (!styleBlob) return [3, 5];
                                    _b = (_a = clickgo.tool).stylePrepend;
                                    return [4, clickgo.tool.blob2Text(styleBlob)];
                                case 3:
                                    r_2 = _b.apply(_a, [_f.sent()]);
                                    rand_1 = r_2.rand;
                                    _c = controlsStyle;
                                    return [4, clickgo.tool.styleUrl2DataUrl(item.config.style, r_2.style, item.files)];
                                case 4:
                                    controlsStyle = _c + _f.sent();
                                    _f.label = 5;
                                case 5:
                                    layoutBlob = item.files[item.config.layout + '.html'];
                                    if (!layoutBlob) {
                                        return [2, { value: -103 }];
                                    }
                                    randList_1 = [
                                        'cg-theme-global-' + name_1 + '_',
                                        'cg-theme-task' + opt.taskId + '-' + name_1 + '_'
                                    ];
                                    if (rand_1 !== '') {
                                        randList_1.push(rand_1);
                                    }
                                    _e = (_d = clickgo.tool).layoutClassPrepend;
                                    return [4, clickgo.tool.blob2Text(layoutBlob)];
                                case 6:
                                    r_3 = _e.apply(_d, [_f.sent(), randList_1]);
                                    layout_1 = r_3.layout;
                                    data_1.taskId = opt.taskId;
                                    data_1.formId = formId;
                                    data_1._dir = (_b = opt.dir) !== null && _b !== void 0 ? _b : '/';
                                    data_1._scope = rand_1;
                                    data_1._controlName = name_1;
                                    methods_1.cgStopPropagation = function (e) {
                                        if (e instanceof MouseEvent && clickgo.hasTouch) {
                                            return;
                                        }
                                        e.stopPropagation();
                                        doFocusAndPopEvent(e);
                                    };
                                    methods_1.cgDown = function (e) {
                                        if (e instanceof MouseEvent && clickgo.hasTouch) {
                                            return;
                                        }
                                        this.$emit('down', e);
                                    };
                                    methods_1.cgTap = function (e) {
                                        if (this.$el.className.indexOf('cg-disabled') !== -1) {
                                            return;
                                        }
                                        this.$emit('tap', e);
                                    };
                                    methods_1.cgDblclick = function (e) {
                                        e.stopPropagation();
                                        if (this.$el.className.indexOf('cg-disabled') !== -1) {
                                            return;
                                        }
                                        this.$emit('dblclick', e);
                                    };
                                    methods_1.cgGetBlob = function (file) {
                                        var _a;
                                        file = clickgo.tool.pathResolve(this.$data._dir, file);
                                        return (_a = clickgo.core.tasks[this.taskId].appPkg.files[file]) !== null && _a !== void 0 ? _a : null;
                                    };
                                    methods_1.cgGetDataUrl = function (file) {
                                        return __awaiter(this, void 0, void 0, function () {
                                            var f, _a;
                                            return __generator(this, function (_b) {
                                                switch (_b.label) {
                                                    case 0:
                                                        f = this.cgGetBlob(file);
                                                        if (!f) return [3, 2];
                                                        return [4, clickgo.tool.blob2DataUrl(f)];
                                                    case 1:
                                                        _a = _b.sent();
                                                        return [3, 3];
                                                    case 2:
                                                        _a = null;
                                                        _b.label = 3;
                                                    case 3: return [2, _a];
                                                }
                                            });
                                        });
                                    };
                                    methods_1._classPrepend = function (cla) {
                                        if (typeof cla !== 'string') {
                                            return cla;
                                        }
                                        if (cla.slice(0, 3) === 'cg-') {
                                            return cla;
                                        }
                                        return "cg-theme-global-" + this.$data._controlName + "_" + cla + " cg-theme-task" + this.taskId + "-" + this.$data._controlName + "_" + cla + " " + this.$data._scope + cla;
                                    };
                                    components['cg-' + name_1] = {
                                        'template': layout_1,
                                        'props': props,
                                        'data': function () {
                                            return clickgo.tool.clone(data_1);
                                        },
                                        'methods': methods_1,
                                        'computed': computed_1,
                                        'watch': watch_1,
                                        'beforeCreate': beforeCreate_1,
                                        'created': created_1,
                                        'beforeMount': beforeMount_1,
                                        'mounted': function () {
                                            this.$nextTick(function () {
                                                mounted_1 === null || mounted_1 === void 0 ? void 0 : mounted_1.call(this);
                                            });
                                        },
                                        'beforeUpdate': beforeUpdate_1,
                                        'updated': function () {
                                            this.$nextTick(function () {
                                                updated_1 === null || updated_1 === void 0 ? void 0 : updated_1.call(this);
                                            });
                                        },
                                        'beforeDestroy': beforeDestroy_1,
                                        'destroyed': destroyed_1,
                                        'components': {}
                                    };
                                    return [2];
                            }
                        });
                    };
                    _h = [];
                    for (_j in controlPkg)
                        _h.push(_j);
                    _k = 0;
                    _l.label = 6;
                case 6:
                    if (!(_k < _h.length)) return [3, 9];
                    name_1 = _h[_k];
                    return [5, _loop_1(name_1)];
                case 7:
                    state_1 = _l.sent();
                    if (typeof state_1 === "object")
                        return [2, state_1.value];
                    _l.label = 8;
                case 8:
                    _k++;
                    return [3, 6];
                case 9:
                    _i++;
                    return [3, 1];
                case 10:
                    for (name_2 in components) {
                        reg = /<cg-(.+?)[ >]/g;
                        match = void 0;
                        while ((match = reg.exec(components[name_2].template))) {
                            if (!components['cg-' + match[1]]) {
                                continue;
                            }
                            components[name_2].components['cg-' + match[1]] = components['cg-' + match[1]];
                        }
                    }
                    style = opt.style;
                    layout = opt.layout;
                    if (!opt.file) return [3, 14];
                    layoutBlob = appPkg.files[opt.file + '.xml'];
                    if (!layoutBlob) return [3, 12];
                    return [4, clickgo.tool.blob2Text(layoutBlob)];
                case 11:
                    layout = _l.sent();
                    _l.label = 12;
                case 12:
                    styleBlob = appPkg.files[opt.file + '.css'];
                    if (!styleBlob) return [3, 14];
                    return [4, clickgo.tool.blob2Text(styleBlob)];
                case 13:
                    style = _l.sent();
                    _l.label = 14;
                case 14:
                    if (!layout) {
                        return [2, -104];
                    }
                    data = {};
                    methods = {};
                    computed = {};
                    watch = {};
                    beforeCreate = undefined;
                    created = undefined;
                    beforeMount = undefined;
                    mounted = undefined;
                    beforeUpdate = undefined;
                    updated = undefined;
                    beforeDestroy = undefined;
                    destroyed = undefined;
                    if (!appPkg.files[opt.file + '.js']) return [3, 16];
                    return [4, loader.requireMemory((_c = opt.file) !== null && _c !== void 0 ? _c : '', appPkg.files)];
                case 15:
                    expo = ((_d = _l.sent()) !== null && _d !== void 0 ? _d : [])[0];
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
                    _l.label = 16;
                case 16:
                    rand = '';
                    if (!style) return [3, 18];
                    r_1 = clickgo.tool.stylePrepend(style);
                    rand = r_1.rand;
                    return [4, clickgo.tool.styleUrl2DataUrl((_e = opt.dir) !== null && _e !== void 0 ? _e : '/', r_1.style, appPkg.files)];
                case 17:
                    style = _l.sent();
                    _l.label = 18;
                case 18:
                    layout = clickgo.tool.layoutInsertAttr(layout, ':focus=\'focus\'');
                    layout = clickgo.tool.purify(layout.replace(/<(\/{0,1})(.+?)>/g, function (t, t1, t2) {
                        if (t2 === 'template') {
                            return t;
                        }
                        else {
                            return '<' + t1 + 'cg-' + t2 + '>';
                        }
                    }));
                    randList = ['cg-task' + opt.taskId + '_'];
                    if (rand !== '') {
                        randList.push(rand);
                    }
                    r = clickgo.tool.layoutClassPrepend(layout, randList);
                    formListElement.insertAdjacentHTML('beforeend', r.layout);
                    el = formListElement.children.item(formListElement.children.length - 1);
                    el.classList.add('cg-form-wrap');
                    el.setAttribute('data-form-id', formId.toString());
                    el.setAttribute('data-task-id', opt.taskId.toString());
                    data.taskId = opt.taskId;
                    data.formId = formId;
                    data._dir = (_f = opt.dir) !== null && _f !== void 0 ? _f : '/';
                    data._scope = rand;
                    data.focus = false;
                    data._customZIndex = false;
                    if (opt.topMost) {
                        data._topMost = true;
                    }
                    else {
                        data._topMost = false;
                    }
                    methods.createForm = function (paramOpt, cfOpt) {
                        if (cfOpt === void 0) { cfOpt = {}; }
                        return __awaiter(this, void 0, void 0, function () {
                            var inOpt, form;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        inOpt = {
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
                                        return [4, create(inOpt)];
                                    case 1:
                                        form = _a.sent();
                                        if (typeof form === 'number') {
                                            this.$children[0].maskFor = undefined;
                                        }
                                        else {
                                            if (this.$children[0].maskFor) {
                                                this.$children[0].maskFor = form.id;
                                                form.vue.$children[0].maskFrom = this.formId;
                                            }
                                        }
                                        return [2];
                                }
                            });
                        });
                    };
                    methods.closeForm = function () {
                        remove(this.formId);
                    };
                    methods.bindFormDrag = function (e) {
                        this.$children[0].moveMethod(e);
                    };
                    methods.setSystemEventListener = function (name, func) {
                        this.eventList[name] = func;
                    };
                    methods.removeSystemEventListener = function (name) {
                        delete (this.eventList[name]);
                    };
                    methods.getBlob = function (file) {
                        var _a;
                        file = clickgo.tool.pathResolve(this.$data._dir, file);
                        return (_a = clickgo.core.tasks[this.taskId].appPkg.files[file]) !== null && _a !== void 0 ? _a : null;
                    };
                    methods.getDataUrl = function (file) {
                        return __awaiter(this, void 0, void 0, function () {
                            var f, _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        f = this.cgGetBlob(file);
                                        if (!f) return [3, 2];
                                        return [4, clickgo.tool.blob2DataUrl(f)];
                                    case 1:
                                        _a = _b.sent();
                                        return [3, 3];
                                    case 2:
                                        _a = null;
                                        _b.label = 3;
                                    case 3: return [2, _a];
                                }
                            });
                        });
                    };
                    methods.loadTheme = function (path) {
                        return __awaiter(this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4, clickgo.theme.load(path, this.taskId)];
                                    case 1:
                                        _a.sent();
                                        return [2];
                                }
                            });
                        });
                    };
                    methods.clearTheme = function () {
                        return __awaiter(this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4, clickgo.theme.clear(this.taskId)];
                                    case 1:
                                        _a.sent();
                                        return [2];
                                }
                            });
                        });
                    };
                    methods.setTheme = function (path) {
                        return __awaiter(this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4, clickgo.theme.clear(this.taskId)];
                                    case 1:
                                        _a.sent();
                                        return [4, clickgo.theme.load(path, this.taskId)];
                                    case 2:
                                        _a.sent();
                                        return [2];
                                }
                            });
                        });
                    };
                    methods.setTopMost = function (top) {
                        this.$data._customZIndex = false;
                        if (top) {
                            this.$data._topMost = true;
                            if (!this.focus) {
                                changeFocus(this.formId, this);
                            }
                            else {
                                this.$children[0].setPropData('zIndex', ++exports.lastTopZIndex);
                            }
                        }
                        else {
                            this.$data._topMost = false;
                            this.$children[0].setPropData('zIndex', ++exports.lastZIndex);
                        }
                    };
                    methods.flash = function () {
                        var _this = this;
                        if (!this.focus) {
                            changeFocus(this.formId);
                        }
                        if (this.$children[0].flashTimer) {
                            clearTimeout(this.$children[0].flashTimer);
                            this.$children[0].flashTimer = undefined;
                        }
                        this.$children[0].flashTimer = setTimeout(function () {
                            _this.$children[0].flashTimer = undefined;
                        }, 1000);
                        clickgo.core.trigger('formFlash', opt.taskId, formId);
                    };
                    methods._classPrepend = function (cla) {
                        if (typeof cla !== 'string') {
                            return cla;
                        }
                        if (cla.slice(0, 3) === 'cg-') {
                            return cla;
                        }
                        return "cg-task" + this.taskId + "_" + cla + " " + this.$data._scope + cla;
                    };
                    return [4, new Promise(function (resolve) {
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
                                'mounted': function () {
                                    this.$nextTick(function () {
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
                                'updated': function () {
                                    this.$nextTick(function () {
                                        updated === null || updated === void 0 ? void 0 : updated.call(this);
                                    });
                                },
                                'beforeDestroy': beforeDestroy,
                                'destroyed': destroyed,
                            });
                        })];
                case 19:
                    $vm = _l.sent();
                    if (!$vm) {
                        return [2, -106];
                    }
                    $vm.eventList = {};
                    if (controlsStyle !== '') {
                        clickgo.tool.pushStyle(controlsStyle, opt.taskId, 'controls', formId);
                    }
                    if (style) {
                        clickgo.tool.pushStyle(style, opt.taskId, 'forms', formId);
                    }
                    position = clickgo.getPosition();
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
                            return [2, -105];
                        }
                    }
                    changeFocus(formId, $vm);
                    form = {
                        'id': formId,
                        'vue': $vm,
                        'win': null,
                        'events': {}
                    };
                    if (!clickgo.core.tasks[opt.taskId]) {
                        $vm.$destroy();
                        clickgo.tool.removeStyle(opt.taskId, formId);
                        formListElement.removeChild($vm.$el);
                        return [2, -107];
                    }
                    clickgo.core.tasks[opt.taskId].forms[formId] = form;
                    clickgo.core.trigger('formCreated', opt.taskId, formId, { 'title': $vm.$children[0].title, 'icon': $vm.$children[0].iconData });
                    return [2, form];
            }
        });
    });
}
exports.create = create;
window.addEventListener('resize', function () {
    for (var i = 0; i < formListElement.children.length; ++i) {
        var el = formListElement.children.item(i);
        if (el.className.indexOf('cg-state-max') === -1) {
            continue;
        }
        var taskId = parseInt(el.getAttribute('data-task-id'));
        var formId = parseInt(el.getAttribute('data-form-id'));
        if (!clickgo.core.tasks[taskId]) {
            continue;
        }
        var $vm = clickgo.core.tasks[taskId].forms[formId].vue;
        var position = clickgo.getPosition();
        $vm.$children[0].setPropData('width', position.width);
        $vm.$children[0].setPropData('height', position.height);
    }
    clickgo.core.trigger('screenResize');
});

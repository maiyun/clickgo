"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activePanels = exports.elements = exports.launcherRoot = exports.simpleSystemTaskRoot = exports.AbstractForm = exports.AbstractPanel = void 0;
exports.superConfirm = superConfirm;
exports.min = min;
exports.max = max;
exports.close = close;
exports.bindResize = bindResize;
exports.bindDrag = bindDrag;
exports.refreshMaxPosition = refreshMaxPosition;
exports.getTaskId = getTaskId;
exports.get = get;
exports.send = send;
exports.getList = getList;
exports.getFocus = getFocus;
exports.getActivePanel = getActivePanel;
exports.removeActivePanel = removeActivePanel;
exports.setActivePanel = setActivePanel;
exports.hash = hash;
exports.getHash = getHash;
exports.hashBack = hashBack;
exports.changeFocus = changeFocus;
exports.getMaxZIndexID = getMaxZIndexID;
exports.getRectByBorder = getRectByBorder;
exports.showCircular = showCircular;
exports.moveRectangle = moveRectangle;
exports.showRectangle = showRectangle;
exports.hideRectangle = hideRectangle;
exports.showDrag = showDrag;
exports.moveDrag = moveDrag;
exports.hideDrag = hideDrag;
exports.alert = alert;
exports.notify = notify;
exports.notifyProgress = notifyProgress;
exports.hideNotify = hideNotify;
exports.appendToPop = appendToPop;
exports.removeFromPop = removeFromPop;
exports.showPop = showPop;
exports.hidePop = hidePop;
exports.isJustPop = isJustPop;
exports.doFocusAndPopEvent = doFocusAndPopEvent;
exports.remove = remove;
exports.removePanel = removePanel;
exports.createPanel = createPanel;
exports.create = create;
exports.dialog = dialog;
exports.confirm = confirm;
exports.prompt = prompt;
exports.flash = flash;
exports.showLauncher = showLauncher;
exports.hideLauncher = hideLauncher;
const clickgo = __importStar(require("../clickgo"));
const core = __importStar(require("./core"));
const task = __importStar(require("./task"));
const tool = __importStar(require("./tool"));
const dom = __importStar(require("./dom"));
const control = __importStar(require("./control"));
const fs = __importStar(require("./fs"));
const native = __importStar(require("./native"));
let focusId = null;
const info = {
    'lastId': 0,
    'lastPanelId': 0,
    'bottomLastZIndex': 999,
    'lastZIndex': 999999,
    'topLastZIndex': 99999999,
    'locale': {
        'en': {
            'ok': 'OK',
            'yes': 'Yes',
            'no': 'No',
            'cancel': 'Cancel',
            'search': 'Search',
            'confirmExitStep': 'This operation will exit the current process. Are you sure you want to exit?'
        },
        'sc': {
            'ok': '好',
            'yes': '是',
            'no': '否',
            'cancel': '取消',
            'search': '搜索',
            'confirmExitStep': '此操作将退出当前流程，确定退出吗？'
        },
        'tc': {
            'ok': '好',
            'yes': '是',
            'no': '否',
            'cancel': '取消',
            'search': '檢索',
            'confirmExitStep': '此操作將結束目前的流程，確定退出嗎？'
        },
        'ja': {
            'ok': '好',
            'yes': 'はい',
            'no': 'いいえ',
            'cancel': 'キャンセル',
            'search': '検索',
            'confirmExitStep': 'この操作は現在のプロセスを終了します。本当に終了しますか？'
        },
        'ko': {
            'ok': '확인',
            'yes': '예',
            'no': '아니오',
            'cancel': '취소',
            'search': '검색',
            'confirmExitStep': '이 작업은 현재 프로세스를 종료합니다. 종료하시겠습니까?'
        },
        'th': {
            'ok': 'ตกลง',
            'yes': 'ใช่',
            'no': 'ไม่',
            'cancel': 'ยกเลิก',
            'search': 'ค้นหา',
            'confirmExitStep': 'การดำเนินการนี้จะออกจากกระบวนการปัจจุบัน ยืนยันที่จะออกไหม？'
        },
        'es': {
            'ok': 'Aceptar',
            'yes': 'Sí',
            'no': 'No',
            'cancel': 'Cancelar',
            'search': 'Buscar',
            'confirmExitStep': 'Esta operación cerrará el proceso actual. ¿Estás seguro de que quieres salir?'
        },
        'de': {
            'ok': 'OK',
            'yes': 'Ja',
            'no': 'Nein',
            'cancel': 'Abbrechen',
            'search': 'Suchen',
            'confirmExitStep': 'Diese Aktion beendet den aktuellen Prozess. Möchten Sie wirklich beenden?'
        },
        'fr': {
            'ok': 'OK',
            'yes': 'Oui',
            'no': 'Non',
            'cancel': 'Annuler',
            'search': 'Rechercher',
            'confirmExitStep': 'Cette opération va quitter le processus en cours. Êtes-vous sûr de vouloir quitter ?'
        },
        'pt': {
            'ok': 'OK',
            'yes': 'Sim',
            'no': 'Não',
            'cancel': 'Cancelar',
            'search': 'Buscar',
            'confirmExitStep': 'Esta operação encerrará o processo atual. Você tem certeza de que deseja sair?'
        },
        'ru': {
            'ok': 'OK',
            'yes': 'Да',
            'no': 'Нет',
            'cancel': 'Отмена',
            'search': 'Поиск',
            'confirmExitStep': 'Эта операция завершит текущий процесс. Вы уверены, что хотите выйти?'
        },
        'vi': {
            'ok': 'OK',
            'yes': 'Có',
            'no': 'Không',
            'cancel': 'Hủy bỏ',
            'search': 'Tìm kiếm',
            'confirmExitStep': 'Thao tác này sẽ thoát khỏi quy trình hiện tại. Bạn có chắc chắn muốn thoát không?'
        }
    }
};
class AbstractCommon {
    get filename() {
        return '';
    }
    get controlName() {
        return 'root';
    }
    set controlName(v) {
        notify({
            'title': 'Error',
            'content': `The software tries to modify the system variable "controlName".\nPath: ${this.filename}`,
            'type': 'danger'
        });
        return;
    }
    get taskId() {
        return 0;
    }
    get formId() {
        return 0;
    }
    set formFocus(b) {
        notify({
            'title': 'Error',
            'content': `The software tries to modify the system variable "formFocus".\nPath: ${this.filename}`,
            'type': 'danger'
        });
    }
    get path() {
        return '';
    }
    get prep() {
        return '';
    }
    get locale() {
        return task.list[this.taskId].locale.lang || core.config.locale;
    }
    get l() {
        return (key, data) => {
            var _a, _b, _c, _d;
            const loc = (_d = (_b = (_a = task.list[this.taskId].locale.data[this.locale]) === null || _a === void 0 ? void 0 : _a[key]) !== null && _b !== void 0 ? _b : (_c = task.list[this.taskId].locale.data['en']) === null || _c === void 0 ? void 0 : _c[key]) !== null && _d !== void 0 ? _d : '[LocaleError]' + key;
            if (!data) {
                return loc;
            }
            let i = -1;
            return loc.replace(/\?/g, function () {
                ++i;
                if (!data[i]) {
                    return '';
                }
                return data[i];
            });
        };
    }
    get classPrepend() {
        return (cla) => {
            if (typeof cla !== 'string') {
                return cla;
            }
            return `cg-task${this.taskId}_${cla}${this.prep ? (' ' + this.prep + cla) : ''}`;
        };
    }
    watch(name, cb, opt = {}) {
        return this.$watch(name, cb, opt);
    }
    get refs() {
        return this.$refs;
    }
    get nextTick() {
        return this.$nextTick;
    }
    allowEvent(e) {
        return dom.allowEvent(e);
    }
    trigger(name, param1 = '', param2 = '') {
        if (!['formTitleChanged', 'formIconChanged', 'formStateMinChanged', 'formStateMaxChanged', 'formShowChanged'].includes(name)) {
            return;
        }
        core.trigger(name, this.taskId, this.formId, param1, param2);
    }
    send(fid, obj) {
        obj.taskId = this.taskId;
        obj.formId = this.formId;
        send(fid, obj);
    }
    onBeforeCreate() {
        return;
    }
    onCreated() {
        return;
    }
    onBeforeMount() {
        return;
    }
    onBeforeUpdate() {
        return;
    }
    onUpdated() {
        return;
    }
    onBeforeUnmount() {
        return;
    }
    onUnmounted() {
        return;
    }
}
class AbstractPanel extends AbstractCommon {
    constructor() {
        super(...arguments);
        this.qs = {};
    }
    get panelId() {
        return 0;
    }
    get rootForm() {
        return {};
    }
    get rootPanel() {
        return {};
    }
    get formHash() {
        return this.rootForm.formHash;
    }
    set formHash(fh) {
        this.rootForm.formHash = fh;
    }
    get formHashData() {
        return this.rootForm.formHashData;
    }
    set formHashData(v) {
        this.rootForm.formHashData = v;
    }
    formHashBack() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.rootForm.formHashBack();
        });
    }
    sendToRootPanel(data) {
        this.rootPanel.send(data);
    }
    enterStep(list) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.rootForm.enterStep(list);
        });
    }
    doneStep() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.rootForm.doneStep();
        });
    }
    clearQs() {
        this.qs = {};
    }
    get formFocus() {
        var _a;
        return (_a = this.rootForm.formFocus) !== null && _a !== void 0 ? _a : false;
    }
    onShow() {
        return;
    }
    onShowed() {
        return;
    }
    onHide() {
        return;
    }
    onMounted() {
        return;
    }
    onReceive() {
        return;
    }
    onQsChange() {
        return;
    }
    onQsChangeShow() {
        return;
    }
}
exports.AbstractPanel = AbstractPanel;
class AbstractForm extends AbstractCommon {
    constructor() {
        super(...arguments);
        this.isNativeSync = false;
        this.isReady = false;
        this._loading = false;
        this.lockLoading = false;
        this._inStep = false;
        this._stepValues = [];
        this._firstShow = true;
        this.dialogResult = '';
    }
    get formHash() {
        return '';
    }
    set formHash(v) {
    }
    get formHashData() {
        return {};
    }
    set formHashData(v) {
    }
    get topMost() {
        return false;
    }
    set topMost(v) {
    }
    get bottomMost() {
        return false;
    }
    set bottomMost(v) {
    }
    get isMask() {
        return !task.list[this.taskId].runtime.dialogFormIds.length ||
            task.list[this.taskId].runtime.dialogFormIds[task.list[this.taskId].runtime.dialogFormIds.length - 1]
                === this.formId ? false : true;
    }
    get formFocus() {
        return this._formFocus;
    }
    get showInSystemTask() {
        return false;
    }
    set showInSystemTask(v) {
    }
    ready(cb) {
        cb();
    }
    formHashBack() {
        return __awaiter(this, void 0, void 0, function* () {
            const v = this;
            if (Date.now() - v.$data._lastFormHashData > 300) {
                v.$data._formHashData = {};
            }
            if (!v.$data._historyHash.length) {
                if (v.$data._formHash) {
                    if (this.inStep) {
                        if (!(yield clickgo.form.confirm({
                            'taskId': this.taskId,
                            'content': info.locale[this.locale].confirmExitStep
                        }))) {
                            return;
                        }
                        this._inStep = false;
                        this.refs.form.stepHide();
                    }
                    v.$data._formHash = '';
                    core.trigger('formHashChange', this.taskId, this.formId, '', v.$data._formHashData);
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
                    if (!(yield clickgo.form.confirm({
                        'taskId': this.taskId,
                        'content': info.locale[this.locale].confirmExitStep
                    }))) {
                        return;
                    }
                    this._inStep = false;
                    this.refs.form.stepHide();
                }
            }
            v.$data._formHash = parent;
            v.$data._historyHash.splice(-1);
            core.trigger('formHashChange', this.taskId, this.formId, parent, v.$data._formHashData);
        });
    }
    sendToPanel(panel, data) {
        panel.send(data);
    }
    get loading() {
        return this._loading;
    }
    set loading(val) {
        if (this.lockLoading) {
            return;
        }
        this._loading = val;
    }
    get inStep() {
        return this._inStep;
    }
    enterStep(list) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._inStep) {
                return false;
            }
            if (list[0].value !== this.formHash) {
                return false;
            }
            this._inStep = true;
            this._stepValues.length = 0;
            for (const item of list) {
                this._stepValues.push(item.value);
            }
            this.refs.form.stepData = list;
            this.refs.form.stepValue = this.formHash;
            yield this.nextTick();
            this.refs.form.stepShow();
            return true;
        });
    }
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
    doneStep() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._inStep) {
                return;
            }
            this._inStep = false;
            yield this.refs.form.stepDone();
        });
    }
    show() {
        const v = this;
        if (this._firstShow) {
            this._firstShow = false;
            const area = core.getAvailArea();
            if (!v.$refs.form.stateMaxData) {
                if (v.$refs.form.left === -1) {
                    v.$refs.form.setPropData('left', (area.width - v.$el.offsetWidth) / 2);
                }
                if (v.$refs.form.top === -1) {
                    v.$refs.form.setPropData('top', (area.height - v.$el.offsetHeight) / 2);
                }
            }
            v.$refs.form.$data.isShow = true;
            changeFocus(this.formId);
        }
        else {
            v.$refs.form.$data.isShow = true;
        }
    }
    showDialog() {
        return __awaiter(this, void 0, void 0, function* () {
            task.list[this.taskId].runtime.dialogFormIds.push(this.formId);
            this.show();
            this.topMost = true;
            return new Promise((resolve) => {
                this.cgDialogCallback = () => {
                    resolve(this.dialogResult);
                };
            });
        });
    }
    hide() {
        const v = this;
        v.$refs.form.$data.isShow = false;
    }
    close() {
        close(this.formId);
    }
    onMounted() {
        return;
    }
    onReceive() {
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
    onTaskStarted() {
        return;
    }
    onTaskEnded() {
        return;
    }
    onLauncherFolderNameChanged() {
        return;
    }
    onHashChanged() {
        return;
    }
}
exports.AbstractForm = AbstractForm;
const popInfo = {
    'list': [],
    'elList': [],
    'wayList': [],
    'time': [],
    'lastZIndex': 0
};
let superConfirmHandler = undefined;
exports.elements = {
    'wrap': document.createElement('div'),
    'list': document.createElement('div'),
    'popList': document.createElement('div'),
    'circular': document.createElement('div'),
    'rectangle': document.createElement('div'),
    'gesture': document.createElement('div'),
    'drag': document.createElement('div'),
    'notify': document.createElement('div'),
    'alert': document.createElement('div'),
    'simpletask': document.createElement('div'),
    'launcher': document.createElement('div'),
    'confirm': document.createElement('div'),
    'init': function () {
        this.wrap.id = 'cg-wrap';
        document.getElementsByTagName('body')[0].appendChild(this.wrap);
        this.wrap.addEventListener('touchmove', function (e) {
            if (e.target && dom.findParentByData(e.target, 'cg-scroll')) {
                return;
            }
            if (e.cancelable) {
                e.preventDefault();
            }
        }, {
            'passive': false
        });
        this.wrap.addEventListener('wheel', function (e) {
            if (e.target && ((e.target.dataset.cgScroll !== undefined) || dom.findParentByData(e.target, 'cg-scroll'))) {
                return;
            }
            e.preventDefault();
        }, {
            'passive': false
        });
        this.wrap.addEventListener('contextmenu', function (e) {
            e.preventDefault();
        });
        if (clickgo.isImmersion()) {
            this.wrap.addEventListener('mouseenter', function () {
                native.invoke('cg-mouse-ignore', native.getToken(), false);
            });
            this.wrap.addEventListener('mouseleave', function () {
                native.invoke('cg-mouse-ignore', native.getToken(), true);
            });
        }
        this.list.id = 'cg-form-list';
        this.wrap.appendChild(this.list);
        this.popList.id = 'cg-pop-list';
        this.wrap.appendChild(this.popList);
        this.circular.id = 'cg-circular';
        this.wrap.appendChild(this.circular);
        this.rectangle.setAttribute('data-pos', '');
        this.rectangle.id = 'cg-rectangle';
        this.wrap.appendChild(this.rectangle);
        this.gesture.id = 'cg-gesture';
        this.wrap.appendChild(this.gesture);
        this.drag.id = 'cg-drag';
        this.drag.innerHTML = '<svg width="16" height="16" viewBox="0 0 48 48" fill="none" stroke="#FFF" xmlns="http://www.w3.org/2000/svg"><path d="M8 8L40 40" stroke-width="4" stroke-linecap="butt" stroke-linejoin="miter"/><path d="M8 40L40 8" stroke-width="4" stroke-linecap="butt" stroke-linejoin="miter"/></svg>';
        this.wrap.appendChild(this.drag);
        this.notify.id = 'cg-notify';
        this.wrap.appendChild(this.notify);
        this.alert.id = 'cg-alert';
        this.wrap.appendChild(this.alert);
        this.simpletask.id = 'cg-simpletask';
        this.wrap.appendChild(this.simpletask);
        const simpletaskApp = clickgo.vue.createApp({
            'template': '<div v-for="(item, formId) of forms" class="cg-simpletask-item" @click="click(parseInt(formId))"><div v-if="item.icon" class="cg-simpletask-icon" :style="{\'background-image\': \'url(\' + item.icon + \')\'}"></div><div>{{item.title}}</div></div>',
            'data': function () {
                return {
                    'forms': {}
                };
            },
            'watch': {
                'forms': {
                    handler: function () {
                        const length = Object.keys(this.forms).length;
                        if (length > 0) {
                            if (exports.elements.simpletask.style.bottom !== '0px') {
                                exports.elements.simpletask.style.bottom = '0px';
                                core.trigger('screenResize');
                            }
                        }
                        else {
                            if (exports.elements.simpletask.style.bottom === '0px') {
                                exports.elements.simpletask.style.bottom = '-46px';
                                core.trigger('screenResize');
                            }
                        }
                    },
                    'deep': true
                }
            },
            'methods': {
                click: function (formId) {
                    changeFocus(formId);
                }
            },
            'mounted': function () {
                exports.simpleSystemTaskRoot = this;
            }
        });
        simpletaskApp.mount('#cg-simpletask');
        this.launcher.id = 'cg-launcher';
        this.wrap.appendChild(this.launcher);
        const waiting = function () {
            if (!core.config) {
                setTimeout(function () {
                    waiting();
                }, 150);
                return;
            }
            const launcherApp = clickgo.vue.createApp({
                'template': `<div class="cg-launcher-search">` +
                    `<input v-if="folderName === ''" class="cg-launcher-sinput" :placeholder="search" v-model="name">` +
                    `<input v-else class="cg-launcher-foldername" :value="folderName" @change="folderNameChange">` +
                    `</div>` +
                    `<div class="cg-launcher-list" @mousedown="mousedown" @click="listClick" :class="[folderName === '' ? '' : 'cg-folder-open']">` +
                    `<div v-for="item of list" class="cg-launcher-item">` +
                    `<div class="cg-launcher-inner">` +
                    `<div v-if="!item.list || item.list.length === 0" class="cg-launcher-icon" :style="{'background-image': 'url(' + item.icon + ')'}" @click="iconClick($event, item)"></div>` +
                    `<div v-else class="cg-launcher-folder" @click="openFolder($event, item)">` +
                    `<div>` +
                    `<div v-for="sub of item.list" class="cg-launcher-item">` +
                    `<div class="cg-launcher-inner">` +
                    `<div class="cg-launcher-icon" :style="{'background-image': 'url(' + sub.icon + ')'}" @click="subIconClick($event, sub)"></div>` +
                    `<div class="cg-launcher-name">{{sub.name}}</div>` +
                    `</div>` +
                    `<div class="cg-launcher-space"></div>` +
                    `</div>` +
                    `</div>` +
                    `</div>` +
                    `<div class="cg-launcher-name">{{item.name}}</div>` +
                    `</div>` +
                    `<div class="cg-launcher-space"></div>` +
                    `</div>` +
                    `</div>`,
                'data': function () {
                    return {
                        'name': '',
                        'folderName': '',
                        'folderItem': {}
                    };
                },
                'computed': {
                    'search': function () {
                        var _a, _b;
                        return (_b = (_a = info.locale[core.config.locale]) === null || _a === void 0 ? void 0 : _a.search) !== null && _b !== void 0 ? _b : info.locale['en'].search;
                    },
                    'list': function () {
                        if (this.name === '') {
                            return core.config['launcher.list'];
                        }
                        const list = [];
                        for (const item of core.config['launcher.list']) {
                            if (item.list && item.list.length > 0) {
                                for (const sub of item.list) {
                                    if (sub.name.toLowerCase().includes(this.name.toLowerCase())) {
                                        list.push(sub);
                                    }
                                }
                            }
                            else {
                                if (item.name.toLowerCase().includes(this.name.toLowerCase())) {
                                    list.push(item);
                                }
                            }
                        }
                        return list;
                    }
                },
                'methods': {
                    mousedown: function (e) {
                        this.md = e.pageX + e.pageY;
                    },
                    listClick: function (e) {
                        if (this.md !== e.pageX + e.pageY) {
                            return;
                        }
                        if (e.currentTarget !== e.target) {
                            return;
                        }
                        if (this.folderName === '') {
                            hideLauncher();
                        }
                        else {
                            this.closeFolder();
                        }
                    },
                    iconClick: function (e, item) {
                        return __awaiter(this, void 0, void 0, function* () {
                            if (this.md !== e.pageX + e.pageY) {
                                return;
                            }
                            hideLauncher();
                            yield clickgo.task.run(item.path, {
                                'icon': item.icon
                            });
                        });
                    },
                    subIconClick: function (e, item) {
                        return __awaiter(this, void 0, void 0, function* () {
                            if (this.md !== e.pageX + e.pageY) {
                                return;
                            }
                            hideLauncher();
                            yield clickgo.task.run(item.path, {
                                'icon': item.icon
                            });
                        });
                    },
                    closeFolder: function () {
                        this.folderName = '';
                        const el = this.folderEl;
                        const rect = el.parentNode.getBoundingClientRect();
                        el.classList.remove('cg-show');
                        el.style.left = (rect.left + 30).toString() + 'px';
                        el.style.top = rect.top.toString() + 'px';
                        el.style.width = '';
                        el.style.height = '';
                        setTimeout(() => {
                            el.style.position = '';
                            el.style.left = '';
                            el.style.top = '';
                        }, 150);
                    },
                    openFolder: function (e, item) {
                        if (this.md !== e.pageX + e.pageY) {
                            return;
                        }
                        if (e.currentTarget.childNodes[0] !== e.target) {
                            return;
                        }
                        if (this.folderName !== '') {
                            this.closeFolder();
                            return;
                        }
                        this.folderName = item.name;
                        this.folderItem = item;
                        const el = e.currentTarget.childNodes.item(0);
                        this.folderEl = el;
                        const searchEl = document.getElementsByClassName('cg-launcher-search')[0];
                        const rect = el.getBoundingClientRect();
                        el.style.left = rect.left.toString() + 'px';
                        el.style.top = rect.top.toString() + 'px';
                        el.style.position = 'fixed';
                        requestAnimationFrame(() => {
                            el.classList.add('cg-show');
                            el.style.left = '50px';
                            el.style.top = searchEl.offsetHeight.toString() + 'px';
                            el.style.width = 'calc(100% - 100px)';
                            el.style.height = 'calc(100% - 50px - ' + searchEl.offsetHeight.toString() + 'px)';
                        });
                    },
                    folderNameChange: function (e) {
                        var _a;
                        const input = e.target;
                        const val = input.value.trim();
                        if (val === '') {
                            input.value = this.folderName;
                            return;
                        }
                        this.folderName = val;
                        core.trigger('launcherFolderNameChanged', (_a = this.folderItem.id) !== null && _a !== void 0 ? _a : '', val);
                    }
                },
                'mounted': function () {
                    exports.launcherRoot = this;
                }
            });
            launcherApp.mount('#cg-launcher');
        };
        waiting();
        this.confirm.id = 'cg-confirm';
        this.wrap.appendChild(this.confirm);
        this.confirm.innerHTML = `<div class="cg-confirm-box">` +
            `<div id="cg-confirm-content"></div>` +
            `<div class="cg-confirm-controls">` +
            `<div id="cg-confirm-cancel"></div>` +
            `<div id="cg-confirm-ok"></div>` +
            `</div>` +
            `</div>`;
        this.confirm.style.display = 'none';
        document.getElementById('cg-confirm-cancel').addEventListener('click', () => {
            superConfirmHandler === null || superConfirmHandler === void 0 ? void 0 : superConfirmHandler(false);
            this.confirm.style.display = 'none';
            const fid = getMaxZIndexID();
            if (fid) {
                changeFocus(fid);
            }
        });
        document.getElementById('cg-confirm-ok').addEventListener('click', () => {
            superConfirmHandler === null || superConfirmHandler === void 0 ? void 0 : superConfirmHandler(true);
            this.confirm.style.display = 'none';
            const fid = getMaxZIndexID();
            if (fid) {
                changeFocus(fid);
            }
        });
    }
};
exports.elements.init();
function superConfirm(html) {
    return new Promise((resolve) => {
        var _a, _b, _c, _d;
        if (superConfirmHandler !== undefined) {
            resolve(false);
            return;
        }
        exports.elements.confirm.style.display = 'flex';
        document.getElementById('cg-confirm-content').innerHTML = html;
        document.getElementById('cg-confirm-cancel').innerHTML = (_b = (_a = info.locale[core.config.locale]) === null || _a === void 0 ? void 0 : _a.cancel) !== null && _b !== void 0 ? _b : info.locale['en'].cancel;
        document.getElementById('cg-confirm-ok').innerHTML = (_d = (_c = info.locale[core.config.locale]) === null || _c === void 0 ? void 0 : _c.ok) !== null && _d !== void 0 ? _d : info.locale['en'].ok;
        superConfirmHandler = (result) => {
            superConfirmHandler = undefined;
            resolve(result);
        };
    });
}
function changeState(state, formId) {
    const tid = getTaskId(formId);
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
function min(formId) {
    return changeState('min', formId);
}
function max(formId) {
    return changeState('max', formId);
}
function close(formId) {
    return changeState('close', formId);
}
function bindResize(e, border) {
    const formWrap = dom.findParentByClass(e.target, 'cg-form-wrap');
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
function bindDrag(e) {
    const formWrap = dom.findParentByClass(e.target, 'cg-form-wrap');
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
function refreshMaxPosition() {
    const area = core.getAvailArea();
    for (let i = 0; i < exports.elements.list.children.length; ++i) {
        const el = exports.elements.list.children.item(i);
        const ef = el.children.item(0);
        if (ef.dataset.cgMax === undefined) {
            continue;
        }
        const taskId = parseInt(el.getAttribute('data-task-id'));
        const formId = parseInt(el.getAttribute('data-form-id'));
        if (!task.list[taskId]) {
            continue;
        }
        const vroot = task.list[taskId].forms[formId].vroot;
        if (ef.dataset.cgBottomMost === undefined) {
            vroot.$refs.form.setPropData('left', area.left);
            vroot.$refs.form.setPropData('top', area.top);
            vroot.$refs.form.setPropData('width', area.width);
            vroot.$refs.form.setPropData('height', area.height);
        }
        else {
            vroot.$refs.form.setPropData('width', area.owidth);
            vroot.$refs.form.setPropData('height', area.oheight);
        }
    }
}
function getTaskId(formId) {
    const formElement = exports.elements.list.querySelector(`[data-form-id='${formId}']`);
    if (!formElement) {
        return 0;
    }
    const taskIdAttr = formElement.getAttribute('data-task-id');
    if (!taskIdAttr) {
        return 0;
    }
    return parseInt(taskIdAttr);
}
function get(formId) {
    const taskId = getTaskId(formId);
    if (taskId === 0) {
        return null;
    }
    if (!task.list[taskId].forms[formId]) {
        return null;
    }
    const item = task.list[taskId].forms[formId];
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
function send(formId, obj) {
    const taskId = getTaskId(formId);
    if (taskId === 0) {
        return;
    }
    const item = task.list[taskId].forms[formId];
    item.vroot.onReceive(obj);
}
function getList(taskId) {
    if (!task.list[taskId]) {
        return {};
    }
    const list = {};
    for (const fid in task.list[taskId].forms) {
        const item = task.list[taskId].forms[fid];
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
function getFocus() {
    return focusId;
}
exports.activePanels = {};
function getActivePanel(formId) {
    var _a;
    return (_a = exports.activePanels[formId]) !== null && _a !== void 0 ? _a : [];
}
function removeActivePanel(panelId, formId, taskId) {
    if (!taskId) {
        return false;
    }
    if (!task.list[taskId]) {
        return false;
    }
    if (!task.list[taskId].forms[formId]) {
        return false;
    }
    if (!exports.activePanels[formId]) {
        return true;
    }
    const io = exports.activePanels[formId].indexOf(panelId);
    if (io === -1) {
        return true;
    }
    exports.activePanels[formId].splice(io, 1);
    if (!exports.activePanels[formId].length) {
        delete exports.activePanels[formId];
    }
    return true;
}
function setActivePanel(panelId, formId, taskId) {
    if (!taskId) {
        return false;
    }
    if (!task.list[taskId]) {
        return false;
    }
    if (!task.list[taskId].forms[formId]) {
        return false;
    }
    if (!exports.activePanels[formId]) {
        exports.activePanels[formId] = [];
    }
    const io = exports.activePanels[formId].indexOf(panelId);
    if (io !== -1) {
        return true;
    }
    exports.activePanels[formId].push(panelId);
    return true;
}
function hash(hash, formId) {
    const taskId = getTaskId(formId);
    if (taskId === 0) {
        return false;
    }
    const t = task.list[taskId];
    if (!t) {
        return false;
    }
    const item = task.list[taskId].forms[formId];
    if (!item) {
        return false;
    }
    item.vroot.formHash = hash;
    return true;
}
function getHash(formId) {
    const taskId = getTaskId(formId);
    if (taskId === 0) {
        return '';
    }
    const t = task.list[taskId];
    if (!t) {
        return '';
    }
    const item = task.list[taskId].forms[formId];
    if (!item) {
        return '';
    }
    return item.vroot.$data._formHash;
}
function hashBack(formId) {
    return __awaiter(this, void 0, void 0, function* () {
        const taskId = getTaskId(formId);
        if (taskId === 0) {
            return false;
        }
        const t = task.list[taskId];
        if (!t) {
            return false;
        }
        const item = task.list[taskId].forms[formId];
        if (!item) {
            return false;
        }
        yield item.vroot.formHashBack();
        return true;
    });
}
function changeFocus(formId = 0) {
    var _a;
    if (typeof formId === 'string') {
        formId = parseInt(formId);
    }
    const dataFormId = getFocus();
    if (dataFormId) {
        if (dataFormId === formId) {
            return;
        }
        else {
            const t = task.list[task.getFocus()];
            t.forms[dataFormId].vapp._container.removeAttribute('data-form-focus');
            t.forms[dataFormId].vroot._formFocus = false;
            core.trigger('formBlurred', t.id, dataFormId);
        }
    }
    focusId = null;
    task.setFocus();
    if (formId === 0) {
        return;
    }
    const el = exports.elements.list.querySelector(`.cg-form-wrap[data-form-id='${formId}']`);
    if (!el) {
        return;
    }
    if (el.children.item(0).dataset.cgMin !== undefined) {
        min(formId);
    }
    const taskId = parseInt((_a = el.getAttribute('data-task-id')) !== null && _a !== void 0 ? _a : '0');
    const t = task.list[taskId];
    if (t.runtime.dialogFormIds.length) {
        const dialogFormId = t.runtime.dialogFormIds[t.runtime.dialogFormIds.length - 1];
        if (get(dialogFormId).stateMin) {
            min(dialogFormId);
        }
        if (t.forms[dialogFormId].vroot._topMost) {
            t.forms[dialogFormId].vroot.$refs.form.$data.zIndex = ++info.topLastZIndex;
        }
        else if (t.forms[dialogFormId].vroot._bottomMost) {
            t.forms[dialogFormId].vroot.$refs.form.$data.zIndex = ++info.bottomLastZIndex;
        }
        else {
            t.forms[dialogFormId].vroot.$refs.form.$data.zIndex = ++info.lastZIndex;
        }
        t.forms[dialogFormId].vapp._container.dataset.formFocus = '';
        t.forms[dialogFormId].vroot._formFocus = true;
        focusId = dialogFormId;
        task.setFocus(t.id);
        core.trigger('formFocused', taskId, dialogFormId);
        if (dialogFormId !== formId) {
            clickgo.form.flash(dialogFormId, taskId);
        }
    }
    else {
        if (t.forms[formId].vroot._topMost) {
            t.forms[formId].vroot.$refs.form.$data.zIndex = ++info.topLastZIndex;
        }
        else if (t.forms[formId].vroot._bottomMost) {
            t.forms[formId].vroot.$refs.form.$data.zIndex = ++info.bottomLastZIndex;
        }
        else {
            t.forms[formId].vroot.$refs.form.$data.zIndex = ++info.lastZIndex;
        }
        t.forms[formId].vapp._container.dataset.formFocus = '';
        t.forms[formId].vroot._formFocus = true;
        focusId = formId;
        task.setFocus(t.id);
        core.trigger('formFocused', taskId, formId);
    }
}
function getMaxZIndexID(out = {}) {
    var _a, _b;
    let zIndex = 0;
    let formId = null;
    for (let i = 0; i < exports.elements.list.children.length; ++i) {
        const formWrap = exports.elements.list.children.item(i);
        const formInner = formWrap.children.item(0);
        if (!formInner) {
            continue;
        }
        const z = parseInt(formInner.style.zIndex);
        if (z < 1000000) {
            continue;
        }
        if (formInner.dataset.cgMin !== undefined) {
            continue;
        }
        const tid = parseInt(formWrap.getAttribute('data-task-id'));
        if (tid === task.systemTaskInfo.taskId) {
            continue;
        }
        if ((_a = out.taskIds) === null || _a === void 0 ? void 0 : _a.includes(tid)) {
            continue;
        }
        const fid = parseInt(formWrap.getAttribute('data-form-id'));
        if ((_b = out.formIds) === null || _b === void 0 ? void 0 : _b.includes(fid)) {
            continue;
        }
        if (z > zIndex) {
            zIndex = z;
            formId = fid;
        }
    }
    return formId;
}
function getRectByBorder(border) {
    var _a, _b, _c, _d;
    const area = core.getAvailArea();
    let width, height, left, top;
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
        width = (_a = border.width) !== null && _a !== void 0 ? _a : area.width;
        height = (_b = border.height) !== null && _b !== void 0 ? _b : area.height;
        left = (_c = border.left) !== null && _c !== void 0 ? _c : area.left;
        top = (_d = border.top) !== null && _d !== void 0 ? _d : area.top;
    }
    return {
        'width': width,
        'height': height,
        'left': left,
        'top': top
    };
}
function showCircular(x, y) {
    exports.elements.circular.style.transition = 'none';
    requestAnimationFrame(function () {
        exports.elements.circular.style.width = '6px';
        exports.elements.circular.style.height = '6px';
        exports.elements.circular.style.left = (x - 3).toString() + 'px';
        exports.elements.circular.style.top = (y - 3).toString() + 'px';
        exports.elements.circular.style.opacity = '1';
        requestAnimationFrame(function () {
            exports.elements.circular.style.transition = 'all .3s var(--g-cubic)';
            requestAnimationFrame(function () {
                exports.elements.circular.style.width = '60px';
                exports.elements.circular.style.height = '60px';
                exports.elements.circular.style.left = (x - 30).toString() + 'px';
                exports.elements.circular.style.top = (y - 30).toString() + 'px';
                exports.elements.circular.style.opacity = '0';
            });
        });
    });
}
function moveRectangle(border) {
    var _a, _b, _c, _d;
    const dataReady = (_a = exports.elements.rectangle.getAttribute('data-ready')) !== null && _a !== void 0 ? _a : '0';
    if (dataReady === '0') {
        return;
    }
    const dataBorder = (_b = exports.elements.rectangle.getAttribute('data-border')) !== null && _b !== void 0 ? _b : '';
    const setDataBorder = typeof border === 'string' ? border : `o-${border.left}-${(_c = border.top) !== null && _c !== void 0 ? _c : 'n'}-${border.width}-${(_d = border.height) !== null && _d !== void 0 ? _d : 'n'}`;
    if (dataBorder === setDataBorder) {
        return;
    }
    exports.elements.rectangle.setAttribute('data-dir', setDataBorder);
    const pos = getRectByBorder(border);
    const width = pos.width - 20;
    const height = pos.height - 20;
    const left = pos.left + 10;
    const top = pos.top + 10;
    if (width !== undefined && height !== undefined && left !== undefined && top !== undefined) {
        exports.elements.rectangle.style.width = width.toString() + 'px';
        exports.elements.rectangle.style.height = height.toString() + 'px';
        exports.elements.rectangle.style.left = left.toString() + 'px';
        exports.elements.rectangle.style.top = top.toString() + 'px';
    }
}
function showRectangle(x, y, border) {
    exports.elements.rectangle.style.transition = 'none';
    requestAnimationFrame(function () {
        exports.elements.rectangle.style.width = '5px';
        exports.elements.rectangle.style.height = '5px';
        exports.elements.rectangle.style.left = (x - 10).toString() + 'px';
        exports.elements.rectangle.style.top = (y - 10).toString() + 'px';
        exports.elements.rectangle.style.opacity = '1';
        exports.elements.rectangle.setAttribute('data-ready', '0');
        exports.elements.rectangle.setAttribute('data-dir', '');
        requestAnimationFrame(function () {
            exports.elements.rectangle.style.transition = 'all .3s var(--g-cubic)';
            requestAnimationFrame(function () {
                exports.elements.rectangle.setAttribute('data-ready', '1');
                moveRectangle(border);
            });
        });
    });
}
function hideRectangle() {
    exports.elements.rectangle.style.opacity = '0';
}
let dragTimeOut = 0;
function showDrag() {
    if (dragTimeOut) {
        clearTimeout(dragTimeOut);
        dragTimeOut = 0;
    }
    exports.elements.drag.style.opacity = '1';
    exports.elements.drag.style.transform = 'perspective(100px) rotateX(15deg) translateZ(15px)';
    exports.elements.drag.style.borderBottomWidth = '2px';
}
function moveDrag(opt) {
    if (opt.top) {
        exports.elements.drag.style.top = opt.top.toString() + 'px';
    }
    if (opt.left) {
        exports.elements.drag.style.left = opt.left.toString() + 'px';
    }
    let perspective = 0;
    if (opt.width) {
        exports.elements.drag.style.width = opt.width.toString() + 'px';
        if (perspective < opt.width) {
            perspective = opt.width;
        }
    }
    if (opt.height) {
        exports.elements.drag.style.height = opt.height.toString() + 'px';
        if (perspective < opt.height) {
            perspective = opt.height;
        }
    }
    if (perspective) {
        exports.elements.drag.style.transform = 'perspective(' + (perspective + 50) + 'px) rotateX(15deg) translateZ(15px)';
    }
    if (opt.icon) {
        exports.elements.drag.childNodes[0].style.display = 'block';
    }
    else {
        exports.elements.drag.childNodes[0].style.display = 'none';
    }
}
function hideDrag() {
    exports.elements.drag.style.transform = 'initial';
    exports.elements.drag.style.borderBottomWidth = '1px';
    dragTimeOut = window.setTimeout(() => {
        dragTimeOut = 0;
        exports.elements.drag.style.opacity = '0';
    }, 300);
}
let alertBottom = 0;
let alertId = 0;
function alert(content, type) {
    const nid = ++alertId;
    const timeout = 3000;
    const el = document.createElement('div');
    const y = alertBottom;
    el.classList.add('cg-alert-wrap');
    el.classList.add('cg-' + (type !== null && type !== void 0 ? type : 'default'));
    el.setAttribute('data-alertid', nid.toString());
    el.style.transform = `translateY(${y + 10}px)`;
    el.style.opacity = '0';
    el.innerHTML = `<div class="cg-alert-content">` +
        `<div class="cg-alert-icon"></div>` +
        `<div>${tool.escapeHTML(content)}</div>` +
        '</div>';
    exports.elements.alert.appendChild(el);
    alertBottom -= el.offsetHeight + 10;
    requestAnimationFrame(function () {
        el.style.transform = `translateY(${y}px)`;
        el.style.opacity = '1';
        const timer = window.setTimeout(function () {
            clearTimeout(timer);
            const alertHeight = el.offsetHeight;
            el.style.opacity = '0';
            setTimeout(function () {
                alertBottom += alertHeight + 10;
                const alertElementList = document.getElementsByClassName('cg-alert-wrap');
                let needSub = false;
                for (const alertElement of alertElementList) {
                    if (alertElement === el) {
                        needSub = true;
                        continue;
                    }
                    if (needSub) {
                        alertElement.style.transform = alertElement.style.transform.replace(/translateY\(([-0-9]+)px\)/, function (t, t1) {
                            return `translateY(${parseInt(t1) + alertHeight + 10}px)`;
                        });
                    }
                }
                el.remove();
            }, 100);
        }, timeout);
    });
    return nid;
}
let notifyBottom = -10;
let notifyId = 0;
function notify(opt) {
    var _a;
    const nid = ++notifyId;
    let timeout = 5000;
    if (opt.timeout !== undefined) {
        if (opt.timeout <= 0 || opt.timeout > 30000) {
            timeout = 60000 * 5;
        }
        else {
            timeout = opt.timeout;
        }
    }
    if (opt.progress && !opt.type) {
        opt.type = 'progress';
    }
    const el = document.createElement('div');
    let y = notifyBottom;
    let x = -10;
    if (task.systemTaskInfo.taskId > 0) {
        if (core.config['task.position'] === 'bottom') {
            y -= task.systemTaskInfo.length;
        }
        else if (core.config['task.position'] === 'right') {
            x -= task.systemTaskInfo.length;
        }
    }
    el.classList.add('cg-notify-wrap');
    el.setAttribute('data-notifyid', nid.toString());
    el.style.transform = `translateY(${y}px) translateX(280px)`;
    el.style.opacity = '0';
    el.classList.add((opt.title && opt.content) ? 'cg-notify-full' : 'cg-notify-only');
    el.innerHTML = `<div class="cg-notify-icon cg-${tool.escapeHTML((_a = opt.type) !== null && _a !== void 0 ? _a : 'primary')}"></div>` +
        '<div style="flex: 1;">' +
        (opt.title ? `<div class="cg-notify-title">${tool.escapeHTML(opt.title)}</div>` : '') +
        (opt.content ? `<div class="cg-notify-content">${tool.escapeHTML(opt.content).replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\n/g, '<br>')}</div>` +
            `${opt.progress ? '<div class="cg-notify-progress"></div>' : ''}` : '') +
        '</div>';
    if (opt.icon) {
        el.childNodes.item(0).style.background = 'url(' + opt.icon + ')';
        el.childNodes.item(0).style.backgroundSize = '14px';
    }
    exports.elements.notify.appendChild(el);
    notifyBottom -= el.offsetHeight + 10;
    requestAnimationFrame(function () {
        el.style.transform = `translateY(${y}px) translateX(${x}px)`;
        el.style.opacity = '1';
        const timer = window.setTimeout(function () {
            hideNotify(nid);
        }, timeout);
        el.setAttribute('data-timer', timer.toString());
    });
    return nid;
}
function notifyProgress(notifyId, per) {
    const el = exports.elements.notify.querySelector(`[data-notifyid="${notifyId}"]`);
    if (!el) {
        return;
    }
    const progress = el.querySelector('.cg-notify-progress');
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
function hideNotify(notifyId) {
    const el = exports.elements.notify.querySelector(`[data-notifyid="${notifyId}"]`);
    if (!el) {
        return;
    }
    clearTimeout(parseInt(el.getAttribute('data-timer')));
    const notifyHeight = el.offsetHeight;
    el.style.opacity = '0';
    setTimeout(function () {
        notifyBottom += notifyHeight + 10;
        const notifyElementList = document.getElementsByClassName('cg-notify-wrap');
        let needSub = false;
        for (const notifyElement of notifyElementList) {
            if (notifyElement === el) {
                needSub = true;
                continue;
            }
            if (needSub) {
                notifyElement.style.transform = notifyElement.style.transform.replace(/translateY\(([-0-9]+)px\)/, function (t, t1) {
                    return `translateY(${parseInt(t1) + notifyHeight + 10}px)`;
                });
            }
        }
        el.remove();
    }, 100);
}
function appendToPop(el) {
    exports.elements.popList.appendChild(el);
}
function removeFromPop(el) {
    exports.elements.popList.removeChild(el);
}
function refreshPopPosition(el, pop, direction, size = {}) {
    var _a, _b;
    const width = (_a = size.width) !== null && _a !== void 0 ? _a : pop.offsetWidth;
    const height = (_b = size.height) !== null && _b !== void 0 ? _b : pop.offsetHeight;
    let left, top;
    if (typeof direction === 'string') {
        const bcr = el.getBoundingClientRect();
        if (direction === 'v') {
            left = bcr.left;
            top = bcr.top + bcr.height;
        }
        else if (direction === 'h') {
            left = bcr.left + bcr.width - 2;
            top = bcr.top - 2;
        }
        else {
            pop.removeAttribute('data-pop-t-bottom');
            left = bcr.left + bcr.width / 2 - width / 2;
            top = bcr.top - height - 10;
        }
        if (width + left > window.innerWidth) {
            if (direction === 'v') {
                left = bcr.left + bcr.width - width;
            }
            else if (direction === 'h') {
                left = bcr.left - width + 2;
            }
            else {
            }
        }
        if (height + top > window.innerHeight) {
            if (direction === 'v') {
                top = bcr.top - height;
            }
            else if (direction === 'h') {
                top = bcr.top + bcr.height - height + 2;
            }
            else {
            }
        }
        else if (top < 0 && direction === 't') {
            top = bcr.top + bcr.height + 10;
            pop.dataset.popTBottom = '';
        }
    }
    else {
        let x;
        let y;
        if (direction instanceof MouseEvent || direction.type === 'mousedown') {
            x = direction.clientX;
            y = direction.clientY;
        }
        else if (direction instanceof TouchEvent || direction.type === 'touchstart') {
            x = direction.touches[0].clientX;
            y = direction.touches[0].clientY;
        }
        else {
            x = direction.x;
            y = direction.y;
        }
        left = x + 5;
        top = y + 7;
        if (width + left > window.innerWidth) {
            left = x - width - 5;
        }
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
    pop.style.left = left.toString() + 'px';
    pop.style.top = top.toString() + 'px';
    pop.style.zIndex = (++popInfo.lastZIndex).toString();
    if (size.width) {
        pop.style.width = size.width.toString() + 'px';
    }
    if (size.height) {
        pop.style.height = size.height.toString() + 'px';
    }
}
let lastShowPopTime = 0;
function showPop(el, pop, direction, opt = {}) {
    var _a;
    if (!(el instanceof Element)) {
        if (!el.$el) {
            return;
        }
        el = el.$el;
    }
    if (pop && !(pop instanceof Element)) {
        if (!pop.$el) {
            return;
        }
        pop = pop.$el;
    }
    if (opt.null === undefined) {
        opt.null = false;
    }
    if (opt.size === undefined) {
        opt.size = {};
    }
    if (opt.flow === undefined) {
        opt.flow = true;
    }
    if (!pop && !opt.null) {
        return;
    }
    if (pop && !opt.flow) {
        pop.removeAttribute('data-cg-pop-none');
        pop.dataset.cgFlow = '';
        clickgo.tool.sleep(34).then(() => {
            if (pop.dataset.cgFlow === undefined) {
                return;
            }
            refreshPopPosition(el, pop, direction, opt.size);
            if (opt.autoPosition) {
                clickgo.dom.watchSize(pop, () => {
                    refreshPopPosition(el, pop, direction, opt.size);
                });
            }
            pop.dataset.cgOpen = '';
        }).catch(() => {
        });
        return;
    }
    const now = Date.now();
    if (now - lastShowPopTime < 5) {
        lastShowPopTime = now;
        return;
    }
    lastShowPopTime = now;
    if (el.dataset.cgPopOpen !== undefined) {
        return;
    }
    const parentPop = dom.findParentByData(el, 'cg-pop');
    if ((parentPop === null || parentPop === void 0 ? void 0 : parentPop.dataset.cgLevel) !== undefined) {
        const nextlevel = parseInt(parentPop.dataset.cgLevel) + 1;
        if (popInfo.elList[nextlevel]) {
            hidePop(popInfo.elList[nextlevel]);
        }
    }
    else {
        hidePop();
    }
    if (!pop) {
        popInfo.elList.push(el);
        el.dataset.cgPopOpen = '';
        el.dataset.cgLevel = (popInfo.elList.length - 1).toString();
        return;
    }
    pop.removeAttribute('data-cg-pop-none');
    popInfo.list.push(pop);
    popInfo.elList.push(el);
    popInfo.wayList.push((_a = opt.way) !== null && _a !== void 0 ? _a : 'normal');
    popInfo.time.push(Date.now());
    pop.dataset.cgLevel = (popInfo.list.length - 1).toString();
    el.dataset.cgLevel = (popInfo.elList.length - 1).toString();
    clickgo.tool.sleep(34).then(() => {
        if (pop.dataset.cgLevel === undefined) {
            return;
        }
        refreshPopPosition(el, pop, direction, opt.size);
        if (opt.autoPosition && typeof direction === 'string') {
            clickgo.dom.watchSize(pop, () => {
                refreshPopPosition(el, pop, direction, opt.size);
            });
        }
        if (opt.autoScroll && typeof direction === 'string') {
            clickgo.dom.watchPosition(el, () => {
                refreshPopPosition(el, pop, direction, opt.size);
            });
        }
        pop.dataset.cgOpen = '';
        el.dataset.cgPopOpen = '';
    }).catch(() => {
    });
}
function hidePop(pop) {
    if (pop && !(pop instanceof HTMLElement)) {
        if (!pop.$el) {
            return;
        }
        pop = pop.$el;
    }
    if (!pop) {
        if (popInfo.elList.length === 0) {
            return;
        }
        hidePop(popInfo.elList[0]);
        return;
    }
    if (pop.dataset.cgFlow !== undefined) {
        pop.removeAttribute('data-cg-flow');
        pop.removeAttribute('data-cg-open');
        clickgo.dom.unwatchSize(pop);
        clickgo.tool.sleep(334).then(() => {
            if (pop.dataset.cgFlow !== undefined) {
                return;
            }
            pop.dataset.cgPopNone = '';
        }).catch(() => {
        });
        return;
    }
    if (pop.dataset.cgLevel === undefined) {
        return;
    }
    const isPop = pop.dataset.cgPop !== undefined ? true : false;
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
        clickgo.dom.unwatchSize(pop);
        clickgo.dom.unwatchPosition(popInfo.elList[level]);
        popInfo.elList[level].removeAttribute('data-cg-pop-open');
        popInfo.elList[level].removeAttribute('data-cg-level');
        clickgo.tool.sleep(334).then(() => {
            if (pop.dataset.cgLevel !== undefined) {
                return;
            }
            pop.dataset.cgPopNone = '';
        }).catch(() => {
        });
    }
    else {
        if (popInfo.list[level]) {
            const opop = popInfo.list[level];
            opop.removeAttribute('data-cg-open');
            opop.removeAttribute('data-cg-level');
            clickgo.dom.unwatchSize(popInfo.list[level]);
            clickgo.dom.unwatchPosition(pop);
            clickgo.tool.sleep(334).then(() => {
                if (opop.dataset.cgLevel !== undefined) {
                    return;
                }
                opop.dataset.cgPopNone = '';
            }).catch(() => {
            });
        }
        pop.removeAttribute('data-cg-pop-open');
        pop.removeAttribute('data-cg-level');
    }
    popInfo.list.splice(level);
    popInfo.elList.splice(level);
    popInfo.wayList.splice(level);
    popInfo.time.splice(level);
}
function isJustPop(el) {
    if (el instanceof HTMLElement) {
        const level = el.dataset.cgLevel;
        if (!level) {
            return false;
        }
        el = parseInt(level);
    }
    const time = popInfo.time[el];
    if (Date.now() - time >= 100) {
        return false;
    }
    return true;
}
function doFocusAndPopEvent(e) {
    var _a, _b;
    if (dom.hasTouchButMouse(e)) {
        return;
    }
    const target = e.target;
    if (!target) {
        return;
    }
    const paths = (_a = e.path) !== null && _a !== void 0 ? _a : (e.composedPath ? e.composedPath() : []);
    let isCgPopOpen = null;
    for (const item of paths) {
        if (!item.tagName) {
            continue;
        }
        if (item.dataset.cgLevel !== undefined && item.dataset.cgPop === undefined) {
            isCgPopOpen = item;
            continue;
        }
        if (item.classList.contains('cg-form-wrap')) {
            const formId = parseInt((_b = item.getAttribute('data-form-id')) !== null && _b !== void 0 ? _b : '0');
            changeFocus(formId);
            if (isCgPopOpen) {
                if (!isJustPop(isCgPopOpen)) {
                    hidePop();
                }
            }
            else {
                hidePop();
            }
            return;
        }
        if (item.tagName.toLowerCase() === 'body') {
            break;
        }
    }
    for (const item of paths) {
        if (!item.tagName) {
            continue;
        }
        if (item.tagName.toLowerCase() === 'body') {
            break;
        }
        if (item.dataset.cgPop !== undefined) {
            if (item.dataset.cgLevel) {
                const nextlevel = parseInt(item.dataset.cgLevel) + 1;
                if (popInfo.wayList[nextlevel] === 'click' && !isJustPop(nextlevel)) {
                    clickgo.form.hidePop(popInfo.list[nextlevel]);
                }
            }
            return;
        }
    }
    hidePop();
    changeFocus();
}
window.addEventListener('touchstart', doFocusAndPopEvent, {
    'passive': true
});
window.addEventListener('mousedown', doFocusAndPopEvent);
function remove(formId) {
    const taskId = getTaskId(formId);
    if (!task.list[taskId].forms[formId]) {
        return false;
    }
    if (task.list[taskId].forms[formId].closed) {
        return false;
    }
    task.list[taskId].forms[formId].closed = true;
    const title = task.list[taskId].forms[formId].vroot.$refs.form.title;
    const icon = task.list[taskId].forms[formId].vroot.$refs.form.iconDataUrl;
    const io = task.list[taskId].runtime.dialogFormIds.indexOf(formId);
    if (io > -1) {
        task.list[taskId].runtime.dialogFormIds.splice(io, 1);
    }
    task.list[taskId].forms[formId].vroot.$refs.form.$data.isShow = false;
    setTimeout(function () {
        var _a;
        const fid = getMaxZIndexID({
            'formIds': [formId]
        });
        if (fid) {
            changeFocus(fid);
        }
        else {
            changeFocus();
        }
        if (!task.list[taskId]) {
            return true;
        }
        task.list[taskId].forms[formId].vapp.unmount();
        task.list[taskId].forms[formId].vapp._container.remove();
        (_a = exports.elements.popList.querySelector('[data-form-id="' + formId.toString() + '"]')) === null || _a === void 0 ? void 0 : _a.remove();
        if (io > -1) {
            task.list[taskId].forms[formId].vroot.cgDialogCallback();
        }
        delete task.list[taskId].forms[formId];
        dom.removeStyle(taskId, 'form', formId);
        core.trigger('formRemoved', taskId, formId, title, icon);
        dom.clearWatchStyle(formId);
        dom.clearWatchProperty(formId);
        dom.clearWatchPosition(formId);
        native.clear(formId, taskId);
        delete exports.activePanels[formId];
        if (Object.keys(task.list[taskId].forms).length === 0) {
            task.end(taskId);
        }
    }, 300);
    return true;
}
function removePanel(id, vapp, el) {
    var _a;
    const formWrap = dom.findParentByClass(el, 'cg-form-wrap');
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
    const tid = parseInt(taskId);
    vapp.unmount();
    vapp._container.remove();
    (_a = el.querySelector('[data-panel-id="' + id.toString() + '"]')) === null || _a === void 0 ? void 0 : _a.remove();
    dom.removeStyle(tid, 'form', formId, id);
    dom.clearWatchStyle(formId, id);
    dom.clearWatchProperty(formId, id);
    dom.clearWatchPosition(formId, id);
    if (exports.activePanels[formId]) {
        const io = exports.activePanels[formId].indexOf(id);
        if (io >= 0) {
            exports.activePanels[formId].splice(io, 1);
        }
        if (!exports.activePanels[formId].length) {
            delete exports.activePanels[formId];
        }
    }
    return true;
}
function getForm(taskId, formId) {
    const t = task.list[taskId];
    if (!t) {
        return null;
    }
    const form = t.forms[formId];
    if (!form) {
        return null;
    }
    return form;
}
function createPanel(rootPanel_1, cls_1) {
    return __awaiter(this, arguments, void 0, function* (rootPanel, cls, opt = {}, taskId) {
        var _a;
        if (rootPanel.element.dataset.cgControl !== 'panel') {
            const err = new Error('form.createPanel: -0');
            core.trigger('error', 0, 0, err, err.message);
            throw err;
        }
        const formWrap = dom.findParentByData(rootPanel.element, 'form-id');
        if (!formWrap) {
            const err = new Error('form.createPanel: -0');
            core.trigger('error', 0, 0, err, err.message);
            throw err;
        }
        const formId = parseInt(formWrap.dataset.formId);
        if (!taskId) {
            const err = new Error('form.createPanel: -1');
            core.trigger('error', 0, 0, err, err.message);
            throw err;
        }
        const t = task.list[taskId];
        if (!t) {
            const err = new Error('form.createPanel: -2');
            core.trigger('error', 0, 0, err, err.message);
            throw err;
        }
        let layout = '';
        if (opt.layout) {
            layout = opt.layout;
        }
        let style = '';
        let prep = '';
        if (opt.style) {
            style = opt.style;
        }
        let filename = '';
        if (typeof cls === 'string') {
            filename = tool.urlResolve((_a = opt.path) !== null && _a !== void 0 ? _a : '/', cls);
            if (!layout) {
                const l = t.app.files[filename + '.xml'];
                if (typeof l !== 'string') {
                    const err = new Error('form.createPanel: -3');
                    core.trigger('error', 0, 0, err, err.message);
                    throw err;
                }
                layout = l;
            }
            if (!style) {
                const s = t.app.files[filename + '.css'];
                if (typeof s === 'string') {
                    style = s;
                }
            }
            cls = class extends AbstractPanel {
                get filename() {
                    return filename + '.js';
                }
                get taskId() {
                    return t.id;
                }
            };
        }
        const panelId = ++info.lastPanelId;
        const panel = new cls();
        if (!filename) {
            filename = panel.filename;
        }
        const lio = filename.lastIndexOf('/');
        const path = filename.slice(0, lio);
        if (!layout) {
            const l = t.app.files[filename.slice(0, -2) + 'xml'];
            if (typeof l !== 'string') {
                const err = new Error('form.createPanel: -4');
                core.trigger('error', 0, 0, err, err.message);
                throw err;
            }
            layout = l;
        }
        if (!style) {
            const s = t.app.files[filename.slice(0, -2) + 'css'];
            if (typeof s === 'string') {
                style = s;
            }
        }
        if (style) {
            const r = tool.stylePrepend(style);
            prep = r.prep;
            style = yield tool.styleUrl2DataUrl(path + '/', r.style, t.app.files);
        }
        layout = tool.purify(layout);
        layout = tool.layoutAddTagClassAndReTagName(layout, true);
        const prepList = ['cg-task' + t.id.toString() + '_'];
        if (prep !== '') {
            prepList.push(prep);
        }
        layout = tool.layoutClassPrepend(layout, prepList);
        layout = tool.eventsAttrWrap(layout);
        if (layout.includes('<teleport')) {
            layout = tool.teleportGlue(layout, formId);
        }
        const components = control.buildComponents(t.id, formId, path);
        if (!components) {
            const err = new Error('form.createPanel: -5');
            core.trigger('error', 0, 0, err, err.message);
            throw err;
        }
        const idata = {};
        const cdata = Object.entries(panel);
        for (const item of cdata) {
            if (item[0] === 'access') {
                continue;
            }
            idata[item[0]] = item[1];
        }
        const prot = tool.getClassPrototype(panel);
        const methods = prot.method;
        const computed = prot.access;
        computed.formId = {
            get: function () {
                return formId;
            },
            set: function () {
                notify({
                    'title': 'Error',
                    'content': `The software tries to modify the system variable "formId".\nPath: ${this.filename}`,
                    'type': 'danger'
                });
                return;
            }
        };
        computed.panelId = {
            get: function () {
                return panelId;
            },
            set: function () {
                notify({
                    'title': 'Error',
                    'content': `The software tries to modify the system variable "panelId".\nPath: ${this.filename}`,
                    'type': 'danger'
                });
                return;
            }
        };
        computed.path = {
            get: function () {
                return path;
            },
            set: function () {
                notify({
                    'title': 'Error',
                    'content': `The software tries to modify the system variable "path".\nPath: ${this.filename}`,
                    'type': 'danger'
                });
                return;
            }
        };
        computed.prep = {
            get: function () {
                return prep;
            },
            set: function () {
                notify({
                    'title': 'Error',
                    'content': `The software tries to modify the system variable "prep".\nPath: ${this.filename}`,
                    'type': 'danger'
                });
                return;
            }
        };
        computed.rootForm = {
            get: function () {
                return t.forms[formId].vroot;
            },
            set: function () {
                notify({
                    'title': 'Error',
                    'content': `The software tries to modify the system variable "rootForm".\nPath: ${this.filename}`,
                    'type': 'danger'
                });
                return;
            }
        };
        computed.rootPanel = {
            get: function () {
                return rootPanel;
            },
            set: function () {
                notify({
                    'title': 'Error',
                    'content': `The software tries to modify the system variable "rootPanel".\nPath: ${this.filename}`,
                    'type': 'danger'
                });
                return;
            }
        };
        rootPanel.element.insertAdjacentHTML('beforeend', `<div data-panel-id="${panelId.toString()}"></div>`);
        if (style) {
            dom.pushStyle(t.id, style, 'form', formId, panelId);
        }
        const mel = rootPanel.element.children.item(rootPanel.element.children.length - 1);
        mel.style.position = 'absolute';
        mel.style.display = 'none';
        const rtn = yield new Promise(function (resolve) {
            const vapp = clickgo.vue.createApp({
                'template': layout.replace(/^<cg-panel([\s\S]+)-panel>$/, '<cg-layout$1-layout>'),
                'data': function () {
                    return tool.clone(idata);
                },
                'methods': methods,
                'computed': computed,
                'beforeCreate': panel.onBeforeCreate,
                'created': function () {
                    if (panel.access) {
                        this.access = tool.clone(panel.access);
                    }
                    this.onCreated();
                },
                'beforeMount': function () {
                    this.onBeforeMount();
                },
                'mounted': function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield this.$nextTick();
                        mel.children.item(0).style.flex = '1';
                        resolve({
                            'vapp': vapp,
                            'vroot': this
                        });
                    });
                },
                'beforeUpdate': function () {
                    this.onBeforeUpdate();
                },
                'updated': function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield this.$nextTick();
                        this.onUpdated();
                    });
                },
                'beforeUnmount': function () {
                    this.onBeforeUnmount();
                },
                'unmounted': function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield this.$nextTick();
                        this.onUnmounted();
                    });
                }
            });
            vapp.config.errorHandler = function (err, vm, info) {
                notify({
                    'title': 'Runtime Error',
                    'content': `Message: ${err.message}\nTask id: ${vm.taskId}\nForm id: ${vm.formId}`,
                    'type': 'danger'
                });
                console.error('Runtime Error [form.createPanel.errorHandler]', `Message: ${err.message}\nTask id: ${vm.taskId}\nForm id: ${vm.formId}`, err, info);
                core.trigger('error', vm.taskId, vm.formId, err, info + '(-3,' + vm.taskId + ',' + vm.formId + ')');
            };
            for (const key in components) {
                vapp.component(key, components[key]);
            }
            try {
                vapp.mount(mel);
            }
            catch (err) {
                notify({
                    'title': 'Runtime Error',
                    'content': `Message: ${err.message}\nTask id: ${t.id}\nForm id: ${formId}`,
                    'type': 'danger'
                });
                console.error('Runtime Error [form.createPanel.mount]', `Message: ${err.message}\nTask id: ${t.id}\nForm id: ${formId}`, err);
                core.trigger('error', t.id, formId, err, err.message);
            }
        });
        yield tool.sleep(34);
        try {
            yield panel.onMounted.call(rtn.vroot);
        }
        catch (err) {
            core.trigger('error', rtn.vroot.taskId, rtn.vroot.formId, err, 'Create panel mounted error: -6.');
            try {
                rtn.vapp.unmount();
            }
            catch (err) {
                const msg = `Message: ${err.message}\nTask id: ${t.id}\nForm id: ${formId}\nFunction: form.createPanel, unmount.`;
                notify({
                    'title': 'Panel Unmount Error',
                    'content': msg,
                    'type': 'danger'
                });
                console.log('Panel Unmount Error', msg, err);
            }
            rtn.vapp._container.remove();
            dom.clearWatchStyle(rtn.vroot.formId, panelId);
            dom.clearWatchProperty(rtn.vroot.formId, panelId);
            dom.clearWatchPosition(rtn.vroot.formId, panelId);
            dom.removeStyle(rtn.vroot.taskId, 'form', rtn.vroot.formId, panelId);
            throw err;
        }
        return {
            'id': panelId,
            'vapp': rtn.vapp,
            'vroot': rtn.vroot
        };
    });
}
function create(cls_1, data_1) {
    return __awaiter(this, arguments, void 0, function* (cls, data, opt = {}, taskId) {
        var _a, _b;
        if (!taskId) {
            const err = new Error('form.create: -1');
            core.trigger('error', 0, 0, err, err.message);
            throw err;
        }
        const t = task.list[taskId];
        if (!t) {
            const err = new Error('form.create: -2');
            core.trigger('error', 0, 0, err, err.message);
            throw err;
        }
        let layout = '';
        if (opt.layout) {
            layout = opt.layout;
        }
        let style = '';
        let prep = '';
        if (opt.style) {
            style = opt.style;
        }
        let filename = '';
        if (typeof cls === 'string') {
            filename = tool.urlResolve((_a = opt.path) !== null && _a !== void 0 ? _a : '/', cls);
            if (!layout) {
                const l = t.app.files[filename + '.xml'];
                if (typeof l !== 'string') {
                    const err = new Error('form.create: -3');
                    core.trigger('error', 0, 0, err, err.message);
                    throw err;
                }
                layout = l;
            }
            if (!style) {
                const s = t.app.files[filename + '.css'];
                if (typeof s === 'string') {
                    style = s;
                }
            }
            cls = class extends AbstractForm {
                get filename() {
                    return filename + '.js';
                }
                get taskId() {
                    return t.id;
                }
            };
        }
        const formId = ++info.lastId;
        const frm = new cls();
        if (!filename) {
            filename = frm.filename;
        }
        const lio = filename.lastIndexOf('/');
        const path = filename.slice(0, lio);
        if (!layout) {
            const l = t.app.files[filename.slice(0, -2) + 'xml'];
            if (typeof l !== 'string') {
                const err = new Error('form.create: -4');
                core.trigger('error', 0, 0, err, err.message);
                throw err;
            }
            layout = l;
        }
        if (!style) {
            const s = t.app.files[filename.slice(0, -2) + 'css'];
            if (typeof s === 'string') {
                style = s;
            }
        }
        if (style) {
            const r = tool.stylePrepend(style);
            prep = r.prep;
            style = yield tool.styleUrl2DataUrl(path + '/', r.style, t.app.files);
        }
        layout = tool.purify(layout);
        layout = tool.layoutAddTagClassAndReTagName(layout, true);
        const prepList = ['cg-task' + t.id.toString() + '_'];
        if (prep !== '') {
            prepList.push(prep);
        }
        layout = tool.layoutClassPrepend(layout, prepList);
        layout = tool.eventsAttrWrap(layout);
        if (layout.includes('<teleport')) {
            layout = tool.teleportGlue(layout, formId);
        }
        const components = control.buildComponents(t.id, formId, path);
        if (!components) {
            const err = new Error('form.create: -5');
            core.trigger('error', 0, 0, err, err.message);
            throw err;
        }
        const idata = {};
        const cdata = Object.entries(frm);
        for (const item of cdata) {
            if (item[0] === 'access') {
                continue;
            }
            idata[item[0]] = item[1];
        }
        idata._formFocus = false;
        if (clickgo.isNative() && (formId === 1) && !clickgo.isImmersion() && !clickgo.hasFrame()) {
            idata.isNativeSync = true;
        }
        const prot = tool.getClassPrototype(frm);
        const methods = prot.method;
        const computed = prot.access;
        computed.formId = {
            get: function () {
                return formId;
            },
            set: function () {
                notify({
                    'title': 'Error',
                    'content': `The software tries to modify the system variable "formId".\nPath: ${this.filename}`,
                    'type': 'danger'
                });
                return;
            }
        };
        computed.path = {
            get: function () {
                return path;
            },
            set: function () {
                notify({
                    'title': 'Error',
                    'content': `The software tries to modify the system variable "path".\nPath: ${this.filename}`,
                    'type': 'danger'
                });
                return;
            }
        };
        computed.prep = {
            get: function () {
                return prep;
            },
            set: function () {
                notify({
                    'title': 'Error',
                    'content': `The software tries to modify the system variable "prep".\nPath: ${this.filename}`,
                    'type': 'danger'
                });
                return;
            }
        };
        idata._bottomMost = false;
        computed.bottomMost = {
            get: function () {
                return this._bottomMost;
            },
            set: function (v) {
                if (v) {
                    this._bottomMost = true;
                    this.$el.dataset.cgBottomMost = '';
                    if (this._topMost) {
                        this._topMost = false;
                    }
                    this.$refs.form.$data.zIndex = ++info.bottomLastZIndex;
                }
                else {
                    this._bottomMost = false;
                    this.$el.removeAttribute('data-cg-bottom-most');
                    this.$refs.form.$data.zIndex = ++info.lastZIndex;
                }
            }
        };
        idata._topMost = false;
        computed.topMost = {
            get: function () {
                return this._topMost;
            },
            set: function (v) {
                if (v) {
                    this._topMost = true;
                    if (this._bottomMost) {
                        this._bottomMost = false;
                        this.$el.removeAttribute('data-cg-bottom-most');
                    }
                    if (!this._formFocus) {
                        changeFocus(this.formId);
                    }
                    else {
                        this.$refs.form.$data.zIndex = ++info.topLastZIndex;
                    }
                }
                else {
                    this._topMost = false;
                    this.$refs.form.$data.zIndex = ++info.lastZIndex;
                }
            }
        };
        idata._historyHash = [];
        idata._formHash = '';
        computed.formHash = {
            get: function () {
                return this._formHash;
            },
            set: function (v) {
                if (v === this._formHash) {
                    return;
                }
                if (Date.now() - this._lastFormHashData > 300) {
                    this._formHashData = {};
                }
                if (this.inStep) {
                    (() => __awaiter(this, void 0, void 0, function* () {
                        if (this._stepValues.includes(v)) {
                            this.$refs.form.stepValue = v;
                        }
                        else {
                            if (!(yield clickgo.form.confirm({
                                'taskId': this.taskId,
                                'content': info.locale[this.locale].confirmExitStep
                            }))) {
                                return;
                            }
                            this._inStep = false;
                            this.$refs.form.stepHide();
                        }
                        if (this._formHash) {
                            this._historyHash.push(this._formHash);
                        }
                        this._formHash = v;
                        core.trigger('formHashChange', t.id, formId, v, this._formHashData);
                    }))();
                    return;
                }
                if (this._formHash) {
                    this._historyHash.push(this._formHash);
                }
                this._formHash = v;
                core.trigger('formHashChange', t.id, formId, v, this._formHashData);
            }
        };
        idata._lastFormHashData = 0;
        idata._formHashData = {};
        computed.formHashData = {
            get: function () {
                return this._formHashData;
            },
            set: function (v) {
                this._formHashData = v;
                this._lastFormHashData = Date.now();
            }
        };
        idata._showInSystemTask = true;
        computed.showInSystemTask = {
            get: function () {
                return this._showInSystemTask;
            },
            set: function (v) {
                this._showInSystemTask = v;
                core.trigger('formShowInSystemTaskChange', t.id, formId, v);
            }
        };
        const cbs = [];
        methods.ready = function (cb) {
            if (this.isReady) {
                cb();
                return;
            }
            cbs.push(cb);
        };
        exports.elements.list.insertAdjacentHTML('beforeend', `<div class="cg-form-wrap" data-form-id="${formId.toString()}" data-task-id="${t.id.toString()}"></div>`);
        exports.elements.popList.insertAdjacentHTML('beforeend', `<div data-form-id="${formId.toString()}" data-task-id="${t.id.toString()}"></div>`);
        if (style) {
            dom.pushStyle(t.id, style, 'form', formId);
        }
        const el = exports.elements.list.children.item(exports.elements.list.children.length - 1);
        const rtn = yield new Promise(function (resolve) {
            const vapp = clickgo.vue.createApp({
                'template': layout.replace(/^<cg-form/, '<cg-form ref="form"'),
                'data': function () {
                    return tool.clone(idata);
                },
                'methods': methods,
                'computed': computed,
                'beforeCreate': frm.onBeforeCreate,
                'created': function () {
                    if (frm.access) {
                        this.access = tool.clone(frm.access);
                    }
                    this.onCreated();
                },
                'beforeMount': function () {
                    this.onBeforeMount();
                },
                'mounted': function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield this.$nextTick();
                        if (this.$refs.form.icon) {
                            const icon = yield fs.getContent(this.$refs.form.icon, undefined, taskId);
                            this.$refs.form.iconDataUrl = (icon instanceof Blob) ? yield tool.blob2DataUrl(icon) : '';
                        }
                        resolve({
                            'vapp': vapp,
                            'vroot': this
                        });
                    });
                },
                'beforeUpdate': function () {
                    this.onBeforeUpdate();
                },
                'updated': function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield this.$nextTick();
                        this.onUpdated();
                    });
                },
                'beforeUnmount': function () {
                    this.onBeforeUnmount();
                },
                'unmounted': function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield this.$nextTick();
                        this.onUnmounted();
                    });
                }
            });
            vapp.config.errorHandler = function (err, vm, info) {
                notify({
                    'title': 'Runtime Error',
                    'content': `Message: ${err.message}\nTask id: ${vm.taskId}\nForm id: ${vm.formId}`,
                    'type': 'danger'
                });
                console.error('Runtime Error [form.create.errorHandler]', `Message: ${err.message}\nTask id: ${vm.taskId}\nForm id: ${vm.formId}`, err, info);
                core.trigger('error', vm.taskId, vm.formId, err, info + '(-3,' + vm.taskId + ',' + vm.formId + ')');
            };
            for (const key in components) {
                vapp.component(key, components[key]);
            }
            try {
                vapp.mount(el);
            }
            catch (err) {
                notify({
                    'title': 'Runtime Error',
                    'content': `Message: ${err.message}\nTask id: ${t.id}\nForm id: ${formId}`,
                    'type': 'danger'
                });
                console.error('Runtime Error [form.create.mount]', `Message: ${err.message}\nTask id: ${t.id}\nForm id: ${formId}`, err);
                core.trigger('error', t.id, formId, err, err.message);
            }
        });
        const nform = {
            'id': formId,
            'vapp': rtn.vapp,
            'vroot': rtn.vroot,
            'closed': false
        };
        t.forms[formId] = nform;
        yield tool.sleep(34);
        try {
            yield frm.onMounted.call(rtn.vroot, data !== null && data !== void 0 ? data : {});
        }
        catch (err) {
            core.trigger('error', rtn.vroot.taskId, rtn.vroot.formId, err, 'Create form mounted error: -6.');
            delete t.forms[formId];
            try {
                rtn.vapp.unmount();
            }
            catch (err) {
                const msg = `Message: ${err.message}\nTask id: ${t.id}\nForm id: ${formId}\nFunction: form.create, unmount.`;
                notify({
                    'title': 'Form Unmount Error',
                    'content': msg,
                    'type': 'danger'
                });
                console.log('Form Unmount Error', msg, err);
            }
            rtn.vapp._container.remove();
            (_b = exports.elements.popList.querySelector('[data-form-id="' + rtn.vroot.formId + '"]')) === null || _b === void 0 ? void 0 : _b.remove();
            dom.clearWatchStyle(rtn.vroot.formId);
            dom.clearWatchProperty(rtn.vroot.formId);
            dom.clearWatchPosition(rtn.vroot.formId);
            native.clear(formId, t.id);
            dom.removeStyle(rtn.vroot.taskId, 'form', rtn.vroot.formId);
            throw err;
        }
        core.trigger('formCreated', t.id, formId, rtn.vroot.$refs.form.title, rtn.vroot.$refs.form.iconDataUrl, rtn.vroot.showInSystemTask);
        if (rtn.vroot.isNativeSync) {
            yield native.invoke('cg-set-size', native.getToken(), rtn.vroot.$refs.form.$el.offsetWidth, rtn.vroot.$refs.form.$el.offsetHeight);
            window.addEventListener('resize', function () {
                rtn.vroot.$refs.form.setPropData('width', window.innerWidth);
                rtn.vroot.$refs.form.setPropData('height', window.innerHeight);
            });
        }
        rtn.vroot.isReady = true;
        for (const cb of cbs) {
            cb.call(rtn.vroot);
        }
        return rtn.vroot;
    });
}
function dialog(opt) {
    return new Promise(function (resolve) {
        var _a, _b, _c, _d;
        if (typeof opt === 'string') {
            opt = {
                'content': opt
            };
        }
        const filename = tool.urlResolve((_a = opt.path) !== null && _a !== void 0 ? _a : '/', './tmp' + (Math.random() * 100000000000000).toFixed() + '.js');
        const nopt = opt;
        const taskId = nopt.taskId;
        if (!taskId) {
            resolve('');
            return;
        }
        const t = task.list[taskId];
        if (!t) {
            resolve('');
            return;
        }
        const locale = t.locale.lang || core.config.locale;
        if (nopt.buttons === undefined) {
            nopt.buttons = [(_c = (_b = info.locale[locale]) === null || _b === void 0 ? void 0 : _b.ok) !== null && _c !== void 0 ? _c : info.locale['en'].ok];
        }
        const cls = class extends AbstractForm {
            constructor() {
                var _a, _b;
                super(...arguments);
                this.buttons = nopt.buttons;
                this.data = (_a = nopt.data) !== null && _a !== void 0 ? _a : {};
                this.methods = (_b = nopt.methods) !== null && _b !== void 0 ? _b : {};
            }
            get filename() {
                return filename;
            }
            get taskId() {
                return taskId;
            }
            select(button) {
                const event = {
                    'go': true,
                    preventDefault: function () {
                        this.go = false;
                    },
                    'detail': {
                        'button': button
                    }
                };
                if (nopt.select) {
                    nopt.select.call(this, event, button);
                }
                if (event.go) {
                    if (nopt.autoDialogResult !== false) {
                        this.dialogResult = button;
                    }
                    close(this.formId);
                }
            }
        };
        create(cls, undefined, {
            'layout': `<form title="${(_d = nopt.title) !== null && _d !== void 0 ? _d : 'dialog'}" min="false" max="false" resize="false" height="0" width="0" border="${nopt.title ? 'normal' : 'plain'}" direction="v"><dialog :buttons="buttons" @select="select"${nopt.direction ? ` direction="${nopt.direction}"` : ''}${nopt.gutter ? ` gutter="${nopt.gutter}"` : ''}>${nopt.content}</dialog></form>`,
            'style': nopt.style
        }, t.id).then((frm) => {
            if (typeof frm === 'number') {
                resolve('');
                return;
            }
            frm.showDialog().then((v) => {
                resolve(v);
            }).catch(() => {
                resolve('');
            });
        }).catch(() => {
            resolve('');
        });
    });
}
function confirm(opt) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        if (typeof opt === 'string') {
            opt = {
                'content': opt
            };
        }
        const taskId = opt.taskId;
        if (!taskId) {
            return false;
        }
        const t = task.list[taskId];
        if (!t) {
            return false;
        }
        const locale = t.locale.lang || core.config.locale;
        const buttons = [(_b = (_a = info.locale[locale]) === null || _a === void 0 ? void 0 : _a.no) !== null && _b !== void 0 ? _b : info.locale['en'].no, (_d = (_c = info.locale[locale]) === null || _c === void 0 ? void 0 : _c.yes) !== null && _d !== void 0 ? _d : info.locale['en'].yes];
        if (opt.cancel) {
            buttons.unshift((_f = (_e = info.locale[locale]) === null || _e === void 0 ? void 0 : _e.cancel) !== null && _f !== void 0 ? _f : info.locale['en'].cancel);
        }
        const res = yield dialog({
            'taskId': taskId,
            'title': opt.title,
            'content': opt.content,
            'buttons': buttons
        });
        if (res === ((_h = (_g = info.locale[locale]) === null || _g === void 0 ? void 0 : _g.yes) !== null && _h !== void 0 ? _h : info.locale['en'].yes)) {
            return true;
        }
        if (res === ((_k = (_j = info.locale[locale]) === null || _j === void 0 ? void 0 : _j.cancel) !== null && _k !== void 0 ? _k : info.locale['en'].cancel)) {
            return 0;
        }
        return false;
    });
}
function prompt(opt) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e;
        if (typeof opt === 'string') {
            opt = {
                'content': opt
            };
        }
        const taskId = opt.taskId;
        if (!taskId) {
            return '';
        }
        const t = task.list[taskId];
        if (!t) {
            return '';
        }
        const locale = t.locale.lang || core.config.locale;
        const buttons = [(_b = (_a = info.locale[locale]) === null || _a === void 0 ? void 0 : _a.ok) !== null && _b !== void 0 ? _b : info.locale['en'].ok];
        const cancelBtn = (_d = (_c = info.locale[locale]) === null || _c === void 0 ? void 0 : _c.cancel) !== null && _d !== void 0 ? _d : info.locale['en'].cancel;
        if (opt.cancel === true || opt.cancel === undefined) {
            buttons.unshift(cancelBtn);
        }
        const res = yield dialog({
            'taskId': taskId,
            'title': opt.title,
            'direction': 'v',
            'gutter': 10,
            'content': '<block>' + opt.content + '</block><text v-model="data.text" />',
            'data': {
                'text': (_e = opt.text) !== null && _e !== void 0 ? _e : ''
            },
            'select': function (e, button) {
                var _a;
                const event = {
                    'go': true,
                    preventDefault: function () {
                        this.go = false;
                    },
                    'detail': {
                        'button': button,
                        'value': this.data.text
                    }
                };
                (_a = opt.select) === null || _a === void 0 ? void 0 : _a.call(this, event, button);
                if (!event.go) {
                    e.preventDefault();
                }
                if (e.detail.button === cancelBtn) {
                    this.dialogResult = '';
                    return;
                }
                this.dialogResult = this.data.text;
            },
            'buttons': buttons,
            'autoDialogResult': false
        });
        return res;
    });
}
function flash(formId, taskId) {
    if (!taskId) {
        return;
    }
    const form = getForm(taskId, formId);
    if (!form) {
        return;
    }
    if (!form.vroot._formFocus) {
        changeFocus(form.id);
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
    core.trigger('formFlash', taskId, formId);
}
function showLauncher() {
    exports.elements.launcher.style.display = 'flex';
    requestAnimationFrame(function () {
        exports.elements.launcher.classList.add('cg-show');
    });
}
function hideLauncher() {
    exports.elements.launcher.classList.remove('cg-show');
    setTimeout(function () {
        if (exports.launcherRoot.folderName !== '') {
            exports.launcherRoot.closeFolder();
        }
        exports.launcherRoot.name = '';
        exports.elements.launcher.style.display = 'none';
    }, 300);
}
window.addEventListener('resize', function () {
    task.refreshSystemPosition();
});

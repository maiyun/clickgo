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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.mount = mount;
exports.unmount = unmount;
exports.getContent = getContent;
exports.putContent = putContent;
exports.readLink = readLink;
exports.symlink = symlink;
exports.unlink = unlink;
exports.stats = stats;
exports.isDir = isDir;
exports.isFile = isFile;
exports.mkdir = mkdir;
exports.rmdir = rmdir;
exports.rmdirDeep = rmdirDeep;
exports.chmod = chmod;
exports.rename = rename;
exports.readDir = readDir;
exports.copyFolder = copyFolder;
exports.copyFile = copyFile;
const tool = __importStar(require("./tool"));
const task = __importStar(require("./task"));
const form = __importStar(require("./form"));
const core = __importStar(require("./core"));
const native = __importStar(require("./native"));
const clickgoFiles = ['/app/', '/app/demo/', '/app/demo/app.js', '/app/demo/config.json', '/app/demo/form/', '/app/demo/form/control/', '/app/demo/form/control/alayout2/', '/app/demo/form/control/alayout2/alayout2.js', '/app/demo/form/control/alayout2/alayout2.xml', '/app/demo/form/control/alert/', '/app/demo/form/control/alert/alert.js', '/app/demo/form/control/alert/alert.xml', '/app/demo/form/control/arteditor/', '/app/demo/form/control/arteditor/arteditor.js', '/app/demo/form/control/arteditor/arteditor.xml', '/app/demo/form/control/arteditor/img.js', '/app/demo/form/control/arteditor/img.xml', '/app/demo/form/control/block/', '/app/demo/form/control/block/block.css', '/app/demo/form/control/block/block.xml', '/app/demo/form/control/box/', '/app/demo/form/control/box/box.js', '/app/demo/form/control/box/box.xml', '/app/demo/form/control/button/', '/app/demo/form/control/button/button.css', '/app/demo/form/control/button/button.js', '/app/demo/form/control/button/button.xml', '/app/demo/form/control/captcha/', '/app/demo/form/control/captcha/captcha.js', '/app/demo/form/control/captcha/captcha.xml', '/app/demo/form/control/check/', '/app/demo/form/control/check/check.js', '/app/demo/form/control/check/check.xml', '/app/demo/form/control/circle/', '/app/demo/form/control/circle/circle.xml', '/app/demo/form/control/content/', '/app/demo/form/control/content/content.js', '/app/demo/form/control/content/content.xml', '/app/demo/form/control/date/', '/app/demo/form/control/date/date.js', '/app/demo/form/control/date/date.xml', '/app/demo/form/control/datepanel/', '/app/demo/form/control/datepanel/datepanel.js', '/app/demo/form/control/datepanel/datepanel.xml', '/app/demo/form/control/daterange/', '/app/demo/form/control/daterange/daterange.js', '/app/demo/form/control/daterange/daterange.xml', '/app/demo/form/control/delete/', '/app/demo/form/control/delete/delete.js', '/app/demo/form/control/delete/delete.xml', '/app/demo/form/control/desc/', '/app/demo/form/control/desc/desc.js', '/app/demo/form/control/desc/desc.xml', '/app/demo/form/control/dialog/', '/app/demo/form/control/dialog/dialog.js', '/app/demo/form/control/dialog/dialog.xml', '/app/demo/form/control/drawer/', '/app/demo/form/control/drawer/drawer.js', '/app/demo/form/control/drawer/drawer.xml', '/app/demo/form/control/echarts/', '/app/demo/form/control/echarts/echarts.js', '/app/demo/form/control/echarts/echarts.xml', '/app/demo/form/control/empty/', '/app/demo/form/control/empty/empty.js', '/app/demo/form/control/empty/empty.xml', '/app/demo/form/control/file/', '/app/demo/form/control/file/file.js', '/app/demo/form/control/file/file.xml', '/app/demo/form/control/flow/', '/app/demo/form/control/flow/flow.css', '/app/demo/form/control/flow/flow.js', '/app/demo/form/control/flow/flow.xml', '/app/demo/form/control/form/', '/app/demo/form/control/form/form.css', '/app/demo/form/control/form/form.js', '/app/demo/form/control/form/form.xml', '/app/demo/form/control/grid/', '/app/demo/form/control/grid/grid.js', '/app/demo/form/control/grid/grid.xml', '/app/demo/form/control/group/', '/app/demo/form/control/group/group.js', '/app/demo/form/control/group/group.xml', '/app/demo/form/control/hske/', '/app/demo/form/control/hske/hske.js', '/app/demo/form/control/hske/hske.xml', '/app/demo/form/control/html/', '/app/demo/form/control/html/html.js', '/app/demo/form/control/html/html.xml', '/app/demo/form/control/icon/', '/app/demo/form/control/icon/icon.xml', '/app/demo/form/control/iconview/', '/app/demo/form/control/iconview/iconview.js', '/app/demo/form/control/iconview/iconview.xml', '/app/demo/form/control/img/', '/app/demo/form/control/img/img.xml', '/app/demo/form/control/imgviewer/', '/app/demo/form/control/imgviewer/imgviewer.js', '/app/demo/form/control/imgviewer/imgviewer.xml', '/app/demo/form/control/jodit/', '/app/demo/form/control/jodit/jodit.js', '/app/demo/form/control/jodit/jodit.xml', '/app/demo/form/control/label/', '/app/demo/form/control/label/label.js', '/app/demo/form/control/label/label.xml', '/app/demo/form/control/layout/', '/app/demo/form/control/layout/layout.js', '/app/demo/form/control/layout/layout.xml', '/app/demo/form/control/link/', '/app/demo/form/control/link/link.js', '/app/demo/form/control/link/link.xml', '/app/demo/form/control/list/', '/app/demo/form/control/list/list.css', '/app/demo/form/control/list/list.js', '/app/demo/form/control/list/list.xml', '/app/demo/form/control/loading/', '/app/demo/form/control/loading/loading.xml', '/app/demo/form/control/map/', '/app/demo/form/control/map/map.js', '/app/demo/form/control/map/map.xml', '/app/demo/form/control/marquee/', '/app/demo/form/control/marquee/marquee.js', '/app/demo/form/control/marquee/marquee.xml', '/app/demo/form/control/menu/', '/app/demo/form/control/menu/menu.js', '/app/demo/form/control/menu/menu.xml', '/app/demo/form/control/monaco/', '/app/demo/form/control/monaco/monaco.js', '/app/demo/form/control/monaco/monaco.xml', '/app/demo/form/control/mpegts/', '/app/demo/form/control/mpegts/mpegts.js', '/app/demo/form/control/mpegts/mpegts.xml', '/app/demo/form/control/nav/', '/app/demo/form/control/nav/nav.js', '/app/demo/form/control/nav/nav.xml', '/app/demo/form/control/page/', '/app/demo/form/control/page/page.js', '/app/demo/form/control/page/page.xml', '/app/demo/form/control/palette/', '/app/demo/form/control/palette/palette.js', '/app/demo/form/control/palette/palette.xml', '/app/demo/form/control/panel/', '/app/demo/form/control/panel/panel.js', '/app/demo/form/control/panel/panel.xml', '/app/demo/form/control/panel/test1.js', '/app/demo/form/control/panel/test1.xml', '/app/demo/form/control/panel/test2.xml', '/app/demo/form/control/pdf/', '/app/demo/form/control/pdf/pdf.js', '/app/demo/form/control/pdf/pdf.xml', '/app/demo/form/control/pdf/test.pdf', '/app/demo/form/control/progress/', '/app/demo/form/control/progress/progress.js', '/app/demo/form/control/progress/progress.xml', '/app/demo/form/control/property/', '/app/demo/form/control/property/property.js', '/app/demo/form/control/property/property.xml', '/app/demo/form/control/qrcode/', '/app/demo/form/control/qrcode/qrcode.js', '/app/demo/form/control/qrcode/qrcode.xml', '/app/demo/form/control/radio/', '/app/demo/form/control/radio/radio.js', '/app/demo/form/control/radio/radio.xml', '/app/demo/form/control/scroll/', '/app/demo/form/control/scroll/scroll.js', '/app/demo/form/control/scroll/scroll.xml', '/app/demo/form/control/select/', '/app/demo/form/control/select/select.js', '/app/demo/form/control/select/select.xml', '/app/demo/form/control/setting/', '/app/demo/form/control/setting/setting.xml', '/app/demo/form/control/sgroup/', '/app/demo/form/control/sgroup/sgroup.xml', '/app/demo/form/control/step/', '/app/demo/form/control/step/step.js', '/app/demo/form/control/step/step.xml', '/app/demo/form/control/svg/', '/app/demo/form/control/svg/svg.js', '/app/demo/form/control/svg/svg.xml', '/app/demo/form/control/switch/', '/app/demo/form/control/switch/switch.js', '/app/demo/form/control/switch/switch.xml', '/app/demo/form/control/tab/', '/app/demo/form/control/tab/tab.js', '/app/demo/form/control/tab/tab.xml', '/app/demo/form/control/table/', '/app/demo/form/control/table/table.js', '/app/demo/form/control/table/table.xml', '/app/demo/form/control/tag/', '/app/demo/form/control/tag/tag.js', '/app/demo/form/control/tag/tag.xml', '/app/demo/form/control/text/', '/app/demo/form/control/text/text.js', '/app/demo/form/control/text/text.xml', '/app/demo/form/control/timeline/', '/app/demo/form/control/timeline/timeline.js', '/app/demo/form/control/timeline/timeline.xml', '/app/demo/form/control/tip/', '/app/demo/form/control/tip/tip.js', '/app/demo/form/control/tip/tip.xml', '/app/demo/form/control/tplink/', '/app/demo/form/control/tplink/tplink.js', '/app/demo/form/control/tplink/tplink.xml', '/app/demo/form/control/tuieditor/', '/app/demo/form/control/tuieditor/tuieditor.js', '/app/demo/form/control/tuieditor/tuieditor.xml', '/app/demo/form/control/tuiviewer/', '/app/demo/form/control/tuiviewer/tuiviewer.js', '/app/demo/form/control/tuiviewer/tuiviewer.xml', '/app/demo/form/control/uploader/', '/app/demo/form/control/uploader/uploader.js', '/app/demo/form/control/uploader/uploader.xml', '/app/demo/form/control/vflow/', '/app/demo/form/control/vflow/vflow.css', '/app/demo/form/control/vflow/vflow.js', '/app/demo/form/control/vflow/vflow.xml', '/app/demo/form/control/video/', '/app/demo/form/control/video/video.js', '/app/demo/form/control/video/video.xml', '/app/demo/form/control/web/', '/app/demo/form/control/web/web.js', '/app/demo/form/control/web/web.xml', '/app/demo/form/control/xterm/', '/app/demo/form/control/xterm/xterm.js', '/app/demo/form/control/xterm/xterm.xml', '/app/demo/form/event/', '/app/demo/form/event/form/', '/app/demo/form/event/form/form.css', '/app/demo/form/event/form/form.js', '/app/demo/form/event/form/form.xml', '/app/demo/form/event/other/', '/app/demo/form/event/other/other.js', '/app/demo/form/event/other/other.xml', '/app/demo/form/event/screen/', '/app/demo/form/event/screen/screen.js', '/app/demo/form/event/screen/screen.xml', '/app/demo/form/event/task/', '/app/demo/form/event/task/task.js', '/app/demo/form/event/task/task.xml', '/app/demo/form/main.css', '/app/demo/form/main.js', '/app/demo/form/main.xml', '/app/demo/form/method/', '/app/demo/form/method/acontrol/', '/app/demo/form/method/acontrol/acontrol.js', '/app/demo/form/method/acontrol/acontrol.xml', '/app/demo/form/method/aform/', '/app/demo/form/method/aform/aform.js', '/app/demo/form/method/aform/aform.xml', '/app/demo/form/method/aform/sd.js', '/app/demo/form/method/aform/sd.xml', '/app/demo/form/method/core/', '/app/demo/form/method/core/core.js', '/app/demo/form/method/core/core.xml', '/app/demo/form/method/dom/', '/app/demo/form/method/dom/dom.css', '/app/demo/form/method/dom/dom.js', '/app/demo/form/method/dom/dom.xml', '/app/demo/form/method/form/', '/app/demo/form/method/form/form.js', '/app/demo/form/method/form/form.xml', '/app/demo/form/method/form/test.xml', '/app/demo/form/method/fs/', '/app/demo/form/method/fs/fs.js', '/app/demo/form/method/fs/fs.xml', '/app/demo/form/method/fs/text.js', '/app/demo/form/method/fs/text.xml', '/app/demo/form/method/native/', '/app/demo/form/method/native/native.js', '/app/demo/form/method/native/native.xml', '/app/demo/form/method/storage/', '/app/demo/form/method/storage/storage.js', '/app/demo/form/method/storage/storage.xml', '/app/demo/form/method/system/', '/app/demo/form/method/system/system.js', '/app/demo/form/method/system/system.xml', '/app/demo/form/method/task/', '/app/demo/form/method/task/locale1.json', '/app/demo/form/method/task/locale2.json', '/app/demo/form/method/task/task.js', '/app/demo/form/method/task/task.xml', '/app/demo/form/method/theme/', '/app/demo/form/method/theme/theme.js', '/app/demo/form/method/theme/theme.xml', '/app/demo/form/method/tool/', '/app/demo/form/method/tool/tool.js', '/app/demo/form/method/tool/tool.xml', '/app/demo/form/method/zip/', '/app/demo/form/method/zip/zip.js', '/app/demo/form/method/zip/zip.xml', '/app/demo/form/solution/', '/app/demo/form/solution/backpanel/', '/app/demo/form/solution/backpanel/backpanel.js', '/app/demo/form/solution/backpanel/backpanel.xml', '/app/demo/global.css', '/app/demo/res/', '/app/demo/res/custombtn.cgc', '/app/demo/res/icon.svg', '/app/demo/res/img.jpg', '/app/demo/res/marker.svg', '/app/demo/res/r-1.svg', '/app/demo/res/r-2.svg', '/app/demo/res/sql.svg', '/app/demo/res/txt.svg', '/app/demo/res/video.mp4', '/app/demo/res/zip.svg', '/app/task/', '/app/task/app.js', '/app/task/config.json', '/app/task/form/', '/app/task/form/bar/', '/app/task/form/bar/bar.js', '/app/task/form/bar/bar.xml', '/app/task/form/desktop/', '/app/task/form/desktop/desktop.xml', '/app/task/locale/', '/app/task/locale/en.json', '/app/task/locale/ja.json', '/app/task/locale/sc.json', '/app/task/locale/tc.json', '/clickgo.js', '/clickgo.ts', '/control/', '/control/arteditor.cgc', '/control/box.cgc', '/control/captcha.cgc', '/control/common.cgc', '/control/desc.cgc', '/control/drawer.cgc', '/control/echarts.cgc', '/control/form.cgc', '/control/iconview.cgc', '/control/jodit.cgc', '/control/map.cgc', '/control/monaco.cgc', '/control/mpegts.cgc', '/control/nav.cgc', '/control/page.cgc', '/control/pdf.cgc', '/control/property.cgc', '/control/qrcode.cgc', '/control/table.cgc', '/control/task.cgc', '/control/tplink.cgc', '/control/tuieditor.cgc', '/control/tuiviewer.cgc', '/control/web.cgc', '/control/xterm.cgc', '/ext/', '/ext/toastui-editor-all.min.js', '/ext/tplinkhd.min.js', '/global.css', '/icon.png', '/index.js', '/index.ts', '/lib/', '/lib/control.js', '/lib/control.ts', '/lib/core.js', '/lib/core.ts', '/lib/dom.js', '/lib/dom.ts', '/lib/form.js', '/lib/form.ts', '/lib/fs.js', '/lib/fs.ts', '/lib/native.js', '/lib/native.ts', '/lib/storage.js', '/lib/storage.ts', '/lib/task.js', '/lib/task.ts', '/lib/theme.js', '/lib/theme.ts', '/lib/tool.js', '/lib/tool.ts', '/lib/zip.js', '/lib/zip.ts', '/notosans-regular.ttf', '/theme/', '/theme/blue.cgt', '/theme/byterun.cgt', '/theme/light.cgt'];
const localeData = {
    'en': {
        'apply-unmount': 'Are you sure to unmount the "?" mount point?',
    },
    'sc': {
        'apply-unmount': '确定卸载“?”挂载点吗？'
    },
    'tc': {
        'apply-unmount': '確定卸載「?」掛載點嗎？'
    },
    'ja': {
        'apply-unmount': '「?」マウントポイントをアンマウントしてよろしいですか？'
    },
    'ko': {
        'apply-unmount': '"?" 마운트 지점을 언마운트하시겠습니까?'
    },
    'th': {
        'apply-unmount': 'คุณแน่ใจหรือว่าต้องการยกเลิกการติดตั้งจุดติดตั้ง "?"'
    },
    'es': {
        'apply-unmount': '¿Está seguro de que desea desmontar el punto de montaje "?"'
    },
    'de': {
        'apply-unmount': 'Möchten Sie den Einhängepunkt "?" wirklich demontieren?'
    },
    'fr': {
        'apply-unmount': 'Voulez-vous vraiment démonter le point de montage "?"'
    },
    'pt': {
        'apply-unmount': 'Tem certeza de que deseja desmontar o ponto de montagem "?"'
    },
    'ru': {
        'apply-unmount': 'Вы уверены, что хотите отмонтировать точку монтирования "?"'
    },
    'vi': {
        'apply-unmount': 'Bạn có chắc chắn muốn tháo dỡ điểm gắn "?" không?'
    }
};
const mounts = {};
function getMountName(path) {
    const io = path.slice(9).indexOf('/');
    return io === -1 ? path.slice(9) : path.slice(9, io + 9);
}
function mount(name, handler, taskId) {
    if (mounts[name]) {
        return false;
    }
    if (!/^[a-zA-Z][\w]+$/.test(name)) {
        return false;
    }
    if (taskId) {
        const t = task.list[taskId];
        if (t) {
            const val = 'fs./mounted/' + name + '/w';
            if (!t.runtime.permissions.includes(val)) {
                t.runtime.permissions.push(val);
            }
        }
    }
    handler.date = new Date();
    mounts[name] = handler;
    return true;
}
function unmount(name) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        if (!mounts[name]) {
            return true;
        }
        const loc = (_b = (_a = localeData[core.config.locale]) === null || _a === void 0 ? void 0 : _a['apply-unmount']) !== null && _b !== void 0 ? _b : localeData['en']['apply-unmount'];
        if (!(yield form.superConfirm(loc.replace('?', '/mount/' + tool.escapeHTML(name) + '/')))) {
            return false;
        }
        delete mounts[name];
        return true;
    });
}
function getContent(path, options, taskId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        path = tool.urlResolve('/', path);
        const fpath = path.slice(8);
        if (typeof options === 'string') {
            options = {
                'encoding': options
            };
        }
        else {
            options !== null && options !== void 0 ? options : (options = {});
        }
        const encoding = options.encoding;
        const start = options.start;
        const end = options.end;
        if (path.startsWith('/clickgo/') || path.startsWith('http:') || path.startsWith('https:') || path.startsWith('file:')) {
            let ourl = '';
            if (path.startsWith('/clickgo/')) {
                if (!clickgoFiles.includes(fpath)) {
                    return null;
                }
                ourl = tool.urlResolve(__dirname, './').slice(0, -1) + fpath;
            }
            else {
                ourl = path;
            }
            try {
                const rand = '?' + ((_a = options.cache) !== null && _a !== void 0 ? _a : Math.random().toString());
                let blob = null;
                const headers = {};
                if (start !== null && start !== void 0 ? start : end) {
                    headers['range'] = `bytes=${start !== null && start !== void 0 ? start : '0'}-${end !== null && end !== void 0 ? end : ''}`;
                }
                if (options.progress) {
                    blob = yield tool.request(ourl + (!ourl.startsWith(loader.cdn) ? rand : ''), {
                        'headers': headers,
                        'progress': options.progress,
                        'responseType': 'blob'
                    });
                }
                else {
                    blob = yield (yield fetch(ourl + (!ourl.startsWith(loader.cdn) ? rand : ''), {
                        'headers': headers
                    })).blob();
                }
                if (!blob) {
                    return null;
                }
                if (!encoding) {
                    return blob;
                }
                return yield new Promise(function (resolve) {
                    const fr = new FileReader();
                    fr.addEventListener('load', function () {
                        resolve(fr.result);
                    });
                    fr.readAsText(blob, encoding);
                });
            }
            catch (_d) {
                return null;
            }
        }
        else if (path.startsWith('/storage/') || path.startsWith('/mounted/')) {
            const r = yield task.checkPermission('fs.' + path + 'r', false, undefined, taskId);
            if (!r[0]) {
                return null;
            }
            if (path.startsWith('/mounted/')) {
                const name = getMountName(path);
                const hanlder = mounts[name];
                if (!hanlder) {
                    return null;
                }
                return (_c = (_b = hanlder.getContent) === null || _b === void 0 ? void 0 : _b.call(hanlder, path.slice(9 + name.length), options)) !== null && _c !== void 0 ? _c : null;
            }
            if (options.progress) {
                delete options.progress;
            }
            const rtn = yield native.invoke('cg-fs-getContent', native.getToken(), fpath, options);
            if (!rtn) {
                return null;
            }
            if (typeof rtn === 'string') {
                return rtn;
            }
            return new Blob([rtn], {
                'type': tool.getMimeByPath(path).mime
            });
        }
        else if (path.startsWith('/package/') || path.startsWith('/current/')) {
            if (!taskId) {
                return null;
            }
            if (path.startsWith('/current/')) {
                return getContent(task.list[taskId].current + fpath, options, taskId);
            }
            const file = task.list[taskId].app.files[fpath];
            if (!file) {
                return null;
            }
            if (typeof file === 'string') {
                return file;
            }
            if (!options.encoding) {
                if (start === undefined && end === undefined) {
                    return file;
                }
                return file.slice(start, end, file.type);
            }
            const encoding = options.encoding;
            return new Promise(function (resolve) {
                const fr = new FileReader();
                fr.addEventListener('load', function () {
                    resolve(fr.result);
                });
                fr.readAsText(file, encoding);
            });
        }
        else {
            return null;
        }
    });
}
function putContent(path_1, data_1) {
    return __awaiter(this, arguments, void 0, function* (path, data, options = {}, taskId) {
        var _a, _b;
        path = tool.urlResolve('/', path);
        const fpath = path.slice(8);
        if (path.startsWith('/clickgo/')) {
            return false;
        }
        else if (path.startsWith('/storage/') || path.startsWith('/mounted/')) {
            const r = yield task.checkPermission('fs.' + path + 'w', false, undefined, taskId);
            if (!r[0]) {
                return false;
            }
            if (path.startsWith('/mounted/')) {
                const name = getMountName(path);
                const hanlder = mounts[name];
                if (!hanlder) {
                    return false;
                }
                return (_b = (_a = hanlder.putContent) === null || _a === void 0 ? void 0 : _a.call(hanlder, path.slice(9 + name.length), data, options)) !== null && _b !== void 0 ? _b : false;
            }
            let buf = undefined;
            if (data instanceof Blob) {
                buf = new Uint8Array(yield data.arrayBuffer());
            }
            return native.invoke('cg-fs-putContent', native.getToken(), fpath, buf !== null && buf !== void 0 ? buf : data, options);
        }
        else if (path.startsWith('/package/')) {
            return false;
        }
        else if (path.startsWith('/current/')) {
            if (!taskId) {
                return false;
            }
            return putContent(task.list[taskId].current + fpath, data, options, taskId);
        }
        else {
            return false;
        }
    });
}
function readLink(path, encoding, taskId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        path = tool.urlResolve('/', path);
        const fpath = path.slice(8);
        if (path.startsWith('/clickgo/')) {
            return null;
        }
        else if (path.startsWith('/storage/') || path.startsWith('/mounted/')) {
            const r = yield task.checkPermission('fs.' + path + 'r', false, undefined, taskId);
            if (!r[0]) {
                return null;
            }
            if (path.startsWith('/mounted/')) {
                const name = getMountName(path);
                const hanlder = mounts[name];
                if (!hanlder) {
                    return null;
                }
                return (_b = (_a = hanlder.readLink) === null || _a === void 0 ? void 0 : _a.call(hanlder, path.slice(9 + name.length), encoding)) !== null && _b !== void 0 ? _b : null;
            }
            return native.invoke('cg-fs-readLink', native.getToken(), fpath, encoding);
        }
        else if (path.startsWith('/package/')) {
            return null;
        }
        else if (path.startsWith('/current/')) {
            if (!taskId) {
                return null;
            }
            return task.list[taskId].current;
        }
        else {
            return null;
        }
    });
}
function symlink(filePath, linkPath, type, taskId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        filePath = tool.urlResolve('/', filePath);
        linkPath = tool.urlResolve('/', linkPath);
        if (filePath.startsWith('/clickgo/')) {
            return false;
        }
        else if (filePath.startsWith('/storage/') || filePath.startsWith('/mounted/')) {
            const r = yield task.checkPermission('fs.' + filePath + 'w', false, undefined, taskId);
            if (!r[0]) {
                return false;
            }
            if (filePath.startsWith('/mounted/')) {
                const fname = getMountName(filePath);
                const lname = getMountName(linkPath);
                if (fname !== lname) {
                    return false;
                }
                const hanlder = mounts[fname];
                if (!hanlder) {
                    return false;
                }
                return (_b = (_a = hanlder.symlink) === null || _a === void 0 ? void 0 : _a.call(hanlder, filePath.slice(9 + fname.length), linkPath.slice(9 + fname.length), type)) !== null && _b !== void 0 ? _b : false;
            }
            return native.invoke('cg-fs-symlink', native.getToken(), filePath.slice(8), linkPath.slice(8), type);
        }
        else if (filePath.startsWith('/package/')) {
            return false;
        }
        else if (filePath.startsWith('/current/')) {
            if (!taskId) {
                return false;
            }
            if (linkPath.startsWith('/current/')) {
                linkPath = task.list[taskId].current + linkPath.slice(8);
            }
            return symlink(task.list[taskId].current + filePath.slice(8), linkPath, type, taskId);
        }
        else {
            return false;
        }
    });
}
function unlink(path, taskId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        path = tool.urlResolve('/', path);
        const fpath = path.slice(8);
        if (path.startsWith('/clickgo/')) {
            return false;
        }
        else if (path.startsWith('/storage/') || path.startsWith('/mounted/')) {
            const r = yield task.checkPermission('fs.' + path + 'w', false, undefined, taskId);
            if (!r[0]) {
                return false;
            }
            if (path.startsWith('/mounted/')) {
                const name = getMountName(path);
                const hanlder = mounts[name];
                if (!hanlder) {
                    return false;
                }
                return (_b = (_a = hanlder.unlink) === null || _a === void 0 ? void 0 : _a.call(hanlder, path.slice(9 + name.length))) !== null && _b !== void 0 ? _b : false;
            }
            return native.invoke('cg-fs-unlink', native.getToken(), fpath);
        }
        else if (path.startsWith('/package/')) {
            return false;
        }
        else if (path.startsWith('/current/')) {
            if (!taskId) {
                return false;
            }
            return unlink(task.list[taskId].current + fpath, taskId);
        }
        else {
            return false;
        }
    });
}
function getClickGoStats(path) {
    return __awaiter(this, void 0, void 0, function* () {
        if (path.endsWith('/')) {
            const date = new Date();
            const ms = date.getTime();
            return {
                isFile: function () {
                    return false;
                },
                isDirectory: function () {
                    return true;
                },
                isSymbolicLink: function () {
                    return false;
                },
                'size': 0,
                'blksize': 0,
                'atimeMs': ms,
                'mtimeMs': ms,
                'ctimeMs': ms,
                'birthtimeMs': ms,
                'atime': date,
                'mtime': date,
                'ctime': date,
                'birthtime': date
            };
        }
        else {
            try {
                const res = yield fetch(tool.urlResolve(__dirname, './').slice(0, -1) + path, {
                    'headers': {
                        'range': `bytes=0-1`
                    }
                });
                const hdate = res.headers.get('date');
                const hmdate = res.headers.get('last-modified');
                let hlength = res.headers.get('content-range');
                if (hlength) {
                    const lio = hlength.lastIndexOf('/');
                    hlength = hlength.slice(lio + 1);
                }
                let date = new Date();
                let mdate = date;
                if (hdate) {
                    date = new Date(hdate);
                }
                if (hmdate) {
                    mdate = new Date(hmdate);
                }
                const ms = date.getTime();
                const mms = mdate.getTime();
                return {
                    isFile: function () {
                        return true;
                    },
                    isDirectory: function () {
                        return false;
                    },
                    isSymbolicLink: function () {
                        return false;
                    },
                    'size': hlength ? parseInt(hlength) : 0,
                    'blksize': hlength ? parseInt(hlength) : 0,
                    'atimeMs': ms,
                    'mtimeMs': mms,
                    'ctimeMs': mms,
                    'birthtimeMs': ms,
                    'atime': date,
                    'mtime': mdate,
                    'ctime': mdate,
                    'birthtime': date
                };
            }
            catch (_a) {
                return null;
            }
        }
    });
}
function stats(path, taskId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        path = tool.urlResolve('/', path);
        if (path.endsWith('/')) {
            path = path.slice(0, -1);
        }
        if (['', '/clickgo', '/storage', '/mounted', '/package'].includes(path)) {
            const date = new Date();
            const ms = date.getTime();
            return {
                isFile: function () {
                    return false;
                },
                isDirectory: function () {
                    return true;
                },
                isSymbolicLink: function () {
                    return false;
                },
                'size': 0,
                'blksize': 0,
                'atimeMs': ms,
                'mtimeMs': ms,
                'ctimeMs': ms,
                'birthtimeMs': ms,
                'atime': date,
                'mtime': date,
                'ctime': date,
                'birthtime': date
            };
        }
        if (path === '/current') {
            const date = new Date();
            const ms = date.getTime();
            return {
                isFile: function () {
                    return false;
                },
                isDirectory: function () {
                    return false;
                },
                isSymbolicLink: function () {
                    return true;
                },
                'size': 0,
                'blksize': 0,
                'atimeMs': ms,
                'mtimeMs': ms,
                'ctimeMs': ms,
                'birthtimeMs': ms,
                'atime': date,
                'mtime': date,
                'ctime': date,
                'birthtime': date
            };
        }
        let fpath = path.slice(8);
        if (path.startsWith('/clickgo/')) {
            if (!clickgoFiles.includes(fpath)) {
                if (!clickgoFiles.includes(fpath + '/')) {
                    return null;
                }
                fpath += '/';
            }
            return getClickGoStats(fpath);
        }
        else if (path.startsWith('/storage/')) {
            const r = yield task.checkPermission('fs.' + path + 'r', false, undefined, taskId);
            if (!r[0]) {
                return null;
            }
            const item = yield native.invoke('cg-fs-stats', native.getToken(), fpath);
            if (!item) {
                return null;
            }
            return {
                isFile: function () {
                    return item.isFile;
                },
                isDirectory: function () {
                    return item.isDirectory;
                },
                isSymbolicLink: function () {
                    return item.isSymbolicLink;
                },
                'size': item.size,
                'blksize': item.blksize,
                'atimeMs': item.atimeMs,
                'mtimeMs': item.mtimeMs,
                'ctimeMs': item.ctimeMs,
                'birthtimeMs': item.birthtimeMs,
                'atime': item.atime,
                'mtime': item.mtime,
                'ctime': item.ctime,
                'birthtime': item.birthtime
            };
        }
        else if (path.startsWith('/mounted/')) {
            const name = getMountName(path);
            const hanlder = mounts[name];
            if (!hanlder) {
                return null;
            }
            if (path === '/mounted/' + name) {
                const ms = hanlder.date.getTime();
                return {
                    isFile: function () {
                        return false;
                    },
                    isDirectory: function () {
                        return true;
                    },
                    isSymbolicLink: function () {
                        return false;
                    },
                    'size': 0,
                    'blksize': 0,
                    'atimeMs': ms,
                    'mtimeMs': ms,
                    'ctimeMs': ms,
                    'birthtimeMs': ms,
                    'atime': hanlder.date,
                    'mtime': hanlder.date,
                    'ctime': hanlder.date,
                    'birthtime': hanlder.date
                };
            }
            const r = yield task.checkPermission('fs.' + path + 'r', false, undefined, taskId);
            if (!r[0]) {
                return null;
            }
            return (_b = (_a = hanlder.stats) === null || _a === void 0 ? void 0 : _a.call(hanlder, path.slice(9 + name.length))) !== null && _b !== void 0 ? _b : null;
        }
        else if (path.startsWith('/package/') || path.startsWith('/current/')) {
            if (!taskId) {
                return null;
            }
            if (path.startsWith('/current/')) {
                return stats(task.list[taskId].current + fpath, taskId);
            }
            if (task.list[taskId].app.files[fpath]) {
                const file = task.list[taskId].app.files[fpath];
                const date = new Date();
                const ms = date.getTime();
                let size = 0;
                if (typeof file !== 'string') {
                    size = file.size;
                }
                else {
                    size = new Blob([file]).size;
                }
                return {
                    isFile: function () {
                        return true;
                    },
                    isDirectory: function () {
                        return false;
                    },
                    isSymbolicLink: function () {
                        return false;
                    },
                    'size': size,
                    'blksize': size,
                    'atimeMs': ms,
                    'mtimeMs': ms,
                    'ctimeMs': ms,
                    'birthtimeMs': ms,
                    'atime': date,
                    'mtime': date,
                    'ctime': date,
                    'birthtime': date
                };
            }
            if (!fpath.endsWith('/')) {
                fpath += '/';
            }
            for (const p in task.list[taskId].app.files) {
                if (!p.startsWith(fpath)) {
                    continue;
                }
                const date = new Date();
                const ms = date.getTime();
                return {
                    isFile: function () {
                        return false;
                    },
                    isDirectory: function () {
                        return true;
                    },
                    isSymbolicLink: function () {
                        return false;
                    },
                    'size': 0,
                    'blksize': 0,
                    'atimeMs': ms,
                    'mtimeMs': ms,
                    'ctimeMs': ms,
                    'birthtimeMs': ms,
                    'atime': date,
                    'mtime': date,
                    'ctime': date,
                    'birthtime': date
                };
            }
            return null;
        }
        else {
            return null;
        }
    });
}
function isDir(path, taskId) {
    return __awaiter(this, void 0, void 0, function* () {
        const pstats = yield stats(path, taskId);
        if (!(pstats === null || pstats === void 0 ? void 0 : pstats.isDirectory())) {
            return false;
        }
        return pstats;
    });
}
function isFile(path, taskId) {
    return __awaiter(this, void 0, void 0, function* () {
        const pstats = yield stats(path, taskId);
        if (!(pstats === null || pstats === void 0 ? void 0 : pstats.isFile())) {
            return false;
        }
        return pstats;
    });
}
function mkdir(path_1) {
    return __awaiter(this, arguments, void 0, function* (path, mode = 0o755, taskId) {
        var _a, _b;
        path = tool.urlResolve('/', path);
        if (yield isDir(path, taskId)) {
            return true;
        }
        const fpath = path.slice(8);
        if (path.startsWith('/clickgo/')) {
            return false;
        }
        else if (path.startsWith('/storage/') || path.startsWith('/mounted/')) {
            const r = yield task.checkPermission('fs.' + path + 'w', false, undefined, taskId);
            if (!r[0]) {
                return false;
            }
            if (path.startsWith('/mounted/')) {
                const name = getMountName(path);
                const hanlder = mounts[name];
                if (!hanlder) {
                    return false;
                }
                return (_b = (_a = hanlder.mkdir) === null || _a === void 0 ? void 0 : _a.call(hanlder, path.slice(9 + name.length), mode)) !== null && _b !== void 0 ? _b : false;
            }
            return native.invoke('cg-fs-mkdir', native.getToken(), fpath, mode);
        }
        else if (path.startsWith('/package/')) {
            return false;
        }
        else if (path.startsWith('/current/')) {
            if (!taskId) {
                return false;
            }
            return mkdir(task.list[taskId].current + fpath, mode, taskId);
        }
        else {
            return false;
        }
    });
}
function rmdir(path, taskId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        path = tool.urlResolve('/', path);
        const fpath = path.slice(8);
        if (path.startsWith('/clickgo/')) {
            return false;
        }
        else if (path.startsWith('/storage/') || path.startsWith('/mounted/')) {
            const r = yield task.checkPermission('fs.' + path + 'w', false, undefined, taskId);
            if (!r[0]) {
                return false;
            }
            if (path.startsWith('/mounted/')) {
                const name = getMountName(path);
                const hanlder = mounts[name];
                if (!hanlder) {
                    return false;
                }
                return (_b = (_a = hanlder.rmdir) === null || _a === void 0 ? void 0 : _a.call(hanlder, path.slice(9 + name.length))) !== null && _b !== void 0 ? _b : false;
            }
            return native.invoke('cg-fs-rmdir', native.getToken(), fpath);
        }
        else if (path.startsWith('/package/')) {
            return false;
        }
        else if (path.startsWith('/current/')) {
            if (!taskId) {
                return false;
            }
            return rmdir(task.list[taskId].current + fpath, taskId);
        }
        else {
            return false;
        }
    });
}
function rmdirDeep(path, taskId) {
    return __awaiter(this, void 0, void 0, function* () {
        path = tool.urlResolve('/', path);
        if (!path.endsWith('/')) {
            path += '/';
        }
        const list = yield readDir(path, undefined, taskId);
        for (const item of list) {
            const stat = yield stats(path + item.name, taskId);
            if (!stat) {
                return false;
            }
            if (stat.isDirectory()) {
                const rtn = yield rmdirDeep(path + item.name, taskId);
                if (!rtn) {
                    return false;
                }
            }
            else {
                const rtn = yield unlink(path + item.name, taskId);
                if (!rtn) {
                    return false;
                }
            }
        }
        return rmdir(path, taskId);
    });
}
function chmod(path, mod, taskId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        path = tool.urlResolve('/', path);
        const fpath = path.slice(8);
        if (path.startsWith('/clickgo/')) {
            return false;
        }
        else if (path.startsWith('/storage/') || path.startsWith('/mounted/')) {
            const r = yield task.checkPermission('fs.' + path + 'w', false, undefined, taskId);
            if (!r[0]) {
                return false;
            }
            if (path.startsWith('/mounted/')) {
                const name = getMountName(path);
                const hanlder = mounts[name];
                if (!hanlder) {
                    return false;
                }
                return (_b = (_a = hanlder.chmod) === null || _a === void 0 ? void 0 : _a.call(hanlder, path.slice(9 + name.length), mod)) !== null && _b !== void 0 ? _b : false;
            }
            return native.invoke('cg-fs-chmod', native.getToken(), fpath, mod);
        }
        else if (path.startsWith('/package/')) {
            return false;
        }
        else if (path.startsWith('/current/')) {
            if (!taskId) {
                return false;
            }
            return chmod(task.list[taskId].current + fpath, mod, taskId);
        }
        else {
            return false;
        }
    });
}
function rename(oldPath, newPath, taskId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        oldPath = tool.urlResolve('/', oldPath);
        newPath = tool.urlResolve('/', newPath);
        if (!oldPath.startsWith(newPath.slice(0, 9))) {
            return false;
        }
        const ofpath = oldPath.slice(8);
        const nfpath = newPath.slice(8);
        if (oldPath.startsWith('/clickgo/')) {
            return false;
        }
        else if (oldPath.startsWith('/storage/') || oldPath.startsWith('/mounted/')) {
            let r = yield task.checkPermission('fs.' + oldPath + 'w', false, undefined, taskId);
            if (!r[0]) {
                return false;
            }
            r = yield task.checkPermission('fs.' + newPath + 'w', false, undefined, taskId);
            if (!r[0]) {
                return false;
            }
            if (oldPath.startsWith('/mounted/')) {
                const fname = getMountName(oldPath);
                const lname = getMountName(newPath);
                if (fname !== lname) {
                    return false;
                }
                const hanlder = mounts[fname];
                if (!hanlder) {
                    return false;
                }
                return (_b = (_a = hanlder.rename) === null || _a === void 0 ? void 0 : _a.call(hanlder, oldPath.slice(9 + fname.length), newPath.slice(9 + fname.length))) !== null && _b !== void 0 ? _b : false;
            }
            return native.invoke('cg-fs-rename', native.getToken(), ofpath, nfpath);
        }
        else if (oldPath.startsWith('/package/')) {
            return false;
        }
        else if (oldPath.startsWith('/current/')) {
            if (!taskId) {
                return false;
            }
            return rename(task.list[taskId].current + ofpath, task.list[taskId].current + nfpath, taskId);
        }
        else {
            return false;
        }
    });
}
function readDir(path, encoding, taskId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        path = tool.urlResolve('/', path);
        if (path === '/') {
            const list = [
                {
                    isFile: function () {
                        return false;
                    },
                    isDirectory: function () {
                        return true;
                    },
                    isSymbolicLink: function () {
                        return false;
                    },
                    'name': 'clickgo'
                },
                {
                    isFile: function () {
                        return false;
                    },
                    isDirectory: function () {
                        return true;
                    },
                    isSymbolicLink: function () {
                        return false;
                    },
                    'name': 'storage'
                },
                {
                    isFile: function () {
                        return false;
                    },
                    isDirectory: function () {
                        return true;
                    },
                    isSymbolicLink: function () {
                        return false;
                    },
                    'name': 'mounted'
                }
            ];
            if (taskId) {
                list.push({
                    isFile: function () {
                        return false;
                    },
                    isDirectory: function () {
                        return true;
                    },
                    isSymbolicLink: function () {
                        return false;
                    },
                    'name': 'package'
                });
            }
            if (taskId) {
                list.push({
                    isFile: function () {
                        return false;
                    },
                    isDirectory: function () {
                        return false;
                    },
                    isSymbolicLink: function () {
                        return true;
                    },
                    'name': 'current'
                });
            }
            return list;
        }
        if (!path.endsWith('/')) {
            path += '/';
        }
        const fpath = path.slice(8);
        if (path.startsWith('/clickgo/')) {
            const list = [];
            for (const item of clickgoFiles) {
                if (!item.startsWith(fpath)) {
                    continue;
                }
                if (fpath === item) {
                    continue;
                }
                const rpath = item.slice(fpath.length);
                if (rpath.includes('/')) {
                    if (rpath.endsWith('/')) {
                        if (rpath.slice(0, -1).includes('/')) {
                            continue;
                        }
                        list.push({
                            isFile: function () {
                                return false;
                            },
                            isDirectory: function () {
                                return true;
                            },
                            isSymbolicLink: function () {
                                return false;
                            },
                            'name': rpath.slice(0, -1)
                        });
                    }
                    continue;
                }
                list.push({
                    isFile: function () {
                        return true;
                    },
                    isDirectory: function () {
                        return false;
                    },
                    isSymbolicLink: function () {
                        return false;
                    },
                    'name': rpath
                });
            }
            return list;
        }
        else if (path.startsWith('/storage/') || path.startsWith('/mounted/')) {
            const list = [];
            if (path === '/mounted/') {
                for (const name in mounts) {
                    list.push({
                        isFile: function () {
                            return false;
                        },
                        isDirectory: function () {
                            return true;
                        },
                        isSymbolicLink: function () {
                            return false;
                        },
                        'name': name
                    });
                }
                return list;
            }
            const r = yield task.checkPermission('fs.' + path + 'r', false, undefined, taskId);
            if (!r[0]) {
                return [];
            }
            if (path.startsWith('/mounted/')) {
                const name = getMountName(path);
                const hanlder = mounts[name];
                if (!hanlder) {
                    return [];
                }
                return (_b = (_a = hanlder.readDir) === null || _a === void 0 ? void 0 : _a.call(hanlder, path.slice(9 + name.length), encoding)) !== null && _b !== void 0 ? _b : [];
            }
            const ls = yield native.invoke('cg-fs-readDir', native.getToken(), fpath, encoding);
            for (const item of ls) {
                list.push({
                    isFile: function () {
                        return item.isFile;
                    },
                    isDirectory: function () {
                        return item.isDirectory;
                    },
                    isSymbolicLink: function () {
                        return item.isSymbolicLink;
                    },
                    'name': item.name
                });
            }
            return list;
        }
        else if (path.startsWith('/package/') || path.startsWith('/current/')) {
            if (!taskId) {
                return [];
            }
            if (path.startsWith('/current/')) {
                return readDir(task.list[taskId].current + fpath, encoding, taskId);
            }
            const list = [];
            const dirs = [];
            for (const p in task.list[taskId].app.files) {
                if (!p.startsWith(fpath)) {
                    continue;
                }
                const rpath = p.slice(fpath.length);
                const sio = rpath.indexOf('/');
                if (sio !== -1) {
                    const name = rpath.slice(0, sio);
                    if (!dirs.includes(name)) {
                        dirs.push(name);
                        list.push({
                            isFile: function () {
                                return false;
                            },
                            isDirectory: function () {
                                return true;
                            },
                            isSymbolicLink: function () {
                                return false;
                            },
                            'name': name
                        });
                    }
                    continue;
                }
                list.push({
                    isFile: function () {
                        return true;
                    },
                    isDirectory: function () {
                        return false;
                    },
                    isSymbolicLink: function () {
                        return false;
                    },
                    'name': rpath
                });
            }
            return list;
        }
        else {
            return [];
        }
    });
}
function copyFolder(from_1, to_1) {
    return __awaiter(this, arguments, void 0, function* (from, to, ignore = [], taskId) {
        let num = 0;
        if (!(yield isDir(from, taskId))) {
            return 0;
        }
        const flist = yield readDir(from, undefined, taskId);
        let checkTo = false;
        for (const item of flist) {
            if (item.isDirectory()) {
                const r = yield copyFolder(from + item.name + '/', to + item.name + '/', ignore, taskId);
                if (r === -1) {
                    return r;
                }
                else {
                    num += r;
                }
            }
            else if (item.isFile()) {
                if (ignore.length > 0 && tool.match(item.name, ignore)) {
                    continue;
                }
                if (!checkTo) {
                    if (!(yield mkdir(to, undefined, taskId))) {
                        return -1;
                    }
                    checkTo = true;
                }
                if (!(yield copyFile(from + item.name, to + item.name, taskId))) {
                    continue;
                }
                ++num;
            }
        }
        return num;
    });
}
function copyFile(src, dest, taskId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        src = tool.urlResolve('/', src);
        dest = tool.urlResolve('/', dest);
        if (!src.startsWith(dest.slice(0, 9))) {
            return false;
        }
        const sfpath = src.slice(8);
        const dfpath = dest.slice(8);
        if (src.startsWith('/clickgo/')) {
            return false;
        }
        else if (src.startsWith('/storage/') || dest.startsWith('/mounted/')) {
            let r = yield task.checkPermission('fs.' + src + 'r', false, undefined, taskId);
            if (!r[0]) {
                return false;
            }
            r = yield task.checkPermission('fs.' + dest + 'w', false, undefined, taskId);
            if (!r[0]) {
                return false;
            }
            if (src.startsWith('/mounted/')) {
                const fname = getMountName(src);
                const lname = getMountName(dest);
                if (fname !== lname) {
                    return false;
                }
                const hanlder = mounts[fname];
                if (!hanlder) {
                    return false;
                }
                return (_b = (_a = hanlder.copyFile) === null || _a === void 0 ? void 0 : _a.call(hanlder, src.slice(9 + fname.length), dest.slice(9 + fname.length))) !== null && _b !== void 0 ? _b : false;
            }
            return native.invoke('cg-fs-copyFile', native.getToken(), sfpath, dfpath);
        }
        else if (src.startsWith('/package/')) {
            return false;
        }
        else if (src.startsWith('/current/')) {
            if (!taskId) {
                return false;
            }
            return copyFile(task.list[taskId].current + sfpath, task.list[taskId].current + dfpath, taskId);
        }
        else {
            return false;
        }
    });
}

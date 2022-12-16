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
Object.defineProperty(exports, "__esModule", { value: true });
const clickgo = require("clickgo");
const button_1 = require("./control/button/button");
const check_1 = require("./control/check/check");
const dialog_1 = require("./control/dialog/dialog");
const file_1 = require("./control/file/file");
const form_1 = require("./control/form/form");
const list_1 = require("./control/list/list");
const marquee_1 = require("./control/marquee/marquee");
const menu_1 = require("./control/menu/menu");
const monaco_1 = require("./control/monaco/monaco");
const flow_1 = require("./control/flow/flow");
const property_1 = require("./control/property/property");
const radio_1 = require("./control/radio/radio");
const scroll_1 = require("./control/scroll/scroll");
const select_1 = require("./control/select/select");
const tab_1 = require("./control/tab/tab");
const text_1 = require("./control/text/text");
const vflow_1 = require("./control/vflow/vflow");
const form_2 = require("./event/form/form");
const other_1 = require("./event/other/other");
const screen_1 = require("./event/screen/screen");
const task_1 = require("./event/task/task");
const aform_1 = require("./method/aform/aform");
const core_1 = require("./method/core/core");
const dom_1 = require("./method/dom/dom");
const form_3 = require("./method/form/form");
const fs_1 = require("./method/fs/fs");
const native_1 = require("./method/native/native");
const system_1 = require("./method/system/system");
const task_2 = require("./method/task/task");
const theme_1 = require("./method/theme/theme");
const tool_1 = require("./method/tool/tool");
const zip_1 = require("./method/zip/zip");
class default_1 extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.ntab = '';
        this.test = 0;
    }
    onMounted() {
        return __awaiter(this, void 0, void 0, function* () {
            while (true) {
                yield clickgo.tool.sleep(2000);
                this.test += 1;
            }
        });
    }
    openForm(name) {
        return __awaiter(this, void 0, void 0, function* () {
            let frm = 0;
            switch (name) {
                case 'cblock': {
                    frm = yield this.createForm('control/block/block');
                    break;
                }
                case 'cbutton': {
                    frm = yield button_1.default.create();
                    break;
                }
                case 'ccheck': {
                    frm = yield check_1.default.create();
                    break;
                }
                case 'cdialog': {
                    frm = yield dialog_1.default.create();
                    break;
                }
                case 'cfile': {
                    frm = yield file_1.default.create();
                    break;
                }
                case 'cform': {
                    frm = yield form_1.default.create();
                    break;
                }
                case 'cvflow': {
                    frm = yield vflow_1.default.create();
                    break;
                }
                case 'cimg': {
                    frm = yield this.createForm('control/img/img');
                    break;
                }
                case 'clabel': {
                    frm = yield this.createForm('control/label/label');
                    break;
                }
                case 'clist': {
                    frm = yield list_1.default.create();
                    break;
                }
                case 'cloading': {
                    frm = yield this.createForm('control/loading/loading');
                    break;
                }
                case 'cmarquee': {
                    frm = yield marquee_1.default.create();
                    break;
                }
                case 'cmenu': {
                    frm = yield menu_1.default.create();
                    break;
                }
                case 'cmonaco': {
                    frm = yield monaco_1.default.create();
                    break;
                }
                case 'cflow': {
                    frm = yield flow_1.default.create();
                    break;
                }
                case 'cproperty': {
                    frm = yield property_1.default.create();
                    break;
                }
                case 'cradio': {
                    frm = yield radio_1.default.create();
                    break;
                }
                case 'cscroll': {
                    frm = yield scroll_1.default.create();
                    break;
                }
                case 'cselect': {
                    frm = yield select_1.default.create();
                    break;
                }
                case 'ctab': {
                    frm = yield tab_1.default.create();
                    break;
                }
                case 'ctext': {
                    frm = yield text_1.default.create();
                    break;
                }
                case 'eform': {
                    frm = yield form_2.default.create();
                    break;
                }
                case 'eother': {
                    frm = yield other_1.default.create();
                    break;
                }
                case 'escreen': {
                    frm = yield screen_1.default.create();
                    break;
                }
                case 'etask': {
                    frm = yield task_1.default.create();
                    break;
                }
                case 'aform': {
                    frm = yield aform_1.default.create();
                    break;
                }
                case 'mcore': {
                    frm = yield core_1.default.create();
                    break;
                }
                case 'mdom': {
                    frm = yield dom_1.default.create();
                    break;
                }
                case 'mform': {
                    frm = yield form_3.default.create();
                    break;
                }
                case 'mfs': {
                    frm = yield fs_1.default.create();
                    break;
                }
                case 'mnative': {
                    frm = yield native_1.default.create();
                    break;
                }
                case 'msystem': {
                    frm = yield system_1.default.create();
                    break;
                }
                case 'mtask': {
                    frm = yield task_2.default.create();
                    break;
                }
                case 'mtheme': {
                    frm = yield theme_1.default.create();
                    break;
                }
                case 'mtool': {
                    frm = yield tool_1.default.create();
                    break;
                }
                case 'mzip': {
                    frm = yield zip_1.default.create();
                    break;
                }
            }
            if (typeof frm === 'number') {
                return;
            }
            frm.show();
        });
    }
}
exports.default = default_1;

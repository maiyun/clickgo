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
const box_1 = require("./control/box/box");
const button_1 = require("~c/button/button");
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
    }
    openForm(name) {
        return __awaiter(this, void 0, void 0, function* () {
            let frm;
            switch (name) {
                case 'cblock': {
                    frm = yield clickgo.form.create('control/block/block', undefined, {
                        'path': this.filename
                    });
                    break;
                }
                case 'cbox': {
                    frm = yield clickgo.form.create(box_1.default);
                    break;
                }
                case 'cbutton': {
                    frm = yield clickgo.form.create(button_1.default);
                    break;
                }
                case 'ccheck': {
                    frm = yield clickgo.form.create(check_1.default);
                    break;
                }
                case 'cdialog': {
                    frm = yield clickgo.form.create(dialog_1.default);
                    break;
                }
                case 'cfile': {
                    frm = yield clickgo.form.create(file_1.default);
                    break;
                }
                case 'cform': {
                    frm = yield clickgo.form.create(form_1.default);
                    break;
                }
                case 'cvflow': {
                    frm = yield clickgo.form.create(vflow_1.default);
                    break;
                }
                case 'cimg': {
                    frm = yield clickgo.form.create('control/img/img', undefined, {
                        'path': this.filename
                    });
                    break;
                }
                case 'clabel': {
                    frm = yield clickgo.form.create('control/label/label', undefined, {
                        'path': this.filename
                    });
                    break;
                }
                case 'clist': {
                    frm = yield clickgo.form.create(list_1.default);
                    break;
                }
                case 'cloading': {
                    frm = yield clickgo.form.create('control/loading/loading', undefined, {
                        'path': this.filename
                    });
                    break;
                }
                case 'cmarquee': {
                    frm = yield clickgo.form.create(marquee_1.default);
                    break;
                }
                case 'cmenu': {
                    frm = yield clickgo.form.create(menu_1.default);
                    break;
                }
                case 'cmonaco': {
                    frm = yield clickgo.form.create(monaco_1.default);
                    break;
                }
                case 'cflow': {
                    frm = yield clickgo.form.create(flow_1.default);
                    break;
                }
                case 'cproperty': {
                    frm = yield clickgo.form.create(property_1.default);
                    break;
                }
                case 'cradio': {
                    frm = yield clickgo.form.create(radio_1.default);
                    break;
                }
                case 'cscroll': {
                    frm = yield clickgo.form.create(scroll_1.default);
                    break;
                }
                case 'cselect': {
                    frm = yield clickgo.form.create(select_1.default);
                    break;
                }
                case 'ctab': {
                    frm = yield clickgo.form.create(tab_1.default);
                    break;
                }
                case 'ctext': {
                    frm = yield clickgo.form.create(text_1.default);
                    break;
                }
                case 'eform': {
                    frm = yield clickgo.form.create(form_2.default);
                    break;
                }
                case 'eother': {
                    frm = yield clickgo.form.create(other_1.default);
                    break;
                }
                case 'escreen': {
                    frm = yield clickgo.form.create(screen_1.default);
                    break;
                }
                case 'etask': {
                    frm = yield clickgo.form.create(task_1.default);
                    break;
                }
                case 'aform': {
                    frm = yield clickgo.form.create(aform_1.default);
                    break;
                }
                case 'mcore': {
                    frm = yield clickgo.form.create(core_1.default);
                    break;
                }
                case 'mdom': {
                    frm = yield clickgo.form.create(dom_1.default);
                    break;
                }
                case 'mform': {
                    frm = yield clickgo.form.create(form_3.default);
                    break;
                }
                case 'mfs': {
                    frm = yield clickgo.form.create(fs_1.default);
                    break;
                }
                case 'mnative': {
                    frm = yield clickgo.form.create(native_1.default);
                    break;
                }
                case 'msystem': {
                    frm = yield clickgo.form.create(system_1.default);
                    break;
                }
                case 'mtask': {
                    frm = yield clickgo.form.create(task_2.default);
                    break;
                }
                case 'mtheme': {
                    frm = yield clickgo.form.create(theme_1.default);
                    break;
                }
                case 'mtool': {
                    frm = yield clickgo.form.create(tool_1.default);
                    break;
                }
                default: {
                    frm = yield clickgo.form.create(zip_1.default);
                }
            }
            frm.show();
        });
    }
}
exports.default = default_1;

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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clickgo = __importStar(require("clickgo"));
const alayout2_1 = __importDefault(require("./control/alayout2/alayout2"));
const grid_1 = __importDefault(require("./control/grid/grid"));
const box_1 = __importDefault(require("./control/box/box"));
const captcha_1 = __importDefault(require("./control/captcha/captcha"));
const button_1 = __importDefault(require("~c/button/button"));
const check_1 = __importDefault(require("./control/check/check"));
const datepanel_1 = __importDefault(require("./control/datepanel/datepanel"));
const calendar_1 = __importDefault(require("./control/calendar/calendar"));
const date_1 = __importDefault(require("./control/date/date"));
const daterange_1 = __importDefault(require("./control/daterange/daterange"));
const dialog_1 = __importDefault(require("./control/dialog/dialog"));
const drawer_1 = __importDefault(require("./control/drawer/drawer"));
const file_1 = __importDefault(require("./control/file/file"));
const form_1 = __importDefault(require("./control/form/form"));
const group_1 = __importDefault(require("./control/group/group"));
const html_1 = __importDefault(require("./control/html/html"));
const progress_1 = __importDefault(require("./control/progress/progress"));
const alert_1 = __importDefault(require("./control/alert/alert"));
const iconview_1 = __importDefault(require("./control/iconview/iconview"));
const link_1 = __importDefault(require("./control/link/link"));
const label_1 = __importDefault(require("./control/label/label"));
const palette_1 = __importDefault(require("./control/palette/palette"));
const layout_1 = __importDefault(require("./control/layout/layout"));
const hske_1 = __importDefault(require("./control/hske/hske"));
const list_1 = __importDefault(require("./control/list/list"));
const map_1 = __importDefault(require("./control/map/map"));
const marquee_1 = __importDefault(require("./control/marquee/marquee"));
const menu_1 = __importDefault(require("./control/menu/menu"));
const monaco_1 = __importDefault(require("./control/monaco/monaco"));
const desc_1 = __importDefault(require("./control/desc/desc"));
const nav_1 = __importDefault(require("./control/nav/nav"));
const page_1 = __importDefault(require("./control/page/page"));
const tag_1 = __importDefault(require("./control/tag/tag"));
const tip_1 = __importDefault(require("./control/tip/tip"));
const panel_1 = __importDefault(require("./control/panel/panel"));
const flow_1 = __importDefault(require("./control/flow/flow"));
const property_1 = __importDefault(require("./control/property/property"));
const qrcode_1 = __importDefault(require("./control/qrcode/qrcode"));
const radio_1 = __importDefault(require("./control/radio/radio"));
const switch_1 = __importDefault(require("./control/switch/switch"));
const scroll_1 = __importDefault(require("./control/scroll/scroll"));
const select_1 = __importDefault(require("./control/select/select"));
const uploader_1 = __importDefault(require("./control/uploader/uploader"));
const svg_1 = __importDefault(require("./control/svg/svg"));
const tab_1 = __importDefault(require("./control/tab/tab"));
const table_1 = __importDefault(require("./control/table/table"));
const text_1 = __importDefault(require("./control/text/text"));
const timeline_1 = __importDefault(require("./control/timeline/timeline"));
const vflow_1 = __importDefault(require("./control/vflow/vflow"));
const video_1 = __importDefault(require("./control/video/video"));
const mpegts_1 = __importDefault(require("./control/mpegts/mpegts"));
const imgviewer_1 = __importDefault(require("./control/imgviewer/imgviewer"));
const step_1 = __importDefault(require("./control/step/step"));
const xterm_1 = __importDefault(require("./control/xterm/xterm"));
const echarts_1 = __importDefault(require("./control/echarts/echarts"));
const empty_1 = __importDefault(require("./control/empty/empty"));
const jodit_1 = __importDefault(require("./control/jodit/jodit"));
const tuieditor_1 = __importDefault(require("./control/tuieditor/tuieditor"));
const tuiviewer_1 = __importDefault(require("./control/tuiviewer/tuiviewer"));
const arteditor_1 = __importDefault(require("./control/arteditor/arteditor"));
const content_1 = __importDefault(require("./control/content/content"));
const delete_1 = __importDefault(require("./control/delete/delete"));
const pdf_1 = __importDefault(require("./control/pdf/pdf"));
const web_1 = __importDefault(require("./control/web/web"));
const tplink_1 = __importDefault(require("./control/tplink/tplink"));
const novnc_1 = __importDefault(require("./control/novnc/novnc"));
const form_2 = __importDefault(require("./event/form/form"));
const other_1 = __importDefault(require("./event/other/other"));
const screen_1 = __importDefault(require("./event/screen/screen"));
const task_1 = __importDefault(require("./event/task/task"));
const aform_1 = __importDefault(require("./method/aform/aform"));
const acontrol_1 = __importDefault(require("./method/acontrol/acontrol"));
const core_1 = __importDefault(require("./method/core/core"));
const dom_1 = __importDefault(require("./method/dom/dom"));
const form_3 = __importDefault(require("./method/form/form"));
const fs_1 = __importDefault(require("./method/fs/fs"));
const native_1 = __importDefault(require("./method/native/native"));
const storage_1 = __importDefault(require("./method/storage/storage"));
const system_1 = __importDefault(require("./method/system/system"));
const task_2 = __importDefault(require("./method/task/task"));
const theme_1 = __importDefault(require("./method/theme/theme"));
const tool_1 = __importDefault(require("./method/tool/tool"));
const zip_1 = __importDefault(require("./method/zip/zip"));
const backpanel_1 = __importDefault(require("./solution/backpanel/backpanel"));
class default_1 extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.ntab = '';
        this.adata = {};
    }
    async openForm(name, data) {
        this.loading = true;
        let frm;
        switch (name) {
            case 'cblock': {
                frm = await clickgo.form.create('control/block/block', undefined, {
                    'path': this.filename
                });
                break;
            }
            case 'calayout2': {
                frm = await clickgo.form.create(alayout2_1.default);
                break;
            }
            case 'cgrid': {
                frm = await clickgo.form.create(grid_1.default);
                break;
            }
            case 'cbox': {
                frm = await clickgo.form.create(box_1.default);
                break;
            }
            case 'cbutton': {
                frm = await clickgo.form.create(button_1.default);
                break;
            }
            case 'ccheck': {
                frm = await clickgo.form.create(check_1.default);
                break;
            }
            case 'cdatepanel': {
                frm = await clickgo.form.create(datepanel_1.default);
                break;
            }
            case 'ccalendar': {
                frm = await clickgo.form.create(calendar_1.default);
                break;
            }
            case 'cdate': {
                frm = await clickgo.form.create(date_1.default);
                break;
            }
            case 'cdaterange': {
                frm = await clickgo.form.create(daterange_1.default);
                break;
            }
            case 'cdesc': {
                frm = await clickgo.form.create(desc_1.default);
                break;
            }
            case 'cdialog': {
                frm = await clickgo.form.create(dialog_1.default);
                break;
            }
            case 'cdrawer': {
                frm = await clickgo.form.create(drawer_1.default);
                break;
            }
            case 'cecharts': {
                frm = await clickgo.form.create(echarts_1.default);
                break;
            }
            case 'cempty': {
                frm = await clickgo.form.create(empty_1.default);
                break;
            }
            case 'cfile': {
                frm = await clickgo.form.create(file_1.default);
                break;
            }
            case 'cform': {
                frm = await clickgo.form.create(form_1.default);
                break;
            }
            case 'cgroup': {
                frm = await clickgo.form.create(group_1.default);
                break;
            }
            case 'chtml': {
                frm = await clickgo.form.create(html_1.default);
                break;
            }
            case 'cprogress': {
                frm = await clickgo.form.create(progress_1.default);
                break;
            }
            case 'ciconview': {
                frm = await clickgo.form.create(iconview_1.default);
                break;
            }
            case 'cvflow': {
                frm = await clickgo.form.create(vflow_1.default);
                break;
            }
            case 'cimgviewer': {
                frm = await clickgo.form.create(imgviewer_1.default);
                break;
            }
            case 'cvideo': {
                frm = await clickgo.form.create(video_1.default);
                break;
            }
            case 'cmpegts': {
                frm = await clickgo.form.create(mpegts_1.default);
                break;
            }
            case 'cstep': {
                frm = await clickgo.form.create(step_1.default);
                break;
            }
            case 'ctag': {
                frm = await clickgo.form.create(tag_1.default);
                break;
            }
            case 'csgroup': {
                frm = await clickgo.form.create('/form/control/sgroup/sgroup');
                break;
            }
            case 'csetting': {
                frm = await clickgo.form.create('/form/control/setting/setting');
                break;
            }
            case 'ctip': {
                frm = await clickgo.form.create(tip_1.default);
                break;
            }
            case 'cxterm': {
                frm = await clickgo.form.create(xterm_1.default);
                break;
            }
            case 'cimg': {
                frm = await clickgo.form.create('control/img/img', undefined, {
                    'path': this.filename
                });
                break;
            }
            case 'ccircle': {
                frm = await clickgo.form.create('control/circle/circle', undefined, {
                    'path': this.filename
                });
                break;
            }
            case 'ccontent': {
                frm = await clickgo.form.create(content_1.default);
                break;
            }
            case 'calert': {
                frm = await clickgo.form.create(alert_1.default);
                break;
            }
            case 'clink': {
                frm = await clickgo.form.create(link_1.default);
                break;
            }
            case 'clabel': {
                frm = await clickgo.form.create(label_1.default);
                break;
            }
            case 'cpalette': {
                frm = await clickgo.form.create(palette_1.default);
                break;
            }
            case 'clayout': {
                frm = await clickgo.form.create(layout_1.default);
                break;
            }
            case 'chske': {
                frm = await clickgo.form.create(hske_1.default);
                break;
            }
            case 'clist': {
                frm = await clickgo.form.create(list_1.default);
                break;
            }
            case 'cloading': {
                frm = await clickgo.form.create('control/loading/loading', undefined, {
                    'path': this.filename
                });
                break;
            }
            case 'cicon': {
                frm = await clickgo.form.create('control/icon/icon', undefined, {
                    'path': this.filename
                });
                break;
            }
            case 'cmap': {
                frm = await clickgo.form.create(map_1.default);
                break;
            }
            case 'cmarquee': {
                frm = await clickgo.form.create(marquee_1.default);
                break;
            }
            case 'cmenu': {
                frm = await clickgo.form.create(menu_1.default);
                break;
            }
            case 'cmonaco': {
                frm = await clickgo.form.create(monaco_1.default);
                break;
            }
            case 'cnav': {
                frm = await clickgo.form.create(nav_1.default);
                break;
            }
            case 'cpage': {
                frm = await clickgo.form.create(page_1.default);
                break;
            }
            case 'cpanel': {
                frm = await clickgo.form.create(panel_1.default);
                break;
            }
            case 'cflow': {
                frm = await clickgo.form.create(flow_1.default);
                break;
            }
            case 'cproperty': {
                frm = await clickgo.form.create(property_1.default);
                break;
            }
            case 'cqrcode': {
                frm = await clickgo.form.create(qrcode_1.default);
                break;
            }
            case 'cradio': {
                frm = await clickgo.form.create(radio_1.default);
                break;
            }
            case 'cswitch': {
                frm = await clickgo.form.create(switch_1.default);
                break;
            }
            case 'cscroll': {
                frm = await clickgo.form.create(scroll_1.default);
                break;
            }
            case 'cselect': {
                frm = await clickgo.form.create(select_1.default);
                break;
            }
            case 'cuploader': {
                frm = await clickgo.form.create(uploader_1.default);
                break;
            }
            case 'csvg': {
                frm = await clickgo.form.create(svg_1.default);
                break;
            }
            case 'ctab': {
                frm = await clickgo.form.create(tab_1.default);
                break;
            }
            case 'ctable': {
                frm = await clickgo.form.create(table_1.default);
                break;
            }
            case 'ctext': {
                frm = await clickgo.form.create(text_1.default);
                break;
            }
            case 'ctimeline': {
                frm = await clickgo.form.create(timeline_1.default);
                break;
            }
            case 'cjodit': {
                frm = await clickgo.form.create(jodit_1.default);
                break;
            }
            case 'ctuieditor': {
                frm = await clickgo.form.create(tuieditor_1.default);
                break;
            }
            case 'ctuiviewer': {
                frm = await clickgo.form.create(tuiviewer_1.default);
                break;
            }
            case 'carteditor': {
                frm = await clickgo.form.create(arteditor_1.default);
                break;
            }
            case 'cdelete': {
                frm = await clickgo.form.create(delete_1.default);
                break;
            }
            case 'cpdf': {
                frm = await clickgo.form.create(pdf_1.default);
                break;
            }
            case 'cweb': {
                frm = await clickgo.form.create(web_1.default);
                break;
            }
            case 'ctplink': {
                frm = await clickgo.form.create(tplink_1.default);
                break;
            }
            case 'cnovnc': {
                frm = await clickgo.form.create(novnc_1.default);
                break;
            }
            case 'ccaptcha': {
                frm = await clickgo.form.create(captcha_1.default);
                break;
            }
            case 'eform': {
                frm = await clickgo.form.create(form_2.default);
                break;
            }
            case 'eother': {
                frm = await clickgo.form.create(other_1.default);
                break;
            }
            case 'escreen': {
                frm = await clickgo.form.create(screen_1.default);
                break;
            }
            case 'etask': {
                frm = await clickgo.form.create(task_1.default);
                break;
            }
            case 'aform': {
                frm = await clickgo.form.create(aform_1.default);
                break;
            }
            case 'acontrol': {
                frm = await clickgo.form.create(acontrol_1.default);
                break;
            }
            case 'mcore': {
                frm = await clickgo.form.create(core_1.default);
                break;
            }
            case 'mdom': {
                frm = await clickgo.form.create(dom_1.default);
                break;
            }
            case 'mform': {
                frm = await clickgo.form.create(form_3.default);
                break;
            }
            case 'mfs': {
                frm = await clickgo.form.create(fs_1.default);
                break;
            }
            case 'mnative': {
                frm = await clickgo.form.create(native_1.default);
                break;
            }
            case 'mstorage': {
                frm = await clickgo.form.create(storage_1.default);
                break;
            }
            case 'msystem': {
                frm = await clickgo.form.create(system_1.default);
                break;
            }
            case 'mtask': {
                frm = await clickgo.form.create(task_2.default);
                break;
            }
            case 'mtheme': {
                frm = await clickgo.form.create(theme_1.default);
                break;
            }
            case 'mtool': {
                frm = await clickgo.form.create(tool_1.default);
                break;
            }
            case 'mzip': {
                frm = await clickgo.form.create(zip_1.default);
                break;
            }
            default: {
                frm = await clickgo.form.create(backpanel_1.default, data);
            }
        }
        this.loading = false;
        frm.show();
    }
    onMounted(data) {
        this.adata = data;
    }
}
exports.default = default_1;

import * as clickgo from 'clickgo';

import calayout2Frm from './control/alayout2/alayout2';
import cgridFrm from './control/grid/grid';
import cboxFrm from './control/box/box';
import ccaptchaFrm from './control/captcha/captcha';
import cbuttonFrm from './control/button/button';
import ccheckFrm from './control/check/check';
import cdatepanelFrm from './control/datepanel/datepanel';
import ccalendarFrm from './control/calendar/calendar';
import cdateFrm from './control/date/date';
import cdaterangeFrm from './control/daterange/daterange';
import cdialogFrm from './control/dialog/dialog';
import cdrawerFrm from './control/drawer/drawer';
import cfileFrm from './control/file/file';
import cformFrm from './control/form/form';
import cgroupFrm from './control/group/group';
import chtmlFrm from './control/html/html';
import cprogressFrm from './control/progress/progress';
import calertFrm from './control/alert/alert';
import ciconviewFrm from './control/iconview/iconview';
import clinkFrm from './control/link/link';
import clabelFrm from './control/label/label';
import cpaletteFrm from './control/palette/palette';
import clayoutFrm from './control/layout/layout';
import chskeFrm from './control/hske/hske';
import clistFrm from './control/list/list';
import cmapFrm from './control/map/map';
import cmarqueeFrm from './control/marquee/marquee';
import cmenuFrm from './control/menu/menu';
import cmonacoFrm from './control/monaco/monaco';
import cdescFrm from './control/desc/desc';
import cnavFrm from './control/nav/nav';
import cpageFrm from './control/page/page';
import ctagFrm from './control/tag/tag';
import ctipFrm from './control/tip/tip';
import cpanelFrm from './control/panel/panel';
import cflowFrm from './control/flow/flow';
import cpropertyFrm from './control/property/property';
import cqrcodeFrm from './control/qrcode/qrcode';
import cradioFrm from './control/radio/radio';
import cswitchFrm from './control/switch/switch';
import cscrollFrm from './control/scroll/scroll';
import cselectFrm from './control/select/select';
import cuploaderFrm from './control/uploader/uploader';
import csvgFrm from './control/svg/svg';
import ctabFrm from './control/tab/tab';
import ctableFrm from './control/table/table';
import ctextFrm from './control/text/text';
import ctimelineFrm from './control/timeline/timeline';
import cvflowFrm from './control/vflow/vflow';
import cvideoFrm from './control/video/video';
import cmpegtsFrm from './control/mpegts/mpegts';
import cimgviewerFrm from './control/imgviewer/imgviewer';
import cstepFrm from './control/step/step';
import cxtermFrm from './control/xterm/xterm';
import cechartsFrm from './control/echarts/echarts';
import cemptyFrm from './control/empty/empty';
import cjoditFrm from './control/jodit/jodit';
import ctuieditorFrm from './control/tuieditor/tuieditor';
import ctuiviewerFrm from './control/tuiviewer/tuiviewer';
import carteditorFrm from './control/arteditor/arteditor';
import ccontentFrm from './control/content/content';
import cdeleteFrm from './control/delete/delete';
import cpdfFrm from './control/pdf/pdf';
import cwebFrm from './control/web/web';
import ctplinkFrm from './control/tplink/tplink';
import ctumsFrm from './control/tums/tums';
import cnovncFrm from './control/novnc/novnc';
import cobjviewerFrm from './control/objviewer/objviewer';

import eformFrm from './event/form/form';
import eotherFrm from './event/other/other';
import escreenFrm from './event/screen/screen';
import etaskFrm from './event/task/task';

import aformFrm from './method/aform/aform';
import acontrolFrm from './method/acontrol/acontrol';
import mcoreFrm from './method/core/core';
import mdomFrm from './method/dom/dom';
import mformFrm from './method/form/form';
import mfsFrm from './method/fs/fs';
import mnativeFrm from './method/native/native';
import mstorageFrm from './method/storage/storage';
import msystemFrm from './method/system/system';
import mtaskFrm from './method/task/task';
import mthemeFrm from './method/theme/theme';
import mtoolFrm from './method/tool/tool';
import mzipFrm from './method/zip/zip';

import sbackpanelFrm from './solution/backpanel/backpanel';

export default class extends clickgo.form.AbstractForm {

    public ntab = '';

    public adata: any = {};

    public async openForm(name: string, data?: Record<string, string>): Promise<void> {
        this.loading = true;
        let frm: clickgo.form.AbstractForm;
        switch (name) {
            case 'cblock': {
                frm = await clickgo.form.create(this, 'control/block/block', undefined, {
                    'path': this.filename
                });
                break;
            }
            case 'calayout2': {
                frm = await clickgo.form.create(this, calayout2Frm);
                break;
            }
            case 'cgrid': {
                frm = await clickgo.form.create(this, cgridFrm);
                break;
            }
            case 'cbox': {
                frm = await clickgo.form.create(this, cboxFrm);
                break;
            }
            case 'cbutton': {
                frm = await clickgo.form.create(this, cbuttonFrm);
                break;
            }
            case 'ccheck': {
                frm = await clickgo.form.create(this, ccheckFrm);
                break;
            }
            case 'cdatepanel': {
                frm = await clickgo.form.create(this, cdatepanelFrm);
                break;
            }
            case 'ccalendar': {
                frm = await clickgo.form.create(this, ccalendarFrm);
                break;
            }
            case 'cdate': {
                frm = await clickgo.form.create(this, cdateFrm);
                break;
            }
            case 'cdaterange': {
                frm = await clickgo.form.create(this, cdaterangeFrm);
                break;
            }
            case 'cdesc': {
                frm = await clickgo.form.create(this, cdescFrm);
                break;
            }
            case 'cdialog': {
                frm = await clickgo.form.create(this, cdialogFrm);
                break;
            }
            case 'cdrawer': {
                frm = await clickgo.form.create(this, cdrawerFrm);
                break;
            }
            case 'cecharts': {
                frm = await clickgo.form.create(this, cechartsFrm);
                break;
            }
            case 'cempty': {
                frm = await clickgo.form.create(this, cemptyFrm);
                break;
            }
            case 'cfile': {
                frm = await clickgo.form.create(this, cfileFrm);
                break;
            }
            case 'cform': {
                frm = await clickgo.form.create(this, cformFrm);
                break;
            }
            case 'cgroup': {
                frm = await clickgo.form.create(this, cgroupFrm);
                break;
            }
            case 'chtml': {
                frm = await clickgo.form.create(this, chtmlFrm);
                break;
            }
            case 'cprogress': {
                frm = await clickgo.form.create(this, cprogressFrm);
                break;
            }
            case 'ciconview': {
                frm = await clickgo.form.create(this, ciconviewFrm);
                break;
            }
            case 'cvflow': {
                frm = await clickgo.form.create(this, cvflowFrm);
                break;
            }
            case 'cimgviewer': {
                frm = await clickgo.form.create(this, cimgviewerFrm);
                break;
            }
            case 'cvideo': {
                frm = await clickgo.form.create(this, cvideoFrm);
                break;
            }
            case 'cmpegts': {
                frm = await clickgo.form.create(this, cmpegtsFrm);
                break;
            }
            case 'cstep': {
                frm = await clickgo.form.create(this, cstepFrm);
                break;
            }
            case 'ctag': {
                frm = await clickgo.form.create(this, ctagFrm);
                break;
            }
            case 'csgroup': {
                frm = await clickgo.form.create(this, '/form/control/sgroup/sgroup');
                break;
            }
            case 'csetting': {
                frm = await clickgo.form.create(this, '/form/control/setting/setting');
                break;
            }
            case 'ctip': {
                frm = await clickgo.form.create(this, ctipFrm);
                break;
            }
            case 'cxterm': {
                frm = await clickgo.form.create(this, cxtermFrm);
                break;
            }
            case 'cimg': {
                frm = await clickgo.form.create(this, 'control/img/img', undefined, {
                    'path': this.filename
                });
                break;
            }
            case 'ccircle': {
                frm = await clickgo.form.create(this, 'control/circle/circle', undefined, {
                    'path': this.filename
                });
                break;
            }
            case 'ccontent': {
                frm = await clickgo.form.create(this, ccontentFrm);
                break;
            }
            case 'calert': {
                frm = await clickgo.form.create(this, calertFrm);
                break;
            }
            case 'clink': {
                frm = await clickgo.form.create(this, clinkFrm);
                break;
            }
            case 'clabel': {
                frm = await clickgo.form.create(this, clabelFrm);
                break;
            }
            case 'cpalette': {
                frm = await clickgo.form.create(this, cpaletteFrm);
                break;
            }
            case 'clayout': {
                frm = await clickgo.form.create(this, clayoutFrm);
                break;
            }
            case 'chske': {
                frm = await clickgo.form.create(this, chskeFrm);
                break;
            }
            case 'clist': {
                frm = await clickgo.form.create(this, clistFrm);
                break;
            }
            case 'cloading': {
                frm = await clickgo.form.create(this, 'control/loading/loading', undefined, {
                    'path': this.filename
                });
                break;
            }
            case 'cicon': {
                frm = await clickgo.form.create(this, 'control/icon/icon', undefined, {
                    'path': this.filename
                });
                break;
            }
            case 'cmap': {
                frm = await clickgo.form.create(this, cmapFrm);
                break;
            }
            case 'cmarquee': {
                frm = await clickgo.form.create(this, cmarqueeFrm);
                break;
            }
            case 'cmenu': {
                frm = await clickgo.form.create(this, cmenuFrm);
                break;
            }
            case 'cmonaco': {
                frm = await clickgo.form.create(this, cmonacoFrm);
                break;
            }
            case 'cnav': {
                frm = await clickgo.form.create(this, cnavFrm);
                break;
            }
            case 'cpage': {
                frm = await clickgo.form.create(this, cpageFrm);
                break;
            }
            case 'cpanel': {
                frm = await clickgo.form.create(this, cpanelFrm);
                break;
            }
            case 'cflow': {
                frm = await clickgo.form.create(this, cflowFrm);
                break;
            }
            case 'cproperty': {
                frm = await clickgo.form.create(this, cpropertyFrm);
                break;
            }
            case 'cqrcode': {
                frm = await clickgo.form.create(this, cqrcodeFrm);
                break;
            }
            case 'cradio': {
                frm = await clickgo.form.create(this, cradioFrm);
                break;
            }
            case 'cswitch': {
                frm = await clickgo.form.create(this, cswitchFrm);
                break;
            }
            case 'cscroll': {
                frm = await clickgo.form.create(this, cscrollFrm);
                break;
            }
            case 'cselect': {
                frm = await clickgo.form.create(this, cselectFrm);
                break;
            }
            case 'cuploader': {
                frm = await clickgo.form.create(this, cuploaderFrm);
                break;
            }
            case 'csvg': {
                frm = await clickgo.form.create(this, csvgFrm);
                break;
            }
            case 'ctab': {
                frm = await clickgo.form.create(this, ctabFrm);
                break;
            }
            case 'ctable': {
                frm = await clickgo.form.create(this, ctableFrm);
                break;
            }
            case 'ctext': {
                frm = await clickgo.form.create(this, ctextFrm);
                break;
            }
            case 'ctimeline': {
                frm = await clickgo.form.create(this, ctimelineFrm);
                break;
            }
            case 'cjodit': {
                frm = await clickgo.form.create(this, cjoditFrm);
                break;
            }
            case 'ctuieditor': {
                frm = await clickgo.form.create(this, ctuieditorFrm);
                break;
            }
            case 'ctuiviewer': {
                frm = await clickgo.form.create(this, ctuiviewerFrm);
                break;
            }
            case 'carteditor': {
                frm = await clickgo.form.create(this, carteditorFrm);
                break;
            }
            case 'cdelete': {
                frm = await clickgo.form.create(this, cdeleteFrm);
                break;
            }
            case 'cpdf': {
                frm = await clickgo.form.create(this, cpdfFrm);
                break;
            }
            case 'cweb': {
                frm = await clickgo.form.create(this, cwebFrm);
                break;
            }
            case 'ctplink': {
                frm = await clickgo.form.create(this, ctplinkFrm);
                break;
            }
            case 'ctums': {
                frm = await clickgo.form.create(this, ctumsFrm);
                break;
            }
            case 'cnovnc': {
                frm = await clickgo.form.create(this, cnovncFrm);
                break;
            }
            case 'ccaptcha': {
                frm = await clickgo.form.create(this, ccaptchaFrm);
                break;
            }
            case 'cobjviewer': {
                frm = await clickgo.form.create(this, cobjviewerFrm);
                break;
            }

            case 'eform': {
                frm = await clickgo.form.create(this, eformFrm);
                break;
            }
            case 'eother': {
                frm = await clickgo.form.create(this, eotherFrm);
                break;
            }
            case 'escreen': {
                frm = await clickgo.form.create(this, escreenFrm);
                break;
            }
            case 'etask': {
                frm = await clickgo.form.create(this, etaskFrm);
                break;
            }

            case 'aform': {
                frm = await clickgo.form.create(this, aformFrm);
                break;
            }
            case 'acontrol': {
                frm = await clickgo.form.create(this, acontrolFrm);
                break;
            }
            case 'mcore': {
                frm = await clickgo.form.create(this, mcoreFrm);
                break;
            }
            case 'mdom': {
                frm = await clickgo.form.create(this, mdomFrm);
                break;
            }
            case 'mform': {
                frm = await clickgo.form.create(this, mformFrm);
                break;
            }
            case 'mfs': {
                frm = await clickgo.form.create(this, mfsFrm);
                break;
            }
            case 'mnative': {
                frm = await clickgo.form.create(this, mnativeFrm);
                break;
            }
            case 'mstorage': {
                frm = await clickgo.form.create(this, mstorageFrm);
                break;
            }
            case 'msystem': {
                frm = await clickgo.form.create(this, msystemFrm);
                break;
            }
            case 'mtask': {
                frm = await clickgo.form.create(this, mtaskFrm);
                break;
            }
            case 'mtheme': {
                frm = await clickgo.form.create(this, mthemeFrm);
                break;
            }
            case 'mtool': {
                frm = await clickgo.form.create(this, mtoolFrm);
                break;
            }
            case 'mzip': {
                frm = await clickgo.form.create(this, mzipFrm);
                break;
            }
            default: {
                frm = await clickgo.form.create(this, sbackpanelFrm, data);
            }
        }
        this.loading = false;
        await frm.show();
    }

    public get language(): string {
        return clickgo.core.config.locale;
    }

    public onMounted(data: Record<string, any>): void {
        this.adata = data;
    }

    public changeToEn(): void {
        clickgo.core.config.locale = 'en';
    }

}

import * as clickgo from 'clickgo';
import * as types from '~/types/index';

import calayout2Frm from './control/alayout2/alayout2';
import cgridFrm from './control/grid/grid';
import cboxFrm from './control/box/box';
import cbuttonFrm from '~c/button/button';
import ccheckFrm from './control/check/check';
import cdatepanelFrm from './control/datepanel/datepanel';
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
        let frm: types.AbstractForm;
        switch (name) {
            case 'cblock': {
                frm = await clickgo.form.create('control/block/block', undefined, {
                    'path': this.filename
                });
                break;
            }
            case 'calayout2': {
                frm = await clickgo.form.create(calayout2Frm);
                break;
            }
            case 'cgrid': {
                frm = await clickgo.form.create(cgridFrm);
                break;
            }
            case 'cbox': {
                frm = await clickgo.form.create(cboxFrm);
                break;
            }
            case 'cbutton': {
                frm = await clickgo.form.create(cbuttonFrm);
                break;
            }
            case 'ccheck': {
                frm = await clickgo.form.create(ccheckFrm);
                break;
            }
            case 'cdatepanel': {
                frm = await clickgo.form.create(cdatepanelFrm);
                break;
            }
            case 'cdate': {
                frm = await clickgo.form.create(cdateFrm);
                break;
            }
            case 'cdaterange': {
                frm = await clickgo.form.create(cdaterangeFrm);
                break;
            }
            case 'cdesc': {
                frm = await clickgo.form.create(cdescFrm);
                break;
            }
            case 'cdialog': {
                frm = await clickgo.form.create(cdialogFrm);
                break;
            }
            case 'cdrawer': {
                frm = await clickgo.form.create(cdrawerFrm);
                break;
            }
            case 'cecharts': {
                frm = await clickgo.form.create(cechartsFrm);
                break;
            }
            case 'cempty': {
                frm = await clickgo.form.create(cemptyFrm);
                break;
            }
            case 'cfile': {
                frm = await clickgo.form.create(cfileFrm);
                break;
            }
            case 'cform': {
                frm = await clickgo.form.create(cformFrm);
                break;
            }
            case 'cgroup': {
                frm = await clickgo.form.create(cgroupFrm);
                break;
            }
            case 'chtml': {
                frm = await clickgo.form.create(chtmlFrm);
                break;
            }
            case 'cprogress': {
                frm = await clickgo.form.create(cprogressFrm);
                break;
            }
            case 'ciconview': {
                frm = await clickgo.form.create(ciconviewFrm);
                break;
            }
            case 'cvflow': {
                frm = await clickgo.form.create(cvflowFrm);
                break;
            }
            case 'cimgviewer': {
                frm = await clickgo.form.create(cimgviewerFrm);
                break;
            }
            case 'cvideo': {
                frm = await clickgo.form.create(cvideoFrm);
                break;
            }
            case 'cstep': {
                frm = await clickgo.form.create(cstepFrm);
                break;
            }
            case 'ctag': {
                frm = await clickgo.form.create(ctagFrm);
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
                frm = await clickgo.form.create(ctipFrm);
                break;
            }
            case 'cxterm': {
                frm = await clickgo.form.create(cxtermFrm);
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
                frm = await clickgo.form.create(ccontentFrm);
                break;
            }
            case 'calert': {
                frm = await clickgo.form.create(calertFrm);
                break;
            }
            case 'clink': {
                frm = await clickgo.form.create(clinkFrm);
                break;
            }
            case 'clabel': {
                frm = await clickgo.form.create(clabelFrm);
                break;
            }
            case 'cpalette': {
                frm = await clickgo.form.create(cpaletteFrm);
                break;
            }
            case 'clayout': {
                frm = await clickgo.form.create(clayoutFrm);
                break;
            }
            case 'chske': {
                frm = await clickgo.form.create(chskeFrm);
                break;
            }
            case 'clist': {
                frm = await clickgo.form.create(clistFrm);
                break;
            }
            case 'cloading': {
                frm = await clickgo.form.create('control/loading/loading', undefined, {
                    'path': this.filename
                });
                break;
            }
            case 'cmap': {
                frm = await clickgo.form.create(cmapFrm);
                break;
            }
            case 'cmarquee': {
                frm = await clickgo.form.create(cmarqueeFrm);
                break;
            }
            case 'cmenu': {
                frm = await clickgo.form.create(cmenuFrm);
                break;
            }
            case 'cmonaco': {
                frm = await clickgo.form.create(cmonacoFrm);
                break;
            }
            case 'cnav': {
                frm = await clickgo.form.create(cnavFrm);
                break;
            }
            case 'cpage': {
                frm = await clickgo.form.create(cpageFrm);
                break;
            }
            case 'cpanel': {
                frm = await clickgo.form.create(cpanelFrm);
                break;
            }
            case 'cflow': {
                frm = await clickgo.form.create(cflowFrm);
                break;
            }
            case 'cproperty': {
                frm = await clickgo.form.create(cpropertyFrm);
                break;
            }
            case 'cradio': {
                frm = await clickgo.form.create(cradioFrm);
                break;
            }
            case 'cswitch': {
                frm = await clickgo.form.create(cswitchFrm);
                break;
            }
            case 'cscroll': {
                frm = await clickgo.form.create(cscrollFrm);
                break;
            }
            case 'cselect': {
                frm = await clickgo.form.create(cselectFrm);
                break;
            }
            case 'cuploader': {
                frm = await clickgo.form.create(cuploaderFrm);
                break;
            }
            case 'csvg': {
                frm = await clickgo.form.create(csvgFrm);
                break;
            }
            case 'ctab': {
                frm = await clickgo.form.create(ctabFrm);
                break;
            }
            case 'ctable': {
                frm = await clickgo.form.create(ctableFrm);
                break;
            }
            case 'ctext': {
                frm = await clickgo.form.create(ctextFrm);
                break;
            }
            case 'ctimeline': {
                frm = await clickgo.form.create(ctimelineFrm);
                break;
            }
            case 'cjodit': {
                frm = await clickgo.form.create(cjoditFrm);
                break;
            }
            case 'ctuieditor': {
                frm = await clickgo.form.create(ctuieditorFrm);
                break;
            }
            case 'ctuiviewer': {
                frm = await clickgo.form.create(ctuiviewerFrm);
                break;
            }
            case 'carteditor': {
                frm = await clickgo.form.create(carteditorFrm);
                break;
            }
            case 'cdelete': {
                frm = await clickgo.form.create(cdeleteFrm);
                break;
            }

            case 'eform': {
                frm = await clickgo.form.create(eformFrm);
                break;
            }
            case 'eother': {
                frm = await clickgo.form.create(eotherFrm);
                break;
            }
            case 'escreen': {
                frm = await clickgo.form.create(escreenFrm);
                break;
            }
            case 'etask': {
                frm = await clickgo.form.create(etaskFrm);
                break;
            }

            case 'aform': {
                frm = await clickgo.form.create(aformFrm);
                break;
            }
            case 'acontrol': {
                frm = await clickgo.form.create(acontrolFrm);
                break;
            }
            case 'mcore': {
                frm = await clickgo.form.create(mcoreFrm);
                break;
            }
            case 'mdom': {
                frm = await clickgo.form.create(mdomFrm);
                break;
            }
            case 'mform': {
                frm = await clickgo.form.create(mformFrm);
                break;
            }
            case 'mfs': {
                frm = await clickgo.form.create(mfsFrm);
                break;
            }
            case 'mnative': {
                frm = await clickgo.form.create(mnativeFrm);
                break;
            }
            case 'mstorage': {
                frm = await clickgo.form.create(mstorageFrm);
                break;
            }
            case 'msystem': {
                frm = await clickgo.form.create(msystemFrm);
                break;
            }
            case 'mtask': {
                frm = await clickgo.form.create(mtaskFrm);
                break;
            }
            case 'mtheme': {
                frm = await clickgo.form.create(mthemeFrm);
                break;
            }
            case 'mtool': {
                frm = await clickgo.form.create(mtoolFrm);
                break;
            }
            case 'mzip': {
                frm = await clickgo.form.create(mzipFrm);
                break;
            }
            default: {
                frm = await clickgo.form.create(sbackpanelFrm, data);
            }
        }
        this.loading = false;
        frm.show();
    }

    public onMounted(data: Record<string, any>): void {
        this.adata = data;
    }

}

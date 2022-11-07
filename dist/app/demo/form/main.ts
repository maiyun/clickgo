import * as clickgo from 'clickgo';
import * as types from '~/types/index';

import cbuttonFrm from './control/button/button';
import ccheckFrm from './control/check/check';
import cdialogFrm from './control/dialog/dialog';
import cfileFrm from './control/file/file';
import cformFrm from './control/form/form';
import cgreatviewFrm from './control/greatview/greatview';
import clistFrm from './control/list/list';
import cmarqueeFrm from './control/marquee/marquee';
import cmenuFrm from './control/menu/menu';
import cmonacoFrm from './control/monaco/monaco';
import cflowFrm from './control/flow/flow';
import cpropertyFrm from './control/property/property';
import cradioFrm from './control/radio/radio';
import cscrollFrm from './control/scroll/scroll';
import cselectFrm from './control/select/select';
import ctabFrm from './control/tab/tab';
import ctextFrm from './control/text/text';
import cviewFrm from './control/view/view';

import eformFrm from './event/form/form';
import escreenFrm from './event/screen/screen';
import etaskFrm from './event/task/task';

import aformFrm from './method/aform/aform';
import mcoreFrm from './method/core/core';
import mdomFrm from './method/dom/dom';
import mformFrm from './method/form/form';
import mfsFrm from './method/fs/fs';
import mtaskFrm from './method/task/task';
import mthemeFrm from './method/theme/theme';
import mtoolFrm from './method/tool/tool';
import mzipFrm from './method/zip/zip';

export default class extends clickgo.form.AbstractForm {

    public ntab = '';

    public async openForm(name: string): Promise<void> {
        let frm: number | types.AbstractForm = 0;
        switch (name) {
            case 'cblock': {
                frm = await this.createForm('control/block/block');
                break;
            }
            case 'cbutton': {
                frm = await cbuttonFrm.create();
                break;
            }
            case 'ccheck': {
                frm = await ccheckFrm.create();
                break;
            }
            case 'cdialog': {
                frm = await cdialogFrm.create();
                break;
            }
            case 'cfile': {
                frm = await cfileFrm.create();
                break;
            }
            case 'cform': {
                frm = await cformFrm.create();
                break;
            }
            case 'cgreatview': {
                frm = await cgreatviewFrm.create();
                break;
            }
            case 'cimg': {
                frm = await this.createForm('control/img/img');
                break;
            }
            case 'clabel': {
                frm = await this.createForm('control/label/label');
                break;
            }
            case 'clist': {
                frm = await clistFrm.create();
                break;
            }
            case 'cloading': {
                frm = await this.createForm('control/loading/loading');
                break;
            }
            case 'cmarquee': {
                frm = await cmarqueeFrm.create();
                break;
            }
            case 'cmenu': {
                frm = await cmenuFrm.create();
                break;
            }
            case 'cmonaco': {
                frm = await cmonacoFrm.create();
                break;
            }
            case 'cflow': {
                frm = await cflowFrm.create();
                break;
            }
            case 'cproperty': {
                frm = await cpropertyFrm.create();
                break;
            }
            case 'cradio': {
                frm = await cradioFrm.create();
                break;
            }
            case 'cscroll': {
                frm = await cscrollFrm.create();
                break;
            }
            case 'cselect': {
                frm = await cselectFrm.create();
                break;
            }
            case 'ctab': {
                frm = await ctabFrm.create();
                break;
            }
            case 'ctext': {
                frm = await ctextFrm.create();
                break;
            }
            case 'cview': {
                frm = await cviewFrm.create();
                break;
            }

            case 'eform': {
                frm = await eformFrm.create();
                break;
            }
            case 'escreen': {
                frm = await escreenFrm.create();
                break;
            }
            case 'etask': {
                frm = await etaskFrm.create();
                break;
            }

            case 'aform': {
                frm = await aformFrm.create();
                break;
            }
            case 'mcore': {
                frm = await mcoreFrm.create();
                break;
            }
            case 'mdom': {
                frm = await mdomFrm.create();
                break;
            }
            case 'mform': {
                frm = await mformFrm.create();
                break;
            }
            case 'mfs': {
                frm = await mfsFrm.create();
                break;
            }
            case 'mtask': {
                frm = await mtaskFrm.create();
                break;
            }
            case 'mtheme': {
                frm = await mthemeFrm.create();
                break;
            }
            case 'mtool': {
                frm = await mtoolFrm.create();
                break;
            }
            case 'mzip': {
                frm = await mzipFrm.create();
                break;
            }
        }
        if (typeof frm === 'number') {
            // --- 报错 ---
            return;
        }
        frm.show();
    }
}

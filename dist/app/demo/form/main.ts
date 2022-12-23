import * as clickgo from 'clickgo';
import * as types from '~/types/index';

import cboxFrm from './control/box/box';
import cbuttonFrm from '~c/button/button';
import ccheckFrm from './control/check/check';
import cdialogFrm from './control/dialog/dialog';
import cfileFrm from './control/file/file';
import cformFrm from './control/form/form';
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
import cvflowFrm from './control/vflow/vflow';

import eformFrm from './event/form/form';
import eotherFrm from './event/other/other';
import escreenFrm from './event/screen/screen';
import etaskFrm from './event/task/task';

import aformFrm from './method/aform/aform';
import mcoreFrm from './method/core/core';
import mdomFrm from './method/dom/dom';
import mformFrm from './method/form/form';
import mfsFrm from './method/fs/fs';
import mnativeFrm from './method/native/native';
import msystemFrm from './method/system/system';
import mtaskFrm from './method/task/task';
import mthemeFrm from './method/theme/theme';
import mtoolFrm from './method/tool/tool';
import mzipFrm from './method/zip/zip';

export default class extends clickgo.form.AbstractForm {

    public ntab = '';

    public async openForm(name: string): Promise<void> {
        let frm: types.AbstractForm;
        switch (name) {
            case 'cblock': {
                frm = await clickgo.form.create('control/block/block', undefined, {
                    'path': this.filename
                });
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
            case 'cdialog': {
                frm = await clickgo.form.create(cdialogFrm);
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
            case 'cvflow': {
                frm = await clickgo.form.create(cvflowFrm);
                break;
            }
            case 'cimg': {
                frm = await clickgo.form.create('control/img/img', undefined, {
                    'path': this.filename
                });
                break;
            }
            case 'clabel': {
                frm = await clickgo.form.create('control/label/label', undefined, {
                    'path': this.filename
                });
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
            case 'cscroll': {
                frm = await clickgo.form.create(cscrollFrm);
                break;
            }
            case 'cselect': {
                frm = await clickgo.form.create(cselectFrm);
                break;
            }
            case 'ctab': {
                frm = await clickgo.form.create(ctabFrm);
                break;
            }
            case 'ctext': {
                frm = await clickgo.form.create(ctextFrm);
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
            default: {
                frm = await clickgo.form.create(mzipFrm);
            }
        }
        frm.show();
    }
}

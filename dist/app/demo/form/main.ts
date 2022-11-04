import * as clickgo from 'clickgo';
import * as types from '~/types/index';

import cformFrm from './control/form/form';
import cdialogFrm from './control/dialog/dialog';
import mformFrm from './method/form/form';
import aformFrm from './method/aform/aform';

export default class extends clickgo.form.AbstractForm {

    public ntab = '';

    public async openForm(name: string): Promise<void> {
        let frm: number | types.AbstractForm = 0;
        switch (name) {
            case 'cblock': {
                frm = await this.createForm('control/block/block');
                break;
            }
            case 'cform': {
                frm = await cformFrm.create();
                break;
            }
            case 'cdialog': {
                frm = await cdialogFrm.create();
                break;
            }

            case 'mform': {
                frm = await mformFrm.create();
                break;
            }
            case 'aform': {
                frm = await aformFrm.create();
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

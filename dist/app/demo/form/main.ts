import * as clickgo from 'clickgo';
import * as types from '~/types/index';

import cformFrm from './control/form/form';

export default class extends clickgo.form.AbstractForm {

    public ntab = '';

    public async openForm(name: string): Promise<void> {
        let frm: number | types.AbstractForm = 0;
        switch (name) {
            case 'cform': {
                frm = await cformFrm.create();
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

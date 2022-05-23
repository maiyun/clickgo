import * as types from '~/types/index';
import * as clickgo from 'clickgo';

export const data = {
    btnChecked: false,
    btnRadio: '0',
    type: 'default',
    area: 'all',
    plain: 'not'
};

export const methods = {
    dialog: async function(this: types.IVForm, text: string): Promise<void> {
        await clickgo.form.dialog(text);
    }
};

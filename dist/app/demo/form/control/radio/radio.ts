import * as clickgo from 'clickgo';
import * as types from '~/types';

export default class extends clickgo.form.AbstractForm {

    public value = 'radio1';

    public disabled = false;

    public async onChange(e: types.IRadioChangeEvent): Promise<void> {
        if (e.detail.selected !== 'radio2') {
            return;
        }
        e.preventDefault();
        await clickgo.form.dialog('selected: ' + e.detail.selected + ', value: ' + e.detail.value);
    }

}

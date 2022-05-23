import * as types from '~/types/index';
import * as clickgo from 'clickgo';

export const computed = {
    'config': function(): string {
        return JSON.stringify(clickgo.core.config, null, 4);
    }
};

export const methods = {
    getAvailArea: async function(this: types.IVForm): Promise<void> {
        await clickgo.form.dialog(JSON.stringify(clickgo.core.getAvailArea()));
    }
};

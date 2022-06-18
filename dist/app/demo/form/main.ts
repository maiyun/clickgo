import * as types from '~/types/index';
import * as clickgo from 'clickgo';

export const data = {
    'ntab': ''
};

export const methods = {
    openForm: async function(this: types.IVForm, type: string, name: string): Promise<void> {
        await clickgo.form.create({
            'file': `${type}/${name}/${name}`
        });
    }
};

import * as clickgo from 'clickgo';
import * as types from '~/types/index';

export const data = {
    'width': 300,
    'height': 520,
    'icon': '',
    'title': 'Form',
    'min': true,
    'max': true,
    'close': true,
    'stateMax': false,
    'stateMin': false,
    'minWidth': 200,
    'minHeight': 100,
    'resize': true,
    'loading': false,
    'border': 'normal'
};

export const methods = {
    showLoading: async function(this: types.IVForm): Promise<void> {
        this.loading = true;
        await clickgo.tool.sleep(1000);
        this.loading = false;
    }
};

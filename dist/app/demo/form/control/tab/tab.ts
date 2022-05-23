import * as types from '~/types/index';
import * as clickgo from 'clickgo';

export const data = {
    'ntab': '',
    'tabs': ['tab1'],
    'tindex': 1,
    'tabPosition': 'top',
    'color': undefined,
    'size': undefined,
    'drag': false,
    'close': false
};

export const methods = {
    onClose: async function(this: types.IVForm, e: CustomEvent, i: number): Promise<void> {
        if (i !== 10) {
            return;
        }
        e.preventDefault();
        await clickgo.form.dialog('The tab can not be close.');
    },
    add: function(this: types.IVForm): void {
        const len = this.tabs.length as number;
        const val = 'tab' + (++this.tindex).toString();
        if (len === 15) {
            this.tabs.push({
                'value': val,
                'drag': false,
                'close': false
            });
        }
        else if (len === 16) {
            this.tabs.push({
                'value': val,
                'drag': true,
                'close': true
            });
        }
        else {
            this.tabs.push(val);
        }
    },
    remove: function(this: types.IVForm): void {
        if (this.tabs.length > 0) {
            this.tabs.splice(this.tabs.length - 1);
        }
    },
    position: function(this: types.IVForm): void {
        switch (this.tabPosition) {
            case 'top':
                this.tabPosition = 'right';
                break;
            case 'right':
                this.tabPosition = 'bottom';
                break;
            case 'bottom':
                this.tabPosition = 'left';
                break;
            default:
                this.tabPosition = 'top';
        }
    }
};

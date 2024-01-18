import * as clickgo from 'clickgo';
import * as types from '~/types/index';

export default class extends clickgo.form.AbstractForm {

    public ntab = '';

    public tabs: any[] = ['tab1', {
        'label': 'haha',
        'value': 'ok'
    }];

    public tindex = 1;

    public tabPosition = 'top';

    public color = undefined;

    public size = undefined;

    public drag = false;

    public cclose = false;

    public async onClose(e: types.ITabCloseEvent): Promise<void> {
        if (e.detail.index !== 10) {
            await clickgo.form.dialog('Closed, index: ' + e.detail.index.toString() + ', value: ' + e.detail.value);
            return;
        }
        e.preventDefault();
        await clickgo.form.dialog('The tab can not be close.');
    }

    public add(): void {
        const len = this.tabs.length;
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
    }

    public remove(): void {
        if (this.tabs.length > 0) {
            this.tabs.splice(this.tabs.length - 1);
        }
    }

    public position(): void {
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

}

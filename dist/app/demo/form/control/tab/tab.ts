import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public ntab = '';

    public tabs: any[] = ['tab1'];

    public tindex = 1;

    public tabPosition = 'top';

    public color = undefined;

    public size = undefined;

    public drag = false;

    public close = false;

    public async onClose(e: CustomEvent, i: number): Promise<void> {
        if (i !== 10) {
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

import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.ntab = 'ok';
        this.tabs = ['tab1', {
                'label': 'haha',
                'value': 'ok'
            }];
        this.tindex = 1;
        this.tabPosition = 'top';
        this.color = undefined;
        this.size = undefined;
        this.drag = false;
        this.cclose = false;
    }
    async onClose(e) {
        if (e.detail.index !== 10) {
            await clickgo.form.dialog(this, 'Closed, index: ' + e.detail.index.toString() + ', value: ' + e.detail.value);
            return;
        }
        e.preventDefault();
        await clickgo.form.dialog(this, 'The tab can not be close.');
    }
    add() {
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
    remove() {
        if (this.tabs.length > 0) {
            this.tabs.splice(this.tabs.length - 1);
        }
    }
    position() {
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

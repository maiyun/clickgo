import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.controls = false;
        this.list = true;
        this.list1 = [
            {
                'device': '',
                'channel': 1,
                'index': 0,
                'mode': 0
            }
        ];
        this.list2 = [
            {
                'device': '',
                'channel': 1,
                'index': 0,
                'mode': 2
            },
            {
                'device': '',
                'channel': 6,
                'index': 1,
                'mode': 0
            }
        ];
        this.init = {
            'sid': '',
            'skey': '',
        };
        this.range = false;
    }
    refresh() {
        this.refs.tplink.refresh();
    }
}

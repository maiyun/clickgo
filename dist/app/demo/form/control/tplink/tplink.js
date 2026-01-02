import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    controls = false;
    list = true;
    list1 = [
        {
            'device': '',
            'channel': 1,
            'index': 0,
            'mode': 0
        }
    ];
    list2 = [
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
    init = {
        'sid': '',
        'skey': '',
    };
    refresh() {
        this.refs.tplink.refresh();
    }
    range = false;
}

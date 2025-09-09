import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public controls = false;

    public list = true;

    public list1 = [
        {
            'device': '',
            'channel': 1,
            'index': 0,
            'mode': 0
        }
    ];

    public list2 = [
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

    public init = {
        'sid': '',
        'skey': '',
    };

    public refresh(): void {
        this.refs.tplink.refresh();
    }

    public range = false;

}

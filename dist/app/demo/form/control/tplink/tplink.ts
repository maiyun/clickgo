import * as clickgo from 'clickgo';
import * as types from '~/types/index';

export default class extends clickgo.form.AbstractForm {

    public controls = false;

    public list = true;

    public list1 = [
        {
            'device': '80-AE-54-DA-45-FA',
            'channel': 1,
            'index': 0,
            'mode': 0
        }
    ];

    public list2 = [
        {
            'device': '4C-10-D5-8D-99-D5',
            'channel': 1,
            'index': 0,
            'mode': 2
        },
        {
            'device': '80-AE-54-DA-45-FA',
            'channel': 6,
            'index': 1,
            'mode': 0
        }
    ];

    public init = {
        'sid': 'YTc4YmY5ODY2MjAxYWE0',
        'skey': '6c5b04bcb5d1434c834ba4b69db26a08'
    };

    public refresh() {
        this.refs.tplink.refresh();
    }

    public range = false;

}

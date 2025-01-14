import * as clickgo from 'clickgo';
import * as types from '~/types/index';

export default class extends clickgo.form.AbstractForm {

    public controls = false;

    public play = true;

    public volume = 80;

    public list = [
        {
            'label': 'empty',
            'value': ''
        },
        {
            'label': 'rtsp1',
            'value': 'ws://ocs.brctest.com:8080/camera?_auth=Basic%20dG9rZW46ek1pNFFkZmMyMWxCOG95Ng==&lang=sc&shop_uid=j5CJlpt0fAOq2DCo&uid=cASOapX4ftbiuSY0uIhKPFID&channel=sub'
        },
        {
            'label': 'rtsp2',
            'value': 'ws://ocs.brctest.com:8080/camera?_auth=Basic%20dG9rZW46ek1pNFFkZmMyMWxCOG95Ng==&lang=sc&shop_uid=j5CJlpt0fAOq2DCo&uid=jv6Rk0FdCYHGnu02xjKxz9Pe&channel=sub',
            'fval': 'ws://ocs.brctest.com:8080/camera?_auth=Basic%20dG9rZW46ek1pNFFkZmMyMWxCOG95Ng==&lang=sc&shop_uid=j5CJlpt0fAOq2DCo&uid=jv6Rk0FdCYHGnu02xjKxz9Pe&channel=main'
        }
    ];

    public src: string[] = [''];

    public fsrc: string = '';

    /** --- select changed 事件 --- */
    public changed(e: types.ISelectChangedEvent) {
        const found = this.list.find(item => item.value === e.detail.value[0]);
        if (found && found.fval) {
            this.fsrc = found.fval;
            return;
        }
        this.fsrc = '';
    }

}

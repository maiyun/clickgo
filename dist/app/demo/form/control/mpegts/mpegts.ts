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
            'value': 'ws://media.z7test.com:8080/media?uid=cASOapX4ftbiuSY0uIhKPFID&auth=x&channel=sub'
        },
        {
            'label': 'rtsp2',
            'value': 'ws://media.z7test.com:8080/media?uid=jv6Rk0FdCYHGnu02xjKxz9Pe&auth=x&channel=sub',
            'fval': 'ws://media.z7test.com:8080/media?uid=jv6Rk0FdCYHGnu02xjKxz9Pe&auth=x&channel=main'
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

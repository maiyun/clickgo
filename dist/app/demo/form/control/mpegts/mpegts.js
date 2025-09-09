import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.controls = false;
        this.play = true;
        this.volume = 80;
        this.list = [
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
        this.src = [''];
        this.fsrc = '';
    }
    /** --- select changed 事件 --- */
    changed(e) {
        const found = this.list.find(item => item.value === e.detail.value[0]);
        if (found?.fval) {
            this.fsrc = found.fval;
            return;
        }
        this.fsrc = '';
    }
}

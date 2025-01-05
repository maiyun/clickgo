import * as clickgo from 'clickgo';

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
            'value': 'ws://ocs.brctest.com:8080/camera?_auth=Basic%20dG9rZW46Q0Rmcjd1T0NPdHhmc09PeA==&lang=sc&shop_uid=j5CJlpt0fAOq2DCo&uid=cASOapX4ftbiuSY0uIhKPFID'
        },
        {
            'label': 'rtsp2',
            'value': 'ws://ocs.brctest.com:8080/camera?_auth=Basic%20dG9rZW46Q0Rmcjd1T0NPdHhmc09PeA==&lang=sc&shop_uid=j5CJlpt0fAOq2DCo&uid=jv6Rk0FdCYHGnu02xjKxz9Pe'
        }
    ];

    public src: string[] = [''];

}

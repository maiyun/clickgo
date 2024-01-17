import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public data = [
        {
            'label': 'step1'
        },
        {
            'value': 'step2'
        },
        {
            'icon': '/package/res/marker.svg',
            'value': 'icon'
        },
        {
            'label': 'successful',
            'value': 'step3',
            'desc': 'qq'
        }
    ];

    public plain: boolean = false;

    public step1 = '';

}

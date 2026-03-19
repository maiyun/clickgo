import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    data = [
        {
            'label': 'step1'
        },
        {
            'label': 'step2 so long so long',
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
    plain = false;
    step1 = '';
    /**
     * --- 步骤节点点击事件处理 ---
     * @param e click 事件
     */
    onStepClicked(e) {
        this.step1 = e.detail.value;
    }
}

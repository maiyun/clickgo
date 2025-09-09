import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.props = {
            'text': 'https://www.maiyun.net',
            'options': {}
        };
        this.access = {
            'qrcode': undefined,
        };
        this.notInit = false;
        this.isLoading = true;
    }
    async onMounted() {
        const qrcode = await clickgo.core.getModule('qrcode');
        if (!qrcode) {
            // --- 没有成功 ---
            this.isLoading = false;
            this.notInit = true;
            return;
        }
        this.access.qrcode = qrcode;
        this.watch('options', () => {
            if (!this.access.qrcode || !this.props.text) {
                return;
            }
            this.access.qrcode.toCanvas(this.refs.content, this.props.text, this.props.options);
        }, {
            'immediate': true
        });
        this.watch('text', () => {
            if (!this.access.qrcode || !this.props.text) {
                return;
            }
            this.access.qrcode.toCanvas(this.refs.content, this.props.text, this.props.options);
        });
        this.isLoading = false;
    }
}

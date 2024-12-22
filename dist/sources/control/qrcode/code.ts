import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        'text': string;
        'options': {
            'margin'?: number;
            'scale'?: number;
            'small'?: boolean;
            'width'?: number;
            'color.dark'?: string;
            'color.light'?: string;
        };
    } = {
            'text': 'https://www.maiyun.net',

            'options': {}
        };
    
    public access: {
        'qrcode': any;
    } = {
            'qrcode': undefined,
        };

    public notInit = false;

    public isLoading = true;

    public async onMounted(): Promise<void> {
        const qrcode = await clickgo.core.getModule('qrcode');
        if (!qrcode) {
            // --- 没有成功 ---
            this.isLoading = false;
            this.notInit = true;
            return;
        }
        this.access.qrcode = qrcode;
        this.watch('options', (): void => {
            if (!this.access.qrcode || !this.props.text) {
                return;
            }
            this.access.qrcode.toCanvas(this.refs.content, this.props.text, this.props.options);
        }, {
            'immediate': true
        });
        this.watch('text', (): void => {
            if (!this.access.qrcode || !this.props.text) {
                return;
            }
            this.access.qrcode.toCanvas(this.refs.content, this.props.text, this.props.options);
        });
        this.isLoading = false;
    }

}

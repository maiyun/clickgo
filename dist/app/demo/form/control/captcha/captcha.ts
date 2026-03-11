import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public tcResult: string = 'waiting...';

    public cfResult: string = 'waiting...';

    public methodResult: string = 'waiting...';

    public tcKey = '';

    public cfKey = '';

    public tcOnResult(res: any): void {
        this.tcResult = res;
    }

    public tcOnReset(): void {
        this.tcResult = 'waiting...';
        this.refs.tc.reset();
    }

    public cfOnResult(res: any): void {
        this.cfResult = res;
    }

    public cfOnReset(): void {
        this.cfResult = 'waiting...';
        this.refs.cf.reset();
    }

    public async tcOnShowByMethod(): Promise<void> {
        this.loading = true;
        const res = await clickgo.form.captcha(this, {
            'factory': 'tc',
            'akey': this.tcKey,
        });
        this.loading = false;
        if (!res) {
            this.methodResult = 'tc: false';
            return;
        }
        this.methodResult = 'tc: ' + res.detail.token;
    }

    public async cfOnShowByMethod(): Promise<void> {
        this.loading = true;
        const res = await clickgo.form.captcha(this, {
            'factory': 'cf',
            'akey': this.cfKey,
        });
        this.loading = false;
        if (!res) {
            this.methodResult = 'cf: false';
            return;
        }
        this.methodResult = 'cf: ' + res.detail.token;
    }

}

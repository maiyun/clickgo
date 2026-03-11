import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    tcResult = 'waiting...';
    cfResult = 'waiting...';
    methodResult = 'waiting...';
    tcKey = '';
    cfKey = '';
    tcOnResult(res) {
        this.tcResult = res;
    }
    tcOnReset() {
        this.tcResult = 'waiting...';
        this.refs.tc.reset();
    }
    cfOnResult(res) {
        this.cfResult = res;
    }
    cfOnReset() {
        this.cfResult = 'waiting...';
        this.refs.cf.reset();
    }
    async tcOnShowByMethod() {
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
    async cfOnShowByMethod() {
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

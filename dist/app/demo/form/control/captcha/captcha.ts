import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public tcResult: string = 'waiting...';

    public cfResult: string = 'waiting...';

    public tcKey = '';

    public cfKey = '';

    public tcOnResult(res: any) {
        this.tcResult = res;
    }

    public tcOnReset() {
        this.tcResult = 'waiting...';
        this.refs.tc.reset();
    }

    public cfOnResult(res: any) {
        this.cfResult = res;
    }

    public cfOnReset() {
        this.cfResult = 'waiting...';
        this.refs.cf.reset();
    }

}

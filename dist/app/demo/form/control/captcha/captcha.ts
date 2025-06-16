import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public tcResult: string = 'waiting...';

    public cfResult: string = 'waiting...';

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

}

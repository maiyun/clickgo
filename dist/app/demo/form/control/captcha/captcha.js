import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.tcResult = 'waiting...';
        this.cfResult = 'waiting...';
        this.tcKey = '';
        this.cfKey = '';
    }
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
}

import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.sh1 = 1000;
        this.c1 = 100;
        this.so1 = 500;
        this.sh2 = 0;
        this.c2 = 0;
        this.so2 = 0;
        this.count = 3;
        this.float = false;
        this.disabled = false;
        this.isShow = true;
    }
}

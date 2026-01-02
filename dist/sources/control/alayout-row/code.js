import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    alayout = null;
    get gap() {
        if (!this.alayout?.propNumber) {
            return '0';
        }
        return this.alayout.propNumber('gutter') + 'px';
    }
    onMounted() {
        this.alayout = this.parentByName('alayout');
    }
}

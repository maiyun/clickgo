import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    desc = null;
    get isBorder() {
        return this.desc?.propBoolean?.('border') ? true : false;
    }
    get size() {
        return this.desc?.props.size;
    }
    get plain() {
        return this.desc?.propBoolean('plain');
    }
    onMounted() {
        this.desc = this.parentByName('desc');
    }
}

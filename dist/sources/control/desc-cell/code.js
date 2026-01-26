import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    props = {
        'stripe': false,
        'nopadding': false,
    };
    desc = null;
    descRow = null;
    get isBorder() {
        return this.desc?.propBoolean?.('border') ? true : false;
    }
    get size() {
        return this.desc?.props.size;
    }
    get plain() {
        return this.desc?.propBoolean?.('plain') ? true : false;
    }
    /** --- 上层是 stripe 或本层是 stripe --- */
    get isStripe() {
        return this.desc?.propBoolean('stripe') ?
            true :
            (this.descRow?.propBoolean('stripe') ?
                true :
                this.propBoolean('stripe'));
    }
    onMounted() {
        this.desc = this.parentByName('desc');
        this.descRow = this.parentByName('desc-row');
    }
}

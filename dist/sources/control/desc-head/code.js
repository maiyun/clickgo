import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    desc = null;
    descRow = null;
    get isBorder() {
        return this.desc?.propBoolean?.('border') ? true : false;
    }
    get size() {
        return this.desc?.props.size;
    }
    get plain() {
        return this.desc?.propBoolean('plain');
    }
    get isRowlr() {
        return this.desc?.propBoolean?.('rowlr') ? true : false;
    }
    get isHover() {
        if (!this.descRow?.propBoolean?.('hover')) {
            return false;
        }
        return this.descRow?.hovered ? true : false;
    }
    onMounted() {
        this.desc = this.parentByName('desc');
        this.descRow = this.parentByName('desc-row');
    }
}

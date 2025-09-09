import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.props = {
            'direction': undefined,
            'gutter': 0,
            'alignH': undefined,
            'alignV': undefined,
            'span': 0,
            'sizeM': 0,
            'sizeL': 0,
        };
        this.grid = null;
    }
    /** --- 方向 --- */
    get directionComp() {
        return this.props.direction ?? this.grid?.direction ?? 'h';
    }
    /** --- 当前的内间距 --- */
    get gutterComp() {
        if (this.propNumber('gutter')) {
            return this.propNumber('gutter');
        }
        return this.propNumber('gutter') ? this.propNumber('gutter') : (this.grid?.propNumber('itemGutter') ?? 0);
    }
    get alignHComp2() {
        return this.alignHComp ?? this.grid?.alignHComp;
    }
    get alignVComp2() {
        return this.alignVComp ?? this.grid?.alignVComp;
    }
    /** --- 当前单元格横跨的列 --- */
    get spanNum() {
        const size = this.grid?.size ?? 's';
        if (size === 's') {
            return 1;
        }
        if (size === 'm') {
            return this.propInt('sizeM') === -1 ? 1 : (this.propInt('sizeM') || this.propInt('span') || 1);
        }
        return this.propInt('sizeL') === -1 ? 1 : (this.propInt('sizeL') || this.propInt('span') || 1);
    }
    /** --- 横跨几行 --- */
    get spanComp() {
        return this.spanNum > 1 ? 'span ' + this.spanNum.toString() : undefined;
    }
    onMounted() {
        this.grid = this.parentByName('grid');
    }
}

import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    props = {
        'direction': undefined,
        'gutter': 0,
        'alignH': undefined,
        'alignV': undefined,
        'span': undefined,
    };
    grid = null;
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
    /** --- 横向对齐方式 --- */
    get alignHComp2() {
        return this.alignHComp ?? this.grid?.alignHComp;
    }
    /** --- 纵向对齐方式 --- */
    get alignVComp2() {
        return this.alignVComp ?? this.grid?.alignVComp;
    }
    /** --- 横跨几列数字 --- */
    get spanNum() {
        if (this.props.span === undefined) {
            return 1;
        }
        const span = this.propInt('span');
        if (span === -1) {
            return -1;
        }
        /** --- grid max span --- */
        const maxSpan = this.grid?.maxSpan ?? 12;
        return (span > maxSpan) ? maxSpan : span;
    }
    /** --- 横跨几列 css 模式 --- */
    get spanComp() {
        if (this.props.span === undefined) {
            return undefined;
        }
        if (this.spanNum === -1) {
            return '1 / -1';
        }
        return 'span ' + this.spanNum.toString();
    }
    onMounted() {
        this.grid = this.parentByName('grid');
    }
}

import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        'direction': 'h' | 'v' | undefined;
        'gutter': number | string;
        'alignH': string | undefined;
        'alignV': string | undefined;

        /** --- 横跨几列，-1 代表横跨所有列 --- */
        'span'?: number | string;
    } = {
            'direction': undefined,
            'gutter': 0,
            'alignH': undefined,
            'alignV': undefined,

            'span': undefined,
        };

    public grid: any = null;

    /** --- 方向 --- */
    public get directionComp(): string {
        return this.props.direction ?? this.grid?.direction ?? 'h';
    }

    /** --- 当前的内间距 --- */
    public get gutterComp(): number {
        if (this.propNumber('gutter')) {
            return this.propNumber('gutter');
        }
        return this.propNumber('gutter') ? this.propNumber('gutter') : (this.grid?.propNumber('itemGutter') ?? 0);
    }

    /** --- 横向对齐方式 --- */
    public get alignHComp2(): string | undefined {
        return this.alignHComp ?? this.grid?.alignHComp;
    }

    /** --- 纵向对齐方式 --- */
    public get alignVComp2(): string | undefined {
        return this.alignVComp ?? this.grid?.alignVComp;
    }

    /** --- 横跨几列数字 --- */
    public get spanNum(): number {
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
    public get spanComp(): string | undefined {
        if (this.props.span === undefined) {
            return undefined;
        }
        if (this.spanNum === -1) {
            return '1 / -1';
        }
        return 'span ' + this.spanNum.toString();
    }

    public onMounted(): void {
        this.grid = this.parentByName('grid');
    }

}

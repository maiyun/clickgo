import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        'direction': 'h' | 'v' | undefined;
        'gutter': number | string;
        'alignH': string | undefined;
        'alignV': string | undefined;

        'span': number | string;
        'sizeM': number | string;
        'sizeL': number | string;
    } = {
            'direction': undefined,
            'gutter': 0,
            'alignH': undefined,
            'alignV': undefined,

            'span': 0,
            'sizeM': 0,
            'sizeL': 0,
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

    public get alignHComp2(): string | undefined {
        return this.alignHComp ?? this.grid?.alignHComp;
    }

    public get alignVComp2(): string | undefined {
        return this.alignVComp ?? this.grid?.alignVComp;
    }

    /** --- 当前单元格横跨的列 --- */
    public get spanNum(): number {
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
    public get spanComp(): string | undefined {
        return this.spanNum > 1 ? 'span ' + this.spanNum.toString() : undefined;
    }

    public onMounted(): void {
        this.grid = this.parentByName('grid');
    }

}

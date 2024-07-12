import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        'direction': 'h' | 'v';
        'gutter': number | string;
        'itemGutter': number | string;
        /** --- 定义所有子 cell 的 alignH --- */
        'alignH': string | undefined;
        /** --- 定义所有子 cell 的 alignV --- */
        'alignV': string | undefined;

        'sizeM': number | string;
        'sizeL': number | string;
    } = {
            'direction': 'h',
            'gutter': 0,
            'itemGutter': 0,
            'alignH': undefined,
            'alignV': undefined,

            'sizeM': 0,
            'sizeL': 0,
        };

    /** --- 整个宽度 --- */
    public width = 0;

    /** --- 当前的大小模式 --- */
    public size: string = 's';

    /** --- 一行排几列 --- */
    public get columns(): number {
        if (this.width >= 1400) {
            this.size = 'l';
            return this.propInt('sizeL') || 4;
        }
        if (this.width >= 700) {
            this.size = 'm';
            return this.propInt('sizeM') || 2;
        }
        this.size = 's';
        return 1;
    }

    public onMounted(): void {
        clickgo.dom.watchSize(this.element, () => {
            this.width = this.element.offsetWidth;
        }, true);
    }

}

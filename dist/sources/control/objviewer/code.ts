import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        'direction': 'h' | 'v';
        'bg': 'dot' | 'grid';
        'gutter': number | string;
        'alignH': string | undefined;
        'alignV': string | undefined;

        'lines': Array<{
            'hue': string;
            'start': clickgo.control.IObjviewerLineObj;
            'end': clickgo.control.IObjviewerLineObj;
        }> | string;
    } = {
            'direction': 'h',
            'bg': 'dot',
            'gutter': '',
            'alignH': undefined,
            'alignV': undefined,

            'lines': [],
        };

    public scaleS = 1;

    public scaleX = 0;

    public scaleY = 0;

    /** --- 绑定缩放事件 --- */
    public scale(oe: MouseEvent | TouchEvent | WheelEvent): void {
        clickgo.dom.bindScale(oe, (e, scale, cpos) => {
            e.preventDefault();
            this.scaleX += cpos.x;
            this.scaleY += cpos.y;
            this.scaleS *= scale;
            if (this.scaleS > 5) {
                this.scaleS = 5;
            }
            else if (this.scaleS < 0.3) {
                this.scaleS = 0.3;
            }
        });
    }

    /** --- 重置缩放/定位 --- */
    public refresh(): void {
        this.scaleS = 1;
        this.scaleX = (this.element.offsetWidth - this.refs.content.offsetWidth) / 2;
        this.scaleY = (this.element.offsetHeight - this.refs.content.offsetHeight) / 2;
    }

    public async onMounted(): Promise<void> {
        await clickgo.tool.sleep(34);
        this.refresh();
    }

}

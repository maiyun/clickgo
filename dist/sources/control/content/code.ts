import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        'direction': 'h' | 'v';
        'gutter': number | string;
        'alignH': string | undefined;
        'alignV': string | undefined;
    } = {
            'direction': 'h',
            'gutter': '',
            'alignH': undefined,
            'alignV': undefined
        };

    /** --- 内部有的需要判断 require 的控件 --- */
    public controls: Array<clickgo.control.AbstractControl & Record<string, any>> = [];

    /** --- 供子组件调用，用来在本 controls 移除 --- */
    public remove(c: clickgo.control.AbstractControl): void {
        for (let i = 0; i < this.controls.length; ++i) {
            if (this.controls[i] !== c) {
                continue;
            }
            this.controls.splice(i, 1);
            break;
        }
    }

    /** --- 供外部调用的，返回 true 代表校验通过 --- */
    public check(): boolean {
        let rtn = true;
        for (const item of this.controls) {
            if (item.value === '') {
                rtn = false;
                item.mustInput = true;
                continue;
            }
        }
        return rtn;
    }

}

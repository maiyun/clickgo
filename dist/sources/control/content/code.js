import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.props = {
            'direction': 'h',
            'gutter': '',
            'alignH': undefined,
            'alignV': undefined,
            'fill': false
        };
        /** --- 内部有的需要判断 require 的控件 --- */
        this.controls = [];
    }
    /** --- 供子组件调用，用来在本 controls 移除 --- */
    remove(c) {
        for (let i = 0; i < this.controls.length; ++i) {
            if (this.controls[i] !== c) {
                continue;
            }
            this.controls.splice(i, 1);
            break;
        }
    }
    /** --- 供外部调用的，返回 true 代表校验通过 --- */
    check() {
        let rtn = true;
        for (const item of this.controls) {
            const r = item.check();
            if (!r) {
                rtn = false;
            }
        }
        return rtn;
    }
}

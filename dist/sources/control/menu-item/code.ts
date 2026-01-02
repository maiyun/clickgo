import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        'disabled': boolean | string;

        'alt': string;
    } = {
            'disabled': false,

            'alt': ''
        };

    public down(e: PointerEvent): void {
        this.enter(e);
        clickgo.modules.pointer.click(e, () => {
            if (this.element.dataset.cgPopOpen !== undefined) {
                // --- 本来是展开状态，就隐藏起来 ---
                clickgo.form.hidePop(this.refs.pop);
                return;
            }
            clickgo.form.showPop(this.element, this.refs.pop, 'v', {
                'null': true
            });
        });
    }

    public enter(e: PointerEvent): void {
        clickgo.modules.pointer.hover(e, {
            enter: () => {
                const length = clickgo.dom.siblingsData(this.element, 'cg-pop-open').length;
                if (length === 0) {
                    // --- 别的没有展开，则不管 ---
                    return;
                }
                clickgo.form.showPop(this.element, this.refs.pop, 'v', {
                    'null': true
                });
            },
        });
    }

}

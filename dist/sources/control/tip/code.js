import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    props = {
        'label': '',
        'maxwidth': 400,
        'class': '',
        'type': 'default',
        'plain': false,
    };
    /** --- 鼠标在本体或 pop 里 --- */
    inTip = false;
    popEnter(e) {
        clickgo.modules.pointer.hover(e, {
            enter: () => {
                this.inTip = true;
            },
            leave: async () => {
                this.inTip = false;
                await clickgo.tool.sleep(150);
                if (this.inTip) {
                    return;
                }
                clickgo.form.hidePop(this.refs.pop);
            },
        });
    }
    onMounted() {
        let el = this.refs.span.previousElementSibling;
        if (!el) {
            return;
        }
        while (el.dataset.cgControl === undefined) {
            el = el.previousElementSibling;
            if (!el) {
                return;
            }
        }
        this.refs.span.remove();
        const enter = (e) => {
            clickgo.modules.pointer.hover(e, {
                enter: () => {
                    this.inTip = true;
                    clickgo.form.showPop(el, this.refs.pop, 't', {
                        'flow': false
                    });
                },
                leave: async () => {
                    // --- 允许 tip 移动上去 ---
                    this.inTip = false;
                    await clickgo.tool.sleep(150);
                    if (this.inTip) {
                        return;
                    }
                    clickgo.form.hidePop(this.refs.pop);
                }
            });
        };
        el.addEventListener('pointerenter', enter);
        el.addEventListener('pointerdown', enter);
    }
}

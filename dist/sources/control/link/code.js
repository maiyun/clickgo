import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    props = {
        'url': '',
        'line': false,
        'align': 'left',
        'disabled': false,
        'type': 'info'
    };
    /** --- 获取 align 的 css 属性模式 --- */
    get alignComp() {
        switch (this.props.align) {
            case 'center': {
                return 'center';
            }
            case 'left':
            case 'start': {
                return 'flex-start';
            }
            default: {
                return 'flex-end';
            }
        }
    }
    keydown(e) {
        if (e.key !== 'Enter') {
            return;
        }
        // --- 回车 ---
        e.preventDefault();
        this.element.click();
    }
    down() {
        if (this.element.dataset.cgPopOpen !== undefined) {
            return;
        }
        clickgo.form.showPop(this.element, this.refs.pop, 'v', {
            'autoScroll': true,
        });
    }
}

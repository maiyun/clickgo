import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        'url': string;
        'line': boolean | string;
        'align': 'left' | 'start' | 'center' | 'right' | 'end';
        'disabled': boolean | string;
        'type': 'primary' | 'info' | 'warning' | 'danger' | 'plain';
    } = {
            'url': '',
            'line': false,
            'align': 'left',
            'disabled': false,
            'type': 'info'
        };

    /** --- 获取 align 的 css 属性模式 --- */
    public get alignComp(): string | undefined {
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

    public keydown(e: KeyboardEvent): void {
        if (e.key !== 'Enter') {
            return;
        }
        // --- 回车 ---
        e.preventDefault();
        this.element.click();
    }

    public down(e: MouseEvent | TouchEvent): void {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        if (this.element.dataset.cgPopOpen !== undefined) {
            return;
        }
        clickgo.form.showPop(this.element, this.refs.pop, 'v', {
            'autoScroll': true,
        });
    }

}

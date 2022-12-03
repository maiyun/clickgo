import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        'disabled': boolean | string;

        'alt': string;
        'type': string;
        'label': string;
        'modelValue': string | boolean;
    } = {
            'disabled': false,

            'alt': '',
            'type': '',
            'label': '',
            'modelValue': ''
        };

    public padding = '';

    public get opMargin(): string {
        return this.padding.replace(/(\w+)/g, '-$1');
    }

    public enter(e: MouseEvent): void {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        clickgo.form.showPop(this.element, this.refs.pop, 'h');
    }

    public touch(): void {
        // --- 只有 touchstart 才显示，因为 PC 的 mouseenter 已经显示过了 ---
        clickgo.form.showPop(this.element, this.refs.pop, 'h');
    }

    public click(): void {
        if (!this.props.type) {
            if (!this.slots['pop']) {
                // --- 没有下层，则隐藏所有 pop ---
                clickgo.form.hidePop();
            }
            return;
        }
        // --- 有 type ---
        if (this.props.type === 'radio') {
            this.emit('update:modelValue', this.props.label);
        }
        else if (this.props.type === 'check') {
            this.emit('update:modelValue', this.props.modelValue ? false : true);
        }
        clickgo.form.hidePop();
    }

    public onBeforeUnmount(): void | Promise<void> {
        const menulist = this.parentByName('menulist');
        if (!menulist) {
            return;
        }
        // --- type ---
        if (this.props.type) {
            --menulist.hasTypeItemsCount;
        }
    }

    public onMounted(): void {
        this.watch('type', (): void => {
            const menulist = this.parentByName('menulist');
            if (!menulist) {
                return;
            }
            if (this.props.type) {
                ++menulist.hasTypeItemsCount;
            }
            else {
                --menulist.hasTypeItemsCount;
            }
        }, {
            'immediate': true
        });

        clickgo.dom.watchStyle(this.element, 'padding', (n, v) => {
            this.padding = v;
        }, true);

        const menulist = this.parentByName('menulist');
        if (!menulist) {
            return;
        }
        if (this.props.type) {
            ++menulist.hasTypeItemsCount;
        }
    }

}

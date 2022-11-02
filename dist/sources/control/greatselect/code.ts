import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props = {
        'disabled': false,

        'direction': 'h',

        'area': 'all',

        'pop': 'greatlist',

        'data': [],

        'modelValue': -1
    };

    public padding = '';

    public isKeyDown = false;

    public get isDisabled(): boolean {
        return clickgo.tool.getBoolean(this.props.disabled);
    }

    public opMargin(): string {
        return this.padding.replace(/(\w+)/g, '-$1');
    }

    public keydown(e: KeyboardEvent): void {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.click(e, 'arrow');
        }
        else if (e.key === ' ') {
            e.preventDefault();
            this.isKeyDown = true;
        }
    }

    public keyup(e: KeyboardEvent): void {
        if (!this.isKeyDown) {
            return;
        }
        this.isKeyDown = false;
        this.click(e, 'arrow');
    }

    public click(e: MouseEvent | KeyboardEvent, area: 'left' | 'arrow'): void {
        if (this.element.dataset.cgPopOpen !== undefined) {
            clickgo.form.hidePop(this.element);
            return;
        }
        if (this.props.area === 'arrow' && area === 'left') {
            // --- 当前只能箭头展开，并且点击的还是不能展开的左侧 ---
            return;
        }
        clickgo.form.showPop(this.element, this.refs.pop, 'v', {
            'size': {
                'width': this.element.offsetWidth
            }
        });
    }

    public updateModelValue(val: number): void {
        this.emit('update:modelValue', val);
    }

    public itemclick(e: MouseEvent, arrow: boolean): void {
        if (arrow) {
            return;
        }
        clickgo.form.hidePop();
    }

    public onMounted(): void {
        clickgo.dom.watchStyle(this.element, 'padding', (n, v) => {
            this.padding = v;
        }, true);
    }

}

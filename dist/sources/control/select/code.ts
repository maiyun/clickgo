import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props = {
        'disabled': false,

        'modelValue': '',
        'editable': false,
        'data': []
    };

    public background = '';

    public padding = '';

    public value = '';

    public label = '';

    public inputValue = '';

    public get isDisabled(): boolean {
        return clickgo.tool.getBoolean(this.props.disabled);
    }

    public get isEditable(): boolean {
        return clickgo.tool.getBoolean(this.props.editable);
    }

    public get opMargin(): string {
        return this.padding.replace(/(\w+)/g, '-$1');
    }

    public updateInputValue(value: string): void {
        this.inputValue = value;
        this.value = this.inputValue;
        this.emit('update:modelValue', this.value);
    }

    public updateModelValue(value: string): void {
        this.value = value;
        if (this.isEditable && (value === '')) {
            return;
        }
        this.inputValue = value;
        this.emit('update:modelValue', value);
    }

    public updateLabel(label: string): void {
        this.label = label;
        this.emit('label', label);
    }

    public listItemClick(): void {
        clickgo.form.hidePop();
    }

    public onMounted(): void | Promise<void> {
        this.watch('modelValue', (): void => {
            this.value = this.props.modelValue;
        }, {
            'immediate': true
        });
        this.watch('isEditable', (editable: boolean): void => {
            if (editable) {
                this.inputValue = this.value;
            }
        }, {
            'immediate': true
        });

        clickgo.dom.watchStyle(this.element, ['background', 'padding'], (n, v) => {
            switch (n) {
                case 'background': {
                    this.background = v;
                    break;
                }
                case 'padding': {
                    this.padding = v;
                    break;
                }
            }
        }, true);
    }

}

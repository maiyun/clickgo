import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        'modelValue': string;
        'show': boolean | string;
    } = {
            'modelValue': '',
            'show': false
        };

    public showData = false;

    /** --- 当前选中的 name --- */
    public selected: string = '';

    /** --- 当前是否是层的模式 --- */
    public layer = false;

    /** --- 选择一个 name，child 可能也会调用 --- */
    public select(name: string): void {
        this.selected = name;
        this.emit('update:modelValue', name);
        if (this.showData) {
            this.showData = false;
            this.emit('update:show', this.showData);
        }
    }

    public menuwrapClick(e: MouseEvent): void {
        if (!this.layer) {
            return;
        }
        if (e.currentTarget !== e.target) {
            return;
        }
        if (!this.showData) {
            return;
        }
        this.showData = false;
        this.emit('update:show', this.showData);
    }

    public onMounted(): void | Promise<void> {
        // --- 切换层的模式 ---
        clickgo.dom.watchSize(this.element, () => {
            if (this.element.offsetWidth < 500) {
                if (!this.layer) {
                    this.layer = true;
                    this.emit('layer', this.layer);
                }
            }
            else {
                if (this.layer) {
                    this.layer = false;
                    this.emit('layer', this.layer);
                }
            }
        }, true);

        this.watch('show', () => {
            this.showData = this.propBoolean('show');
        }, {
            'immediate': true
        });

        this.watch('modelValue', () => {
            this.select(this.props.modelValue);
        }, {
            'immediate': true
        });
    }

}

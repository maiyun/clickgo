import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'select': null,
        'remove': null,
        'changed': null,

        'update:modelValue': null
    };

    public props: {
        'disabled': boolean | string;
        'length': number | string;
        'drag': boolean | string;
        /** --- img 图像前缀 --- */
        'pre': string;
        'multi': boolean | string;
        'progress'?: number;

        'modelValue': Array<string | {
            'title'?: string;
            'src': string;
        }>;
    } = {
            'disabled': false,
            'length': 6,
            'drag': false,
            'pre': '',
            'multi': false,
            'progress': undefined,

            'modelValue': []
        };

    /** --- 发出 select 事件 --- */
    public select(): void {
        if (this.props.progress !== undefined) {
            return;
        }
        this.emit('select');
    }

    // --- drag / drop ---

    public rand = '';

    public down(e: PointerEvent, index: number): void {
        clickgo.modules.pointer.drag(e, (e.currentTarget as HTMLElement).parentNode?.parentNode as HTMLElement, {
            'data': {
                'index': index,
                'tab': this.rand
            }
        });
    }

    public drop(e: CustomEvent, index: number): void {
        if (typeof e.detail.value !== 'object') {
            return;
        }
        if (e.detail.value.tab !== this.rand) {
            return;
        }
        this.props.modelValue.splice(index, 0, this.props.modelValue.splice(e.detail.value.index, 1)[0]);
        this.emit('update:modelValue', this.props.modelValue);
        this.emit('changed');
    }

    public remove(index: number): void {
        const event: clickgo.control.IUploaderRemoveEvent = {
            'go': true,
            preventDefault: function() {
                this.go = false;
            },
            'detail': {
                'index': index,
            }
        };
        this.emit('remove', event);
        if (!event.go) {
            return;
        }
        this.props.modelValue.splice(index, 1);
        this.emit('update:modelValue', this.props.modelValue);
        this.emit('changed');
    }

    public onMounted(): void {
        this.rand = clickgo.tool.random(16);
    }

}

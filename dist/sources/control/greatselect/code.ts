import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'remove': null,
        'add': null,
        'change': null,
        'changed': null,
        /** --- 无论是谁，只要 pop 显示就响应 --- */
        'pop': null,

        'update:modelValue': null,
    };

    public props: {
        'disabled': boolean | string;
        'multi': boolean | string;
        'direction': 'h' | 'v';
        'area': 'all' | 'text' | 'arrow';
        'pop': 'greatlist' | 'custom';
        'plain': boolean | string;
        'virtual': boolean | string;
        /** --- 0, xs, s, m, l, xl --- */
        'padding'?: string;
        /** --- 设置弹出层的最低宽度 --- */
        'minWidth'?: number;

        /** --- 映射 disabled、control 的 key --- */
        'map': {
            'disabled'?: string;
            'control'?: string;
        };
        'data': Array<{
            'disabled': boolean;
            'control'?: 'split';
            [key: string]: any;
        }>;
        'sizes': Record<string, number | undefined>;
        'modelValue': number[];
    } = {
            'disabled': false,
            'multi': false,
            'direction': 'h',
            'area': 'all',
            'pop': 'greatlist',
            'plain': false,
            'virtual': false,
            'padding': 'm',
            'minWidth': 0,

            'map': {},
            'data': [],
            'sizes': {},
            'modelValue': []
        };

    public isSpaceDown = false;

    /**
     * --- 显示 pop，可供别人调用 ---
     */
    public showPop(): void {
        clickgo.form.showPop(this.element, this.refs.pop, 'v', {
            'size': {
                'width': this.propNumber('minWidth') ?
                    Math.max(this.element.offsetWidth, this.propNumber('minWidth')) :
                    this.element.offsetWidth,
            },
            'autoPosition': true,
            'autoScroll': true,
            'way': 'click'
        });
        this.emit('pop');
    }

    /**
     * --- 隐藏 pop，可供别人调用 ---
     */
    public hidePop(): void {
        clickgo.form.hidePop(this.element);
    }

    // --- 内部方法 ---

    public keydown(e: KeyboardEvent): void {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.down(e, 'arrow');
        }
        else if (e.key === ' ') {
            e.preventDefault();
            this.isSpaceDown = true;
        }
    }

    public keyup(e: KeyboardEvent): void {
        if (!this.isSpaceDown) {
            return;
        }
        this.isSpaceDown = false;
        this.down(e, 'arrow');
    }

    public down(e: MouseEvent | TouchEvent | KeyboardEvent, area: 'left' | 'arrow'): void {
        if (!(e instanceof KeyboardEvent) && clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        if (this.element.dataset.cgPopOpen !== undefined) {
            // this.hidePop();
            return;
        }
        if (this.props.area === 'arrow' && area === 'left') {
            // --- 当前只能箭头展开，并且点击的还是不能展开的左侧 ---
            return;
        }
        this.showPop();
    }

    public updateModelValue(val: number): void {
        this.emit('update:modelValue', val);
    }

    public itemclicked(e: clickgo.control.IListItemclickedEvent): void {
        if (e.detail.arrow) {
            return;
        }
        if (this.propBoolean('multi')) {
            // --- 多选不隐藏 ---
            return;
        }
        this.hidePop();
    }

    public onAdd(e: clickgo.control.IGreatlistAddEvent): void {
        const event: clickgo.control.IGreatselectAddEvent = {
            'go': true,
            preventDefault: function() {
                this.go = false;
            },
            'detail': {
                'value': e.detail.value
            }
        };
        this.emit('add', event);
        if (!event.go) {
            e.preventDefault();
        }
    }

    public onRemove(e: clickgo.control.IGreatlistRemoveEvent): void {
        const event: clickgo.control.IGreatselectRemoveEvent = {
            'go': true,
            preventDefault: function() {
                this.go = false;
            },
            'detail': {
                'value': e.detail.value
            }
        };
        this.emit('remove', event);
        if (!event.go) {
            e.preventDefault();
        }
    }

    public onChange(e: clickgo.control.IGreatlistChangeEvent): void {
        const event: clickgo.control.IGreatselectChangeEvent = {
            'go': true,
            preventDefault: function() {
                this.go = false;
            },
            'detail': {
                'value': e.detail.value
            }
        };
        this.emit('change', event);
        if (!event.go) {
            e.preventDefault();
        }
    }

    public onChanged(e: clickgo.control.IGreatlistChangedEvent): void {
        const event: clickgo.control.IGreatselectChangedEvent = {
            'detail': {
                'value': e.detail.value
            }
        };
        this.emit('changed', event);
    }

}

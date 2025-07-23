import * as clickgo from 'clickgo';
import * as types from '~/types';

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'remove': null,
        'add': null,
        'change': null,
        'changed': null,

        'update:modelValue': null
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
                'width': this.element.offsetWidth
            },
            'autoPosition': true,
            'autoScroll': true,
            'way': 'click'
        });
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

    public itemclicked(e: types.IListItemclickedEvent): void {
        if (e.detail.arrow) {
            return;
        }
        if (this.propBoolean('multi')) {
            // --- 多选不隐藏 ---
            return;
        }
        this.hidePop();
    }

    public onAdd(e: types.IGreatlistAddEvent): void {
        const event: types.IGreatselectAddEvent = {
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

    public onRemove(e: types.IGreatlistRemoveEvent): void {
        const event: types.IGreatselectRemoveEvent = {
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

    public onChange(e: types.IGreatlistChangeEvent): void {
        const event: types.IGreatselectChangeEvent = {
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

    public onChanged(e: types.IGreatlistChangedEvent): void {
        const event: types.IGreatselectChangedEvent = {
            'detail': {
                'value': e.detail.value
            }
        };
        this.emit('changed', event);
    }

}

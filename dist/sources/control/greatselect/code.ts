import * as clickgo from 'clickgo';
import * as types from '~/types';

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'remove': null,
        'add': null
    };

    public props: {
        'disabled': boolean | string;
        'multi': boolean | string;
        'direction': 'h' | 'v';
        'area': 'all' | 'text' | 'arrow';
        'pop': 'greatlist' | 'custom';

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
            'data': [],
            'sizes': {},
            'modelValue': []
        };

    public padding = '';

    public font = '';

    public isSpaceDown = false;

    public get opMargin(): string {
        return this.padding.replace(/(\w+)/g, '-$1');
    }

    /**
     * --- 显示 pop，可供别人调用 ---
     */
    public showPop(): void {
        clickgo.form.showPop(this.element, this.refs.pop, 'v', {
            'size': {
                'width': this.element.offsetWidth
            },
            'autoPosition': true
        });
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
            clickgo.form.hidePop(this.element);
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

    public itemclick(e: MouseEvent, arrow: boolean): void {
        if (arrow) {
            return;
        }
        if (this.propBoolean('multi')) {
            // --- 多选不隐藏 ---
            return;
        }
        clickgo.form.hidePop();
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

    public onMounted(): void {
        clickgo.dom.watchStyle(this.element, ['font', 'padding'], (n, v) => {
            switch (n) {
                case 'font': {
                    this.font = v;
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

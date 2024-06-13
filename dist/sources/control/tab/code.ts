import * as clickgo from 'clickgo';
import * as types from '~/types/index';

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'close': null,

        'update:tabs': null,
        'update:modelValue': null
    };

    public props = {
        'tabPosition': 'top',
        'drag': false,
        'close': false,

        'tabs': [],
        'modelValue': ''
    };

    public arrow = false;

    public timer = 0;

    public tabsData: Array<{
        'label'?: string;
        'value'?: string;
        'drag'?: boolean;
        'close'?: boolean;
    } | string> = [];

    public oldTabs = undefined;

    public value = '';

    public rand = '';

    public get isDrag(): boolean {
        return clickgo.tool.getBoolean(this.props.drag);
    }

    public get isClose(): boolean {
        return clickgo.tool.getBoolean(this.props.close);
    }

    public get tabsComp(): any[] {
        const tabs = [];
        for (const item of this.tabsData) {
            if (typeof item !== 'object') {
                tabs.push({
                    'label': item,
                    'value': item,
                    'drag': this.isDrag,
                    'close': this.isClose
                });
            }
            else {
                tabs.push({
                    'label': item.label ?? item.value ?? 'error',
                    'value': item.value ?? item.label ?? 'error',
                    'drag': item.drag ?? this.isDrag,
                    'close': item.close ?? this.isClose
                });
            }
        }
        return tabs;
    }

    public get values(): string[] {
        const list = [];
        for (const item of this.tabsComp) {
            list.push(item.value);
        }
        return list;
    }

    public wheel(e: WheelEvent): void {
        if (this.props.tabPosition === 'left' || this.props.tabPosition === 'right') {
            this.refs.tabs[0].scrollTop += e.deltaY;
            return;
        }
        if (e.deltaX !== 0) {
            this.refs.tabs[0].scrollLeft += e.deltaX;
            return;
        }
        this.refs.tabs[0].scrollLeft += e.deltaY;
    }

    public down(e: MouseEvent | TouchEvent, index: number): void {
        const nval = this.tabsComp[index].value;
        if (this.value !== nval) {
            this.value = nval;
            this.emit('update:modelValue', this.value);
        }
        clickgo.dom.bindDrag(e, {
            'el': (e.currentTarget as HTMLElement).parentNode as HTMLElement,
            'data': {
                'index': index,
                'tab': this.rand
            }
        });
    }

    public tabClose(e: MouseEvent, index: number, value: string): void {
        const event: types.ITabCloseEvent = {
            'go': true,
            preventDefault: function() {
                this.go = false;
            },
            'detail': {
                'index': index,
                'value': value
            }
        };
        this.emit('close', event);
        if (!event.go) {
            return;
        }
        e.stopPropagation();
        this.tabsData.splice(index, 1);
        this.emit('update:tabs', this.tabsData);
    }

    public drop(e: CustomEvent, index: number): void {
        if (typeof e.detail.value !== 'object') {
            return;
        }
        if (e.detail.value.tab !== this.rand) {
            return;
        }
        this.tabsData.splice(index, 0, this.tabsData.splice(e.detail.value.index, 1)[0]);
        this.emit('update:tabs', this.tabsData);
    }

    public tabClick(e: MouseEvent | TouchEvent, item: Record<string, any>): void {
        this.value = item.value;
        this.emit('update:modelValue', this.value);
    }

    public longDown(e: MouseEvent | TouchEvent, type: 'start' | 'end'): void {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        const num = type === 'start' ? -5 : 5;
        clickgo.dom.bindDown(e, {
            down: () => {
                this.timer = clickgo.task.onFrame(() => {
                    if (this.props.tabPosition === 'top' || this.props.tabPosition === 'bottom') {
                        this.refs.tabs[0].scrollLeft += num;
                    }
                    else {
                        this.refs.tabs[0].scrollTop += num;
                    }
                });
            },
            up: () => {
                clickgo.task.offFrame(this.timer);
                this.timer = 0;
            }
        });
    }

    // --- 检测是否显示箭头 ---
    public onResize(): void {
        const tab = this.refs.tabs[0];
        if (this.props.tabPosition === 'top' || this.props.tabPosition === 'bottom') {
            const width = this.arrow ? tab.clientWidth + 40 : tab.clientWidth;
            if (tab.scrollWidth > width) {
                this.arrow = true;
            }
            else {
                this.arrow = false;
            }
        }
        else {
            const height = this.arrow ? tab.clientHeight + 40 : tab.clientHeight;
            if (tab.scrollHeight > height) {
                this.arrow = true;
            }
            else {
                this.arrow = false;
            }
        }
    }

    public refreshValue(): void {
        // --- 默认选项卡选择 ---
        if (this.value === '') {
            const v = this.values[0] ? this.values[0] : '';
            if (this.value !== v) {
                this.value = v;
                this.emit('update:modelValue', this.value);
            }
        }
        else if (!this.values.includes(this.value)) {
            const v = this.values[this.values.length - 1] ? this.values[this.values.length - 1] : '';
            if (this.value !== v) {
                this.value = v;
                this.emit('update:modelValue', this.value);
            }
        }
    }

    public onMounted(): void {
        this.watch('modelValue', (): void => {
            if (this.value !== this.props.modelValue) {
                this.value = this.props.modelValue;
                this.refreshValue();
            }
        }, {
            'immediate': true
        });
        this.watch('tabs', (): void => {
            this.tabsData = this.props.tabs;
        }, {
            'deep': true
        });
        this.watch('tabsComp', (): void => {
            this.refreshValue();
            this.nextTick().then(() => {
                this.onResize();
            }).catch(function(e) {
                console.log(e);
            });
        }, {
            'deep': true
        });
        this.watch('tabPosition', async (): Promise<void> => {
            await this.nextTick();
            if (this.oldTabs === this.refs.tabs[0]) {
                return;
            }
            this.oldTabs = this.refs.tabs[0];
            clickgo.dom.watchSize(this.refs.tabs[0], () => {
                this.onResize();
            });
        });

        this.rand = clickgo.tool.random(16);
        this.tabsData = this.props.tabs;
        // --- 检测是否显示箭头 ---
        this.oldTabs = this.refs.tabs[0];
        clickgo.dom.watchSize(this.refs.tabs[0], () => {
            this.onResize();
        });
        this.refreshValue();
    }

}

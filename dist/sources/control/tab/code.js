import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    emits = {
        'close': null,
        'change': null,
        'changed': null,
        'update:tabs': null,
        'update:modelValue': null
    };
    props = {
        'tabPosition': 'top',
        'drag': false,
        'close': false,
        'tabs': [],
        'modelValue': ''
    };
    arrow = false;
    timer = 0;
    tabsData = [];
    oldTabs = undefined;
    value = '';
    rand = '';
    get isDrag() {
        return clickgo.tool.getBoolean(this.props.drag);
    }
    get isClose() {
        return clickgo.tool.getBoolean(this.props.close);
    }
    get tabsComp() {
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
    get values() {
        const list = [];
        for (const item of this.tabsComp) {
            list.push(item.value);
        }
        return list;
    }
    wheel(e) {
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
    down(e, index) {
        const nval = this.tabsComp[index].value;
        if (this.value !== nval) {
            this.value = nval;
            this.emit('update:modelValue', this.value);
        }
        clickgo.modules.pointer.drag(e, e.currentTarget.parentNode, {
            'data': {
                'index': index,
                'tab': this.rand
            }
        });
    }
    tabClose(e, index, value) {
        const event = {
            'go': true,
            preventDefault: function () {
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
    drop(e, index) {
        if (typeof e.detail.value !== 'object') {
            return;
        }
        if (e.detail.value.tab !== this.rand) {
            return;
        }
        this.tabsData.splice(index, 0, this.tabsData.splice(e.detail.value.index, 1)[0]);
        this.emit('update:tabs', this.tabsData);
    }
    tabClick(e, item) {
        const event = {
            'go': true,
            preventDefault: function () {
                this.go = false;
            },
            'detail': {
                'value': item.value
            }
        };
        this.emit('change', event);
        if (!event.go) {
            return;
        }
        this.value = item.value;
        this.emit('update:modelValue', this.value);
        const event2 = {
            'detail': {
                'value': item.value
            }
        };
        this.emit('changed', event2);
    }
    longDown(e, type) {
        const num = type === 'start' ? -5 : 5;
        clickgo.modules.pointer.down(e, {
            down: () => {
                this.timer = clickgo.task.onFrame(this, () => {
                    if (this.props.tabPosition === 'top' || this.props.tabPosition === 'bottom') {
                        this.refs.tabs[0].scrollLeft += num;
                    }
                    else {
                        this.refs.tabs[0].scrollTop += num;
                    }
                });
            },
            up: () => {
                clickgo.task.offFrame(this, this.timer);
                this.timer = 0;
            }
        });
    }
    // --- 检测是否显示箭头 ---
    onResize() {
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
    refreshValue() {
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
    onMounted() {
        this.watch('tabs', () => {
            this.tabsData = clickgo.tool.clone(this.props.tabs);
        }, {
            'deep': true,
            'immediate': true
        });
        this.watch('modelValue', () => {
            if (this.value !== this.props.modelValue) {
                this.value = this.props.modelValue;
                this.refreshValue();
            }
        }, {
            'immediate': true
        });
        this.watch('tabsComp', () => {
            this.refreshValue();
            this.nextTick().then(() => {
                this.onResize();
            }).catch(() => { });
        }, {
            'deep': true
        });
        this.watch('tabPosition', async () => {
            await this.nextTick();
            if (this.oldTabs === this.refs.tabs[0]) {
                return;
            }
            this.oldTabs = this.refs.tabs[0];
            clickgo.dom.watchSize(this, this.refs.tabs[0], () => {
                this.onResize();
            });
        });
        this.rand = clickgo.tool.random(16);
        // --- 检测是否显示箭头 ---
        this.oldTabs = this.refs.tabs[0];
        clickgo.dom.watchSize(this, this.refs.tabs[0], () => {
            this.onResize();
        });
        this.refreshValue();
    }
}

import * as clickgo from 'clickgo';
/** --- 同一窗体内的 Dock 实例注册表，确保同时只有一个浮动面板打开 --- */
const formDocks = new WeakMap();
/** --- Dock 进入窄布局的宽度，与 Nav 的浮层模式断点保持一致 --- */
const narrowWidth = 600;
export default class extends clickgo.control.AbstractControl {
    emits = {
        'update:expanded': null
    };
    props = {
        'expanded': true,
        'position': 'right',
        'width': 280
    };
    /** --- 不参与响应式处理的 Form 尺寸监听状态 --- */
    access = {
        'formSizeWatch': null
    };
    /** --- 当前是否展开 --- */
    expandedData = true;
    /** --- 当前是否因所在布局区域过窄而强制收起 --- */
    narrow = false;
    /** --- 浮动面板当前指向的 group 索引，-1 表示关闭 --- */
    floatGroup = -1;
    /** --- 浮动面板可使用的 Dock 内容区高度 --- */
    floatAreaHeight = 0;
    /** --- 侧栏所在位置 --- */
    get positionData() {
        return this.props.position === 'left' ? 'left' : 'right';
    }
    /** --- 当前折叠按钮是否显示向右箭头 --- */
    get chevronRight() {
        return (this.positionData === 'right') === this.expandedData;
    }
    /** --- 展开时的宽度 --- */
    get widthComp() {
        if (typeof this.props.width === 'number') {
            return `${this.props.width}px`;
        }
        if (/^\d+$/.test(this.props.width)) {
            return `${this.props.width}px`;
        }
        return this.props.width;
    }
    /** --- 切换展开/收起 --- */
    toggle() {
        if (this.narrow) {
            return;
        }
        this.expandedData = !this.expandedData;
        this.floatGroup = -1;
        this.emit('update:expanded', this.expandedData);
    }
    /**
     * --- 使用键盘切换展开状态 ---
     * @param event 键盘事件
     */
    toggleKeydown(event) {
        if ((event.key !== 'Enter') && (event.key !== ' ')) {
            return;
        }
        event.preventDefault();
        this.toggle();
    }
    /**
     * --- 收起模式下打开或关闭浮动分组 ---
     * @param groupIndex 分组索引
     */
    toggleFloat(groupIndex) {
        if (this.floatGroup === groupIndex) {
            this.floatGroup = -1;
            return;
        }
        const siblings = formDocks.get(this.rootForm);
        if (siblings) {
            for (const dock of siblings) {
                if (dock !== this) {
                    dock.floatGroup = -1;
                }
            }
        }
        this.floatGroup = groupIndex;
    }
    /** --- 关闭浮动面板 --- */
    closeFloat() {
        this.floatGroup = -1;
    }
    /**
     * --- 获取浮动面板所在的 Dock 内容区 ---
     * @returns Dock 内容区元素
     */
    getFloatArea() {
        return this.refs.body ?? null;
    }
    async onMounted() {
        const form = this.rootForm;
        if (!formDocks.has(form)) {
            formDocks.set(form, new Set());
        }
        formDocks.get(form).add(this);
        this.watch('expanded', () => {
            this.expandedData = !this.narrow && this.propBoolean('expanded');
            this.floatGroup = -1;
        }, {
            'immediate': true
        });
        await this.nextTick();
        const formElement = this.rootForm.element;
        if (!formElement.isConnected) {
            return;
        }
        const handler = () => {
            const narrow = formElement.offsetWidth < narrowWidth;
            if (this.narrow === narrow) {
                return;
            }
            this.narrow = narrow;
            this.expandedData = !narrow && this.propBoolean('expanded');
            this.floatGroup = -1;
        };
        if (clickgo.dom.watchSizeMulti(this, formElement, handler, true)) {
            this.access.formSizeWatch = {
                'element': formElement,
                'handler': handler
            };
        }
        clickgo.dom.watchSize(this, this.refs.body, () => {
            this.floatAreaHeight = this.refs.body.clientHeight;
        }, true);
    }
    onUnmounted() {
        const sizeWatch = this.access.formSizeWatch;
        if (sizeWatch) {
            clickgo.dom.unwatchSizeMulti(this, sizeWatch.element, sizeWatch.handler);
            this.access.formSizeWatch = null;
        }
        const siblings = formDocks.get(this.rootForm);
        siblings?.delete(this);
        if (!siblings?.size) {
            formDocks.delete(this.rootForm);
        }
    }
}

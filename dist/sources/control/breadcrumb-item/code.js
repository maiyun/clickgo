import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    emits = {
        'select': null,
    };
    props = {
        'name': '',
        'label': '',
        'icon': '',
        'disabled': false,
    };
    /** --- 所属面包屑 --- */
    breadcrumb = null;
    /** --- 按直属子项实际顺序计算的索引 --- */
    index = 0;
    /** --- 当前项在完成注册前保持不可操作 --- */
    isCurrent = true;
    /** --- 空格按下后等待释放，移开焦点即取消 --- */
    isSpaceDown = false;
    /** --- 单项及整组禁用状态 --- */
    get isDisabled() {
        return this.propBoolean('disabled') || (this.breadcrumb?.propBoolean('disabled') ?? false);
    }
    /** --- 分隔符由所属面包屑统一提供 --- */
    get separator() {
        return this.breadcrumb?.props.separator ?? '/';
    }
    /**
     * --- 通知应用选择历史层级，不在控件内部执行跳转 ---
     * @returns 选择通知完成，当前位置或禁用项不触发事件
     */
    select() {
        const breadcrumb = this.breadcrumb;
        if (!breadcrumb || this.isCurrent || this.isDisabled) {
            return;
        }
        const event = {
            'detail': {
                'name': this.props.name || this.props.label,
                'index': this.index,
            },
        };
        this.emit('select', event);
        breadcrumb.emit('select', event);
    }
    /**
     * --- 使用框架一致的键盘激活流程，阻止宿主重复生成 click ---
     * @param event 键盘按下事件
     * @returns 按键处理完成
     */
    keydown(event) {
        if (event.key !== 'Enter' && event.key !== ' ') {
            return;
        }
        event.preventDefault();
        if (event.repeat || event.isComposing || this.isCurrent || this.isDisabled) {
            return;
        }
        if (event.key === 'Enter') {
            this.select();
        }
        else {
            this.isSpaceDown = true;
        }
    }
    /**
     * --- 空格释放时激活仍可操作的历史层级 ---
     * @param event 键盘释放事件
     * @returns 按键处理完成
     */
    keyup(event) {
        if (event.key !== ' ' || !this.isSpaceDown) {
            return;
        }
        event.preventDefault();
        this.isSpaceDown = false;
        this.select();
    }
    /**
     * --- 禁用或变为当前位置时取消待释放的空格操作 ---
     * @returns 状态校正完成
     */
    onBeforeUpdate() {
        if (this.isCurrent || this.isDisabled) {
            this.isSpaceDown = false;
        }
    }
    /**
     * --- 关联父控件并参与当前位置计算 ---
     * @returns 注册完成
     */
    onMounted() {
        this.breadcrumb = this.parentByName('breadcrumb');
        this.breadcrumb?.register(this);
    }
    /**
     * --- 解除父控件持有的引用 ---
     * @returns 注销完成
     */
    onBeforeUnmount() {
        this.breadcrumb?.unregister(this);
        this.breadcrumb = null;
    }
}

import * as clickgo from 'clickgo';
import type Breadcrumb from '../breadcrumb/code';

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'select': null,
    };

    public props: {
        /** --- 事件携带的层级标识，空值时回退到 label --- */
        'name': string;
        /** --- 未提供默认插槽时显示的文字 --- */
        'label': string;
        /** --- 图标资源，支持 SVG 与图片 --- */
        'icon': string;
        /** --- 禁止操作当前历史层级 --- */
        'disabled': boolean | string;
    } = {
            'name': '',
            'label': '',
            'icon': '',
            'disabled': false,
        };

    /** --- 所属面包屑 --- */
    public breadcrumb: Breadcrumb | null = null;

    /** --- 按直属子项实际顺序计算的索引 --- */
    public index = 0;

    /** --- 当前项在完成注册前保持不可操作 --- */
    public isCurrent = true;

    /** --- 空格按下后等待释放，移开焦点即取消 --- */
    public isSpaceDown = false;

    /** --- 单项及整组禁用状态 --- */
    public get isDisabled(): boolean {
        return this.propBoolean('disabled') || (this.breadcrumb?.propBoolean('disabled') ?? false);
    }

    /** --- 分隔符由所属面包屑统一提供 --- */
    public get separator(): string {
        return this.breadcrumb?.props.separator ?? '/';
    }

    /**
     * --- 通知应用选择历史层级，不在控件内部执行跳转 ---
     * @returns 选择通知完成，当前位置或禁用项不触发事件
     */
    public select(): void {
        const breadcrumb = this.breadcrumb;
        if (!breadcrumb || this.isCurrent || this.isDisabled) {
            return;
        }
        const event: clickgo.control.IBreadcrumbSelectEvent = {
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
    public keydown(event: KeyboardEvent): void {
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
    public keyup(event: KeyboardEvent): void {
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
    public onBeforeUpdate(): void {
        if (this.isCurrent || this.isDisabled) {
            this.isSpaceDown = false;
        }
    }

    /**
     * --- 关联父控件并参与当前位置计算 ---
     * @returns 注册完成
     */
    public onMounted(): void {
        this.breadcrumb = this.parentByName('breadcrumb') as Breadcrumb | null;
        this.breadcrumb?.register(this);
    }

    /**
     * --- 解除父控件持有的引用 ---
     * @returns 注销完成
     */
    public onBeforeUnmount(): void {
        this.breadcrumb?.unregister(this);
        this.breadcrumb = null;
    }

}

import * as clickgo from 'clickgo';
import type BreadcrumbItem from '../breadcrumb-item/code';

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'select': null,
    };

    public props: {
        /** --- 导航区域的无障碍名称，由应用提供本地化文案 --- */
        'label': string;
        /** --- 相邻层级间的分隔文本 --- */
        'separator': string;
        /** --- 禁用所有历史层级的操作 --- */
        'disabled': boolean | string;
    } = {
            'label': '',
            'separator': '/',
            'disabled': false,
        };

    /** --- 子项实例只在当前控件生命周期内保留，不参与响应式深克隆 --- */
    public access = {
        'items': null as Map<HTMLElement, BreadcrumbItem> | null,
    };

    /**
     * --- 按实际 DOM 顺序更新索引和当前位置，支持条件渲染及重排 ---
     * @returns 子项状态更新完成
     */
    public refreshItems(): void {
        if (!this.access.items || !this.refs.list) {
            return;
        }
        const items: BreadcrumbItem[] = [];
        for (const element of this.refs.list.children) {
            const item = this.access.items.get(element as HTMLElement);
            if (item) {
                items.push(item);
            }
        }
        for (const [index, item] of items.entries()) {
            item.index = index;
            item.isCurrent = index === items.length - 1;
        }
    }

    /**
     * --- 注册已挂载的直属面包屑项 ---
     * @param item 子项实例
     * @returns 注册完成
     */
    public register(item: BreadcrumbItem): void {
        this.access.items?.set(item.element, item);
        this.refreshItems();
    }

    /**
     * --- 移除即将卸载的子项并修正当前位置 ---
     * @param item 子项实例
     * @returns 移除完成
     */
    public unregister(item: BreadcrumbItem): void {
        this.access.items?.delete(item.element);
        this.refreshItems();
    }

    /**
     * --- 逐实例初始化子项表 ---
     * @returns 初始化完成
     */
    public onCreated(): void {
        this.access.items = new Map();
    }

    /**
     * --- 子项完成首次挂载后统一确定当前位置 ---
     * @returns 初始化完成
     */
    public onMounted(): void {
        this.refreshItems();
    }

    /**
     * --- 插槽增删或重排后同步子项顺序 ---
     * @returns 更新完成
     */
    public onUpdated(): void {
        this.refreshItems();
    }

    /**
     * --- 释放当前控件持有的子项引用 ---
     * @returns 清理完成
     */
    public onBeforeUnmount(): void {
        this.access.items = null;
    }

}

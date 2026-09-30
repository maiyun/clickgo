import * as clickgo from 'clickgo';
import iconviewFrm from '../../control/iconview/iconview';
import { createItems, createPositions, receiveDrop } from '../../control/desktop/data';

export default class extends clickgo.form.AbstractForm {

    public list: clickgo.control.IDesktopItem[] = [
        { 'id': 'return', 'name': 'Back to demo', 'icon': '/package/res/icon.svg', 'locked': true },
        { 'id': 'parameters', 'name': 'Desktop parameters', 'icon': '/package/res/icon.svg' },
        { 'id': 'iconview', 'name': 'Iconview demo', 'icon': '/package/res/icon.svg' },
        ...createItems()
    ];

    public selected: string[] = [];

    public positions = createPositions();

    public returnFormId = '';

    public nextId = 1;

    public saved = true;

    public wallpaper = true;

    public wallpaperImage = '';

    /** --- 使用 Form 的背景能力，桌面仍只有一个 Desktop 内容控件 --- */
    public get background(): string {
        const overlay = 'color-mix(in oklch, var(--g-background) 65%, transparent)';
        return this.wallpaper && this.wallpaperImage ?
            `linear-gradient(${overlay}, ${overlay}), url("${this.wallpaperImage}") center / cover` : '';
    }

    /**
     * --- 演示设置和移除桌面背景图片 ---
     * @returns 无返回值
     */
    public toggleWallpaper(): void {
        this.wallpaper = !this.wallpaper;
        clickgo.storage.set(this, 'desktop.workspace.wallpaper', this.wallpaper ? 1 : 0);
    }

    /** --- 调用方提供参数窗体类，避免两个示例窗体相互导入 --- */
    public access: {
        'parametersForm': (new () => clickgo.form.AbstractForm) | null;
    } = { 'parametersForm': null };

    /**
     * --- 回到打开桌面演示的窗体 ---
     * @returns 焦点切换后结束
     */
    public async back(): Promise<void> {
        if (this.returnFormId) {
            await clickgo.form.changeFocus(this.returnFormId);
        }
    }

    /**
     * --- 由图标打开实际示例窗体或演示文件 ---
     * @param values 图标 ID
     * @returns 请求的窗体或对话框显示后结束
     */
    public async open(values: string[]): Promise<void> {
        for (const id of values) {
            if (id === 'return') {
                await this.back();
            }
            else if ((id === 'parameters') || (id === 'iconview')) {
                const cls = id === 'parameters' ? this.access.parametersForm : iconviewFrm;
                if (cls) {
                    const form = await clickgo.form.create(this, cls);
                    await form.show();
                }
            }
            else {
                const item = this.list.find(item => item.id === id);
                if (item) {
                    await clickgo.form.dialog(this, `${item.name}\nDrag icons to place them; right-click to open a menu. Saved positions are restored when you reopen this workspace.`);
                }
            }
        }
    }

    /**
     * --- 接收双击、Enter 和溢出入口的打开请求 ---
     * @param event 打开事件
     * @returns 请求处理后结束
     */
    public async onOpen(event: clickgo.control.IDesktopOpenEvent): Promise<void> {
        await this.open(event.detail.value);
    }

    /**
     * --- 只保存拖动或整理后的用户布局，跳过尺寸变化和属性回写 ---
     * @param event 布局事件
     * @returns 无返回值
     */
    public onLayout(event: clickgo.control.IDesktopLayoutEvent): void {
        if ((event.detail.reason !== 'drag') && (event.detail.reason !== 'arrange')) {
            return;
        }
        this.saved = clickgo.storage.set(this, 'desktop.workspace.positions', event.detail.preferredPositions);
    }

    /**
     * --- 新图标没有预设位置，由控件安排空位 ---
     * @returns 无返回值
     */
    public add(): void {
        const id = this.nextId++;
        this.list.push({ 'id': `shortcut-${id}`, 'name': `Shortcut ${id}`, 'icon': '/package/res/txt.svg' });
    }

    /**
     * --- 删除图标只改变数据，控件清理对应位置和选择 ---
     * @returns 无返回值
     */
    public remove(): void {
        this.list = this.list.filter(item => !this.selected.includes(item.id) || item.locked);
    }

    /**
     * --- 整理图标 ---
     * @returns 无返回值
     */
    public arrange(): void {
        this.refs.desktop.arrange();
    }

    /**
     * --- 关闭桌面演示并回到调用方 ---
     * @returns 焦点恢复后结束
     */
    public async finish(): Promise<void> {
        clickgo.form.close(this.formId);
        await this.back();
    }

    /**
     * --- 使用现有置底能力，恢复此前保存的有限位置 ---
     * @param data 调用方的返回窗体和参数示例类
     * @returns 无返回值
     */
    public async onMounted(data: {
        'returnFormId'?: string;
        'parametersForm'?: new () => clickgo.form.AbstractForm;
    }): Promise<void> {
        this.bottomMost = true;
        this.showInSystemTask = false;
        this.returnFormId = data.returnFormId ?? '';
        this.access.parametersForm = data.parametersForm ?? null;
        const saved: unknown = clickgo.storage.get(this, 'desktop.workspace.positions');
        if (saved && (typeof saved === 'object') && !Array.isArray(saved)) {
            const entries: Array<[string, clickgo.control.IDesktopPosition]> = [];
            for (const [id, point] of Object.entries(saved)) {
                if (point && (typeof point === 'object') && ('x' in point) && ('y' in point) &&
                    (typeof point.x === 'number') && (typeof point.y === 'number') && Number.isFinite(point.x) && Number.isFinite(point.y)) {
                    entries.push([id, { 'x': point.x, 'y': point.y }]);
                }
            }
            this.positions = Object.fromEntries(entries);
        }
        this.wallpaper = clickgo.storage.get(this, 'desktop.workspace.wallpaper') !== 0;
        const image = await clickgo.fs.getContent(this, '/package/res/img.jpg');
        if (image && (typeof image !== 'string')) {
            this.wallpaperImage = await clickgo.tool.blob2DataUrl(image);
        }
    }

    /**
     * --- 演示从其他控件或任务拖入桌面，目录落点交给业务处理 ---
     * @param event 公共文件拖入事件
     * @returns 示例更新或目录提示关闭后结束
     */
    public async onDrop(event: clickgo.control.IDesktopDropEvent): Promise<void> {
        const items = await receiveDrop(this, event);
        if (!items.length) {
            return;
        }
        this.list.push(...items);
        this.positions = { ...this.positions, [items[0].id]: { ...event.detail.position } };
        this.selected = items.map(item => item.id);
    }

}

import * as clickgo from 'clickgo';
import workspaceFrm from '../../solution/desktop/desktop';
import iconviewFrm from '../iconview/iconview';
import { createItems, createPositions, receiveDrop } from './data';

export default class DesktopFrm extends clickgo.form.AbstractForm {

    public list = createItems();

    public positions = createPositions();

    public selected: string[] = [];

    public overflow: string[] = [];

    public saved: clickgo.control.TDesktopPositions | null = null;

    public nextId = 1;

    public lastLayout = '';

    public disabled = false;

    public multi = true;

    public ctrl = true;

    public selection = true;

    public draggable = true;

    public autoArrange = false;

    public snap = true;

    public plain = false;

    public keepActive = false;

    public custom = false;

    public wallpaper = false;

    public wallpaperImage = '';

    public backgroundSize = ['cover'];

    public backgroundRepeat = ['no-repeat'];

    public backgroundPosition = ['center'];

    public textShadow = true;

    /** --- 示例图片转换为数据 URL 后作为 CSS 背景，不叠加遮罩 --- */
    public get background(): string {
        return this.wallpaper && this.wallpaperImage ? `url("${this.wallpaperImage}")` : '';
    }

    public size = [48];

    public direction = ['column'];

    public cellWidth = '96';

    public cellHeight = '96';

    public gap = '8';

    public padding = '8';

    public target = ['documents'];

    public x = '8';

    public y = '8';

    /** --- 图标目标按稳定 ID 选择 --- */
    public get targets(): Array<{ 'value': string; 'label': string; }> {
        return this.list.map(item => ({ 'value': item.id, 'label': item.name }));
    }

    /** --- 双向绑定输出，供直接检查和复制 --- */
    public get positionText(): string {
        return JSON.stringify(this.positions, null, 2);
    }

    /**
     * --- 添加唯一 ID 的图标，可以增加到超过区域容量 ---
     * @param count 新增数量
     * @returns 无返回值
     */
    public add(count = 1): void {
        for (let i = 0; i < count; ++i) {
            const id = this.nextId++;
            this.list.push({ 'id': `new-${id}`, 'name': `New folder ${id}`, 'type': 0 });
        }
    }

    /**
     * --- 删除当前选择，剩余图标保持各自的位置 ---
     * @returns 无返回值
     */
    public remove(): void {
        this.list = this.list.filter(item => !this.selected.includes(item.id));
    }

    /**
     * --- 从应用端主动修改单个图标的位置 ---
     * @returns 无返回值
     */
    public place(): void {
        const id = this.target[0];
        const x = Number(this.x);
        const y = Number(this.y);
        if (!id || !Number.isFinite(x) || !Number.isFinite(y)) {
            return;
        }
        this.positions = { ...this.positions, [id]: { 'x': x, 'y': y } };
    }

    /**
     * --- 保存独立快照，后续拖动不会修改快照 ---
     * @returns 无返回值
     */
    public save(): void {
        this.saved = clickgo.tool.clone(this.positions);
    }

    /**
     * --- 恢复位置，控件会按照当前区域大小重新校验 ---
     * @returns 无返回值
     */
    public restore(): void {
        if (this.saved) {
            this.positions = clickgo.tool.clone(this.saved);
        }
    }

    /**
     * --- 使用控件公开方法整理图标 ---
     * @returns 无返回值
     */
    public arrange(): void {
        this.refs.desktop.arrange();
    }

    /**
     * --- 为所选图标切换用户拖动锁定状态 ---
     * @returns 无返回值
     */
    public toggleLock(): void {
        for (const item of this.list) {
            if (this.selected.includes(item.id)) {
                item.locked = !item.locked;
            }
        }
    }

    /**
     * --- 展示打开事件中的稳定 ID ---
     * @param values 图标 ID
     * @returns 对话框关闭后结束
     */
    public async open(values: string[]): Promise<void> {
        const names = this.list.filter(item => values.includes(item.id)).map(item => item.name);
        await clickgo.form.dialog(this, `Open: ${names.join(', ')}`);
    }

    /**
     * --- 接收控件打开事件 ---
     * @param event 打开事件
     * @returns 对话框关闭后结束
     */
    public async onOpen(event: clickgo.control.IDesktopOpenEvent): Promise<void> {
        await this.open(event.detail.value);
    }

    /**
     * --- 展示布局变更来源 ---
     * @param event 布局事件
     * @returns 无返回值
     */
    public onLayout(event: clickgo.control.IDesktopLayoutEvent): void {
        this.lastLayout = event.detail.reason;
    }

    /**
     * --- 展示未放入区域的 ID，默认 +N 菜单仍可打开它们 ---
     * @param event 溢出事件
     * @returns 无返回值
     */
    public onOverflow(event: clickgo.control.IDesktopOverflowEvent): void {
        this.overflow = event.detail.value;
    }

    /**
     * --- 打开只有 Desktop 控件的置底实战 Form ---
     * @returns 窗体显示后结束
     */
    public async openDesktop(): Promise<void> {
        const form = await clickgo.form.create(this, workspaceFrm, {
            'returnFormId': this.formId,
            'parametersForm': DesktopFrm
        });
        await form.show();
    }

    /**
     * --- 切换目标时填写已有坐标，并加载示例壁纸 ---
     * @returns 图片加载后结束
     */
    public async onMounted(): Promise<void> {
        this.watch('target', () => {
            const point = this.positions[this.target[0]];
            this.x = (point?.x ?? 8).toString();
            this.y = (point?.y ?? 8).toString();
        }, { 'deep': true });
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

    /**
     * --- 打开接收和发送通用文件拖拽的另一个窗体 ---
     * @returns 示例窗体显示后结束
     */
    public async openIconview(): Promise<void> {
        const form = await clickgo.form.create(this, iconviewFrm);
        await form.show();
    }

}

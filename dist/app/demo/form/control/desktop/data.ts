import * as clickgo from 'clickgo';

/**
 * --- 为每个演示实例提供独立的图标数据 ---
 * @returns 示例图标
 */
export function createItems(): clickgo.control.IDesktopItem[] {
    const items: clickgo.control.IDesktopItem[] = [
        { 'id': 'documents', 'name': 'Documents', 'type': 0 },
        { 'id': 'pictures', 'name': 'Pictures', 'type': 0 },
        { 'id': 'notes', 'name': 'notes.txt', 'icon': '/package/res/txt.svg' },
        { 'id': 'database', 'name': 'database.sql', 'icon': '/package/res/sql.svg' },
        { 'id': 'archive', 'name': 'archive.zip', 'icon': '/package/res/zip.svg' },
        { 'id': 'guide', 'name': 'A long desktop icon name to demonstrate text wrapping.txt', 'icon': '/package/res/txt.svg' },
        { 'id': 'clickgo', 'name': 'ClickGo', 'icon': '/package/res/icon.svg', 'locked': true }
    ];
    return items.map(item => ({ ...item, 'path': `/demo/desktop/${item.id}` }));
}

/**
 * --- 分散摆放，展示主动设置位置而非按数组顺序排列 ---
 * @returns 示例位置
 */
export function createPositions(): clickgo.control.TDesktopPositions {
    return {
        'documents': { 'x': 8, 'y': 8 },
        'pictures': { 'x': 112, 'y': 8 },
        'notes': { 'x': 8, 'y': 112 },
        'database': { 'x': 216, 'y': 112 },
        'archive': { 'x': 112, 'y': 216 },
        'guide': { 'x': 216, 'y': 216 },
        'clickgo': { 'x': 320, 'y': 8 }
    };
}

/**
 * --- 收到文件拖入请求；示例仅创建图标，不读写真实文件 ---
 * @param current 当前窗体
 * @param event 拖入数据
 * @returns 空白落点新增的示例图标，目录落点只展示请求
 */
export async function receiveDrop(
    current: clickgo.form.AbstractForm, event: clickgo.control.IDesktopDropEvent
): Promise<clickgo.control.IDesktopItem[]> {
    if (event.detail.to) {
        await clickgo.form.dialog(current, `Drop into folder: ${event.detail.to.name}\n${JSON.stringify(event.detail.from, null, 2)}\nThis demo reports the request without changing real files.`);
        return [];
    }
    return event.detail.from.map(item => ({
        'id': `dropped-${clickgo.tool.random(12)}`,
        'name': (item.name?.length ? item.name : undefined) ?? item.path.split('/').filter(Boolean).at(-1) ?? `Dropped item ${item.index + 1}`,
        'type': item.type === 0 ? 0 : 1,
        'path': item.path,
        'icon': item.type === 0 ? undefined : '/package/res/txt.svg'
    }));
}

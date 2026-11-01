/**
 * --- 监听宿主活跃状态，监听器随宿主页面存活；调用方负责只初始化一次 ---
 * @param host 宿主窗口
 * @param page 宿主文档
 * @param callback 状态变化回调；可见且拥有焦点为 true，初始化不调用
 * @returns 无
 */
export function watchActive(host, page, callback) {
    let active = page.visibilityState === 'visible' && page.hasFocus();
    const update = () => {
        const next = page.visibilityState === 'visible' && page.hasFocus();
        if (next === active) {
            return;
        }
        active = next;
        callback(active);
    };
    page.addEventListener('visibilitychange', update);
    host.addEventListener('focus', update);
    host.addEventListener('blur', update);
}

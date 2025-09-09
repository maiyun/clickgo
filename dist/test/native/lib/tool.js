/** --- 当前系统平台 --- */
const platform = process.platform;
/**
 * --- 间隔一段时间 ---
 * @param ms 间隔毫秒
 */
export function sleep(ms) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve();
        }, ms);
    });
}
/** --- path 要额外处理一下，因为 windows 下可能有点不一样 --- */
export function formatPath(path) {
    if (platform !== 'win32') {
        return path;
    }
    if (path === '/') {
        return path;
    }
    path = path.replace(/\//g, '\\');
    return path[1] + ':' + path.slice(2);
}
/** --- 将真实路径转换回去 --- */
export function parsePath(path) {
    if (platform !== 'win32') {
        return path;
    }
    path = path.replace(/\\/g, '/');
    if (path === '/') {
        return path;
    }
    return '/' + path[0].toLowerCase() + path.slice(2);
}

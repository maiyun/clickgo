const platform: NodeJS.Platform = process.platform;
export function sleep(ms: number): Promise<void> {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve();
        }, ms);
    });
}
export function formatPath(path: string): string {
    if (platform !== 'win32') {
        return path;
    }
    if (path === '/') {
        return path;
    }
    path = path.replace(/\//g, '\\');
    return path[1] + ':' + path.slice(2);
}
export function parsePath(path: string): string {
    if (platform !== 'win32') {
        return path;
    }
    path = path.replace(/\\/g, '/');
    if (path === '/') {
        return path;
    }
    return '/' + path[0].toLowerCase() + path.slice(2);
}

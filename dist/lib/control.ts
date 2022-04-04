/** --- clickgo 中的 cgc 文件读取后的 pkg 对象 --- */
export const clickgoControlPkgs: Record<string, ICGControlPkg> = {};

/**
 * --- 将 cgc 文件 blob 转换为 pkg 对象，会自动创建 object url，请注意释放 ---
 * @param blob 文件 blob
 */
export async function read(blob: Blob): Promise<false | ICGControlPkg> {
    const zip = await clickgo.zip.get(blob);
    if (!zip) {
        return false;
    }
    // --- 创建空白 pkg 对象 ---
    const controlPkg: ICGControlPkg = {};
    const controls = zip.readDir();
    for (const control of controls) {
        if (control.isFile) {
            continue;
        }
        const configContent = await zip.getContent('/' + control.name + '/config.json');
        if (!configContent) {
            continue;
        }
        const config: ICGControlConfig = JSON.parse(configContent);
        // --- 开始读取文件 ---
        const objectURLs: Record<string, string> = {};
        const files: Record<string, Blob | string> = {};
        for (const file of config.files) {
            const mime = clickgo.tool.getMimeByPath(file);
            if (['txt', 'json', 'js', 'css', 'xml', 'html'].includes(mime.ext)) {
                const fab = await zip.getContent('/' + control.name + file, 'string');
                if (!fab) {
                    continue;
                }
                // --- 去除 BOM ---
                files[file] = fab.replace(/^\ufeff/, '');
            }
            else {
                const fab = await zip.getContent('/' + control.name + file, 'arraybuffer');
                if (!fab) {
                    continue;
                }
                files[file] = new Blob([fab], {
                    'type': mime.mime
                });
                objectURLs[file] = clickgo.tool.createObjectURL(files[file] as Blob);
            }
        }
        controlPkg[control.name] = {
            'type': 'control',
            'config': config,
            'files': files,
            'objectURLs': objectURLs
        };
    }
    return controlPkg;
}

/**
 * --- 移出 IControlPkg 的所有已创建的 object url ---
 * @param pkg 要处理的 control pkg 对象
 */
export function revokeObjectURL(pkg: ICGControlPkg): void {
    for (const name in pkg) {
        for (const path in pkg[name].objectURLs) {
            clickgo.tool.revokeObjectURL(pkg[name].objectURLs[path]);
        }
    }
}

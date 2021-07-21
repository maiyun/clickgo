/** --- clickgo 中的 cgc 文件读取后的 pkg 对象 --- */
export let clickgoControlPkgs: Record<string, ICGControlPkg> = {};

/**
 * --- 将 cgc 文件 blob 转换为 pkg 对象，会自动创建 object url，请注意释放 ---
 * @param blob 文件 blob
 */
export async function read(blob: Blob): Promise<false | ICGControlPkg> {
    let zip = await clickgo.zip.get(blob);
    if (!zip) {
        return false;
    }
    // --- 创建空白 pkg 对象 ---
    let controlPkg: ICGControlPkg = {};
    let controls = zip.readDir();
    for (let control of controls) {
        if (control.isFile) {
            continue;
        }
        let configContent = await zip.getContent('/' + control.name + '/config.json');
        if (!configContent) {
            continue;
        }
        let config: ICGControlConfig = JSON.parse(configContent);
        // --- 开始读取文件 ---
        let objectURLs: Record<string, string> = {};
        let files: Record<string, Blob | string> = {};
        for (let file of config.files) {
            let mime = clickgo.tool.getMimeByPath(file);
            if (['txt', 'json', 'js', 'css', 'xml', 'html'].includes(mime.ext)) {
                let fab = await zip.getContent('/' + control.name + file, 'string');
                if (!fab) {
                    continue;
                }
                files[file] = fab;
            }
            else {
                let fab = await zip.getContent('/' + control.name + file, 'arraybuffer');
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
    for (let name in pkg) {
        for (let path in pkg[name].objectURLs) {
            clickgo.tool.revokeObjectURL(pkg[name].objectURLs[path]);
        }
    }
}

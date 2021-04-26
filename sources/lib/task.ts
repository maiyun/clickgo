/** --- 当前运行的程序 --- */
export let list: Record<number, ICGTask> = {};
/** --- 最后一个 task id --- */
export let lastId: number = 0;

/**
 * --- 运行一个应用 ---
 * @param url app 路径、blob 对象或 IAppPkg 对象
 * @param opt runtime 运行时要注入的文件列表（cg 文件默认被注入） ---
 */
export async function run(url: string | Blob | ICGAppPkg, opt: { 'runtime'?: Record<string, Blob>; } = {}): Promise<number> {
    if (!opt.runtime) {
        opt.runtime = {};
    }
    // --- 获取正常的 App Pkg 对象 ---
    let appPkg: ICGAppPkg | null;
    if (typeof url === 'string') {
        appPkg = await clickgo.core.fetchApp(url);
    }
    else if (url instanceof Blob) {
        appPkg = (await clickgo.core.readApp(url)) || null;
    }
    else {
        appPkg = url;
    }
    if (!appPkg) {
        return -1;
    }
    // --- app 的内置文件以及运行时文件 ---
    let files: Record<string, Blob> = {};
    for (let fpath in appPkg.files) {
        files[fpath] = appPkg.files[fpath];
    }
    for (let fpath in opt.runtime) {
        files['/runtime' + fpath] = opt.runtime[fpath];
    }
    // --- 创建任务对象 ITask ---
    let taskId = ++lastId;
    list[taskId] = {
        'id': taskId,
        'appPkg': appPkg,
        'customTheme': false,

        'controlPkgs': {},
        'themePkgs': {},

        'files': files,
        'forms': {},
        'objectURLs': {},
        'initControls': {}
    };
    clickgo.dom.createToStyleList(taskId);
    let task: ICGTask = list[taskId];
    // --- 读取 config，对 control 和 theme 进行 pkg 化 ---
    // --- control ---
    for (let path of appPkg.config.controls) {
        path += '.cgc';
        if (path.startsWith('/clickgo/')) {
            await clickgo.core.fetchClickGoFile(path.slice(8));
        }
        else if (task.files[path]) {
            let pkg = await clickgo.control.read(task.files[path]);
            if (pkg) {
                task.controlPkgs[path] = pkg;
            }
        }
    }
    // --- theme ---
    if (appPkg.config.themes) {
        for (let path of appPkg.config.themes) {
            path += '.cgt';
            if (path.startsWith('/clickgo/')) {
                await clickgo.core.fetchClickGoFile(path.slice(8));
            }
            else if (task.files[path]) {
                let pkg = await clickgo.theme.read(task.files[path]);
                if (pkg) {
                    task.themePkgs[path] = pkg;
                }
            }
        }
    }
    // --- 创建 form ---
    let form = await clickgo.form.create(task.id, {
        'file': appPkg.config.main
    });
    if (typeof form === 'number') {
        // --- 结束任务 ---
        for (let name in task.controlPkgs) {
            clickgo.control.revokeObjectURL(task.controlPkgs[name]);
        }
        for (let name in task.themePkgs) {
            clickgo.theme.revokeObjectURL(task.themePkgs[name]);
        }
        delete(list[taskId]);
        clickgo.dom.removeFromStyleList(taskId);
        return form;
    }
    // --- 设置 global style（如果 form 创建失败，就不设置 global style 了） ---
    if (appPkg.config.style && appPkg.files[appPkg.config.style + '.css']) {
        let style = await clickgo.tool.blob2Text(appPkg.files[appPkg.config.style + '.css']);
        let r = clickgo.tool.stylePrepend(style, 'cg-task' + task.id + '_');
        clickgo.dom.pushStyle(task.id, await clickgo.tool.styleUrl2ObjectOrDataUrl(appPkg.config.style, r.style, task));
    }
    // --- 是否要加载独立的 theme ---
    if (appPkg.config.themes) {
        task.customTheme = true;
        for (let theme of appPkg.config.themes) {
            await clickgo.theme.load(task.id, theme + '.cgt');
        }
    }
    else {
        // --- 检测是否加载系统 theme ---
        if (clickgo.theme.global) {
            await clickgo.theme.load(task.id);
        }
    }
    return task.id;
}

/**
 * --- 完全结束任务 ---
 * @param taskId 任务 id
 */
export function end(taskId: number): boolean {
    let task = list[taskId];
    if (!task) {
        return true;
    }
    // --- 移除窗体 list ---
    for (let fid in task.forms) {
        let form = task.forms[fid];
        form.vapp.unmount();
        form.vapp._container.remove();
        clickgo.core.trigger('formRemoved', taskId, form.id, form.vroot.$refs.form.title, form.vroot.$refs.form.iconData);
    }
    // --- 移除 style ---
    clickgo.dom.removeFromStyleList(taskId);
    // --- 移除本 task 创建的所有 object url ---
    for (let path in task.objectURLs) {
        let url = task.objectURLs[path];
        clickgo.tool.revokeObjectURL(url);
    }
    for (let name in task.controlPkgs) {
        clickgo.control.revokeObjectURL(task.controlPkgs[name]);
    }
    // --- 移除 task ---
    delete(list[taskId]);
    // --- 触发 taskEnded 事件 ---
    clickgo.core.trigger('taskEnded', taskId);
    // --- 获取最大的 z index 窗体，并让他获取焦点 ---
    let fid = clickgo.form.getMaxZIndexFormID();
    if (fid) {
        clickgo.form.changeFocus(fid);
    }
    return true;
}

/** --- 当前运行的程序 --- */
export let list: Record<number, ICGTask> = {};
/** --- 最后一个 task id --- */
export let lastId: number = 0;

/** --- task lib 用到的语言包 --- */
let localData: Record<string, {
    'loading': string;
}> = {
    'en': {
        'loading': 'Loading...',
    },
    'sc': {
        'loading': '加载中……'
    },
    'tc': {
        'loading': '載入中……'
    },
    'ja': {
        'loading': '読み込み中...'
    }
};

export function get(tid: number): ICGTaskItem | null {
    if (list[tid] === undefined) {
        return null;
    }
    return {
        'name': list[tid].appPkg.config.name,
        'customTheme': list[tid].customTheme,
        'localName': list[tid].local.name,
        'formCount': Object.keys(list[tid].forms).length,
        'icon': list[tid].icon,
        'path': list[tid].path
    };
}

/**
 * --- 获取 task list 的简略情况 ---
 */
export function getList(): Record<string, ICGTaskItem> {
    let list: Record<string, ICGTaskItem> = {};
    for (let tid in clickgo.task.list) {
        let item = clickgo.task.list[tid];
        list[tid] = {
            'name': item.appPkg.config.name,
            'customTheme': item.customTheme,
            'localName': item.local.name,
            'formCount': Object.keys(item.forms).length,
            'icon': item.icon,
            'path': item.path
        };
    }
    return list;
}

/**
 * --- 运行一个应用 ---
 * @param url app 路径
 * @param opt runtime 运行时要注入的文件列表（cg 文件默认被注入） ---
 */
export async function run(url: string, opt: { 'runtime'?: Record<string, Blob | string>; 'icon'?: string; 'progress'?: boolean; } = {}): Promise<number> {
    let icon = clickgo.cgRootPath + 'icon.png';
    if (opt.icon) {
        icon = opt.icon;
    }
    if (opt.progress === undefined) {
        opt.progress = true;
    }
    if (!opt.runtime) {
        opt.runtime = {};
    }
    let notifyId: number | undefined = opt.progress ? clickgo.form.notify({
        'title': localData[clickgo.core.config.local]?.loading ?? localData['en'].loading,
        'content': url,
        'icon': opt.icon,
        'timeout': 0,
        'progress': true
    }) : undefined;
    let appPkg: ICGAppPkg | null = await clickgo.core.fetchApp(url, {
        'notifyId': notifyId
    });
    if (notifyId) {
        setTimeout(function(): void {
            clickgo.form.hideNotify(notifyId!);
        }, 2000);
    }
    if (!appPkg) {
        return -1;
    }
    // --- app 的内置文件以及运行时文件 ---
    let files: Record<string, Blob | string> = {};
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
        'local': Vue.reactive({
            'name': '',
            'data': {}
        }),
        'icon': appPkg.icon ?? icon,
        'path': url,
        'permission': {},

        'controlPkgs': {},
        'themePkgs': {},

        'files': files,
        'forms': {},
        'objectURLs': {},
        'initControls': {},
        'timers': []
    };
    let task: ICGTask = list[taskId];
    // --- 读取 config，对 control 和 theme 进行 pkg 化（clickgo 的话要运行一遍 fetch 保证已经完成加载） ---
    let clickgoFileList: string[] = [];
    // --- control ---
    for (let path of appPkg.config.controls) {
        path += '.cgc';
        if (path.startsWith('/clickgo/')) {
            clickgoFileList.push(path.slice(8));
        }
        else if (task.files[path]) {
            let pkg = await clickgo.control.read(task.files[path] as Blob);
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
                clickgoFileList.push(path.slice(8));
            }
            else if (task.files[path]) {
                let pkg = await clickgo.theme.read(task.files[path] as Blob);
                if (pkg) {
                    task.themePkgs[path] = pkg;
                }
            }
        }
    }
    // --- local ---
    if (appPkg.config.locals) {
        for (let path in appPkg.config.locals) {
            let localName = appPkg.config.locals[path];
            path += '.json';
            if (task.files[path]) {
                try {
                    let data = JSON.parse(task.files[path] as string);
                    loadLocalData(task.id, localName, data);
                }
                catch {
                    // --- 无所谓 ---
                }
            }
        }
    }
    // --- 然后 fetch clickgo 文件 ---
    if (clickgoFileList.length > 0) {
        try {
            await new Promise<void>(function(resolve, reject) {
                let count = 0;
                for (let file of clickgoFileList) {
                    clickgo.core.fetchClickGoFile(file).then(function(blob: Blob | string | null) {
                        if (blob === null) {
                            reject();
                            return;
                        }
                        ++count;
                        if (count === clickgoFileList.length) {
                            resolve();
                        }
                    }).catch(function() {
                        reject();
                    });
                }
            });
        }
        catch {
            return -2;
        }
    }
    // --- 触发 taskStarted 事件 ---
    clickgo.core.trigger('taskStarted', task.id);
    // --- 创建 form ---
    clickgo.dom.createToStyleList(task.id);
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
        delete(list[task.id]);
        clickgo.dom.removeFromStyleList(task.id);
        clickgo.core.trigger('taskEnded', task.id);
        return form - 100;
    }
    // --- 设置 global style（如果 form 创建失败，就不设置 global style 了） ---
    if (appPkg.config.style && appPkg.files[appPkg.config.style + '.css']) {
        let style = appPkg.files[appPkg.config.style + '.css'] as string;
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
    // --- 获取最大的 z index 窗体，并让他获取焦点 ---
    let fid = clickgo.form.getMaxZIndexFormID({
        'taskIds': [task.id]
    });
    if (fid) {
        clickgo.form.changeFocus(fid);
    }
    else {
        clickgo.form.changeFocus();
    }
    // --- 移除窗体 list ---
    for (let fid in task.forms) {
        let form = task.forms[fid];
        clickgo.core.trigger('formRemoved', taskId, form.id, form.vroot.$refs.form.title, form.vroot.$refs.form.iconData);
        form.vapp.unmount();
        form.vapp._container.remove();
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
    // --- 移除所有 timer ---
    for (let timer in list[taskId].timers) {
        clearTimeout(parseFloat(timer));
    }
    // --- 移除 task ---
    delete(list[taskId]);
    // --- 触发 taskEnded 事件 ---
    clickgo.core.trigger('taskEnded', taskId);
    // --- 移除 task bar ---
    clickgo.form.clearTask(taskId);
    return true;
}

// --- 加载 local data 对象到 task ---
export function loadLocalData(taskId: number, name: string, data: Record<string, any>, pre: string = ''): void {
    if (!list[taskId].local.data[name]) {
        list[taskId].local.data[name] = {};
    }
    for (let k in data) {
        let v = data[k];
        if (typeof v === 'object') {
            loadLocalData(taskId, name, v, pre + k + '.');
        }
        else {
            clickgo.task.list[taskId].local.data[name][pre + k] = v;
        }
    }
}

// --- 创建 timer ---
export function createTimer(taskId: number, formId: number, fun: () => void | Promise<void>, delay: number, opt: {
    'immediate'?: boolean;
    'scope'?: 'form' | 'task';
    'count'?: number;
} = {}): number {
    /** --- 作用域 --- */
    let scope = opt.scope ?? 'form';
    /** --- 执行几次，0 代表无限次 --- */
    let count = opt.count ?? 0;
    let c: number = 0;
    // --- 是否立即执行 ---
    if (opt.immediate) {
        fun() as void;
        ++c;
        if (count > 0 && c === count) {
            return 0;
        }
    }
    let timer: number;
    let timerHandler = (): void => {
        ++c;
        if (list[taskId].forms[formId] === undefined) {
            // --- form 已经没了 ---
            if (scope === 'form') {
                clearTimeout(timer);
                delete(list[taskId].timers[timer]);
                return;
            }
        }
        fun() as void;
        if (count > 0 && c === count) {
            clearTimeout(timer);
            delete(list[taskId].timers[timer]);
            return;
        }
    };
    /** --- timer 对象 number --- */
    if (count === 1) {
        timer = window.setTimeout(timerHandler, delay);
    }
    else {
        timer = window.setInterval(timerHandler, delay);
    }
    list[taskId].timers[timer] = formId;
    return timer;
}

export function removeTimer(taskId: number, timer: number): void {
    if (clickgo.task.list[taskId] === undefined) {
        return;
    }
    let formId = clickgo.task.list[taskId].timers[timer];
    if (formId === undefined) {
        return;
    }
    // --- 放在这，防止一个 task 能结束 别的 task 的 timer ---
    clearTimeout(timer);
    delete(clickgo.task.list[taskId].timers[timer]);
}

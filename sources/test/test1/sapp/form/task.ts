export let data = {
    'left': 0,
    'top': 0,
    'width': 100,

    'list': []
};

export let methods = {
    resizeTaskBar: function(this: IVue): void {
        let pos = clickgo.getPosition();
        this.top = pos.height;
        this.width = pos.width;
    }
};

export let mounted = function(this: IVue): void {
    // --- 将本窗体置顶，放在最低侧 ---
    this.resizeTaskBar();
    this.setSystemEventListener('screenResize', () => {
        this.resizeTaskBar();
    });
    // --- 监听窗体创建事件 ---
    this.setSystemEventListener('formCreated', (taskId: number, formId: number, title: string) => {
        if (taskId === 1) {
            return;
        }
        this.list.push({'taskId': taskId, 'formId': formId, 'title': title});
    });
    this.setSystemEventListener('formRemoved', (taskId: number, formId: number, title: string) => {
        for (let i = 0; i < this.list.length; ++i) {
            if (this.list[i].formId === formId) {
                (this.list as any[]).splice(i, 1);
                break;
            }
        }
    });
    this.setTopMost(true);
};


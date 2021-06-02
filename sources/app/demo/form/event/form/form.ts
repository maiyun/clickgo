export let data = {
    'flist': [],
    'list': []
};

export let mounted = function(this: IVueForm): void {
    this.cgSetSystemEventListener('formCreated', (taskId: number, formId: number, title: string, icon: string): void => {
        this.flist.push({
            'taskId': taskId,
            'formId': formId,
            'title': title,
            'icon': icon
        });
    });
};

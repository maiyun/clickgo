export let data = {
    'flist': [],
    'list': []
};

export let mounted = function(this: IVueForm): void {
    this.cgSetSystemEventListener('formCreated', (taskId: number, formId: number, title: string, icon: string): void => {
        this.flist.push({
            'formId': formId,
            'title': title,
            'icon': icon
        });
        let date = new Date();
        this.list.unshift({
            'time': date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds(),
            'name': 'formCreated',
            'text': `taskId: ${taskId}, formId: ${formId}, title: ${title}, icon: ${icon ? icon.slice(0, 5) + '...' : 'null'}`
        });
    });
};

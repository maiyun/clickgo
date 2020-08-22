export let data = {
    'alwaysOnTop': false,
    'speed': 'N'
};

export let methods = {
    newTask: function(this: IVue): void {
        this.createForm('/form/new', {
            'mask': true
        });
    },
    exit: function(this: IVue): void {
        clickgo.core.endTask(this.taskId);
    }
};

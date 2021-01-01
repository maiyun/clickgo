export let data = {
    'alwaysOnTop': false,
    'speed': 'N'
};

export let methods = {
    newTask: async function(this: IVueForm): Promise<void> {
        await this.cgCreateForm({
            'file': '/form/new',
            'mask': true
        });
    },
    exit: function(this: IVueForm): void {
        clickgo.task.end(this.taskId);
    }
};

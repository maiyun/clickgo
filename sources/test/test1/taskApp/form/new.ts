export let data = {
    'path': ''
};

export let methods = {
    'runApp': async function(this: IVueForm): Promise<void> {
        this.cgCloseForm();
        await clickgo.task.run(this.path);
    }
};

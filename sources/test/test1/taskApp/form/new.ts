export let data = {
    'path': ''
};

export let methods = {
    'runApp': async function(this: IVue): Promise<void> {
        this.closeForm();
        await clickgo.core.runApp(this.path);
    }
};

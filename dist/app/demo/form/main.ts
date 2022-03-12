export let methods = {
    openForm: async function(this: IVForm, type: string, name: string): Promise<void> {
        await this.cgCreateForm(`/form/${type}/${name}/${name}`);
    }
};

export let mounted = async function(): Promise<void> {
    await clickgo.core.initModules('monaco');
};

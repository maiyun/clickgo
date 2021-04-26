export let methods = {
    openForm: async function(this: IVueForm, type: string, name: string): Promise<void> {
        await this.cgCreateForm(`/form/${type}/${name}/${name}`);
    }
};

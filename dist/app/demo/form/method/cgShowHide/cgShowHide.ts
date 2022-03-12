export let methods = {
    cgShowHide: async function(this: IVForm):  Promise<void> {
        this.cgHide();
        await clickgo.tool.sleep(1000);
        this.cgShow();
    }
};

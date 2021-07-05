export let data = {
    'fid': ''
};

export let methods = {
    getList: function(this: IVueForm): void {
        let str = JSON.stringify(clickgo.form.getList(this.taskId)).replace(/"icon":"(.*?)"/g, function(t: string, t1: string): string {
            return `"icon":"${t1 ? (t1.slice(0, 10) + '...') : t1}"`;
        });
        this.cgDialog(`<overflow width="200" height="100" direction="v" style="word-break: break-word;">${str}</overflow>`).catch((e) => { throw e; });
    },
    changeFocus: function(this: IVueForm, formId?: number): void {
        clickgo.form.changeFocus(formId);
    },
    getMaxZIndexFormID: function(this: IVueForm): number | null {
        return clickgo.form.getMaxZIndexFormID();
    }
};

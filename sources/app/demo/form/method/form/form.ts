export let data = {
    'fid': '',
    'type': 'primary'
};

export let methods = {
    getAvailArea: function(this: IVueForm): void {
        this.cgDialog(JSON.stringify(clickgo.form.getAvailArea(), undefined, 4)).catch((e) => { throw e; });
    },
    getList: function(this: IVueForm): void {
        let str = JSON.stringify(clickgo.form.getList(this.taskId)).replace(/"icon":"(.*?)"/g, function(t: string, t1: string): string {
            return `"icon":"${t1 ? (t1.slice(0, 10) + '...') : t1}"`;
        });
        this.cgDialog(`<overflow width="200" height="100" direction="v" style="word-break: break-word;">${str}</overflow>`).catch((e) => { throw e; });
    },
    changeFocus: function(this: IVueForm, formId: string): void {
        clickgo.form.changeFocus(parseInt(formId));
    },
    getMaxZIndexFormID: function(this: IVueForm): number | null {
        return clickgo.form.getMaxZIndexFormID();
    },
    showCircular: function(this: IVueForm, e: MouseEvent): void {
        clickgo.form.showCircular(e.clientX, e.clientY);
    },
    showRectangle: function(this: IVueForm, e: MouseEvent): void {
        clickgo.form.showRectangle(e.clientX, e.clientY, 't');
        this.cgCreateTimer(() => {
            clickgo.form.hideRectangle();
        }, 1000);
    },
    notify: function(this: IVueForm): void {
        clickgo.form.notify({
            'title': 'Notify',
            'content': 'Content',
            'type': this.type
        });
    }
};

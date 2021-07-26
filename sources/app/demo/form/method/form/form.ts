export let data = {
    'fid': '',
    'type': 'primary',
    'progress': 'noraml'
};

export let methods = {
    getAvailArea: function(this: IVueForm): void {
        this.cgDialog(JSON.stringify(clickgo.form.getAvailArea(), undefined, 4)).catch((e) => { throw e; });
    },
    getList: function(this: IVueForm): void {
        let str = JSON.stringify(clickgo.form.getList(this.taskId)).replace(/"icon":"(.*?)"/g, function(t: string, t1: string): string {
            return `"icon":"${t1 ? (t1.slice(0, 10) + '...') : t1}"`;
        });
        this.cgDialog(`<overflow width="200" height="80" direction="v" style="word-break: break-word;">${str}</overflow>`).catch((e) => { throw e; });
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
    notify: async function(this: IVueForm): Promise<void> {
        let icon = undefined;
        if (this.progress === 'progress + icon') {
            icon = await this.cgGetDataUrl('/res/icon.svg');
            if (!icon) {
                icon = undefined;
            }
        }
        let nid = clickgo.form.notify({
            'title': 'Notify',
            'content': 'Content',
            'type': this.type,
            'progress': (this.progress === 'progress + icon') ? true : false,
            'icon': icon
        });
        if (this.progress === 'progress + icon') {
            clickgo.form.notifyProgress(nid, 12);
            await clickgo.tool.sleep(1000);
            clickgo.form.notifyProgress(nid, 30);
            await clickgo.tool.sleep(300);
            clickgo.form.notifyProgress(nid, 50);
            await clickgo.tool.sleep(700);
            clickgo.form.notifyProgress(nid, 75);
            await clickgo.tool.sleep(1000);
            clickgo.form.notifyProgress(nid, 100);
        }
    }
};

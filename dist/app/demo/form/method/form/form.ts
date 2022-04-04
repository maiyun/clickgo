export const data = {
    'fid': '',
    'type': 'primary',
    'progress': 'noraml'
};

export const methods = {
    getAvailArea: function(this: IVForm): void {
        this.cgDialog(JSON.stringify(clickgo.form.getAvailArea(), undefined, 4)).catch((e) => { throw e; });
    },
    getList: function(this: IVForm): void {
        const str = JSON.stringify(clickgo.form.getList(this.taskId))
            .replace(/"icon":"(.*?)"/g, function(t: string, t1: string): string {
                return `"icon":"${t1 ? (t1.slice(0, 10) + '...') : t1}"`;
            });
        this.cgDialog(`<overflow direction="v" style="width: 200px; height: 80px;">${str}</overflow>`).catch((e) => { throw e; });
    },
    changeFocus: function(this: IVForm, formId: string): void {
        clickgo.form.changeFocus(parseInt(formId));
    },
    getMaxZIndexFormID: function(this: IVForm): number | null {
        return clickgo.form.getMaxZIndexFormID();
    },
    showCircular: function(this: IVForm, e: MouseEvent): void {
        clickgo.form.showCircular(e.clientX, e.clientY);
    },
    showRectangle: async function(this: IVForm, e: MouseEvent): Promise<void> {
        clickgo.form.showRectangle(e.clientX, e.clientY, 't');
        await clickgo.tool.sleep(1000);
        clickgo.form.hideRectangle();
    },
    send: function(this: IVForm): void {
        clickgo.form.send(this.formId, { 'x': 'yes' });
    },
    cgReceive: function(this: IVForm, obj: Record<string, any>): void {
        this.cgDialog(JSON.stringify(obj)) as any;
    },
    notify: async function(this: IVForm): Promise<void> {
        let icon = undefined;
        if (this.progress === 'progress + icon') {
            icon = await this.cgGetDataUrl('/res/icon.svg');
            if (!icon) {
                icon = undefined;
            }
        }
        const nid = clickgo.form.notify({
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

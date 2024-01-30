import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractPanel {

    public scount: number = 0;

    public data: any = {};

    public async onShow(d: Record<string, any>): Promise<void> {
        // --- 装作要做一些什么 await 的事件 ---
        await clickgo.tool.sleep(1000);
        ++this.scount;
        this.data = d;
    }

    public async onHide(): Promise<void> {
        // --- 装作要做一些什么 await 的事件 ---
        await clickgo.tool.sleep(1000);
    }

    public async onReceive(data: Record<string, any>): Promise<void> {
        this.data = data;
        await clickgo.form.dialog('test1 got data.');
    }

    public onQsChange(): void {
        clickgo.form.notify({
            'title': 'Test1 Panel',
            'content': 'onQsChange: ' + Object.keys(this.qs).length.toString()
        });
    }

    public async click(): Promise<void> {
        await clickgo.form.dialog('Hello panel!');
    }

    public rootMountData = 'none';

    public onMounted(): void {
        this.rootMountData = this.rootForm.mountData;
    }

}

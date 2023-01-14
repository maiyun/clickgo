import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractPanel {

    public scount: number = 0;

    public data: any = {};

    public onShow(d: Record<string, any>): void {
        ++this.scount;
        this.data = d;
    }

    public async onReceive(data: Record<string, any>): Promise<void> {
        this.data = data;
        await clickgo.form.dialog('test1 got data.');
    }

    public async click(): Promise<void> {
        await clickgo.form.dialog('Hello panel!');
    }

}

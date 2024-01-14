import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public layer: boolean = false;

    public name: string = '';

    public isShow: boolean = true;

    public loading = false;

    public logo = '';

    public async onSelect(e: Event, o: string, v: string): Promise<void> {
        e.preventDefault();
        await clickgo.form.dialog('Not nav, o: ' + o + ', v: ' + v);
    }

    public onMounted(): void {
        this.watch('name', async () => {
            this.loading = true;
            await clickgo.tool.sleep(300);
            this.loading = false;
        });
    }

}

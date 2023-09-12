import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public layer: boolean = false;

    public name: string = '';

    public isShow: boolean = true;

    public loading = false;

    public logo = '';

    public onMounted(): void {
        this.watch('name', async () => {
            this.loading = true;
            await clickgo.tool.sleep(300);
            this.loading = false;
        });
    }

}

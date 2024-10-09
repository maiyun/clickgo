import * as clickgo from 'clickgo';
import * as types from '~/types';

export default class extends clickgo.form.AbstractForm {

    public layer: boolean = false;

    public qs: Record<string, string> = {};

    public name: string = '';

    public isShow: boolean = true;

    public logo = '';

    public slogo = false;

    public hash = false;

    public async onSelect(e: types.INavItemSelectEvent): Promise<void> {
        e.preventDefault();
        await clickgo.form.dialog('Not nav, selected: ' + e.detail.selected + ', name: ' + e.detail.name);
    }

    public onMounted(): void {
        this.watch('name', async () => {
            this.loading = true;
            await clickgo.tool.sleep(300);
            this.loading = false;
        });
    }

}

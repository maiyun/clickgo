import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    layer = false;
    qs = {};
    name = '';
    isShow = true;
    logo = '';
    slogo = false;
    hash = false;
    async onSelect(e) {
        e.preventDefault();
        await clickgo.form.dialog(this, 'Not nav, selected: ' + e.detail.selected + ', name: ' + e.detail.name);
    }
    onMounted() {
        this.watch('name', async () => {
            this.loading = true;
            await clickgo.tool.sleep(300);
            this.loading = false;
        });
    }
}

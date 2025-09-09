import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.layer = false;
        this.qs = {};
        this.name = '';
        this.isShow = true;
        this.logo = '';
        this.slogo = false;
        this.hash = false;
    }
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

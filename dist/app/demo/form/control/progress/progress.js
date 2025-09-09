import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.v = 0;
        this.v2 = 20;
        this.v3 = 60;
        this.v4 = ['default'];
    }
    onMounted() {
        clickgo.tool.sleep(500).then(async () => {
            this.v2 = 40;
            await clickgo.tool.sleep(500);
            this.v2 = 70;
        }).catch(() => {
            // --- nothing ---
        });
    }
}

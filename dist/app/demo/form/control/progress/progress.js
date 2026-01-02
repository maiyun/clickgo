import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    v = 0;
    v2 = 20;
    v3 = 60;
    v4 = ['default'];
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

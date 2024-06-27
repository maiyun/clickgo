import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public v = 0;

    public v2 = 20;

    public v3 = 60;

    public async onMounted() {
        clickgo.tool.sleep(500).then(async () => {
            this.v2 = 40;
            await clickgo.tool.sleep(500);
            this.v2 = 70;
        });
    }

}

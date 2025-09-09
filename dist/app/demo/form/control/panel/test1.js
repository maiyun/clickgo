import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractPanel {
    constructor() {
        super(...arguments);
        this.scount = 0;
        this.data = {};
        this.rootMountData = 'none';
    }
    async onShow(e) {
        // --- 装作要做一些什么 await 的事件 ---
        await clickgo.tool.sleep(1000);
        ++this.scount;
        this.data = e;
    }
    async onHide() {
        // --- 装作要做一些什么 await 的事件 ---
        await clickgo.tool.sleep(1000);
    }
    async onReceive(data) {
        this.data = data;
        await clickgo.form.dialog(this, 'test1 got data.');
    }
    onQsChange() {
        clickgo.form.notify({
            'title': 'Test1 Panel',
            'content': 'onQsChange: ' + Object.keys(this.qs).length.toString()
        });
    }
    async onQsChangeShow(e) {
        // --- 装作要做一些什么 await 的事件 ---
        await clickgo.tool.sleep(500);
        clickgo.form.notify({
            'title': 'Test1 Panel',
            'content': 'onQsChangeShow'
        });
        console.log('onQsChangeShow', e);
    }
    async click() {
        await clickgo.form.dialog(this, 'Hello panel!');
    }
    async clearQss() {
        this.clearQs();
        await clickgo.form.dialog(this, 'cleard.');
    }
    jump() {
        this.rootForm.formHash = 'test1?a=1&b=3';
    }
    onMounted() {
        this.rootMountData = this.rootForm.mountData;
    }
}

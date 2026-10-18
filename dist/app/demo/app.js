import * as clickgo from 'clickgo';
import main from './form/main';
import objviewerFrm from './form/control/objviewer/objviewer';
export default class extends clickgo.core.AbstractApp {
    async main(data) {
        if (data['demo'] === 'objviewer') {
            await this.run(await clickgo.form.create(this, objviewerFrm, {
                'fullscreen': true
            }));
            return;
        }
        await this.run(await clickgo.form.create(this, main, {
            'param': data.param ?? 'none',
        }));
    }
}

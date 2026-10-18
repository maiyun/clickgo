import * as clickgo from 'clickgo';
import main from './form/main';
import objviewerFrm from './form/control/objviewer/objviewer';
import dateFrm from './form/control/date/date';

export default class extends clickgo.core.AbstractApp {

    public async main(data: Record<string, any>): Promise<void> {
        if (data['demo'] === 'date') {
            await this.run(await clickgo.form.create(this, dateFrm));
            return;
        }
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

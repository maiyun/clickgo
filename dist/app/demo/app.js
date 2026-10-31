import * as clickgo from 'clickgo';
import main from './form/main';
import objviewerFrm from './form/control/objviewer/objviewer';
import dateFrm from './form/control/date/date';
import accordionFrm from './form/control/accordion/accordion';
export default class extends clickgo.core.AbstractApp {
    async main(data) {
        if (data['demo'] === 'accordion') {
            await this.run(await clickgo.form.create(this, accordionFrm, {
                'fullscreen': true,
            }));
            return;
        }
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

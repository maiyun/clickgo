import * as clickgo from 'clickgo';
import main from './form/main';
import objviewerFrm from './form/control/objviewer/objviewer';
import dateFrm from './form/control/date/date';
import datepanelFrm from './form/control/datepanel/datepanel';
import daterangeFrm from './form/control/daterange/daterange';
import accordionFrm from './form/control/accordion/accordion';
import dockFrm from './form/control/dock/dock';

export default class extends clickgo.core.AbstractApp {

    public async main(data: Record<string, any>): Promise<void> {
        if (data['demo'] === 'dock') {
            await this.run(await clickgo.form.create(this, dockFrm, {
                'fullscreen': true,
            }));
            return;
        }
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
        if (data['demo'] === 'datepanel') {
            await this.run(await clickgo.form.create(this, datepanelFrm));
            return;
        }
        if (data['demo'] === 'daterange') {
            await this.run(await clickgo.form.create(this, daterangeFrm));
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

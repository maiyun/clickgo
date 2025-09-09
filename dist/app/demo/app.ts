import * as clickgo from 'clickgo';
import main from './form/main';

export default class extends clickgo.core.AbstractApp {

    public async main(data: Record<string, any>): Promise<void> {
        await this.run(await clickgo.form.create(this, main, {
            'param': data.param ?? 'none',
        }));
    }

}

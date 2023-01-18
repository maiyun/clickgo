import * as clickgo from 'clickgo';
import main from './form/main';

export default class extends clickgo.core.AbstractApp {

    public async main(data: Record<string, any>): Promise<void> {
        this.run(await clickgo.form.create(main, {
            'param': data.param ?? 'none'
        }));
    }

}

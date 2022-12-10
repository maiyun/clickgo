import * as clickgo from 'clickgo';
import main from './form/main';

export default class extends clickgo.core.AbstractApp {

    public async main(): Promise<void> {
        this.run(await main.create());
    }

}

import * as clickgo from 'clickgo';
import bar from './form/bar/bar';

export default class extends clickgo.core.AbstractApp {

    public async main(): Promise<void> {
        this.run(await bar.create());
    }

}

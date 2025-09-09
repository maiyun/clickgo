import * as clickgo from 'clickgo';
import bar from './form/bar/bar';
export default class extends clickgo.core.AbstractApp {
    async main() {
        await this.run(await clickgo.form.create(this, bar));
    }
}

import * as clickgo from 'clickgo';
import main from './form/main';
export default class extends clickgo.core.AbstractApp {
    async main() {
        await this.run(await clickgo.form.create(this, main));
    }
}

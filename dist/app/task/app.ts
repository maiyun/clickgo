import * as clickgo from 'clickgo';
import bar from './form/bar/bar';

export default class extends clickgo.core.AbstractApp {

    public async main(): Promise<void> {
        await this.config({
            'name': 'Clickgo Task',
            'ver': 1,
            'version': '0.1',
            'author': 'clickgo',

            'controls': [
                '/clickgo/control/common',
                '/clickgo/control/form',
                '/clickgo/control/task'
            ],
            'locales': {
                '/package/locale/sc': 'sc',
                '/package/locale/tc': 'tc',
                '/package/locale/en': 'en',
                '/package/locale/ja': 'ja'
            },

            'files': [
                '/form/bar/bar.xml',
                '/form/desktop/desktop.xml',
                '/locale/en.json',
                '/locale/ja.json',
                '/locale/sc.json',
                '/locale/tc.json'
            ]
        });
        this.run(await bar.create());
    }

}

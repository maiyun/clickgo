import * as clickgo from 'clickgo';
import main from './form/main';

export default class extends clickgo.core.AbstractApp {

    public async main(): Promise<void> {
        await this.config({
            'name': 'Clickgo Demo',
            'ver': 1,
            'version': '0.1',
            'author': 'clickgo',

            'controls': [
                '/clickgo/control/common',
                '/clickgo/control/form',
                '/clickgo/control/monaco',
                '/clickgo/control/property'
            ],
            'style': '/package/global',

            'files': [
                '/form/control/block/block.css',
                '/form/control/block/block.xml',
                '/form/control/button/button.css',
                '/form/control/button/button.xml',
                '/form/control/check/check.xml',
                '/form/control/dialog/dialog.xml',
                '/form/control/file/file.xml',
                '/form/control/form/form.css',
                '/form/control/form/form.xml',
                '/form/control/greatview/greatview.css',
                '/form/control/greatview/greatview.xml',
                '/form/control/img/img.xml',
                '/form/control/label/label.xml',
                '/form/control/list/list.css',
                '/form/control/list/list.xml',
                '/form/control/loading/loading.xml',
                '/form/control/marquee/marquee.xml',
                '/form/control/menu/menu.xml',
                '/form/control/monaco/monaco.xml',
                '/form/control/overflow/overflow.css',
                '/form/control/overflow/overflow.xml',
                '/form/control/property/property.xml',
                '/form/control/radio/radio.xml',
                '/form/control/scroll/scroll.xml',
                '/form/control/select/select.xml',
                '/form/control/tab/tab.xml',
                '/form/control/text/text.xml',
                '/form/control/view/view.css',
                '/form/control/view/view.xml',
                '/form/event/form/form.css',
                '/form/event/form/form.xml',
                '/form/event/screen/screen.xml',
                '/form/event/task/task.xml',
                '/form/method/aform/aform.xml',
                '/form/method/aform/test.xml',
                '/form/method/core/core.xml',
                '/form/method/dom/dom.css',
                '/form/method/dom/dom.xml',
                '/form/method/form/form.css',
                '/form/method/form/form.xml',
                '/form/method/fs/fs.xml',
                '/form/method/fs/text.xml',
                '/form/method/task/locale1.json',
                '/form/method/task/locale2.json',
                '/form/method/task/task.xml',
                '/form/method/theme/theme.xml',
                '/form/method/tool/tool.xml',
                '/form/method/zip/zip.xml',
                '/form/main.css',
                '/form/main.xml',
                '/res/icon.svg',
                '/res/img.jpg',
                '/res/r-1.svg',
                '/res/r-2.svg',
                '/res/sql.svg',
                '/res/txt.svg',
                '/res/zip.svg',
                '/global.css'
            ]
        });
        this.run(await main.create());
    }

}

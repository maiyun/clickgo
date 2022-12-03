"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const clickgo = require("clickgo");
const main_1 = require("./form/main");
class default_1 extends clickgo.core.AbstractApp {
    main() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.config({
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
                    '/form/control/flow/flow.css',
                    '/form/control/flow/flow.xml',
                    '/form/control/form/form.css',
                    '/form/control/form/form.xml',
                    '/form/control/img/img.xml',
                    '/form/control/label/label.xml',
                    '/form/control/list/list.css',
                    '/form/control/list/list.xml',
                    '/form/control/loading/loading.xml',
                    '/form/control/marquee/marquee.xml',
                    '/form/control/menu/menu.xml',
                    '/form/control/monaco/monaco.xml',
                    '/form/control/property/property.xml',
                    '/form/control/radio/radio.xml',
                    '/form/control/scroll/scroll.xml',
                    '/form/control/select/select.xml',
                    '/form/control/tab/tab.xml',
                    '/form/control/text/text.xml',
                    '/form/control/vflow/vflow.css',
                    '/form/control/vflow/vflow.xml',
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
            this.run(yield main_1.default.create());
        });
    }
}
exports.default = default_1;

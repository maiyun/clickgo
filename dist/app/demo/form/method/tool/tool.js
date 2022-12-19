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
class default_1 extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.sleeping = false;
        this.purifyTxt = `<html>
    <head>
        <title>Hello world!</title>
    </head>
    <body>
        <!-- title -->
        <h1>Title</h1>
        <!-- content -->
        <div>content</div>
    </body>
</html>`;
        this.min = '10';
        this.max = '30';
        this.length = '8';
        this.block = '';
        this.url = 'HtTp://uSer:pAss@sUBDom.TopdOm23.CoM:29819/Admxw2Ksiz/dszas?Mdi=KdiMs1&a=JDd#hehHe';
        this.url1 = '/abc/def/hehe';
        this.url2 = '../bb.index';
    }
    sleep() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.sleeping) {
                return;
            }
            this.sleeping = true;
            yield clickgo.tool.sleep(1000);
            this.sleeping = false;
        });
    }
    purify() {
        this.purifyTxt = clickgo.tool.purify(this.purifyTxt);
    }
    rand() {
        clickgo.form.dialog(clickgo.tool.rand(parseInt(this.min), parseInt(this.max)).toString()).catch((e) => { throw e; });
    }
    random() {
        clickgo.form.dialog(clickgo.tool.random(parseInt(this.length), clickgo.tool.RANDOM_LN, this.block)).catch((e) => { throw e; });
    }
    escapeHTML() {
        clickgo.form.dialog(clickgo.tool.escapeHTML(this.purifyTxt)).catch((e) => { throw e; });
    }
    rgb2hsl() {
        clickgo.form.dialog(JSON.stringify(clickgo.tool.rgb2hsl('9,105,218'))).catch((e) => { throw e; });
    }
    parseUrl() {
        clickgo.form.dialog(JSON.stringify(clickgo.tool.parseUrl(this.url))).catch((e) => { throw e; });
    }
    urlResolve() {
        clickgo.form.dialog(clickgo.tool.urlResolve(this.url1, this.url2)).catch((e) => { throw e; });
    }
}
exports.default = default_1;

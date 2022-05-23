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
exports.methods = exports.data = void 0;
const clickgo = require("clickgo");
exports.data = {
    'sleeping': false,
    'purifyTxt': `<html>
    <head>
        <title>Hello world!</title>
    </head>
    <body>
        <!-- title -->
        <h1>Title</h1>
        <!-- content -->
        <div>content</div>
    </body>
</html>`,
    'min': '10',
    'max': '30',
    'length': '8',
    'block': '',
    'url': 'HtTp://uSer:pAss@sUBDom.TopdOm23.CoM:29819/Admxw2Ksiz/dszas?Mdi=KdiMs1&a=JDd#hehHe',
    'url1': '/abc/def/hehe',
    'url2': '../bb.index'
};
exports.methods = {
    sleep: function () {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.sleeping) {
                return;
            }
            this.sleeping = true;
            yield clickgo.tool.sleep(1000);
            this.sleeping = false;
        });
    },
    purify: function () {
        this.purifyTxt = clickgo.tool.purify(this.purifyTxt);
    },
    rand: function () {
        clickgo.form.dialog(clickgo.tool.rand(parseInt(this.min), parseInt(this.max)).toString()).catch((e) => { throw e; });
    },
    random: function () {
        clickgo.form.dialog(clickgo.tool.random(parseInt(this.length), clickgo.tool.RANDOM_LN, this.block)).catch((e) => { throw e; });
    },
    escapeHTML: function () {
        clickgo.form.dialog(clickgo.tool.escapeHTML(this.purifyTxt)).catch((e) => { throw e; });
    },
    parseUrl: function () {
        clickgo.form.dialog(JSON.stringify(clickgo.tool.parseUrl(this.url))).catch((e) => { throw e; });
    },
    urlResolve: function () {
        clickgo.form.dialog(clickgo.tool.urlResolve(this.url1, this.url2)).catch((e) => { throw e; });
    }
};

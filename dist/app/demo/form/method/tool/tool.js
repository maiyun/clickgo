"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const clickgo = __importStar(require("clickgo"));
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
        <div>// abc</div>
        <script>
        // --- test ---
        if (a) {
           alert('zzz');
        }
        /* --- test 2 --- */
        if (b) {
           alert('zzz');
        }
        </script>
    </body>
</html>`;
        this.min = '10';
        this.max = '30';
        this.length = '8';
        this.block = '';
        this.url = 'HtTp://uSer:pAss@sUBDom.TopdOm23.CoM:29819/Admxw2Ksiz/dszas?Mdi=KdiMs1&a=JDd#hehHe';
        this.url1 = '/abc/def/hehe';
        this.url2 = '../bb.index';
        this.second = '4531';
        this.weight = '8761';
        this.qs = 'a=1&b=2&c=3';
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
    formatSecond() {
        return __awaiter(this, void 0, void 0, function* () {
            yield clickgo.form.dialog(clickgo.tool.formatSecond(parseInt(this.second) || 0));
        });
    }
    weightFormat() {
        return __awaiter(this, void 0, void 0, function* () {
            yield clickgo.form.dialog(clickgo.tool.weightFormat(parseInt(this.weight) || 0));
        });
    }
    queryParse() {
        return __awaiter(this, void 0, void 0, function* () {
            yield clickgo.form.dialog(JSON.stringify(clickgo.tool.queryParse(this.qs)));
        });
    }
    queryStringify() {
        return __awaiter(this, void 0, void 0, function* () {
            yield clickgo.form.dialog(clickgo.tool.queryStringify({ 'a': 1, 'b': 'c' }));
        });
    }
}
exports.default = default_1;

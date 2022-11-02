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
class default_1 extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.props = {
            'src': '',
            'mode': 'default'
        };
        this.imgData = '';
        this.width = 0;
        this.height = 0;
        this.count = 0;
    }
    get backgroundSize() {
        if (this.props.mode === 'default') {
            return this.width.toString() + 'px ' + this.height.toString() + 'px';
        }
        else {
            return this.props.mode;
        }
    }
    onMounted() {
        this.watch('src', () => __awaiter(this, void 0, void 0, function* () {
            const count = ++this.count;
            if (typeof this.props.src !== 'string' || this.props.src === '') {
                this.imgData = '';
                return;
            }
            const pre = this.props.src.slice(0, 6).toLowerCase();
            if (pre === 'file:/') {
                return;
            }
            if (pre === 'http:/' || pre === 'https:' || pre === 'data:i') {
                this.imgData = `url(${this.props.src})`;
                return;
            }
            const path = clickgo.tool.urlResolve(this.path + '/', this.props.src);
            const blob = yield clickgo.fs.getContent(path);
            if ((count !== this.count) || !blob || typeof blob === 'string') {
                return;
            }
            const t = yield clickgo.tool.blob2DataUrl(blob);
            if (count !== this.count) {
                return;
            }
            if (t) {
                this.imgData = 'url(' + t + ')';
                return;
            }
            this.imgData = '';
        }), {
            'immediate': true
        });
        clickgo.dom.watchSize(this.element, (size) => {
            this.width = size.width;
            this.height = size.height;
        }, true);
    }
}
exports.default = default_1;

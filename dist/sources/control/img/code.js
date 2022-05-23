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
exports.mounted = exports.watch = exports.computed = exports.data = exports.props = void 0;
const clickgo = require("clickgo");
exports.props = {
    'src': {
        'default': ''
    },
    'mode': {
        'default': 'default'
    }
};
exports.data = {
    'imgData': '',
    'width': 0,
    'height': 0,
    'count': 0
};
exports.computed = {
    'backgroundSize': function () {
        if (this.mode === 'default') {
            return this.width.toString() + 'px ' + this.height.toString() + 'px';
        }
        else {
            return this.mode;
        }
    }
};
exports.watch = {
    'src': {
        handler: function () {
            return __awaiter(this, void 0, void 0, function* () {
                const count = ++this.count;
                if (typeof this.src !== 'string' || this.src === '') {
                    this.imgData = undefined;
                    return;
                }
                const pre = this.src.slice(0, 6).toLowerCase();
                if (pre === 'file:/') {
                    return;
                }
                if (pre === 'http:/' || pre === 'https:' || pre === 'data:i') {
                    this.imgData = `url(${this.src})`;
                    return;
                }
                const path = clickgo.tool.urlResolve(this.cgPath, this.src);
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
                this.imgData = undefined;
            });
        },
        'immediate': true
    }
};
const mounted = function () {
    clickgo.dom.watchSize(this.$el, (size) => {
        this.width = size.width;
        this.height = size.height;
    }, true);
};
exports.mounted = mounted;

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
exports.watch = exports.data = exports.props = void 0;
exports.props = {
    'width': {
        'default': undefined
    },
    'height': {
        'default': undefined
    },
    'left': {
        'default': 0
    },
    'top': {
        'default': 0
    },
    'zIndex': {
        'default': 0
    },
    'src': {
        'default': ''
    }
};
exports.data = {
    'iconData': ''
};
exports.watch = {
    'src': {
        handler: function () {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.src === '') {
                    this.iconData = undefined;
                    return;
                }
                let pre = this.src.slice(0, 5).toLowerCase();
                if (pre === 'http:') {
                    this.iconData = this.src;
                    return;
                }
                let t = yield this.cgGetDataUrl(this.src);
                if (t) {
                    this.iconData = 'url(' + t + ')';
                    return;
                }
                this.iconData = undefined;
            });
        },
        'immediate': true
    }
};

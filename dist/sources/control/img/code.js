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
exports.watch = exports.computed = exports.data = exports.props = void 0;
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
    'flex': {
        'default': ''
    },
    'src': {
        'default': ''
    },
    'mode': {
        'default': 'default'
    }
};
exports.data = {
    'imgData': ''
};
exports.computed = {
    'backgroundSize': function () {
        if (this.mode === 'default') {
            if ((this.width !== undefined) && (this.height !== undefined)) {
                return this.width + 'px ' + this.height + 'px';
            }
            return undefined;
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
                if (this.src === '') {
                    this.imgData = undefined;
                    return;
                }
                let pre = this.src.slice(0, 6).toLowerCase();
                if (pre === 'http:/' || pre === 'https:' || pre === 'data:i') {
                    this.imgData = 'url(' + this.src + ')';
                    return;
                }
                let t = this.cgGetObjectUrl(this.src);
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

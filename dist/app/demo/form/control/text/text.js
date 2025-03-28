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
        this.value = '';
        this.nvalue = '';
        this.isFocus = false;
        this.nisFocus = false;
        this.selectionStart = 0;
        this.selectionEnd = 0;
        this.scrollLeft = 0;
        this.scrollTop = 0;
        this.clientHeight = 0;
        this.clientWidth = 0;
        this.scrollHeight = 0;
        this.scrollWidth = 0;
        this.type = ['text'];
        this.disabled = false;
        this.placeholder = 'placeholder';
        this.readonly = false;
        this.scroll = true;
        this.wrap = true;
        this.menu = false;
        this.gesture = false;
        this.long = false;
        this.lineHeight = 1;
        this.fontSize = 12;
        this.maxlength = 0;
        this.prepend = false;
        this.append = false;
        this.before = false;
        this.after = false;
        this.border = 'solid';
        this.background = undefined;
        this.phcolor = undefined;
        this.max = undefined;
        this.min = undefined;
        this.plain = false;
        this.require = false;
        this.beforechange = false;
    }
    get textBorder() {
        switch (this.border) {
            case 'underline': {
                return '0 0 .5px 0';
            }
            case 'none': {
                return '0';
            }
        }
        return undefined;
    }
    longClick() {
        this.value = this.long ? 'short\nshort\nshort\nshort\nshort\nshort\nshort\nshort\nshort' : 'long\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\n\n\nlong\nlong\n' + `long


long`;
        this.long = !this.long;
        this.scrollTop = 0;
    }
    onGesture(dir) {
        return __awaiter(this, void 0, void 0, function* () {
            yield clickgo.form.dialog('onGesture: ' + dir);
        });
    }
    onBeforechange(e) {
        if (!this.beforechange) {
            return;
        }
        if (e.detail.value === '1345') {
            e.preventDefault();
            return;
        }
        if (e.detail.value === '1346') {
            e.detail.change = '000000';
        }
    }
    onMinMaxChange(e) {
        console.log('onMinMaxChange', e);
    }
}
exports.default = default_1;

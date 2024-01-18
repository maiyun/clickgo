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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
        this.ntab = '';
        this.tabs = ['tab1', {
                'label': 'haha',
                'value': 'ok'
            }];
        this.tindex = 1;
        this.tabPosition = 'top';
        this.color = undefined;
        this.size = undefined;
        this.drag = false;
        this.cclose = false;
    }
    onClose(e) {
        return __awaiter(this, void 0, void 0, function* () {
            if (e.detail.index !== 10) {
                yield clickgo.form.dialog('Closed, index: ' + e.detail.index.toString() + ', value: ' + e.detail.value);
                return;
            }
            e.preventDefault();
            yield clickgo.form.dialog('The tab can not be close.');
        });
    }
    add() {
        const len = this.tabs.length;
        const val = 'tab' + (++this.tindex).toString();
        if (len === 15) {
            this.tabs.push({
                'value': val,
                'drag': false,
                'close': false
            });
        }
        else if (len === 16) {
            this.tabs.push({
                'value': val,
                'drag': true,
                'close': true
            });
        }
        else {
            this.tabs.push(val);
        }
    }
    remove() {
        if (this.tabs.length > 0) {
            this.tabs.splice(this.tabs.length - 1);
        }
    }
    position() {
        switch (this.tabPosition) {
            case 'top':
                this.tabPosition = 'right';
                break;
            case 'right':
                this.tabPosition = 'bottom';
                break;
            case 'bottom':
                this.tabPosition = 'left';
                break;
            default:
                this.tabPosition = 'top';
        }
    }
}
exports.default = default_1;

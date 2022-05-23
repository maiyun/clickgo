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
    'ntab': '',
    'tabs': ['tab1'],
    'tindex': 1,
    'tabPosition': 'top',
    'color': undefined,
    'size': undefined,
    'drag': false,
    'close': false
};
exports.methods = {
    onClose: function (e, i) {
        return __awaiter(this, void 0, void 0, function* () {
            if (i !== 10) {
                return;
            }
            e.preventDefault();
            yield clickgo.form.dialog('The tab can not be close.');
        });
    },
    add: function () {
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
    },
    remove: function () {
        if (this.tabs.length > 0) {
            this.tabs.splice(this.tabs.length - 1);
        }
    },
    position: function () {
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
};

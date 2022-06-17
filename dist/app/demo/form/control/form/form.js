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
    'width': 300,
    'height': 520,
    'icon': '',
    'title': 'Form',
    'min': true,
    'max': true,
    'close': true,
    'stateMax': false,
    'stateMin': false,
    'minWidth': 200,
    'minHeight': 100,
    'resize': true,
    'loading': false,
    'border': 'normal'
};
exports.methods = {
    showLoading: function () {
        return __awaiter(this, void 0, void 0, function* () {
            this.loading = true;
            yield clickgo.tool.sleep(1000);
            this.loading = false;
        });
    }
};

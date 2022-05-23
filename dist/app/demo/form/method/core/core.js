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
exports.methods = exports.computed = void 0;
const clickgo = require("clickgo");
exports.computed = {
    'config': function () {
        return JSON.stringify(clickgo.core.config, null, 4);
    }
};
exports.methods = {
    getAvailArea: function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield clickgo.form.dialog(JSON.stringify(clickgo.core.getAvailArea()));
        });
    }
};

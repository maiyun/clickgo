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
class default_1 extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.width = 300;
        this.height = 520;
        this.icon = '';
        this.title = 'Form';
        this.min = true;
        this.max = true;
        this.cclose = true;
        this.stateMax = false;
        this.stateMin = false;
        this.minWidth = 200;
        this.minHeight = 100;
        this.resize = true;
        this.loading = false;
        this.border = 'normal';
    }
    showLoading() {
        return __awaiter(this, void 0, void 0, function* () {
            this.loading = true;
            yield clickgo.tool.sleep(1000);
            this.loading = false;
        });
    }
}
exports.default = default_1;

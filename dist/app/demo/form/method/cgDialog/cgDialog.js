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
exports.data = {
    'result': 'None'
};
exports.methods = {
    dialog: function (opt) {
        return __awaiter(this, void 0, void 0, function* () {
            this.result = yield this.cgDialog(opt);
        });
    },
    donot: function () {
        return __awaiter(this, void 0, void 0, function* () {
            this.result = yield this.cgDialog({
                'content': 'Hello world!',
                'buttons': ['Do not close', 'Close'],
                'select': (e, button) => {
                    if (button === 'Do not close') {
                        e.preventDefault();
                    }
                }
            });
        });
    },
    confirm: function (cancel = false) {
        return __awaiter(this, void 0, void 0, function* () {
            this.result = yield this.cgConfirm('Hello world?', cancel);
            if (typeof this.result === 'boolean') {
                this.result = this.result ? 'true (boolean)' : 'false (boolean)';
            }
            else {
                this.result = this.result + ' (number)';
            }
        });
    }
};

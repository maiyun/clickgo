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
    'alwaysOnTop': false,
    'speed': 'N'
};
exports.methods = {
    newTask: function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.cgCreateForm({
                'file': '/form/new',
                'mask': true
            });
        });
    },
    exit: function () {
        clickgo.task.end(this.taskId);
    }
};

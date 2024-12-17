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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clickgo = __importStar(require("clickgo"));
const test1_1 = __importDefault(require("../../control/panel/test1"));
class default_1 extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.fh = '';
        this.name = '';
        this.mountData = 'none';
        this.map = {
            'test1': test1_1.default,
            'test2': '../../control/panel/test2'
        };
    }
    onFormHashChange(taskId, formId, value) {
        if (formId !== this.formId) {
            return;
        }
        this.fh = value;
    }
    onSelect(e) {
        return __awaiter(this, void 0, void 0, function* () {
            e.preventDefault();
            yield clickgo.form.dialog('Show form');
        });
    }
    onJumpdataSelect(e) {
        e.preventDefault();
        this.formHashData = { 'key': 'form hash data' };
        this.formHash = 'test1';
    }
    onMounted(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data.hash) {
                return;
            }
            this.formHash = data.hash;
            yield clickgo.tool.sleep(500);
            this.mountData = 'ok';
        });
    }
}
exports.default = default_1;

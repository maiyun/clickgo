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
class default_1 extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.emits = {
            'init': null
        };
        this.props = {
            'modelValue': ''
        };
        this.notInit = false;
        this.isLoading = true;
        this.access = {
            'tuieditor': undefined
        };
    }
    onMounted() {
        return __awaiter(this, void 0, void 0, function* () {
            const tuieditor = yield clickgo.core.getModule('tuieditor');
            if (!tuieditor) {
                this.isLoading = false;
                this.notInit = true;
                return;
            }
            this.access.tuieditor = new tuieditor.factory({
                'el': this.refs.content,
                'viewer': true,
                'initialValue': this.props.modelValue,
            });
            this.watch('modelValue', (v) => {
                if (!this.access.tuieditor) {
                    return;
                }
                this.access.tuieditor.setMarkdown(v);
            });
            clickgo.dom.watchStyle(this.element, ['font-size', 'font-family'], (n, v) => {
                if (!this.access.tuieditor) {
                    return;
                }
                const pm = this.refs.content.children[0];
                if (!pm) {
                    return;
                }
                switch (n) {
                    case 'font-size': {
                        pm.style.fontSize = v;
                        break;
                    }
                    case 'font-family': {
                        pm.style.fontFamily = v;
                        break;
                    }
                }
            }, true);
            this.isLoading = false;
            this.emit('init', this.access.tuieditor);
        });
    }
}
exports.default = default_1;

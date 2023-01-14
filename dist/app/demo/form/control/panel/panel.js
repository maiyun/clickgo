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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clickgo = __importStar(require("clickgo"));
const test1_1 = __importDefault(require("./test1"));
class default_1 extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.selected = ['none'];
    }
    go() {
        this.refs.panel.go(test1_1.default, {
            'type': 'show'
        });
    }
    ssend() {
        this.refs.panel.send({
            'type': 'send'
        });
    }
    onMounted() {
        this.watch('selected', () => {
            switch (this.selected[0]) {
                case 'none': {
                    break;
                }
                case './test1': {
                    this.refs.panel.go(test1_1.default);
                    break;
                }
                case './test2': {
                    this.refs.panel.go('./test2');
                    break;
                }
            }
        }, {
            'deep': true,
            'immediate': true
        });
    }
}
exports.default = default_1;

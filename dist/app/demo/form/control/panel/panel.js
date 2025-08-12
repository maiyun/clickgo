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
        this.panelv = '';
        this.parentData = 'yeah!';
        this.plain = false;
        this.map = null;
    }
    async go() {
        this.loading = true;
        await this.refs.panel.go(test1_1.default, {
            'type': 'show'
        });
        this.loading = false;
    }
    ssend() {
        this.refs.panel.send({
            'type': 'send'
        });
    }
    changeMap() {
        this.map = this.map ? null : {
            'test1': test1_1.default,
            'test2': './test2'
        };
    }
    onMounted() {
        this.watch('selected', async () => {
            switch (this.selected[0]) {
                case 'none': {
                    if (this.map) {
                        this.panelv = '';
                    }
                    break;
                }
                case './test1': {
                    if (this.map) {
                        this.panelv = 'test1';
                    }
                    else {
                        this.loading = true;
                        await this.refs.panel.go(test1_1.default);
                        this.loading = false;
                    }
                    break;
                }
                case './test2': {
                    if (this.map) {
                        this.panelv = 'test2';
                    }
                    else {
                        this.loading = true;
                        await this.refs.panel.go('./test2');
                        this.loading = false;
                    }
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

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
Object.defineProperty(exports, "__esModule", { value: true });
const clickgo = __importStar(require("clickgo"));
class default_1 extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.controls = false;
        this.play = true;
        this.volume = 80;
        this.list = [
            {
                'label': 'empty',
                'value': ''
            },
            {
                'label': 'rtsp1',
                'value': 'ws://media.z7test.com:8080/media?uid=cASOapX4ftbiuSY0uIhKPFID&auth=x&channel=sub'
            },
            {
                'label': 'rtsp2',
                'value': 'ws://media.z7test.com:8080/media?uid=jv6Rk0FdCYHGnu02xjKxz9Pe&auth=x&channel=sub',
                'fval': 'ws://media.z7test.com:8080/media?uid=jv6Rk0FdCYHGnu02xjKxz9Pe&auth=x&channel=main'
            }
        ];
        this.src = [''];
        this.fsrc = '';
    }
    changed(e) {
        const found = this.list.find(item => item.value === e.detail.value[0]);
        if (found && found.fval) {
            this.fsrc = found.fval;
            return;
        }
        this.fsrc = '';
    }
}
exports.default = default_1;

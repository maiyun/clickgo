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
        this.url = '';
        this.pwd = '';
        this.config = {
            'url': '',
            'pwd': '',
        };
        this.list = [];
    }
    toConnect() {
        this.config.url = this.url;
        this.config.pwd = this.pwd;
    }
    date() {
        const d = new Date();
        return `[${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}] `;
    }
    connect() {
        this.list.unshift(this.date() + 'connect');
    }
    disconnect() {
        this.list.unshift(this.date() + 'disconnect');
    }
    password() {
        this.list.unshift(this.date() + 'password');
    }
    fail() {
        this.list.unshift(this.date() + 'fail');
    }
    desktopresize(e) {
        this.list.unshift(this.date() + 'desktopresize: ' + e.width + 'x' + e.height);
    }
    clipboard(text) {
        this.list.unshift(this.date() + 'clipboard: ' + text);
    }
}
exports.default = default_1;

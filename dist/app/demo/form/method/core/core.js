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
        this.hash = 'test';
        this.location = 'https://www.maiyun.net';
    }
    get config() {
        return JSON.stringify(clickgo.core.config, null, 4).replace(/"icon": "([\s\S]+?)"/g, '"icon": "data:image/..."');
    }
    get global() {
        return JSON.stringify(clickgo.core.global, null, 4);
    }
    async getCdn() {
        await clickgo.form.dialog(clickgo.core.getCdn());
    }
    async getAvailArea() {
        await clickgo.form.dialog(JSON.stringify(clickgo.core.getAvailArea()));
    }
    async hashe() {
        if (clickgo.core.hash(this.hash)) {
            return;
        }
        await clickgo.form.dialog('No permission.');
    }
    async getHash() {
        await clickgo.form.dialog('Hash is: ' + clickgo.core.getHash());
    }
    async getHost() {
        await clickgo.form.dialog('Host is: ' + clickgo.core.getHost());
    }
    async locatione() {
        if (clickgo.core.location(this.location)) {
            return;
        }
        await clickgo.form.dialog('No permission.');
    }
    async getLocation() {
        await clickgo.form.dialog('Location is: ' + clickgo.core.getLocation());
    }
    async back() {
        if (clickgo.core.back()) {
            return;
        }
        await clickgo.form.dialog('No permission.');
    }
    open() {
        clickgo.core.open('https://www.maiyun.net');
    }
}
exports.default = default_1;

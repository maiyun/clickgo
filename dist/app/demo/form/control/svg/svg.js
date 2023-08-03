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
Object.defineProperty(exports, "__esModule", { value: true });
const clickgo = __importStar(require("clickgo"));
class default_1 extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.i = 0;
        this.f = 0;
        this.layouts = [
            `<path d="M9.5 2h-6A1.502 1.502 0 0 0 2 3.5v6A1.502 1.502 0 0 0 3.5 11h6A1.502 1.502 0 0 0 11 9.5v-6A1.502 1.502 0 0 0 9.5 2zm.5 7.5a.501.501 0 0 1-.5.5h-6a.501.501 0 0 1-.5-.5v-6a.501.501 0 0 1 .5-.5h6a.501.501 0 0 1 .5.5zM20.5 2h-6A1.502 1.502 0 0 0 13 3.5v6a1.502 1.502 0 0 0 1.5 1.5h6A1.502 1.502 0 0 0 22 9.5v-6A1.502 1.502 0 0 0 20.5 2zm.5 7.5a.501.501 0 0 1-.5.5h-6a.501.501 0 0 1-.5-.5v-6a.501.501 0 0 1 .5-.5h6a.501.501 0 0 1 .5.5zM9.5 13h-6A1.502 1.502 0 0 0 2 14.5v6A1.502 1.502 0 0 0 3.5 22h6a1.502 1.502 0 0 0 1.5-1.5v-6A1.502 1.502 0 0 0 9.5 13zm.5 7.5a.501.501 0 0 1-.5.5h-6a.501.501 0 0 1-.5-.5v-6a.501.501 0 0 1 .5-.5h6a.501.501 0 0 1 .5.5zM20.5 13h-6a1.502 1.502 0 0 0-1.5 1.5v6a1.502 1.502 0 0 0 1.5 1.5h6a1.502 1.502 0 0 0 1.5-1.5v-6a1.502 1.502 0 0 0-1.5-1.5zm.5 7.5a.501.501 0 0 1-.5.5h-6a.501.501 0 0 1-.5-.5v-6a.501.501 0 0 1 .5-.5h6a.501.501 0 0 1 .5.5z"/>`,
            `<path d="M24 12a4.99 4.99 0 0 1-2.15 4.101l-.85-.495v-.163a3.974 3.974 0 0 0-1.377-7.377l-.79-.124-.052-.798a5.293 5.293 0 0 0-10.214-1.57L8.17 6.59l-.977-.483A2.277 2.277 0 0 0 6.19 5.87a2.18 2.18 0 0 0-1.167.339 2.206 2.206 0 0 0-.98 1.395l-.113.505-.476.2A4 4 0 0 0 5 16h2v1H5a5 5 0 0 1-1.934-9.611 3.21 3.21 0 0 1 1.422-2.025 3.17 3.17 0 0 1 1.702-.493 3.269 3.269 0 0 1 1.446.34 6.293 6.293 0 0 1 12.143 1.867A4.988 4.988 0 0 1 24 12zm-5.437 7.5l-4.016 2.342-4.015-2.342.587-.342-.993-.579-1.578.92 6 3.501 6-3.5-1.579-.92-.992.578zm1.985-3l-1.579-.92-.992.578.586.342-4.016 2.342-4.015-2.342.587-.342-.993-.579-1.578.921 6 3.5zm-12-3l6-3.5 6 3.5-6 3.5zm6 2.342l4.015-2.342-4.016-2.343-4.015 2.343z"/>`,
            `<path d="M4 4H3v1h2V2h1v20H5v-1H4v2h18V1H4zm3-2h14v20H7zM5 20H3v-1h1v-1h1zm0-6H3v-1h1v-1h1zm0-6H3V7h1V6h1zm0 3H3v-1h1V9h1zm0 6H3v-1h1v-1h1zm10.5-5h-3A3.504 3.504 0 0 0 9 15.5V18h10v-2.5a3.504 3.504 0 0 0-3.5-3.5zm2.5 5h-8v-1.5a2.503 2.503 0 0 1 2.5-2.5h3a2.503 2.503 0 0 1 2.5 2.5zm-4-6a3 3 0 1 0-3-3 3.003 3.003 0 0 0 3 3zm0-5a2 2 0 1 1-2 2 2.002 2.002 0 0 1 2-2z"/>`
        ];
        this.files = [
            '../../../res/icon.svg',
            '../../../res/r-1.svg',
            '../../../res/marker.svg'
        ];
        this.color = undefined;
    }
    get layout() {
        return this.i >= 3 ? '' : this.layouts[this.i];
    }
    get file() {
        return this.f >= 3 ? '' : this.files[this.f];
    }
}
exports.default = default_1;

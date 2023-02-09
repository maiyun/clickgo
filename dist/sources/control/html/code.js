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
class default_1 extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.props = {
            'html': '',
            'css': ''
        };
        this.htmlPrep = '';
    }
    get layout() {
        let layout = this.props.html;
        if (!layout) {
            return '';
        }
        layout = layout.replace(/ on(\w+=)/gi, ' data-on$1');
        layout = layout.replace(/<style>[\s\S]*?<\/style>/gi, '');
        layout = layout.replace(/<script>[\s\S]*?<\/script>/gi, '');
        layout = clickgo.tool.layoutAddTagClassAndReTagName(layout, false);
        layout = clickgo.tool.layoutClassPrepend(layout, [this.htmlPrep + '_']);
        return layout;
    }
    get style() {
        if (!this.props.css) {
            return '';
        }
        return clickgo.tool.stylePrepend(this.props.css, this.htmlPrep + '_').style;
    }
    onMounted() {
        this.htmlPrep = 'cg-hscope' + Math.round(Math.random() * 1000000000000000).toString();
    }
}
exports.default = default_1;

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
    get innerStyle() {
        const layout = this.props.html;
        if (!layout) {
            return '';
        }
        const styles = [];
        layout.replace(/<style>([\s\S]*?)<\/style>/gi, function (t, t1) {
            styles.push(t1);
            return '';
        });
        return styles.join('');
    }
    get style() {
        const after = (list, after) => {
            const rtn = [];
            for (const item of list) {
                rtn.push(item + after);
            }
            return rtn.join(',');
        };
        const pre = [];
        const buttons = ['input[type=submit]', 'input[type=button]', 'button'];
        pre.push(buttons.join(',') + '{border:solid .5px var(--g-border-color);background:var(--g-background);color:inherit;font:inherit;padding:var(--g-padding);border-radius:var(--g-radius);outline:dotted .5px transparent;outline-offset:-4px;line-height:inherit;}');
        pre.push(after(buttons, ':hover') + '{border:solid .5px var(--g-border-color-hover);background:var(--g-background-hover);color:var(--g-color-hover)}');
        pre.push(after(buttons, ':active') + '{border:solid .5px var(--g-border-color-active);background:var(--g-background-active);color:var(--g-color-active)}');
        pre.push(after(buttons, ':focus:not(:active):not(:hover)') + '{border:solid .5px var(--g-border-color-focus);background:var(--g-background-focus);color:var(--g-color-focus)}');
        pre.push(after(buttons, ':focus') + '{outline-color:var(--g-focusbox-border-color)}');
        pre.push(after(buttons, ':disabled') + '{border:solid .5px var(--g-border-color-disabled);background:var(--g-background-disabled);color:var(--g-color-disabled)}');
        const texts = ['input:not([type])', 'input[type=text]', 'input[type=password]', 'input[type=email]', 'input[type=url]', 'input[type=tel]', 'input[type=search]', 'input[type=color]', 'input[type=number]'];
        pre.push(texts.join(',') + '{border:solid .5px var(--g-plain-border-color);background:var(--g-plain-background);color:inherit;font:inherit;padding:var(--g-padding);border-radius:var(--g-radius);outline:none;line-height:inherit}');
        pre.push(after(texts, ':hover') + '{border:solid .5px var(--g-plain-border-color-hover)}');
        pre.push(after(texts, ':active') + '{border:solid .5px var(--g-plain-border-color-active)}');
        pre.push(after(texts, ':focus:not(:active):not(:hover)') + '{border:solid .5px var(--g-plain-border-color-focus)}');
        pre.push(after(texts, ':disabled') + '{border:solid .5px var(--g-plain-border-color-disabled);background:var(--g-plain-background-disabled);color:var(--g-plain-color-disabled)}');
        return clickgo.tool.stylePrepend(pre.join('') + (this.props.css ? this.props.css : '') + this.innerStyle, this.htmlPrep + '_').style;
    }
    onMounted() {
        this.htmlPrep = 'cg-hscope' + Math.round(Math.random() * 1000000000000000).toString();
    }
}
exports.default = default_1;

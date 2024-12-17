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
        this.adaptation = false;
        this.htmlIndex = 0;
        this.html = [
            `<h1>Hello world!</h1>
<button>Button</button> <button disabled>Button2</button>
<h2>H2 title</h2>
<div>div</div>
<h3>H3 title</h3>
<input onclick="alert('alert')">
<h4>h4 title</h4>
<input type="email" disabled>
<ul>
    <li class="test">li</li>
    <li>li</li>
</ul>
<span>span</span>
<ol>
    <li>li</li>
    <li id="li">li</li>
</ol>
<script>alert('b');</script>
<style>ul{background:hsl(0,100%,98%)}</style>`,
            `<h2>123</h2>
<button>Test</button>`
        ];
        this.css = `div{background:blue;}.test{background:red;}#li{background:yellow;}`;
        this.lcss = '';
        this.rcss = '';
    }
}
exports.default = default_1;

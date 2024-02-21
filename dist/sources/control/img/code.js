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
        this.props = {
            'src': '',
            'mode': 'default'
        };
        this.imgData = '';
        this.width = 0;
        this.height = 0;
        this.count = 0;
    }
    get backgroundSize() {
        if (this.props.mode === 'default') {
            return this.width.toString() + 'px ' + this.height.toString() + 'px';
        }
        else {
            return this.props.mode;
        }
    }
    onMounted() {
        this.watch('src', () => __awaiter(this, void 0, void 0, function* () {
            const count = ++this.count;
            if (typeof this.props.src !== 'string' || this.props.src === '') {
                this.imgData = '';
                return;
            }
            const pre = this.props.src.slice(0, 6).toLowerCase();
            if (pre === 'file:/') {
                this.imgData = '';
                return;
            }
            if (pre === 'http:/' || pre === 'https:' || pre.startsWith('data:')) {
                this.imgData = `url(${this.props.src})`;
                return;
            }
            let blob = null;
            if (this.props.src.startsWith('/control/')) {
                if (!this.rootControl) {
                    return;
                }
                blob = this.rootControl.packageFiles[this.props.src.slice(8)];
            }
            else {
                const path = clickgo.tool.urlResolve('/package' + this.path + '/', this.props.src);
                blob = yield clickgo.fs.getContent(path);
            }
            if ((count !== this.count) || !blob || typeof blob === 'string') {
                return;
            }
            const t = yield clickgo.tool.blob2DataUrl(blob);
            if (count !== this.count) {
                return;
            }
            if (t) {
                this.imgData = 'url(' + t + ')';
                return;
            }
            this.imgData = '';
        }), {
            'immediate': true
        });
        clickgo.dom.watchSize(this.element, () => {
            this.width = this.element.offsetWidth;
            this.height = this.element.offsetHeight;
        }, true);
    }
}
exports.default = default_1;

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
            'src': '',
            'mode': 'default',
            'direction': 'h',
            'gutter': '',
            'alignH': undefined,
            'alignV': undefined
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
        this.watch('src', async () => {
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
                blob = await clickgo.fs.getContent(path);
            }
            if ((count !== this.count) || !blob || typeof blob === 'string') {
                return;
            }
            const t = await clickgo.tool.blob2DataUrl(blob);
            if (count !== this.count) {
                return;
            }
            if (t) {
                this.imgData = 'url(' + t + ')';
                return;
            }
            this.imgData = '';
        }, {
            'immediate': true
        });
        clickgo.dom.watchSize(this.element, () => {
            this.width = this.element.offsetWidth;
            this.height = this.element.offsetHeight;
        }, true);
    }
}
exports.default = default_1;

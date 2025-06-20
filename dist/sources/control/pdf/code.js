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
        this.emits = {
            'loaded': null,
            'view': null
        };
        this.props = {
            'disabled': false,
            'src': '',
            'page': 1
        };
        this.notInit = false;
        this.isLoading = true;
        this.access = {
            'pdfjs': undefined,
            'pdf': undefined,
            'context': undefined
        };
        this.count = 0;
    }
    load(buf) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.access.pdfjs) {
                return false;
            }
            if (buf instanceof Blob) {
                buf = yield clickgo.tool.blob2ArrayBuffer(buf);
            }
            this.isLoading = true;
            this.access.pdf = yield this.access.pdfjs.getDocument(buf).promise;
            this.isLoading = false;
            yield this.go();
            this.emit('loaded', this.access.pdf);
            return true;
        });
    }
    go() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            var _b;
            this.isLoading = true;
            let page = null;
            try {
                page = yield this.access.pdf.getPage(this.propInt('page'));
            }
            catch (_c) {
                this.isLoading = false;
                return false;
            }
            (_a = (_b = this.access).context) !== null && _a !== void 0 ? _a : (_b.context = this.refs.content.getContext('2d'));
            const viewport = page.getViewport({
                'scale': 1
            });
            const event = {
                'detail': {
                    'width': viewport.width,
                    'height': viewport.height,
                    'inwidth': Math.round((viewport.width / 72) * 100) / 100,
                    'inheight': Math.round((viewport.height / 72) * 100) / 100,
                    'pxwidth': 0,
                    'pxheight': 0,
                }
            };
            const viewport2 = page.getViewport({
                'scale': event.detail.inwidth * clickgo.dom.dpi / viewport.width
            });
            event.detail.pxwidth = Math.round(viewport2.width);
            event.detail.pxheight = Math.round(viewport2.height);
            this.refs.content.width = event.detail.pxwidth;
            this.refs.content.height = event.detail.pxheight;
            page.render({
                'canvasContext': this.access.context,
                'viewport': viewport2
            });
            this.emit('view', event);
            this.isLoading = false;
            return true;
        });
    }
    onMounted() {
        return __awaiter(this, void 0, void 0, function* () {
            this.access.pdfjs = yield clickgo.core.getModule('pdfjs');
            if (!this.access.pdfjs) {
                this.isLoading = false;
                this.notInit = true;
                return;
            }
            this.watch('src', () => __awaiter(this, void 0, void 0, function* () {
                const count = ++this.count;
                if (typeof this.props.src !== 'string' || this.props.src === '') {
                    this.access.pdf = undefined;
                    this.emit('loaded', this.access.pdf);
                    return;
                }
                const pre = this.props.src.slice(0, 6).toLowerCase();
                if (pre === 'file:/') {
                    this.access.pdf = undefined;
                    this.emit('loaded', this.access.pdf);
                    return;
                }
                if (pre.startsWith('data:')) {
                    this.access.pdf = undefined;
                    this.emit('loaded', this.access.pdf);
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
                yield this.load(blob);
            }), {
                'immediate': true,
            });
            this.watch('page', () => __awaiter(this, void 0, void 0, function* () {
                if (!this.access.pdf) {
                    return;
                }
                yield this.go();
            }), {
                'deep': true
            });
            this.isLoading = false;
        });
    }
}
exports.default = default_1;

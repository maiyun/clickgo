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
            'disabled': false,
            'theme': 'black'
        };
        this.notInit = false;
        this.isLoading = true;
        this.access = {
            'term': undefined
        };
    }
    down(e) {
        return __awaiter(this, void 0, void 0, function* () {
            if (clickgo.dom.hasTouchButMouse(e)) {
                return;
            }
            if (e.button !== 2) {
                return;
            }
            const sel = this.access.term.getSelection();
            if (sel) {
                try {
                    yield navigator.clipboard.writeText(sel);
                    this.access.term.clearSelection();
                }
                catch (e) {
                    console.log('Clipboard error.', e);
                }
            }
            else {
                const str = yield navigator.clipboard.readText();
                this.access.term.paste(str);
            }
        });
    }
    onMounted() {
        return __awaiter(this, void 0, void 0, function* () {
            const xterm = yield clickgo.core.getModule('xterm');
            if (!xterm) {
                this.isLoading = false;
                this.notInit = true;
                return;
            }
            this.access.term = new xterm[0]();
            this.access.term.onData((char) => {
                this.emit('data', char);
            });
            this.access.term.onResize((cr) => __awaiter(this, void 0, void 0, function* () {
                const screen = this.refs.content.querySelector('.xterm-screen');
                yield clickgo.tool.sleep(50);
                this.emit('resize', {
                    'cols': cr.cols,
                    'rows': cr.rows,
                    'width': screen.clientWidth,
                    'height': screen.clientHeight
                });
            }));
            const fitAddon = new xterm[1]();
            this.access.term.loadAddon(fitAddon);
            const webgl = new xterm[2]();
            this.access.term.loadAddon(webgl);
            this.access.term.open(this.refs.content);
            clickgo.dom.watchSize(this.element, () => {
                fitAddon.fit();
            }, true);
            this.isLoading = false;
            this.emit('init', this.access.term);
        });
    }
}
exports.default = default_1;

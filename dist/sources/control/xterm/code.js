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
        this.emits = {
            'data': null,
            'resize': null,
            'init': null
        };
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
    async down(e) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        if (e.button !== 2) {
            return;
        }
        const sel = this.access.term.getSelection();
        if (sel) {
            try {
                await navigator.clipboard.writeText(sel);
                this.access.term.clearSelection();
            }
            catch (e) {
                console.log('Clipboard error.', e);
            }
        }
        else {
            const str = await navigator.clipboard.readText();
            this.access.term.paste(str);
        }
    }
    async onMounted() {
        const xterm = await clickgo.core.getModule('xterm');
        if (!xterm) {
            this.isLoading = false;
            this.notInit = true;
            return;
        }
        this.access.term = new xterm[0]();
        this.access.term.onData((char) => {
            this.emit('data', char);
        });
        this.access.term.onResize(async (cr) => {
            const screen = this.refs.content.querySelector('.xterm-screen');
            await clickgo.tool.sleep(50);
            this.emit('resize', {
                'cols': cr.cols,
                'rows': cr.rows,
                'width': screen.clientWidth,
                'height': screen.clientHeight
            });
        });
        const fitAddon = new xterm[1]();
        this.access.term.loadAddon(fitAddon);
        const webgl = new xterm[2]();
        this.access.term.loadAddon(webgl);
        this.access.term.open(this.refs.content);
        clickgo.dom.watchSize(this.element, () => {
            fitAddon.fit();
        });
        this.isLoading = false;
        this.emit('init', this.access.term);
        await clickgo.tool.sleep(34);
        fitAddon.fit();
    }
}
exports.default = default_1;

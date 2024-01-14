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
            'controls': false,
            'loop': false,
            'muted': false,
            'volume': 50,
            'play': false
        };
        this.srcData = '';
        this.isBlob = false;
        this.count = 0;
        this.playData = false;
    }
    onPlay() {
        this.playData = true;
        this.emit('update:play', this.playData);
    }
    onPause() {
        this.playData = false;
        this.emit('update:play', this.playData);
    }
    playClick() {
        if (this.playData) {
            this.refs.video.pause();
        }
        else {
            this.refs.video.play();
        }
        this.playData = !this.playData;
        this.emit('update:play', this.playData);
    }
    fullClick() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.element.requestFullscreen();
        });
    }
    onMounted() {
        this.watch('src', () => __awaiter(this, void 0, void 0, function* () {
            const count = ++this.count;
            if (typeof this.props.src !== 'string' || this.props.src === '') {
                if (this.isBlob) {
                    this.isBlob = false;
                    URL.revokeObjectURL(this.srcData);
                }
                this.srcData = '';
                return;
            }
            const pre = this.props.src.slice(0, 6).toLowerCase();
            if (pre === 'file:/') {
                if (this.isBlob) {
                    this.isBlob = false;
                    URL.revokeObjectURL(this.srcData);
                }
                this.srcData = '';
                return;
            }
            if (pre === 'http:/' || pre === 'https:' || pre.startsWith('data:')) {
                if (this.isBlob) {
                    this.isBlob = false;
                    URL.revokeObjectURL(this.srcData);
                }
                this.srcData = this.props.src;
                return;
            }
            const path = clickgo.tool.urlResolve('/package' + this.path + '/', this.props.src);
            const blob = yield clickgo.fs.getContent(path);
            if ((count !== this.count) || !blob || typeof blob === 'string') {
                return;
            }
            if (this.isBlob) {
                URL.revokeObjectURL(this.srcData);
            }
            const t = URL.createObjectURL(blob);
            this.srcData = t;
        }), {
            'immediate': true
        });
        this.watch('volume', () => {
            this.refs.video.volume = this.propInt('volume') / 100;
        }, {
            'immediate': true
        });
        this.watch('play', () => {
            if (this.playData === this.propBoolean('play')) {
                return;
            }
            this.playData = this.propBoolean('play');
            if (this.playData) {
                this.refs.video.play();
            }
            else {
                this.refs.video.pause();
            }
        }, {
            'immediate': true
        });
    }
    onUnmounted() {
        if (this.isBlob) {
            URL.revokeObjectURL(this.srcData);
        }
    }
}
exports.default = default_1;

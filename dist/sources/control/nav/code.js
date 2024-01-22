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
        this.emits = {
            'layer': null,
            'qs': null
        };
        this.props = {
            'modelValue': '',
            'default': '',
            'hash': false,
            'show': undefined,
            'logo': ''
        };
        this.showData = true;
        this.logoData = '';
        this.logoCount = 0;
        this.selected = '';
        this.qs = {};
        this.layer = false;
        this.childs = [];
    }
    get formHash() {
        return this.rootForm.formHash;
    }
    select(name) {
        if (this.selected === name) {
            return;
        }
        this.selected = name;
        this.emit('update:modelValue', name);
        const qs = this.selected.split('?');
        this.qs = qs[1] ? Object.fromEntries(qs[1].split('&').map(item => item.split('='))) : {};
        this.emit('qs', clickgo.tool.clone(this.qs));
        if (this.propBoolean('hash') && (this.rootForm.formHash !== this.selected)) {
            this.rootForm.formHash = this.selected;
        }
        if (this.layer && this.showData) {
            this.showData = false;
            this.emit('update:show', this.showData);
        }
    }
    menuwrapClick(e) {
        if (!this.layer) {
            return;
        }
        if (e.currentTarget !== e.target) {
            return;
        }
        if (!this.showData) {
            return;
        }
        this.showData = false;
        this.emit('update:show', this.showData);
    }
    onMounted() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.nextTick();
            clickgo.dom.watchSize(this.element, () => {
                if (this.element.offsetWidth < 500) {
                    if (!this.layer) {
                        this.layer = true;
                        this.emit('layer', this.layer);
                    }
                }
                else {
                    if (this.layer) {
                        this.layer = false;
                        this.emit('layer', this.layer);
                    }
                }
            }, true);
            this.watch('show', () => {
                if (this.props.show === undefined) {
                    this.showData = this.layer ? false : true;
                    this.emit('update:show', this.showData);
                    return;
                }
                this.showData = this.propBoolean('show');
            }, {
                'immediate': true
            });
            this.watch('modelValue', () => {
                this.select(this.props.modelValue || this.props.default);
            });
            this.watch('logo', () => __awaiter(this, void 0, void 0, function* () {
                const count = ++this.logoCount;
                if (typeof this.props.logo !== 'string' || this.props.logo === '') {
                    this.logoData = '';
                    return;
                }
                const pre = this.props.logo.slice(0, 6).toLowerCase();
                if (pre === 'file:/') {
                    return;
                }
                if (pre === 'http:/' || pre === 'https:' || pre.startsWith('data:')) {
                    this.logoData = `url(${this.props.logo})`;
                    return;
                }
                const path = clickgo.tool.urlResolve('/package' + this.path + '/', this.props.logo);
                const blob = yield clickgo.fs.getContent(path);
                if ((count !== this.logoCount) || !blob || typeof blob === 'string') {
                    return;
                }
                const t = yield clickgo.tool.blob2DataUrl(blob);
                if (count !== this.logoCount) {
                    return;
                }
                if (t) {
                    this.logoData = 'url(' + t + ')';
                    return;
                }
                this.logoData = '';
            }), {
                'immediate': true
            });
            this.watch('formHash', () => {
                if (!this.propBoolean('hash')) {
                    return;
                }
                if (this.selected === this.formHash) {
                    return;
                }
                this.select(this.formHash || this.props.default);
            });
            this.watch('hash', () => {
                if (!this.propBoolean('hash')) {
                    return;
                }
                if (this.formHash === this.selected) {
                    return;
                }
                this.rootForm.formHash = this.selected;
            });
            if (this.propBoolean('hash')) {
                this.select(this.formHash || this.props.default);
            }
            else {
                this.select(this.props.modelValue || this.props.default);
            }
        });
    }
}
exports.default = default_1;

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
            'changed': null,
            'update:modelValue': null,
        };
        this.props = {
            'disabled': false,
            'mode': 'hsl',
            'modelValue': '',
        };
        this.paletteChanged = {
            'detail': {
                'value': '',
                'hsl': undefined,
                'rgb': undefined
            }
        };
        this.color = '';
        this.value = '';
    }
    ok() {
        if (this.value !== this.color) {
            this.value = this.color;
            this.emit('update:modelValue', this.value);
            this.emit('changed', this.paletteChanged);
        }
        clickgo.form.hidePop(this.element);
    }
    down(e) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        if (this.element.dataset.cgPopOpen !== undefined) {
            clickgo.form.hidePop(this.element);
            return;
        }
        clickgo.form.showPop(this.element, this.refs.pop, 'v');
    }
    changed(e) {
        this.paletteChanged = e;
    }
    onMounted() {
        this.watch('modelValue', () => __awaiter(this, void 0, void 0, function* () {
            if (this.props.modelValue === this.value) {
                return;
            }
            this.value = this.props.modelValue;
            this.color = this.props.modelValue;
            yield this.nextTick();
            this.ok();
        }), {
            'immediate': true
        });
        this.watch('mode', () => __awaiter(this, void 0, void 0, function* () {
            yield this.nextTick();
            this.ok();
        }));
    }
}
exports.default = default_1;

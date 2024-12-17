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
            'update:modelValue': null
        };
        this.props = {
            'data': [],
            'plain': false,
            'modelValue': ''
        };
    }
    get dataComp() {
        var _a, _b, _c, _d, _e, _f;
        const data = [];
        for (const item of this.props.data) {
            data.push({
                'icon': (_a = item.icon) !== null && _a !== void 0 ? _a : '',
                'label': (_c = (_b = item.label) !== null && _b !== void 0 ? _b : item.value) !== null && _c !== void 0 ? _c : 'label',
                'value': (_e = (_d = item.value) !== null && _d !== void 0 ? _d : item.label) !== null && _e !== void 0 ? _e : 'value',
                'desc': (_f = item.desc) !== null && _f !== void 0 ? _f : ''
            });
        }
        return data;
    }
    get nowIndex() {
        var _a, _b;
        if (this.props.modelValue === '#') {
            return this.dataComp.length;
        }
        for (let i = 0; i < this.dataComp.length; ++i) {
            const item = this.dataComp[i];
            if (item.value !== this.props.modelValue) {
                continue;
            }
            return i;
        }
        this.emit('update:modelValue', (_b = (_a = this.dataComp[0]) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : '');
        return 0;
    }
}
exports.default = default_1;

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
            'select': null,
            'changed': null,
            'update:modelValue': null
        };
        this.props = {
            'disabled': false,
            'length': 6,
            'drag': false,
            'pre': '',
            'multi': false,
            'progress': undefined,
            'modelValue': []
        };
        this.rand = '';
    }
    select() {
        if (this.props.progress !== undefined) {
            return;
        }
        this.emit('select');
    }
    down(e, index) {
        var _a;
        clickgo.dom.bindDrag(e, {
            'el': (_a = e.currentTarget.parentNode) === null || _a === void 0 ? void 0 : _a.parentNode,
            'data': {
                'index': index,
                'tab': this.rand
            }
        });
    }
    drop(e, index) {
        if (typeof e.detail.value !== 'object') {
            return;
        }
        if (e.detail.value.tab !== this.rand) {
            return;
        }
        this.props.modelValue.splice(index, 0, this.props.modelValue.splice(e.detail.value.index, 1)[0]);
        this.emit('update:modelValue', this.props.modelValue);
        this.emit('changed');
    }
    onMounted() {
        this.rand = clickgo.tool.random(16);
    }
}
exports.default = default_1;

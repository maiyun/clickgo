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
            'change': null,
            'update:modelValue': null
        };
        this.props = {
            'disabled': false,
            'map': {},
            'modelValue': false
        };
        this.value = false;
        this.isSpaceDown = false;
    }
    get mapComp() {
        var _a, _b;
        return {
            'true': (_a = this.props.map.true) !== null && _a !== void 0 ? _a : true,
            'false': (_b = this.props.map.false) !== null && _b !== void 0 ? _b : false
        };
    }
    click() {
        const event = {
            'go': true,
            preventDefault: function () {
                this.go = false;
            },
            'detail': {
                'value': this.value
            }
        };
        this.emit('change', event);
        if (event.go) {
            this.value = this.value === this.mapComp.true ? this.mapComp.false : this.mapComp.true;
            this.emit('update:modelValue', this.value);
        }
    }
    keydown(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.click();
        }
        else if (e.key === ' ') {
            e.preventDefault();
            this.isSpaceDown = true;
        }
    }
    keyup() {
        if (!this.isSpaceDown) {
            return;
        }
        this.isSpaceDown = false;
        this.click();
    }
    onMounted() {
        this.watch('modelValue', () => {
            if (this.props.modelValue !== undefined) {
                this.value = this.props.modelValue;
            }
        }, {
            'immediate': true
        });
    }
}
exports.default = default_1;

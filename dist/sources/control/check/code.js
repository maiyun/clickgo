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
        this.value = false;
        this.indeterminateData = false;
        this.isSpaceDown = false;
        this.emits = {
            'change': null,
            'changed': null,
            'update:modelValue': null,
            'update:indeterminate': null
        };
        this.props = {
            'disabled': false,
            'modelValue': false,
            'indeterminate': false
        };
    }
    click() {
        return __awaiter(this, void 0, void 0, function* () {
            const event = {
                'go': true,
                preventDefault: function () {
                    this.go = false;
                },
                'detail': {
                    'value': this.value,
                    'indeterminate': this.indeterminateData
                }
            };
            this.emit('change', event);
            if (!event.go) {
                return;
            }
            if (this.indeterminateData) {
                this.indeterminateData = false;
                this.emit('update:indeterminate', this.indeterminateData);
            }
            else {
                this.value = !this.value;
                this.emit('update:modelValue', this.value);
            }
            yield this.nextTick();
            const event2 = {
                'detail': {
                    'value': this.value,
                    'indeterminate': this.indeterminateData
                }
            };
            this.emit('changed', event2);
        });
    }
    keydown(e) {
        return __awaiter(this, void 0, void 0, function* () {
            if (e.key === 'Enter') {
                e.preventDefault();
                yield this.click();
            }
            else if (e.key === ' ') {
                e.preventDefault();
                this.isSpaceDown = true;
            }
        });
    }
    keyup() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isSpaceDown) {
                return;
            }
            this.isSpaceDown = false;
            yield this.click();
        });
    }
    onMounted() {
        this.watch('modelValue', () => {
            if (this.props.modelValue !== undefined) {
                this.value = this.propBoolean('modelValue');
            }
            if (this.indeterminateData && !this.value) {
                this.indeterminateData = false;
                this.emit('update:indeterminate', this.indeterminateData);
            }
        }, {
            'immediate': true
        });
        this.watch('indeterminate', () => {
            if (this.props.indeterminate !== undefined) {
                this.indeterminateData = this.propBoolean('indeterminate');
            }
            if (!this.value && this.indeterminateData) {
                this.value = true;
                this.emit('update:modelValue', this.value);
            }
        }, {
            'immediate': true
        });
    }
}
exports.default = default_1;

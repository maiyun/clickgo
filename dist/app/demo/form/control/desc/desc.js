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
class default_1 extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.border = true;
        this.collapse = true;
        this.data = [
            {
                'name': 'name1',
                'child': ['val1', 'val2']
            },
            {
                'name': 'name2',
                'child': ['val1', 'val2', 'val3']
            },
            {
                'name': 'name3',
                'child': ['val1', 'val2', 'val3', 'val4']
            }
        ];
        this.plain = false;
        this.size = ['m'];
    }
    get maxLine() {
        let len = 0;
        for (const item of this.data) {
            if (!len) {
                len = item.child.length;
                continue;
            }
            len *= item.child.length;
        }
        return len;
    }
    get cols() {
        const cols = [];
        for (let i = 0; i < this.data.length; ++i) {
            if (i === 0) {
                cols.push(this.maxLine / this.data[i].child.length);
                continue;
            }
            cols.push(cols[i - 1] / this.data[i].child.length);
        }
        return cols;
    }
}
exports.default = default_1;

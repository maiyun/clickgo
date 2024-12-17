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
        this.val1 = {
            'id1': {
                'type': 'rect',
                'width': 150,
                'height': 120,
                'x': 40,
                'y': 20
            }
        };
        this.id = 0;
        this.selected = [];
        this.val2 = {
            'btn': {
                'type': 'rect',
                'width': 150,
                'height': 120,
                'x': 40,
                'y': 20
            }
        };
    }
    add() {
        this.val2['tmp' + (++this.id).toString()] = {
            'type': 'rect',
            'width': clickgo.tool.rand(50, 150),
            'height': clickgo.tool.rand(50, 150),
            'x': clickgo.tool.rand(0, 200),
            'y': clickgo.tool.rand(0, 200)
        };
    }
    remove() {
        for (const id in this.val2) {
            delete this.val2[id];
            break;
        }
    }
    up() {
        for (const item of this.selected) {
            this.val2[item].index = 999;
        }
    }
    down() {
        for (const item of this.selected) {
            this.val2[item].index = 0;
        }
    }
}
exports.default = default_1;

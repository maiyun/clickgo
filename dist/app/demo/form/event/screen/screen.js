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
        this.width = 0;
        this.height = 0;
        this.scale = 4;
        this.list = [];
    }
    onScreenResize() {
        const area = clickgo.core.getAvailArea();
        this.width = area.width;
        this.height = area.height;
        if (this.width > 1100 || this.height > 1100) {
            this.scale = 5;
        }
        else if (this.width < 420 || this.height < 420) {
            this.scale = 3;
        }
        else {
            this.scale = 4;
        }
        const date = new Date();
        this.list.unshift({
            'time': date.getHours().toString() + ':' + date.getMinutes().toString() + ':' + date.getSeconds().toString(),
            'width': area.width,
            'height': area.height
        });
    }
    onMounted() {
        const area = clickgo.core.getAvailArea();
        this.width = area.width;
        this.height = area.height;
        if (this.width > 1100 || this.height > 1100) {
            this.scale = 5;
        }
        else if (this.width < 420 || this.height < 420) {
            this.scale = 3;
        }
        else {
            this.scale = 4;
        }
        const date = new Date();
        this.list.unshift({
            'time': date.getHours().toString() + ':' + date.getMinutes().toString() + ':' + date.getSeconds().toString(),
            'width': this.width,
            'height': this.height
        });
    }
}
exports.default = default_1;

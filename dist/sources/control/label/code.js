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
Object.defineProperty(exports, "__esModule", { value: true });
const clickgo = __importStar(require("clickgo"));
class default_1 extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.props = {
            'mode': 'default',
            'content': '',
            'time': true,
            'date': true,
            'zone': false,
            'tz': undefined
        };
    }
    get contentComp() {
        if (this.props.mode !== 'date') {
            return this.props.content;
        }
        if (this.propNumber('content') === 0) {
            return '';
        }
        return clickgo.tool.formatTime(this.propNumber('content'), {
            'date': this.propBoolean('date'),
            'time': this.propBoolean('time'),
            'zone': this.propBoolean('zone'),
            'tz': this.props.tz === undefined ? undefined : this.propNumber('tz')
        });
    }
}
exports.default = default_1;

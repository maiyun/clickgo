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
            'time': true,
            'date': true,
            'zone': false,
            'tz': undefined
        };
        this.dateTxt = '';
    }
    pad(n) {
        const ns = n.toString();
        if (ns.length >= 2) {
            return ns;
        }
        return '0' + ns;
    }
    refreshDate() {
        if (this.props.mode !== 'date') {
            return;
        }
        const dateTxt = [];
        const date = new Date(parseInt(this.element.innerHTML) * 1000);
        const tz = this.props.tz === undefined ? -(date.getTimezoneOffset() / 60) : this.propNumber('tz');
        date.setTime(date.getTime() + tz * 60 * 60 * 1000);
        if (this.propBoolean('date')) {
            dateTxt.push(date.getUTCFullYear().toString() + '-' + this.pad(date.getUTCMonth() + 1) + '-' + this.pad(date.getUTCDate()));
        }
        if (this.propBoolean('time')) {
            dateTxt.push(this.pad(date.getUTCHours()) + ':' + this.pad(date.getUTCMinutes()) + ':' + this.pad(date.getUTCSeconds()));
        }
        if (this.propBoolean('zone')) {
            dateTxt.push('UTC' + (tz >= 0 ? '+' : '') + tz.toString());
        }
        this.dateTxt = dateTxt.join(' ');
    }
    onMounted() {
        this.watch('mode', () => {
            if (this.props.mode === 'date') {
                clickgo.dom.watch(this.element, () => {
                    this.refreshDate();
                }, 'text', true);
            }
            else {
                clickgo.dom.unwatch(this.element);
            }
        }, {
            'immediate': true
        });
        this.watch('time', () => {
            this.refreshDate();
        });
        this.watch('date', () => {
            this.refreshDate();
        });
        this.watch('zone', () => {
            this.refreshDate();
        });
        this.watch('tz', () => {
            this.refreshDate();
        });
    }
}
exports.default = default_1;

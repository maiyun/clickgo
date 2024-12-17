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
        this.props = {
            'direction': 'left',
            'speed': 1
        };
        this.padding = '';
        this.left = 0;
        this.top = 0;
        this.client = 0;
        this.length = 0;
        this.timer = 0;
        this.ani = false;
    }
    get opMargin() {
        return this.padding.replace(/(\w+)/g, '-$1');
    }
    get speedPx() {
        return this.propInt('speed') * 0.8;
    }
    refresh() {
        this.ani = false;
        if (this.length === 0 || this.client === 0) {
            return;
        }
        if (this.length > this.client) {
            if (this.timer > 0) {
                return;
            }
            switch (this.props.direction) {
                case 'left': {
                    this.left = 0;
                    this.top = 0;
                    break;
                }
                case 'right': {
                    this.left = -(this.length - this.client);
                    this.top = 0;
                    break;
                }
                case 'top': {
                    this.left = 0;
                    this.top = 0;
                    break;
                }
                case 'bottom': {
                    this.left = 0;
                    this.top = -(this.length - this.client);
                    break;
                }
            }
        }
        else {
            if (this.timer === 0) {
                return;
            }
            clickgo.task.offFrame(this.timer);
            this.timer = 0;
            this.left = 0;
            this.top = 0;
            return;
        }
        clickgo.task.sleep(() => {
            if (this.length <= this.client) {
                return;
            }
            if (this.timer > 0) {
                return;
            }
            this.timer = clickgo.task.onFrame(() => __awaiter(this, void 0, void 0, function* () {
                if (!clickgo.dom.inPage(this.element)) {
                    clickgo.task.offFrame(this.timer);
                    this.timer = 0;
                    return;
                }
                const xv = this.length - this.client;
                switch (this.props.direction) {
                    case 'left': {
                        if (this.left === -xv) {
                            this.left = 0;
                            clickgo.task.sleep(() => {
                                this.ani = false;
                            }, 150);
                            yield clickgo.tool.sleep(1000);
                        }
                        else {
                            this.left -= this.speedPx;
                            if (this.left < -xv) {
                                this.left = -xv;
                                this.ani = true;
                                yield clickgo.tool.sleep(1000);
                            }
                        }
                        break;
                    }
                    case 'right': {
                        if (this.left === 0) {
                            this.left = -xv;
                            clickgo.task.sleep(() => {
                                this.ani = false;
                            }, 150);
                            yield clickgo.tool.sleep(1000);
                        }
                        else {
                            this.left += this.speedPx;
                            if (this.left > 0) {
                                this.left = 0;
                                this.ani = true;
                                yield clickgo.tool.sleep(1000);
                            }
                        }
                        break;
                    }
                    case 'top': {
                        if (this.top === -xv) {
                            this.top = 0;
                            clickgo.task.sleep(() => {
                                this.ani = false;
                            }, 150);
                            yield clickgo.tool.sleep(1000);
                        }
                        else {
                            this.top -= this.speedPx;
                            if (this.top < -xv) {
                                this.top = -xv;
                                this.ani = true;
                                yield clickgo.tool.sleep(1000);
                            }
                        }
                        break;
                    }
                    case 'bottom': {
                        if (this.top === 0) {
                            this.top = -xv;
                            clickgo.task.sleep(() => {
                                this.ani = false;
                            }, 150);
                            yield clickgo.tool.sleep(1000);
                        }
                        else {
                            this.top += this.speedPx;
                            if (this.top > 0) {
                                this.top = 0;
                                this.ani = true;
                                yield clickgo.tool.sleep(1000);
                            }
                        }
                        break;
                    }
                }
            }), {
                'formId': this.formId
            });
        }, 1000);
    }
    onMounted() {
        this.watch('direction', (n, o) => {
            if (this.timer === 0) {
                return;
            }
            const ndir = (n === 'left' || n === 'right') ? 'h' : 'v';
            const odir = (o === 'left' || o === 'right') ? 'h' : 'v';
            if (ndir === odir) {
                return;
            }
            if (ndir === 'v') {
                this.left = 0;
            }
            else {
                this.top = 0;
            }
        });
        clickgo.dom.watchStyle(this.element, 'padding', (n, v) => {
            this.padding = v;
        }, true);
        clickgo.dom.watchSize(this.element, () => {
            const client = (this.props.direction === 'left' || this.props.direction === 'right') ? this.element.offsetWidth : this.element.offsetHeight;
            if (client === this.client) {
                return;
            }
            this.client = client;
            this.refresh();
        }, true);
        clickgo.dom.watchSize(this.refs.inner, () => {
            const length = (this.props.direction === 'left' || this.props.direction === 'right') ? this.refs.inner.offsetWidth : this.refs.inner.offsetHeight;
            if (length === this.length) {
                return;
            }
            this.length = length;
            this.refresh();
        }, true);
    }
}
exports.default = default_1;

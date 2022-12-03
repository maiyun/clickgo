"use strict";
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
const clickgo = require("clickgo");
class default_1 extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.props = {
            'direction': 'left',
            'scroll': true,
            'speed': 1
        };
        this.padding = '';
        this.left = 0;
        this.top = 0;
        this.client = 0;
        this.length = 0;
        this.timer = 0;
    }
    get opMargin() {
        return this.padding.replace(/(\w+)/g, '-$1');
    }
    get speedPx() {
        return this.propInt('speed') * 0.5;
    }
    refresh() {
        if (this.length === 0 || this.client === 0) {
            return;
        }
        if (this.propBoolean('scroll')) {
            if (this.timer > 0) {
                return;
            }
            switch (this.props.direction) {
                case 'left': {
                    this.left = this.client;
                    this.top = 0;
                    break;
                }
                case 'right': {
                    this.left = -this.length;
                    this.top = 0;
                    break;
                }
                case 'top': {
                    this.left = 0;
                    this.top = this.client;
                    break;
                }
                case 'bottom': {
                    this.left = 0;
                    this.top = -this.length;
                    break;
                }
            }
        }
        else if (this.length > this.client) {
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
                    this.left = this.length - this.client;
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
                    this.top = this.length - this.client;
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
        this.timer = clickgo.task.onFrame(() => __awaiter(this, void 0, void 0, function* () {
            if (!this.element.offsetParent) {
                clickgo.task.offFrame(this.timer);
                this.timer = 0;
                return;
            }
            if (this.propBoolean('scroll')) {
                switch (this.props.direction) {
                    case 'left': {
                        this.left -= this.speedPx;
                        if (this.left < -this.length) {
                            this.left = this.client;
                        }
                        break;
                    }
                    case 'right': {
                        this.left += this.speedPx;
                        if (this.left > this.client) {
                            this.left = -this.length;
                        }
                        break;
                    }
                    case 'top': {
                        this.top -= this.speedPx;
                        if (this.top < -this.length) {
                            this.top = this.client;
                        }
                        break;
                    }
                    case 'bottom': {
                        this.top += this.speedPx;
                        if (this.top > this.client) {
                            this.top = -this.length;
                        }
                        break;
                    }
                }
            }
            else {
                const xv = this.length - this.client;
                switch (this.props.direction) {
                    case 'left': {
                        if (this.left === -xv) {
                            this.left = 0;
                        }
                        else {
                            this.left -= this.speedPx;
                            if (this.left < -xv) {
                                this.left = -xv;
                                yield clickgo.tool.sleep(1000);
                            }
                        }
                        break;
                    }
                    case 'right': {
                        if (this.left === 0) {
                            this.left = xv;
                        }
                        else {
                            this.left += this.speedPx;
                            if (this.left > 0) {
                                this.left = 0;
                                yield clickgo.tool.sleep(1000);
                            }
                        }
                        break;
                    }
                    case 'top': {
                        if (this.top === -xv) {
                            this.top = 0;
                        }
                        else {
                            this.top -= this.speedPx;
                            if (this.top < -xv) {
                                this.top = -xv;
                                yield clickgo.tool.sleep(1000);
                            }
                        }
                        break;
                    }
                    case 'bottom': {
                        if (this.top === 0) {
                            this.top = xv;
                        }
                        else {
                            this.top += this.speedPx;
                            if (this.top > 0) {
                                this.top = 0;
                                yield clickgo.tool.sleep(1000);
                            }
                        }
                        break;
                    }
                }
            }
        }), {
            'formId': this.formId
        });
    }
    onMounted() {
        this.watch('scroll', () => {
            this.refresh();
        });
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
            const client = (this.props.direction === 'left' || this.props.direction === 'right') ? this.element.getBoundingClientRect().width : this.element.getBoundingClientRect().height;
            if (client === this.client) {
                return;
            }
            this.client = client;
            this.refresh();
        }, true);
        clickgo.dom.watchSize(this.refs.inner, () => {
            const length = (this.props.direction === 'left' || this.props.direction === 'right') ? this.refs.inner.getBoundingClientRect().width : this.refs.inner.getBoundingClientRect().height;
            if (length === this.length) {
                return;
            }
            this.length = length;
            this.refresh();
        }, true);
    }
}
exports.default = default_1;

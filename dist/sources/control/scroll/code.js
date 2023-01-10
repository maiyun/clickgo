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
            'disabled': false,
            'float': false,
            'direction': 'v',
            'length': 1000,
            'client': 100,
            'offset': 0
        };
        this.offsetData = 0;
        this.hideTimer = 0;
        this.tran = 0;
        this.isShow = true;
        this.isEnter = false;
        this.width = 0;
        this.height = 0;
        this.barPx = 0;
    }
    get blockPx() {
        const px = this.propInt('client') / this.propInt('length') * this.barPx;
        if (px < 5) {
            return 5;
        }
        return px;
    }
    get maxOffset() {
        return (this.props.length > this.props.client) ? this.propInt('length') - this.propInt('client') : 0;
    }
    get offsetRatio() {
        return this.maxOffset ? this.offsetData / this.maxOffset : 0;
    }
    get outBlockPx() {
        return this.barPx - this.blockPx;
    }
    get offsetPx() {
        return this.outBlockPx * this.offsetRatio;
    }
    wrapTouch(e) {
        clickgo.dom.bindDown(e, {
            down: () => {
                this.isEnter = true;
                if (this.propBoolean('float')) {
                    this.isShow = true;
                    if (this.hideTimer) {
                        clickgo.task.removeTimer(this.hideTimer);
                        this.hideTimer = 0;
                    }
                }
            },
            up: () => {
                this.isEnter = false;
                if (this.propBoolean('float')) {
                    this.hideTimer = clickgo.task.sleep(() => {
                        this.isShow = false;
                    }, 800);
                }
            }
        });
    }
    controlDown(e, type) {
        if (this.props.client >= this.props.length) {
            return;
        }
        clickgo.dom.bindDown(e, {
            down: () => {
                this.tran = clickgo.task.onFrame(() => {
                    if (type === 'start') {
                        if (this.offsetData - 10 < 0) {
                            if (this.offsetData !== 0) {
                                this.offsetData = 0;
                                this.emit('update:offset', this.offsetData);
                            }
                        }
                        else {
                            this.offsetData -= 10;
                            this.emit('update:offset', this.offsetData);
                        }
                    }
                    else {
                        if (this.offsetData + 10 > this.maxOffset) {
                            if (this.offsetData !== this.maxOffset) {
                                this.offsetData = this.maxOffset;
                                this.emit('update:offset', this.offsetData);
                            }
                        }
                        else {
                            this.offsetData += 10;
                            this.emit('update:offset', this.offsetData);
                        }
                    }
                });
            },
            up: () => {
                clickgo.task.offFrame(this.tran);
                this.tran = 0;
            }
        });
    }
    down(e) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        clickgo.dom.bindMove(e, {
            'areaObject': this.refs.bar,
            'object': this.refs.block,
            'move': (e, o) => {
                if ((this.props.direction === 'v' && o.inBorder.top) || (this.props.direction === 'h' && o.inBorder.left)) {
                    this.offsetData = 0;
                }
                else if ((this.props.direction === 'v' && o.inBorder.bottom) || (this.props.direction === 'h' && o.inBorder.right)) {
                    this.offsetData = this.maxOffset;
                }
                else {
                    const offsetPx = this.offsetPx + (this.props.direction === 'v' ? o.oy : o.ox);
                    const ratio = (this.outBlockPx > 0) ? (offsetPx / this.outBlockPx) : 0;
                    this.offsetData = Math.round(ratio * this.maxOffset);
                }
                this.emit('update:offset', this.offsetData);
            }
        });
    }
    barDown(e) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        if (e.currentTarget !== e.target) {
            return;
        }
        const barRect = this.refs.bar.getBoundingClientRect();
        const barOffsetPx = this.props.direction === 'v' ? barRect.top : barRect.left;
        let eOffsetPx = this.props.direction === 'v' ? (e instanceof MouseEvent ? e.clientY : e.touches[0].clientY) : (e instanceof MouseEvent ? e.clientX : e.touches[0].clientX);
        eOffsetPx = eOffsetPx - barOffsetPx;
        let offsetPx = eOffsetPx - this.blockPx / 2;
        if (offsetPx < 0) {
            offsetPx = 0;
        }
        if (offsetPx + this.blockPx > this.barPx) {
            offsetPx = this.barPx - this.blockPx;
        }
        const ratio = (this.outBlockPx > 0) ? (offsetPx / this.outBlockPx) : 0;
        this.offsetData = Math.round(ratio * this.maxOffset);
        this.emit('update:offset', this.offsetData);
        this.down(e);
    }
    enter(e) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        this.isEnter = true;
        if (this.propBoolean('float')) {
            this.isShow = true;
            if (this.hideTimer) {
                clickgo.task.removeTimer(this.hideTimer);
                this.hideTimer = 0;
            }
        }
    }
    leave(e) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        this.isEnter = false;
        if (this.propBoolean('float')) {
            this.hideTimer = clickgo.task.sleep(() => {
                this.isShow = false;
            }, 800);
        }
    }
    onMounted() {
        const checkOffset = () => {
            if (this.offsetData <= this.maxOffset) {
                return;
            }
            this.offsetData = this.maxOffset;
            this.emit('update:offset', this.offsetData);
        };
        this.watch('length', checkOffset);
        this.watch('client', checkOffset);
        this.watch('offset', () => {
            if (this.offsetData === this.propInt('offset')) {
                return;
            }
            this.offsetData = this.propInt('offset');
            if (this.propBoolean('float') && !this.isEnter) {
                if (this.hideTimer) {
                    clickgo.task.removeTimer(this.hideTimer);
                }
                this.isShow = true;
                this.hideTimer = clickgo.task.sleep(() => {
                    this.isShow = false;
                }, 800);
            }
        }, {
            'immediate': true
        });
        this.watch('float', () => {
            if (this.propBoolean('float')) {
                this.hideTimer = clickgo.task.sleep(() => {
                    this.isShow = false;
                }, 800);
            }
            else {
                this.isShow = true;
                if (this.hideTimer) {
                    clickgo.task.removeTimer(this.hideTimer);
                    this.hideTimer = 0;
                }
            }
        }, {
            'immediate': true
        });
        clickgo.dom.watchSize(this.refs.bar, () => {
            const barRect = this.refs.bar.getBoundingClientRect();
            this.barPx = this.props.direction === 'v' ? barRect.height : barRect.width;
            const rect = this.element.getBoundingClientRect();
            this.width = rect.width;
            this.height = rect.height;
        }, true);
    }
    onUnmounted() {
        if (this.hideTimer) {
            clickgo.task.offFrame(this.hideTimer);
        }
    }
}
exports.default = default_1;

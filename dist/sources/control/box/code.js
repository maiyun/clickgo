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
            'modelValue': {}
        };
        this.isInteract = false;
        this.isSelection = false;
        this.selected = [];
    }
    wrapDown(e) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        if (e.target !== e.currentTarget) {
            return;
        }
        if (!e.ctrlKey && !e.metaKey) {
            this.selected.length = 0;
        }
        const rect = this.element.getBoundingClientRect();
        const x = (e instanceof MouseEvent) ? e.clientX : e.touches[0].clientX;
        const y = (e instanceof MouseEvent) ? e.clientY : e.touches[0].clientY;
        clickgo.dom.bindDown(e, {
            start: () => {
                this.isSelection = true;
            },
            move: (ne) => {
                const nx = (ne instanceof MouseEvent) ? ne.clientX : ne.touches[0].clientX;
                const ny = (ne instanceof MouseEvent) ? ne.clientY : ne.touches[0].clientY;
                if (nx > x) {
                    this.refs.selection.setAttribute('x', (x - rect.left).toString());
                    this.refs.selection.setAttribute('width', (nx - x).toString());
                }
                else {
                    this.refs.selection.setAttribute('x', (nx - rect.left).toString());
                    this.refs.selection.setAttribute('width', (x - nx).toString());
                }
                if (ny > y) {
                    this.refs.selection.setAttribute('y', (y - rect.top).toString());
                    this.refs.selection.setAttribute('height', (ny - y).toString());
                }
                else {
                    this.refs.selection.setAttribute('y', (ny - rect.top).toString());
                    this.refs.selection.setAttribute('height', (y - ny).toString());
                }
            },
            end: (ne) => {
                const left = Math.round(parseFloat(this.refs.selection.getAttribute('x')));
                const right = Math.round(parseFloat(this.refs.selection.getAttribute('width'))) + left;
                const top = Math.round(parseFloat(this.refs.selection.getAttribute('y')));
                const bottom = Math.round(parseFloat(this.refs.selection.getAttribute('height'))) + top;
                if (!ne.ctrlKey && !ne.metaKey) {
                    this.selected.length = 0;
                }
                for (const id in this.props.modelValue) {
                    const item = this.props.modelValue[id];
                    if ((right < item.x) ||
                        (left > item.x + item.width) ||
                        (bottom < item.y) ||
                        (top > item.y + item.height)) {
                        continue;
                    }
                    if (this.selected.includes(id)) {
                        continue;
                    }
                    this.selected.push(id);
                }
                this.refs.selection.setAttribute('x', '0');
                this.refs.selection.setAttribute('y', '0');
                this.refs.selection.setAttribute('width', '1');
                this.refs.selection.setAttribute('height', '1');
                this.isSelection = false;
            }
        });
    }
    resize(e, id, dir) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        clickgo.dom.bindResize(e, {
            'objectLeft': this.props.modelValue[id].x,
            'objectTop': this.props.modelValue[id].y,
            'objectWidth': this.props.modelValue[id].width,
            'objectHeight': this.props.modelValue[id].height,
            'border': dir,
            'start': () => {
                this.isInteract = true;
            },
            'move': (left, top, width, height) => {
                let item = this.props.modelValue[id];
                let x = item.x;
                item.x = left;
                x = item.x - x;
                let y = item.y;
                item.y = top;
                y = item.y - y;
                let widthx = item.width;
                item.width = width;
                widthx = item.width - widthx;
                let heightx = item.height;
                item.height = height;
                heightx = item.height - heightx;
                for (const key of this.selected) {
                    if (key === id) {
                        continue;
                    }
                    item = this.props.modelValue[key];
                    item.x += x;
                    item.y += y;
                    item.width += widthx;
                    item.height += heightx;
                }
            },
            'end': () => {
                this.isInteract = false;
            }
        });
    }
    down(e, id) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        if (!this.selected.includes(id)) {
            if (!e.ctrlKey && !e.metaKey) {
                this.selected.length = 0;
            }
            this.selected.push(id);
        }
        if (this.props.modelValue[id].move === false) {
            return;
        }
        clickgo.dom.bindMove(e, {
            'areaObject': this.element,
            'object': e.currentTarget,
            'cursor': 'auto',
            start: () => {
                this.isInteract = true;
            },
            move: (e, o) => {
                for (const key of this.selected) {
                    this.props.modelValue[key].x += o.ox;
                    this.props.modelValue[key].y += o.oy;
                }
            },
            end: () => {
                this.isInteract = false;
            }
        });
    }
    onMounted() {
        this.watch('modelValue', () => {
            for (let i = 0; i < this.selected.length; ++i) {
                const id = this.selected[i];
                if (this.props.modelValue[id]) {
                    continue;
                }
                this.selected.splice(i, 1);
                --i;
            }
        });
    }
}
exports.default = default_1;

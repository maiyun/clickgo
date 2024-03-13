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
        this.emits = {
            'select': null
        };
        this.props = {
            'label': '',
            'name': '',
            'icon': '',
            'show': false
        };
        this.showData = false;
        this.isChild = false;
        this.nav = {};
    }
    get hasChild() {
        return this.slotsAll('default').length ? true : false;
    }
    get overName() {
        return this.props.name === '' ? this.props.label : this.props.name;
    }
    get selected() {
        var _a;
        return (_a = this.nav.selected) !== null && _a !== void 0 ? _a : '';
    }
    get isSelected() {
        if (this.selected === this.overName) {
            return true;
        }
        const selecteda = this.selected.split('?');
        const namea = this.overName.split('?');
        if (selecteda[0] !== namea[0]) {
            return false;
        }
        if (namea[1]) {
            return false;
        }
        if (!selecteda[1]) {
            return true;
        }
        if (this.nav.childs.includes(this.selected)) {
            return false;
        }
        return true;
    }
    click() {
        if (!this.hasChild) {
            if (this.isSelected) {
                return;
            }
            const event = {
                'go': true,
                preventDefault: function () {
                    this.go = false;
                },
                'detail': {
                    'name': this.overName,
                    'selected': this.selected
                }
            };
            this.emit('select', event);
            if (event.go) {
                this.nav.select(this.overName);
            }
            return;
        }
        this.showData = !this.showData;
        this.emit('update:show', this.showData);
    }
    onMounted() {
        this.watch('show', () => {
            if (!this.hasChild) {
                return;
            }
            this.showData = this.propBoolean('show');
        }, {
            'immediate': true
        });
        this.watch('showData', () => __awaiter(this, void 0, void 0, function* () {
            if (!this.hasChild) {
                return;
            }
            if (this.showData) {
                this.refs.menu.style.height = this.refs.menu.children[0].offsetHeight.toString() + 'px';
                yield clickgo.tool.sleep(300);
                this.refs.menu.style.height = '';
            }
            else {
                this.refs.menu.style.height = this.refs.menu.offsetHeight.toString() + 'px';
                yield clickgo.tool.sleep(50);
                this.refs.menu.style.height = '0';
            }
        }));
        if (this.hasChild && !this.showData) {
            this.refs.menu.style.height = '0';
        }
        if (this.parentByName('nav-item')) {
            this.isChild = true;
        }
        this.watch('isSelected', () => {
            if (!this.isSelected) {
                return;
            }
            let parent = this.parentByName('nav-item');
            while (parent) {
                if (!parent.showData) {
                    parent.showData = true;
                    parent.emit('update:show', parent.showData);
                }
                parent = parent.parentByName('nav-item');
            }
        });
        this.watch('overName', (n, o) => {
            const io = this.nav.childs.indexOf(o);
            this.nav.childs.splice(io, 1);
            this.nav.childs.push(n);
        });
        this.nav = this.parentByName('nav');
        this.nav.childs.push(this.overName);
    }
    onUnmounted() {
        const io = this.nav.childs.indexOf(this.overName);
        this.nav.childs.splice(io, 1);
    }
}
exports.default = default_1;

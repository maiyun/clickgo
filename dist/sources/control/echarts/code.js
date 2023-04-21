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
        this.props = {
            'disabled': false,
            'data': {},
            'theme': 'light'
        };
        this.notInit = false;
        this.isLoading = true;
        this.access = {
            'chart': undefined
        };
    }
    onMounted() {
        return __awaiter(this, void 0, void 0, function* () {
            const echarts = yield clickgo.core.getModule('echarts');
            if (!echarts) {
                this.isLoading = false;
                this.notInit = true;
                return;
            }
            this.access.chart = echarts.init(this.refs.content, this.props.theme === 'light' ? undefined : 'dark');
            this.watch('theme', () => {
                this.access.chart.dispose();
                this.access.chart = echarts.init(this.refs.content, this.props.theme === 'light' ? undefined : 'dark');
                this.access.chart.setOption(this.props.data);
                this.emit('init', this.access.chart);
            }, {
                'deep': true
            });
            this.watch('data', () => {
                this.access.chart.setOption(this.props.data);
            }, {
                'immediate': true,
                'deep': true
            });
            clickgo.dom.watchSize(this.element, () => {
                this.access.chart.resize();
            }, true);
            this.isLoading = false;
            this.emit('init', this.access.chart);
        });
    }
}
exports.default = default_1;

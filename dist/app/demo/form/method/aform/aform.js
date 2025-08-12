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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clickgo = __importStar(require("clickgo"));
const sd_1 = __importDefault(require("./sd"));
class default_1 extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.fid = '0';
        this.sendValue = 'sendValue';
        this.test = 'A';
        this.dr = '';
        this.hash = 'testhash';
    }
    ssend() {
        this.send(parseInt(this.fid), {
            'key': this.sendValue
        });
    }
    async hhide() {
        this.hide();
        await clickgo.tool.sleep(1000);
        this.show();
    }
    async sshowDialog() {
        const frm = await clickgo.form.create(sd_1.default);
        this.dr = await frm.showDialog();
    }
    async showLoading() {
        this.loading = true;
        await clickgo.tool.sleep(1000);
        this.loading = false;
    }
    async showLoadingFast() {
        this.loading = true;
        await clickgo.tool.sleep(1000);
        this.loading = false;
        this.loading = true;
        await clickgo.tool.sleep(1000);
        this.loading = false;
    }
    async toEnterStep() {
        const rtn = await this.enterStep([
            {
                'value': 'step1',
                'label': 'step1'
            },
            {
                'value': 'step2'
            },
            {
                'icon': '/package/res/marker.svg',
                'value': 'icon'
            },
            {
                'label': 'successful',
                'value': 'step3',
                'desc': 'qq'
            }
        ]);
        await clickgo.form.dialog('Result: ' + (rtn ? 'true' : 'false'));
    }
    onMounted() {
        this.watch('test', async () => {
            await clickgo.form.dialog('test changed.');
        });
    }
}
exports.default = default_1;

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
class default_1 extends clickgo.form.AbstractPanel {
    constructor() {
        super(...arguments);
        this.scount = 0;
        this.data = {};
        this.rootMountData = 'none';
    }
    async onShow(e) {
        await clickgo.tool.sleep(1000);
        ++this.scount;
        this.data = e;
    }
    async onHide() {
        await clickgo.tool.sleep(1000);
    }
    async onReceive(data) {
        this.data = data;
        await clickgo.form.dialog('test1 got data.');
    }
    onQsChange() {
        clickgo.form.notify({
            'title': 'Test1 Panel',
            'content': 'onQsChange: ' + Object.keys(this.qs).length.toString()
        });
    }
    async onQsChangeShow(e) {
        await clickgo.tool.sleep(500);
        clickgo.form.notify({
            'title': 'Test1 Panel',
            'content': 'onQsChangeShow'
        });
        console.log('onQsChangeShow', e);
    }
    async click() {
        await clickgo.form.dialog('Hello panel!');
    }
    async clearQss() {
        this.clearQs();
        await clickgo.form.dialog('cleard.');
    }
    jump() {
        this.rootForm.formHash = 'test1?a=1&b=3';
    }
    onMounted() {
        this.rootMountData = this.rootForm.mountData;
    }
}
exports.default = default_1;

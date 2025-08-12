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
class default_1 extends clickgo.form.AbstractForm {
    async getVersion() {
        await clickgo.form.dialog('Version: ' + clickgo.getVersion());
    }
    async isNative() {
        await clickgo.form.dialog('Native: ' + (clickgo.isNative() ? 'true' : 'false'));
    }
    async getPlatform() {
        await clickgo.form.dialog('Platform: ' + clickgo.getPlatform());
    }
    async getDevice() {
        await clickgo.form.dialog('Device: ' + JSON.stringify(clickgo.getDevice()));
    }
    async isImmersion() {
        await clickgo.form.dialog('Immersion: ' + (clickgo.isImmersion() ? 'true' : 'false'));
    }
    async hasFrame() {
        await clickgo.form.dialog('hasFrame: ' + (clickgo.hasFrame() ? 'true' : 'false'));
    }
    async ls() {
        await clickgo.form.dialog('typeof localStorage: ' + typeof localStorage);
    }
    async map() {
        await clickgo.form.dialog('typeof Map: ' + typeof Map);
    }
}
exports.default = default_1;

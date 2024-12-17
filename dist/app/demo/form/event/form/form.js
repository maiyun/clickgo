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
class default_1 extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.flist = {};
        this.list = [];
    }
    pushConsole(name, text) {
        const date = new Date();
        this.list.unshift({
            'time': date.getHours().toString() + ':' + date.getMinutes().toString() + ':' + date.getSeconds().toString(),
            'name': name,
            'text': text
        });
    }
    changeFocus(fid) {
        clickgo.form.changeFocus(parseInt(fid));
    }
    onMounted() {
        const list = clickgo.task.getList();
        for (const taskId in list) {
            const flist = clickgo.form.getList(parseInt(taskId));
            for (const fid in flist) {
                this.flist[fid] = {
                    'title': flist[fid].title,
                    'icon': flist[fid].icon,
                    'stateMax': flist[fid].stateMax,
                    'stateMin': flist[fid].stateMin,
                    'show': flist[fid].show,
                    'focus': flist[fid].focus,
                    'flash': false,
                    'showInTask': flist[fid].showInSystemTask
                };
            }
        }
    }
    onFormCreated(taskId, formId, title, icon, showInSystemTask) {
        this.flist[formId] = {
            'title': title,
            'icon': icon,
            'stateMax': false,
            'stateMin': false,
            'show': false,
            'focus': false,
            'flash': false,
            'showInTask': true
        };
        this.pushConsole('formCreated', `taskId: ${taskId}, formId: ${formId}, title: ${title}, icon: ${icon ? icon.slice(0, 10) + '...' : 'null'}, sist: ${showInSystemTask ? 'true' : 'false'}`);
    }
    onFormRemoved(taskId, formId, title, icon) {
        if (!this.flist[formId]) {
            return;
        }
        this.flist[formId] = undefined;
        delete this.flist[formId];
        this.pushConsole('formRemoved', `taskId: ${taskId}, formId: ${formId}, title: ${title}, icon: ${icon ? icon.slice(0, 10) + '...' : 'null'}`);
    }
    onFormTitleChanged(taskId, formId, title) {
        if (!this.flist[formId]) {
            return;
        }
        this.flist[formId].title = title;
        this.pushConsole('formTitleChanged', `taskId: ${taskId}, formId: ${formId}, title: ${title}`);
    }
    onFormIconChanged(taskId, formId, icon) {
        if (!this.flist[formId]) {
            return;
        }
        this.flist[formId].icon = icon;
        this.pushConsole('formIconChanged', `taskId: ${taskId}, formId: ${formId}, icon: ${icon ? icon.slice(0, 10) + '...' : 'null'}`);
    }
    onFormStateMinChanged(taskId, formId, state) {
        if (!this.flist[formId]) {
            return;
        }
        this.flist[formId].min = state;
        this.pushConsole('formStateMinChanged', `taskId: ${taskId}, formId: ${formId}, state: ${state ? 'true' : 'false'}`);
    }
    onFormStateMaxChanged(taskId, formId, state) {
        if (!this.flist[formId]) {
            return;
        }
        this.flist[formId].max = state;
        this.pushConsole('formStateMaxChanged', `taskId: ${taskId}, formId: ${formId}, state: ${state ? 'true' : 'false'}`);
    }
    onFormShowChanged(taskId, formId, state) {
        if (!this.flist[formId]) {
            return;
        }
        this.flist[formId].show = state;
        this.pushConsole('formShowChanged', `taskId: ${taskId}, formId: ${formId}, state: ${state ? 'true' : 'false'}`);
    }
    onFormFocused(taskId, formId) {
        if (!this.flist[formId]) {
            return;
        }
        this.flist[formId].focus = true;
        this.pushConsole('formFocused', `taskId: ${taskId}, formId: ${formId}`);
    }
    onFormBlurred(taskId, formId) {
        if (!this.flist[formId]) {
            return;
        }
        this.flist[formId].focus = false;
        this.pushConsole('formBlurred', `taskId: ${taskId}, formId: ${formId}`);
    }
    onFormFlash(taskId, formId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.flist[formId]) {
                return;
            }
            if (this.flist[formId].flash) {
                clickgo.task.removeTimer(this.flist[formId].flash);
            }
            this.pushConsole('formFlash', `taskId: ${taskId}, formId: ${formId}`);
            this.flist[formId].flash = true;
            yield clickgo.tool.sleep(1000);
            this.flist[formId].flash = false;
        });
    }
    onFormShowInSystemTaskChange(taskId, formId, value) {
        if (!this.flist[formId]) {
            return;
        }
        this.flist[formId].title = value;
        this.pushConsole('formShowInSystemTaskChange', `taskId: ${taskId}, formId: ${formId}, value: ${value}`);
    }
    onFormHashChange(taskId, formId, value, data) {
        if (!this.flist[formId]) {
            return;
        }
        this.pushConsole('formHashChange', `taskId: ${taskId}, formId: ${formId}, value: ${value}, data: ${JSON.stringify(data).slice(0, 20)}...`);
        return;
    }
}
exports.default = default_1;

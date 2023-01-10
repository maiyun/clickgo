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
const clickgo = __importStar(require("../../index"));
const state = document.getElementById('state');
const init = document.getElementById('init');
const href = document.getElementById('href');
let already = false;
class Boot extends clickgo.AbstractBoot {
    main() {
        state.innerHTML = 'Initialized.';
        init.style.pointerEvents = '';
        init.style.userSelect = '';
        init.style.color = '';
        href.style.color = '';
        href.addEventListener('click', () => {
            if (already) {
                return;
            }
            already = true;
            state.innerHTML = 'Task starting...';
            href.removeAttribute('href');
            clickgo.task.run('../../app/demo/').then((taskId) => {
                state.innerHTML = 'Task ' + taskId.toString() + ' running...';
            }).catch((e) => {
                console.log('e', e);
            });
        });
    }
    onError(taskId, formId, error) {
        state.innerHTML = 'Error, Task ID: ' + taskId.toString() + ', Form ID: ' + formId.toString() + '<br>' + (error.stack ? error.stack.replace(/\n/g, '<br>') : '');
        clickgo.task.end(taskId);
    }
    onTaskEnded(taskId) {
        state.innerHTML = 'Task ' + taskId.toString() + ' ended.';
    }
}
clickgo.launcher(new Boot());

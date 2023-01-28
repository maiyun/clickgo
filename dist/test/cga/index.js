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
const clickgo = __importStar(require("../../index"));
const state = document.getElementById('state');
const iconwrap = document.getElementById('iconwrap');
const body = document.getElementsByTagName('body')[0];
let app = null;
class Boot extends clickgo.AbstractBoot {
    main() {
        var _a;
        state.insertAdjacentHTML('afterbegin', '<div>Initialized.</div>');
        (_a = document.getElementById('download')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
            (() => __awaiter(this, void 0, void 0, function* () {
                var _a;
                (_a = document.getElementById('download')) === null || _a === void 0 ? void 0 : _a.remove();
                state.insertAdjacentHTML('afterbegin', '<div>Starting download ...</div>');
                app = yield clickgo.core.fetchApp('./app.cga', {
                    'progress': (l, t) => {
                        state.insertAdjacentHTML('afterbegin', '<div>Progress ' + l.toString() + ' / ' + t.toString() + ' (' + Math.round(l / t * 100).toString() + '%)</div>');
                    }
                });
                if (!app) {
                    state.insertAdjacentHTML('afterbegin', '<div>Network error.</div>');
                    return;
                }
                iconwrap.style.display = 'flex';
                document.getElementById('fl').style.display = 'block';
                document.getElementById('icon').style.backgroundImage = 'url(' + app.icon + ')';
                document.getElementById('mask').style.webkitMaskImage = 'url(' + app.icon + ')';
                document.getElementById('mask').style.maskImage = 'url(' + app.icon + ')';
            }))();
        });
        iconwrap.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            iconwrap.classList.add('selected');
        });
        iconwrap.addEventListener('dblclick', () => {
            (function () {
                return __awaiter(this, void 0, void 0, function* () {
                    body.style.cursor = 'progress';
                    iconwrap.classList.remove('selected');
                    yield clickgo.task.run(app, {
                        initProgress: (s) => {
                            state.insertAdjacentHTML('afterbegin', '<div> ' + s + '</div>');
                        }
                    });
                    body.style.cursor = 'default';
                });
            })();
        });
        document.addEventListener('mousedown', () => {
            iconwrap.classList.remove('selected');
        });
    }
    onError(taskId, formId, error) {
        state.insertAdjacentHTML('afterbegin', '<div>Error, Task ID: ' + taskId.toString() + ', Form ID: ' + formId.toString() + '<br>' + (error.stack ? error.stack.replace(/\n/g, '<br>') : '') + '</div>');
        clickgo.task.end(taskId);
    }
    onTaskEnded(taskId) {
        state.insertAdjacentHTML('afterbegin', '<div>Task ' + taskId.toString() + ' ended.</div>');
    }
}
clickgo.launcher(new Boot());

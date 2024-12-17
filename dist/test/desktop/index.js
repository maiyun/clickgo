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
const clickgo = __importStar(require("../../index"));
const el = document.getElementById('tip');
el.innerHTML = 'Starting system app...';
class Boot extends clickgo.AbstractBoot {
    main() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!window.location.href.includes('?single')) {
                const sTaskId = yield clickgo.task.run('/clickgo/app/task/');
                if (sTaskId <= 0) {
                    el.innerHTML = `Star system app failed(${sTaskId.toString()}).`;
                    return;
                }
                el.innerHTML = 'Starting main app...';
            }
            const taskId = yield clickgo.task.run('/clickgo/app/demo/', {
                'notify': window.location.href.includes('?single') ? false : undefined,
                'unblock': ['sessionStorage'],
                'permissions': ['native.form'],
                'data': {
                    'param': 'abc'
                }
            });
            if (taskId <= 0) {
                el.innerHTML = `Start main app failed(${taskId.toString()}).`;
                return;
            }
            const icon = yield clickgo.fs.getContent('/clickgo/icon.png');
            if (icon instanceof Blob) {
                const du = yield clickgo.tool.blob2DataUrl(icon);
                clickgo.core.config['launcher.list'] = [
                    {
                        'name': clickgo.task.list[taskId].app.config.name + '01',
                        'icon': du,
                        'path': clickgo.task.list[taskId].path
                    },
                    {
                        'name': clickgo.task.list[taskId].app.config.name + '02',
                        'icon': du,
                        'path': clickgo.task.list[taskId].path
                    },
                    {
                        'id': '1',
                        'name': 'folder1',
                        'list': [
                            {
                                'name': clickgo.task.list[taskId].app.config.name + '11',
                                'icon': du,
                                'path': clickgo.task.list[taskId].path
                            },
                            {
                                'name': clickgo.task.list[taskId].app.config.name + '12',
                                'icon': du,
                                'path': clickgo.task.list[taskId].path
                            }
                        ]
                    },
                    {
                        'id': '2',
                        'name': 'folder2',
                        'list': [
                            {
                                'name': clickgo.task.list[taskId].app.config.name + '21',
                                'icon': du,
                                'path': clickgo.task.list[taskId].path
                            }
                        ]
                    }
                ];
            }
            el.innerHTML = 'Running...';
            const body = document.getElementsByTagName('body')[0];
            if (clickgo.isNative() && clickgo.isImmersion()) {
                body.style.background = 'transparent';
                document.getElementById('spic').style.display = 'none';
            }
            else {
                body.classList.add('loaded');
                document.getElementById('spic').style.background = 'transparent';
            }
        });
    }
    onError(taskId, formId, error, info) {
        console.log('boot.onError', info, error);
        const err = document.getElementById('err');
        err.style.display = 'block';
        err.innerHTML = 'Error, Task ID: ' + taskId.toString() + ', Form ID: ' + formId.toString() + '<br>' + (error.stack ? error.stack.replace(/\n/g, '<br>') : '');
        clickgo.task.end(taskId);
    }
    onTaskEnded(taskId) {
        el.innerHTML = 'Task(' + taskId.toString() + ') ended.';
    }
}
clickgo.launcher(new Boot({
    'debug': true
}));

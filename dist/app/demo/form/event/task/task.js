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
        this.tlist = [];
        this.list = [];
        this.tid = [];
    }
    pushConsole(name, text) {
        const date = new Date();
        this.list.unshift({
            'time': date.getHours().toString() + ':' + date.getMinutes().toString() + ':' + date.getSeconds().toString(),
            'name': name,
            'text': text
        });
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const taskId = yield clickgo.task.run('/clickgo/app/demo/');
            yield clickgo.form.dialog(`Successfully run, task id is: ${taskId}.`);
        });
    }
    end() {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield clickgo.form.confirm(`Are you sure to end Task ${this.tid[0]}?`)) {
                clickgo.task.end(this.tid[0]);
            }
        });
    }
    runTask() {
        return __awaiter(this, void 0, void 0, function* () {
            if (clickgo.task.systemTaskInfo.taskId > 0) {
                yield clickgo.form.dialog('The Task APP is already running.');
                return;
            }
            const taskId = yield clickgo.task.run('/clickgo/app/task/');
            yield clickgo.form.dialog(`Successfully run, task id is: ${taskId}.`);
        });
    }
    onTaskStarted(taskId) {
        this.tlist.push({
            'label': 'Task ' + taskId.toString(),
            'value': taskId
        });
        this.pushConsole('taskStarted', `taskId: ${taskId}`);
    }
    onTaskEnded(taskId) {
        for (let i = 0; i < this.tlist.length; ++i) {
            if (this.tlist[i].value !== taskId) {
                continue;
            }
            this.tlist.splice(i, 1);
            break;
        }
        this.pushConsole('taskEnded', `taskId: ${taskId}`);
    }
    onMounted() {
        const list = clickgo.task.getList();
        for (const tid in list) {
            this.tlist.push({
                'label': 'Task ' + tid,
                'value': parseInt(tid)
            });
        }
    }
}
exports.default = default_1;

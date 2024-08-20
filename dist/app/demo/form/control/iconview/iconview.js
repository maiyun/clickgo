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
class default_1 extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.list = [
            {
                'id': '1',
                'type': 0,
                'name': 'Folder',
                'time': 1676636097
            },
            {
                'id': '2',
                'type': 0,
                'name': 'Folder2',
                'time': 1676636097
            },
            {
                'id': '3',
                'type': 1,
                'name': 'File1',
                'time': 1676600096
            },
            {
                'id': '4',
                'type': 1,
                'name': 'db.sql',
                'time': 1676600097,
                'icon': '/package/res/sql.svg'
            },
            {
                'id': '5',
                'type': 1,
                'name': 'article.txt',
                'time': 1676600098,
                'icon': '/package/res/txt.svg'
            },
            {
                'id': '6',
                'type': 1,
                'name': 'pack.zip',
                'time': 1676600099,
                'icon': '/package/res/zip.svg'
            },
            {
                'id': '7',
                'type': 1,
                'name': 'packlonglonglonglonglonglonglonglonglong.zip',
                'time': 1676700099,
                'icon': '/package/res/zip.svg'
            },
            {
                'id': 7,
                'icon': 'https://cdn.jsdelivr.net/npm/clickgo@3.7.0/dist/app/demo/res/img.jpg'
            }
        ];
        this.select = [];
        this.disabled = false;
        this.must = false;
        this.multi = true;
        this.ctrl = true;
        this.selection = true;
        this.gesture = false;
        this.name = true;
        this.selectionArea = {};
        this.scroll = 'auto';
        this.size = [100];
        this.plain = false;
    }
    showIndex() {
        clickgo.form.dialog('Index is ' + this.select.toString() + '.').catch((e) => { throw e; });
    }
    showType() {
        if (this.select.length === 0) {
            clickgo.form.dialog('There are currently no selected items.').catch((e) => { throw e; });
        }
        else {
            const types = [];
            for (const item of this.select) {
                types.push(this.list[item].type);
            }
            clickgo.form.dialog(`Type is ${JSON.stringify(types)}.`).catch((e) => { throw e; });
        }
    }
    add() {
        if (clickgo.tool.rand(0, 1)) {
            this.list.push({
                'id': this.list.length.toString(),
                'type': 1,
                'name': 'File' + this.list.length.toString(),
                'time': Math.floor(Date.now() / 1000)
            });
        }
        else {
            this.list.unshift({
                'id': this.list.length.toString(),
                'type': 0,
                'name': 'Folder' + this.list.length.toString(),
                'time': Math.floor(Date.now() / 1000)
            });
        }
    }
    remove() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.list.length === 3) {
                yield clickgo.form.dialog('It cannot be removed at this time.');
                return;
            }
            this.list.splice(-1, 1);
        });
    }
    drop(e) {
        return __awaiter(this, void 0, void 0, function* () {
            yield clickgo.form.dialog(JSON.stringify(e.detail));
        });
    }
    onSelect(e) {
        this.selectionArea = e.detail.area;
    }
    onOpen(e) {
        return __awaiter(this, void 0, void 0, function* () {
            yield clickgo.form.dialog('onOpen: ' + e.detail.value.toString());
        });
    }
    scrollChange() {
        switch (this.scroll) {
            case 'auto': {
                this.scroll = 'visible';
                break;
            }
            case 'visible': {
                this.scroll = 'hidden';
                break;
            }
            default: {
                this.scroll = 'auto';
            }
        }
    }
    onGesture(dir) {
        return __awaiter(this, void 0, void 0, function* () {
            yield clickgo.form.dialog('onGesture: ' + dir);
        });
    }
}
exports.default = default_1;

"use strict";
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
exports.methods = exports.data = void 0;
exports.data = {
    'width': 300,
    'height': 505,
    'theme': ''
};
exports.methods = {
    openOnlyClose: function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.cgCreateForm('/form/onlyClose');
        });
    },
    openThin: function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.cgCreateForm('/form/thin');
        });
    },
    openBorderNone: function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.cgCreateForm('/form/borderNone');
        });
    },
    openAero: function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.cgCreateForm('/form/aero');
        });
    },
    openMax: function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.cgCreateForm('/form/max');
        });
    },
    openMove: function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.cgCreateForm('/form/move');
        });
    },
    openScroll: function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.cgCreateForm('/form/scroll');
        });
    },
    openView: function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.cgCreateForm('/form/view');
        });
    },
    openMenu: function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.cgCreateForm('/form/menu');
        });
    },
    openGreatView: function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.cgCreateForm('/form/greatview');
        });
    },
    openOverflow: function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.cgCreateForm('/form/overflow');
        });
    },
    runTaskmgr: function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield clickgo.task.run('taskApp/');
        });
    },
    changeTheme: function () {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.theme === '') {
                this.theme = 'once';
                yield this.cgSetTheme('/clickgo/theme/once.cgt');
            }
            else {
                this.theme = '';
                yield this.cgClearTheme();
            }
        });
    },
    openError: function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.cgCreateForm('/form/error');
        });
    }
};

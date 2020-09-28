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
        this.createForm('/form/onlyClose');
    },
    openThin: function () {
        this.createForm('/form/thin');
    },
    openBorderNone: function () {
        this.createForm('/form/borderNone');
    },
    openAero: function () {
        this.createForm('/form/aero');
    },
    openMax: function () {
        this.createForm('/form/max');
    },
    openMove: function () {
        this.createForm('/form/move');
    },
    openScroll: function () {
        this.createForm('/form/scroll');
    },
    openView: function () {
        this.createForm('/form/view');
    },
    openMenu: function () {
        this.createForm('/form/menu');
    },
    openGreatView: function () {
        this.createForm('/form/greatview');
    },
    openOverflow: function () {
        this.createForm('/form/overflow');
    },
    runTaskmgr: function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield clickgo.core.runApp('taskApp/');
        });
    },
    changeTheme: function () {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.theme === '') {
                this.theme = 'once';
                yield clickgo.theme.setGlobal('/clickgo/theme/once.cgt');
            }
            else {
                this.theme = '';
                yield clickgo.theme.clearGlobal();
            }
        });
    },
    openError: function () {
        this.createForm('/form/error');
    }
};

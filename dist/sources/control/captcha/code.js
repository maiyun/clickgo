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
class default_1 extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.emtis = {
            'result': null,
        };
        this.props = {
            'factory': 'tc',
            'akey': '',
        };
        this.access = {
            'lib': undefined,
            'instance': undefined,
        };
        this.notInit = false;
        this.isLoading = false;
        this.state = '';
        this.localeData = {
            'en': {
                'click': 'Click to verify',
                'failed': 'Failed, retry',
                'successful': 'Verified'
            },
            'sc': {
                'click': '点击进行验证',
                'failed': '失败，点击重试',
                'successful': '验证成功'
            },
            'tc': {
                'click': '點選進行驗證',
                'failed': '失敗，點選重試',
                'successful': '驗證成功'
            },
            'ja': {
                'click': '認証する',
                'failed': '失敗、再試行',
                'successful': '成功'
            },
            'ko': {
                'click': '인증하기',
                'failed': '실패, 재시도',
                'successful': '성공'
            },
            'th': {
                'click': 'ยืนยัน',
                'failed': 'ล้มเหลว, ลองอีก',
                'successful': 'สำเร็จ'
            },
            'es': {
                'click': 'Verificar',
                'failed': 'Error, reintenta',
                'successful': 'Verificado'
            },
            'de': {
                'click': 'Prüfen',
                'failed': 'Fehler, retry',
                'successful': 'Erfolgreich'
            },
            'fr': {
                'click': 'Vérifier',
                'failed': 'Échec, réessayer',
                'successful': 'Réussi'
            },
            'pt': {
                'click': 'Verificar',
                'failed': 'Falha, retry',
                'successful': 'Sucesso'
            },
            'ru': {
                'click': 'Проверить',
                'failed': 'Ошибка, повтор',
                'successful': 'Успешно'
            },
            'vi': {
                'click': 'Xác minh',
                'failed': 'Thất bại, thử lại',
                'successful': 'Thành công'
            }
        };
    }
    get showMask() {
        return this.isLoading ? true : clickgo.dom.is.move;
    }
    reset() {
        if (this.props.factory === 'tc') {
            this.state = '';
            this.refs.content.innerHTML = this.l('click');
            return;
        }
        if (!this.access.lib || !this.access.instance) {
            return;
        }
        this.access.lib.reset(this.access.instance);
    }
    click() {
        if (!this.access.instance) {
            return;
        }
        this.access.instance.show();
    }
    onMounted() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.props.factory === 'tc') {
                const tcc = yield clickgo.core.getModule('tcc');
                if (!tcc) {
                    this.isLoading = false;
                    this.notInit = true;
                    return;
                }
                this.access.lib = tcc;
                this.refs.content.innerHTML = this.l('click');
                try {
                    const captcha = new tcc(this.props.akey, (res) => {
                        if (res.ret === 0) {
                            this.state = 'successful';
                            this.refs.content.innerHTML = this.l('successful');
                        }
                        else {
                            this.state = 'failed';
                            this.refs.content.innerHTML = this.l('failed');
                        }
                        this.emit('result', {
                            'result': res.ret === 0 ? 1 : 0,
                            'token': res.ticket + '|' + res.randstr,
                        });
                    }, {
                        'needFeedBack': false,
                    });
                    this.access.instance = captcha;
                }
                catch (_a) {
                    return;
                }
                this.isLoading = false;
                return;
            }
            const cft = yield clickgo.core.getModule('cft');
            if (!cft) {
                this.isLoading = false;
                this.notInit = true;
                return;
            }
            this.access.lib = cft;
            const captcha = cft.render(this.refs.content, {
                'sitekey': this.props.akey,
                'size': 'flexible',
                callback: (token) => {
                    this.emit('result', {
                        'result': 1,
                        'token': token,
                    });
                },
            });
            this.access.instance = captcha;
            this.isLoading = false;
        });
    }
    onUnmounted() {
        if (this.props.factory === 'tc') {
            this.access.instance = undefined;
            return;
        }
        if (!this.access.lib || !this.access.instance) {
            return;
        }
        this.access.lib.remove(this.access.instance);
    }
}
exports.default = default_1;

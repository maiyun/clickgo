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
const clickgo = __importStar(require("clickgo"));
class default_1 extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.emits = {
            'changed': null,
            'update:modelValue': null,
            'update:tz': null,
            'update:yearmonth': null,
            'update:hourminute': null,
        };
        this.props = {
            'disabled': false,
            'modelValue': undefined,
            'tz': undefined,
            'yearmonth': '',
            'hourminute': '',
            'start': undefined,
            'end': undefined,
            'date': true,
            'time': true,
            'zone': false
        };
        this.dateObj = new Date();
        this.timestamp = undefined;
        this.dateStr = '';
        this.timeStr = '';
        this.tzData = 0;
        this.vhour = [];
        this.hours = [];
        this.vminute = [];
        this.minutes = [];
        this.vseconds = [];
        this.seconds = [];
        this.vzone = [];
        this.zones = [];
        this.vzdec = [];
        this.zdecs = ['00', '15', '30', '45'];
        this.localeData = {
            'en': {
                'hour': 'Hour',
                'minute': 'Minute',
                'second': 'Second',
                'zone': 'Time Zone',
                'cancel': 'Cancel',
                'ok': 'OK',
                'please click select': 'Please click select'
            },
            'sc': {
                'hour': '时',
                'minute': '分',
                'second': '秒',
                'zone': '时区',
                'cancel': '取消',
                'ok': '确定',
                'please click select': '请点击选择'
            },
            'tc': {
                'hour': '時',
                'minute': '分',
                'second': '秒',
                'zone': '時區',
                'cancel': '取消',
                'ok': '確定',
                'please click select': '請點擊選擇'
            },
            'ja': {
                'hour': '時',
                'minute': '分',
                'second': '秒',
                'zone': 'タイムゾーン',
                'cancel': 'キャンセル',
                'ok': 'OK',
                'please click select': '選択をクリックしてください'
            },
            'ko': {
                'hour': '시',
                'minute': '분',
                'second': '초',
                'zone': '시간대',
                'cancel': '취소',
                'ok': '확인',
                'please click select': '선택을 클릭하십시오'
            },
            'th': {
                'hour': 'ชั่วโมง',
                'minute': 'นาที',
                'second': 'วินาที',
                'zone': 'เขตเวลา',
                'cancel': 'ยกเลิก',
                'ok': 'ตกลง',
                'please click select': 'โปรดคลิกเลือก'
            },
            'es': {
                'hour': 'Hora',
                'minute': 'Minuto',
                'second': 'Segundo',
                'zone': 'Zona',
                'cancel': 'Cancelar',
                'ok': 'Aceptar',
                'please click select': 'Por favor haga clic en seleccionar'
            },
            'de': {
                'hour': 'Stunde',
                'minute': 'Minute',
                'second': 'Sekunde',
                'zone': 'Zone',
                'cancel': 'Abbrechen',
                'ok': 'OK',
                'please click select': 'Bitte klicken Sie auf Auswahl'
            },
            'fr': {
                'hour': 'Heure',
                'minute': 'Minute',
                'second': 'Seconde',
                'zone': 'Zone',
                'cancel': 'Annuler',
                'ok': 'Valider',
                'please click select': 'Veuillez cliquer sur sélectionner'
            },
            'pt': {
                'hour': 'Hora',
                'minute': 'Minuto',
                'second': 'Segundo',
                'zone': 'Fuso Horário',
                'cancel': 'Cancelar',
                'ok': 'OK',
                'please click select': 'Por favor clique em selecionar'
            },
            'ru': {
                'hour': 'Час',
                'minute': 'Минута',
                'second': 'Секунда',
                'zone': 'Часовой пояс',
                'cancel': 'Отмена',
                'ok': 'ОК',
                'please click select': 'Пожалуйста, нажмите выбрать'
            },
            'vi': {
                'hour': 'Giờ',
                'minute': 'Phút',
                'second': 'Giây',
                'zone': 'Múi giờ',
                'cancel': 'Hủy',
                'ok': 'OK',
                'please click select': 'Vui lòng nhấp chọn'
            }
        };
    }
    click(type) {
        const el = this.refs[type];
        if (el.dataset.cgPopOpen !== undefined) {
            clickgo.form.hidePop(el);
            return;
        }
        if (type === 'first' && !this.propBoolean('date')) {
            clickgo.form.showPop(el, this.refs['timepop'], 'v');
            return;
        }
        clickgo.form.showPop(el, this.refs[type + 'pop'], 'v');
    }
    zoneOk() {
        const vz = parseInt(this.vzone[0]);
        if (vz >= 0) {
            this.tzData = vz + (parseInt(this.vzdec[0]) / 60);
        }
        else {
            this.tzData = vz - (parseInt(this.vzdec[0]) / 60);
        }
        this.emit('update:tz', this.tzData);
        const ts = this.dateObj.getTime() - this.tzData * 60 * 60 * 1000;
        if (this.timestamp !== undefined && ts !== this.timestamp) {
            this.timestamp = ts;
            this.emit('update:modelValue', this.timestamp);
            const event = {
                'detail': {
                    'value': this.timestamp
                }
            };
            this.emit('changed', event);
        }
        clickgo.form.hidePop();
    }
    timeOk() {
        this.dateObj.setUTCHours(parseInt(this.vhour[0]), parseInt(this.vminute[0]), parseInt(this.vseconds[0]), 0);
        this.timestamp = this.dateObj.getTime() - this.tzData * 60 * 60 * 1000;
        this.dateStr = this.dateObj.getUTCFullYear().toString() + '-' + (this.dateObj.getUTCMonth() + 1).toString().padStart(2, '0') + '-' + this.dateObj.getUTCDate().toString().padStart(2, '0');
        this.timeStr = this.dateObj.getUTCHours().toString().padStart(2, '0') + ':' + this.dateObj.getUTCMinutes().toString().padStart(2, '0') + ':' + this.dateObj.getUTCSeconds().toString().padStart(2, '0');
        this.emit('update:modelValue', this.timestamp);
        const event = {
            'detail': {
                'value': this.timestamp
            }
        };
        this.emit('changed', event);
        this.emit('update:hourminute', this.vhour[0] + this.vminute[0] + this.vseconds[0]);
        clickgo.form.hidePop();
    }
    cancel() {
        clickgo.form.hidePop();
    }
    clear() {
        this.timestamp = undefined;
        this.emit('update:modelValue', undefined);
    }
    changed() {
        this.emit('update:modelValue', this.timestamp);
        const event = {
            'detail': {
                'value': this.timestamp
            }
        };
        this.emit('changed', event);
        if (this.timestamp === undefined) {
            return;
        }
        this.dateObj.setTime(this.timestamp + this.tzData * 60 * 60 * 1000);
        this.dateStr = this.dateObj.getUTCFullYear().toString() + '-' + (this.dateObj.getUTCMonth() + 1).toString().padStart(2, '0') + '-' + this.dateObj.getUTCDate().toString().padStart(2, '0');
        const hour = this.dateObj.getUTCHours().toString().padStart(2, '0');
        const minute = this.dateObj.getUTCMinutes().toString().padStart(2, '0');
        const seconds = this.dateObj.getUTCSeconds().toString().padStart(2, '0');
        this.timeStr = hour + ':' + minute + ':' + seconds;
        const hourminute = hour + minute + seconds;
        if (hourminute !== this.props.hourminute) {
            this.emit('update:hourminute', hour + minute + seconds);
        }
    }
    selected() {
        clickgo.form.hidePop(this.refs.firstpop);
    }
    onMounted() {
        for (let i = 0; i <= 23; ++i) {
            this.hours.push(i.toString().padStart(2, '0'));
        }
        for (let i = 0; i <= 59; ++i) {
            this.minutes.push(i.toString().padStart(2, '0'));
        }
        for (let i = 0; i <= 59; ++i) {
            this.seconds.push(i.toString().padStart(2, '0'));
        }
        for (let i = -12; i <= 14; ++i) {
            this.zones.push((i >= 0 ? '+' : '') + i.toString());
        }
        this.watch('tz', () => {
            let tz = 0;
            if (this.props.tz === undefined) {
                tz = -(this.dateObj.getTimezoneOffset() / 60);
                this.emit('update:tz', tz);
            }
            else {
                tz = this.propNumber('tz');
            }
            if (this.tzData === tz) {
                return;
            }
            this.tzData = tz;
            const z = this.tzData.toString().split('.');
            this.vzone[0] = (parseInt(z[0]) >= 0 ? '+' : '') + z[0];
            this.vzdec[0] = z[1] ? (parseFloat('0.' + z[1]) * 60).toString() : '00';
            if (this.timestamp !== undefined) {
                this.emit('update:modelValue', this.dateObj.getTime() - this.tzData * 60 * 60000);
            }
        }, {
            'immediate': true
        });
        this.watch('modelValue', () => {
            if (this.props.modelValue === undefined) {
                this.timestamp = undefined;
                this.vhour[0] = '00';
                this.vminute[0] = '00';
                this.vseconds[0] = '00';
                return;
            }
            this.timestamp = this.propInt('modelValue');
            this.dateObj.setTime(this.timestamp + this.tzData * 60 * 60 * 1000);
            this.dateStr = this.dateObj.getUTCFullYear().toString() + '-' + (this.dateObj.getUTCMonth() + 1).toString().padStart(2, '0') + '-' + this.dateObj.getUTCDate().toString().padStart(2, '0');
            this.timeStr = this.dateObj.getUTCHours().toString().padStart(2, '0') + ':' + this.dateObj.getUTCMinutes().toString().padStart(2, '0') + ':' + this.dateObj.getUTCSeconds().toString().padStart(2, '0');
            this.vhour[0] = this.dateObj.getUTCHours().toString().padStart(2, '0');
            this.vminute[0] = this.dateObj.getUTCMinutes().toString().padStart(2, '0');
            this.vseconds[0] = this.dateObj.getUTCSeconds().toString().padStart(2, '0');
        }, {
            'immediate': true
        });
        this.watch('hourminute', () => {
            const hm = this.vhour[0] + this.vminute[0] + this.vseconds[0];
            if (!this.props.hourminute) {
                this.emit('update:hourminute', hm);
                return;
            }
            if (this.props.hourminute !== hm) {
                this.vhour[0] = this.props.hourminute.slice(0, 2);
                this.vminute[0] = this.props.hourminute.slice(2, 4);
                this.vseconds[0] = this.props.hourminute.slice(4);
            }
        }, {
            'immediate': true
        });
    }
}
exports.default = default_1;

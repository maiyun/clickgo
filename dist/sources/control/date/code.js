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
            'range': null,
            'update:modelValue': null,
            'update:tz': null
        };
        this.props = {
            'disabled': false,
            'modelValue': 0,
            'tz': undefined,
            'range': undefined,
            'date': true,
            'time': true,
            'zone': false
        };
        this.dates = [
            new Date(), new Date()
        ];
        this.cursor = '';
        this.popts = undefined;
        this.tsValues = [0, 0];
        this.dateStrs = ['', ''];
        this.timeStrs = ['', ''];
        this.tzData = 0;
        this.vzone = [];
        this.zones = [];
        this.vzdec = [];
        this.zdecs = ['00', '15', '30', '45'];
        this.localeData = {
            'en': {
                'minute': 'Minute',
                'zone': 'Time Zone',
                'cancel': 'Cancel',
                'ok': 'OK'
            },
            'sc': {
                'minute': '分',
                'zone': '时区',
                'cancel': '取消',
                'ok': '确定'
            },
            'tc': {
                'minute': '分',
                'zone': '時區',
                'cancel': '取消',
                'ok': '確定'
            },
            'ja': {
                'minute': '分',
                'zone': 'タイムゾーン',
                'cancel': 'キャンセル',
                'ok': 'OK'
            },
            'ko': {
                'minute': '분',
                'zone': '시간대',
                'cancel': '취소',
                'ok': '확인'
            },
            'th': {
                'minute': 'นาที',
                'zone': 'เขตเวลา',
                'cancel': 'ยกเลิก',
                'ok': 'ตกลง'
            },
            'es': {
                'minute': 'Minuto',
                'zone': 'Zona',
                'cancel': 'Cancelar',
                'ok': 'Aceptar'
            },
            'de': {
                'minute': 'Minute',
                'zone': 'Zone',
                'cancel': 'Abbrechen',
                'ok': 'OK'
            },
            'fr': {
                'minute': 'Minute',
                'zone': 'Zone',
                'cancel': 'Annuler',
                'ok': 'Valider'
            },
            'pt': {
                'minute': 'Minuto',
                'zone': 'Fuso Horário',
                'cancel': 'Cancelar',
                'ok': 'OK'
            },
            'ru': {
                'minute': 'Минута',
                'zone': 'Часовой пояс',
                'cancel': 'Отмена',
                'ok': 'ОК'
            },
            'vi': {
                'minute': 'Phút',
                'zone': 'Múi giờ',
                'cancel': 'Hủy',
                'ok': 'OK'
            }
        };
        this.startCompDate = new Date();
    }
    click(type) {
        const el = this.refs[type];
        if (el.dataset.cgPopOpen !== undefined) {
            clickgo.form.hidePop(el);
            return;
        }
        if (type === 'first') {
            this.popts = undefined;
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
        clickgo.form.hidePop();
    }
    cancel() {
        clickgo.form.hidePop();
    }
    firstChanged() {
        if (this.props.range !== undefined) {
            return;
        }
        if (!this.popts) {
            return;
        }
        this.tsValues[0] = this.popts;
        this.emit('update:modelValue', this.tsValues[0]);
        this.dates[0].setTime(this.tsValues[0] + this.tzData * 60 * 60 * 1000);
        this.dateStrs[0] = this.dates[0].getUTCFullYear().toString() + '-' + (this.dates[0].getUTCMonth() + 1).toString().padStart(2, '0') + '-' + this.dates[0].getUTCDate().toString().padStart(2, '0');
        this.timeStrs[0] = this.dates[0].getUTCHours().toString().padStart(2, '0') + ':' + this.dates[0].getUTCMinutes().toString().padStart(2, '0') + ':' + this.dates[0].getUTCSeconds().toString().padStart(2, '0');
        clickgo.form.hidePop(this.refs.firstpop);
    }
    get startComp() {
        if (this.popts === undefined) {
            return undefined;
        }
        this.startCompDate.setTime(this.popts);
        this.startCompDate.setMonth(this.startCompDate.getMonth() + 1, 1);
        return this.startCompDate.getTime();
    }
    onRange(e) {
        this.tsValues[0] = e.detail.start;
        this.emit('update:modelValue', this.tsValues[0]);
        this.dates[0].setTime(this.tsValues[0] + this.tzData * 60 * 60 * 1000);
        this.dateStrs[0] = this.dates[0].getUTCFullYear().toString() + '-' + (this.dates[0].getUTCMonth() + 1).toString().padStart(2, '0') + '-' + this.dates[0].getUTCDate().toString().padStart(2, '0');
        this.timeStrs[0] = this.dates[0].getUTCHours().toString().padStart(2, '0') + ':' + this.dates[0].getUTCMinutes().toString().padStart(2, '0') + ':' + this.dates[0].getUTCSeconds().toString().padStart(2, '0');
        this.tsValues[1] = e.detail.end;
        this.dates[1].setTime(this.tsValues[1] + this.tzData * 60 * 60 * 1000);
        this.dateStrs[1] = this.dates[1].getUTCFullYear().toString() + '-' + (this.dates[1].getUTCMonth() + 1).toString().padStart(2, '0') + '-' + this.dates[1].getUTCDate().toString().padStart(2, '0');
        this.timeStrs[1] = this.dates[1].getUTCHours().toString().padStart(2, '0') + ':' + this.dates[1].getUTCMinutes().toString().padStart(2, '0') + ':' + this.dates[1].getUTCSeconds().toString().padStart(2, '0');
        e.preventDefault();
        const event = {
            'detail': {
                'start': e.detail.start,
                'end': e.detail.end
            }
        };
        this.emit('range', event);
        clickgo.form.hidePop(this.refs.firstpop);
        this.refs.firstpanel.clear();
        this.refs.endpanel.clear();
    }
    onMounted() {
        for (let i = -12; i <= 14; ++i) {
            this.zones.push((i >= 0 ? '+' : '') + i.toString());
        }
        this.watch('tz', () => {
            if (this.props.tz === undefined) {
                this.tzData = -(this.dates[0].getTimezoneOffset() / 60);
                this.emit('update:tz', this.tzData);
            }
            else {
                this.tzData = this.propNumber('tz');
            }
            const z = this.tzData.toString().split('.');
            this.vzone[0] = (parseInt(z[0]) >= 0 ? '+' : '') + z[0];
            this.vzdec[0] = z[1] ? (parseFloat('0.' + z[1]) * 60).toString() : '00';
        }, {
            'immediate': true
        });
        this.watch('modelValue', () => {
            this.tsValues[0] = this.propInt('modelValue');
            this.dates[0].setTime(this.tsValues[0] + this.tzData * 60 * 60 * 1000);
            this.dateStrs[0] = this.dates[0].getUTCFullYear().toString() + '-' + (this.dates[0].getUTCMonth() + 1).toString().padStart(2, '0') + '-' + this.dates[0].getUTCDate().toString().padStart(2, '0');
            this.timeStrs[0] = this.dates[0].getUTCHours().toString().padStart(2, '0') + ':' + this.dates[0].getUTCMinutes().toString().padStart(2, '0') + ':' + this.dates[0].getUTCSeconds().toString().padStart(2, '0');
        }, {
            'immediate': true
        });
        this.watch('range', () => {
            if (this.props.range === undefined) {
                this.dates[1].setFullYear(this.dates[0].getFullYear(), this.dates[0].getMonth(), this.dates[0].getDate());
            }
            else {
                this.dates[1].setTime(this.propInt('range'));
                if (this.dates[1].getTime() < this.propInt('modelValue')) {
                    this.dates[1].setTime(this.propInt('modelValue'));
                }
            }
            this.tsValues[1] = this.dates[1].getTime();
            this.dates[1].setTime(this.tsValues[1] + this.tzData * 60 * 60 * 1000);
            this.dateStrs[1] = this.dates[1].getUTCFullYear().toString() + '-' + (this.dates[1].getUTCMonth() + 1).toString().padStart(2, '0') + '-' + this.dates[1].getUTCDate().toString().padStart(2, '0');
            this.timeStrs[1] = this.dates[1].getUTCHours().toString().padStart(2, '0') + ':' + this.dates[1].getUTCMinutes().toString().padStart(2, '0') + ':' + this.dates[1].getUTCSeconds().toString().padStart(2, '0');
        }, {
            'immediate': true
        });
    }
}
exports.default = default_1;

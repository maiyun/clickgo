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
        this.props = {
            'disabled': false,
            'readonly': false,
            'modelValue': 0,
            'tz': undefined,
            'time': true,
            'date': true,
            'zone': false
        };
        this.tzData = 0;
        this.dateObj = new Date();
        this.timestamp = 0;
        this.vyear = [''];
        this.years = [];
        this.vmonth = [''];
        this.months = [];
        this.vdate = [''];
        this.maxdate = 31;
        this.dates = [];
        this.vhour = [];
        this.hours = [];
        this.vminute = [];
        this.minutes = [];
        this.vsecond = [];
        this.seconds = [];
        this.vzone = [];
        this.zones = [];
        this.vzdec = [];
        this.zdecs = ['00', '15', '30', '45'];
        this.localeData = {
            'en': {
                'year': 'Year',
                'month': 'Month',
                'date': 'Date',
                'hour': 'Hour',
                'minute': 'Minute',
                'second': 'Second',
                'zone': 'Time Zone',
                'cancel': 'Cancel',
                'ok': 'OK'
            },
            'sc': {
                'year': '年',
                'month': '月',
                'date': '日',
                'hour': '时',
                'minute': '分',
                'second': '秒',
                'zone': '时区',
                'cancel': '取消',
                'ok': '确定'
            },
            'tc': {
                'year': '年',
                'month': '月',
                'date': '日',
                'hour': '時',
                'minute': '分',
                'second': '秒',
                'zone': '時區',
                'cancel': '取消',
                'ok': '確定'
            },
            'ja': {
                'year': '年',
                'month': '月',
                'date': '日',
                'hour': '時',
                'minute': '分',
                'second': '秒',
                'zone': 'タイムゾーン',
                'cancel': 'キャンセル',
                'ok': 'OK'
            },
            'ko': {
                'year': '년',
                'month': '월',
                'date': '일',
                'hour': '시',
                'minute': '분',
                'second': '초',
                'zone': '시간대',
                'cancel': '취소',
                'ok': '확인'
            },
            'th': {
                'year': 'ปี',
                'month': 'เดือน',
                'date': 'วัน',
                'hour': 'ชั่วโมง',
                'minute': 'นาที',
                'second': 'วินาที',
                'zone': 'เขตเวลา',
                'cancel': 'ยกเลิก',
                'ok': 'ตกลง'
            },
            'es': {
                'year': 'Año',
                'month': 'Mes',
                'date': 'Día',
                'hour': 'Hora',
                'minute': 'Minuto',
                'second': 'Segundo',
                'zone': 'Zona',
                'cancel': 'Cancelar',
                'ok': 'Aceptar'
            },
            'de': {
                'year': 'Jahr',
                'month': 'Monat',
                'date': 'Datum',
                'hour': 'Stunde',
                'minute': 'Minute',
                'second': 'Sekunde',
                'zone': 'Zone',
                'cancel': 'Abbrechen',
                'ok': 'OK'
            },
            'fr': {
                'year': 'Année',
                'month': 'Mois',
                'date': 'Jour',
                'hour': 'Heure',
                'minute': 'Minute',
                'second': 'Seconde',
                'zone': 'Zone',
                'cancel': 'Annuler',
                'ok': 'Valider'
            },
            'pt': {
                'year': 'Ano',
                'month': 'Mês',
                'date': 'Dia',
                'hour': 'Hora',
                'minute': 'Minuto',
                'second': 'Segundo',
                'zone': 'Fuso Horário',
                'cancel': 'Cancelar',
                'ok': 'OK'
            },
            'ru': {
                'year': 'Год',
                'month': 'Месяц',
                'date': 'Дата',
                'hour': 'Час',
                'minute': 'Минута',
                'second': 'Секунда',
                'zone': 'Часовой пояс',
                'cancel': 'Отмена',
                'ok': 'ОК'
            },
            'vi': {
                'year': 'Năm',
                'month': 'Tháng',
                'date': 'Ngày',
                'hour': 'Giờ',
                'minute': 'Phút',
                'second': 'Giây',
                'zone': 'Múi giờ',
                'cancel': 'Hủy',
                'ok': 'OK'
            }
        };
    }
    pad(n) {
        const ns = n.toString();
        if (ns.length >= 2) {
            return ns;
        }
        return '0' + ns;
    }
    isLeapYear(y) {
        return (!(y % 4) && (y % 100) || !(y % 400)) ? true : false;
    }
    click(type) {
        const el = this.refs[type];
        if (el.dataset.cgPopOpen !== undefined) {
            clickgo.form.hidePop(el);
            return;
        }
        switch (type) {
            case 'date': {
                this.vyear[0] = this.dateObj.getUTCFullYear().toString();
                this.vmonth[0] = this.pad(this.dateObj.getUTCMonth() + 1);
                this.vdate[0] = this.pad(this.dateObj.getUTCDate());
                break;
            }
            case 'time': {
                this.vhour[0] = this.pad(this.dateObj.getUTCHours());
                this.vminute[0] = this.pad(this.dateObj.getUTCMinutes());
                this.vsecond[0] = this.pad(this.dateObj.getUTCSeconds());
                break;
            }
            case 'zone': {
                const z = this.tzData.toString().split('.');
                this.vzone[0] = (parseInt(z[0]) >= 0 ? '+' : '') + z[0];
                this.vzdec[0] = z[1] ? (parseFloat('0.' + z[1]) * 60).toString() : '00';
                break;
            }
        }
        clickgo.form.showPop(el, this.refs[type + 'pop'], 'v');
    }
    select(type) {
        switch (type) {
            case 'date': {
                this.dateObj.setUTCFullYear(parseInt(this.vyear[0]), parseInt(this.vmonth[0]) - 1, parseInt(this.vdate[0]));
                this.timestamp = this.dateObj.getTime() - this.tzData * 60 * 60 * 1000;
                this.emit('update:modelValue', this.timestamp);
                break;
            }
            case 'time': {
                this.dateObj.setUTCHours(parseInt(this.vhour[0]), parseInt(this.vminute[0]), parseInt(this.vsecond[0]));
                this.timestamp = this.dateObj.getTime() - this.tzData * 60 * 60 * 1000;
                this.emit('update:modelValue', this.timestamp);
                break;
            }
            case 'zone': {
                const vz = parseInt(this.vzone[0]);
                if (vz >= 0) {
                    this.tzData = vz + (parseInt(this.vzdec[0]) / 60);
                }
                else {
                    this.tzData = vz - (parseInt(this.vzdec[0]) / 60);
                }
                this.emit('update:tz', this.tzData);
                this.dateObj.setTime(this.timestamp + this.tzData * 60 * 60 * 1000);
                break;
            }
        }
        clickgo.form.hidePop();
    }
    cancel() {
        clickgo.form.hidePop();
    }
    onMounted() {
        const maxYear = this.dateObj.getUTCFullYear() + 20;
        for (let i = 1900; i <= maxYear; ++i) {
            this.years.push(i.toString());
        }
        for (let i = 1; i <= 12; ++i) {
            this.months.push(this.pad(i));
        }
        for (let i = 1; i <= 31; ++i) {
            this.dates.push(this.pad(i));
        }
        for (let i = 0; i <= 23; ++i) {
            this.hours.push(this.pad(i));
        }
        for (let i = 0; i <= 59; ++i) {
            this.minutes.push(this.pad(i));
        }
        for (let i = 0; i <= 59; ++i) {
            this.seconds.push(this.pad(i));
        }
        for (let i = -12; i <= 14; ++i) {
            this.zones.push((i >= 0 ? '+' : '') + i.toString());
        }
        this.watch('tz', () => {
            if (this.props.tz === undefined) {
                this.tzData = -(this.dateObj.getTimezoneOffset() / 60);
                this.emit('update:tz', this.tzData);
            }
            else {
                this.tzData = this.propNumber('tz');
            }
            this.dateObj.setTime(this.timestamp + this.tzData * 60 * 60 * 1000);
        }, {
            'immediate': true
        });
        this.watch('modelValue', () => {
            this.timestamp = this.propNumber('modelValue');
            this.dateObj.setTime(this.timestamp + this.tzData * 60 * 60 * 1000);
        }, {
            'immediate': true
        });
        this.watch('vyear', () => {
            if (this.vmonth[0] !== '02') {
                return;
            }
            const nowMaxdate = this.isLeapYear(parseInt(this.vyear[0])) ? 29 : 28;
            if (nowMaxdate === this.maxdate) {
                return;
            }
            this.maxdate = nowMaxdate;
            if (nowMaxdate === 28) {
                this.dates.splice(-1, 1);
            }
            else {
                this.dates.push('29');
            }
        }, {
            'deep': true
        });
        this.watch('vmonth', () => {
            if (!this.vmonth[0]) {
                return;
            }
            let nowMaxdate = 0;
            if (this.vmonth[0] === '02') {
                nowMaxdate = this.isLeapYear(parseInt(this.vyear[0])) ? 29 : 28;
            }
            else if (['01', '03', '05', '07', '08', '10', '12'].includes(this.vmonth[0])) {
                nowMaxdate = 31;
            }
            else {
                nowMaxdate = 30;
            }
            if (nowMaxdate === this.maxdate) {
                return;
            }
            if (nowMaxdate > this.maxdate) {
                for (let i = this.maxdate + 1; i <= nowMaxdate; ++i) {
                    this.dates.push(i.toString());
                }
            }
            else {
                this.dates.splice(nowMaxdate - this.maxdate);
            }
            this.maxdate = nowMaxdate;
        }, {
            'deep': true
        });
    }
}
exports.default = default_1;

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
            'range': null,
            'update:modelValue': null,
            'update:tz': null,
            'update:yearmonth': null,
            'update:cursor': null
        };
        this.props = {
            'disabled': false,
            'readonly': false,
            'plain': false,
            'modelValue': undefined,
            'start': undefined,
            'end': undefined,
            'tz': undefined,
            'yearmonth': '',
            'cursor': '',
            'time': true,
            'zone': false,
            'to': ''
        };
        this.nowSelected = false;
        this.startDate = new Date();
        this.startTs = 0;
        this.startValue = {
            'year': 0,
            'month': 0,
            'date': 0
        };
        this.endDate = new Date();
        this.endTs = 0;
        this.endValue = {
            'year': 0,
            'month': 0,
            'date': 0
        };
        this.tzData = 0;
        this.dateObj = new Date();
        this.dateValue = {
            'year': 0,
            'month': 0,
            'date': 0
        };
        this.timestamp = 0;
        this.localeData = {
            'en': {
                'w0': 'Sun',
                'w1': 'Mon',
                'w2': 'Tue',
                'w3': 'Wed',
                'w4': 'Thu',
                'w5': 'Fri',
                'w6': 'Sat',
                'm1': 'Jan',
                'm2': 'Feb',
                'm3': 'Mar',
                'm4': 'Apr',
                'm5': 'May',
                'm6': 'Jun',
                'm7': 'Jul',
                'm8': 'Aug',
                'm9': 'Sep',
                'm10': 'Oct',
                'm11': 'Nov',
                'm12': 'Dec',
                'year': 'Year',
                'today': 'Today',
                'back': 'Back',
            },
            'sc': {
                'w0': '日',
                'w1': '一',
                'w2': '二',
                'w3': '三',
                'w4': '四',
                'w5': '五',
                'w6': '六',
                'm1': '1月',
                'm2': '2月',
                'm3': '3月',
                'm4': '4月',
                'm5': '5月',
                'm6': '6月',
                'm7': '7月',
                'm8': '8月',
                'm9': '9月',
                'm10': '10月',
                'm11': '11月',
                'm12': '12月',
                'year': '年',
                'today': '今天',
                'back': '返回',
            },
            'tc': {
                'w0': '日',
                'w1': '一',
                'w2': '二',
                'w3': '三',
                'w4': '四',
                'w5': '五',
                'w6': '六',
                'm1': '1月',
                'm2': '2月',
                'm3': '3月',
                'm4': '4月',
                'm5': '5月',
                'm6': '6月',
                'm7': '7月',
                'm8': '8月',
                'm9': '9月',
                'm10': '10月',
                'm11': '11月',
                'm12': '12月',
                'year': '年',
                'today': '今天',
                'back': '返回'
            },
            'ja': {
                'w0': '日',
                'w1': '月',
                'w2': '火',
                'w3': '水',
                'w4': '木',
                'w5': '金',
                'w6': '土',
                'm1': '1月',
                'm2': '2月',
                'm3': '3月',
                'm4': '4月',
                'm5': '5月',
                'm6': '6月',
                'm7': '7月',
                'm8': '8月',
                'm9': '9月',
                'm10': '10月',
                'm11': '11月',
                'm12': '12月',
                'year': '年',
                'today': '今日',
                'back': '戻る'
            },
            'ko': {
                'w0': '일',
                'w1': '월',
                'w2': '화',
                'w3': '수',
                'w4': '목',
                'w5': '금',
                'w6': '토',
                'm1': '1월',
                'm2': '2월',
                'm3': '3월',
                'm4': '4월',
                'm5': '5월',
                'm6': '6월',
                'm7': '7월',
                'm8': '8월',
                'm9': '9월',
                'm10': '10월',
                'm11': '11월',
                'm12': '12월',
                'year': '년',
                'today': '오늘',
                'back': '뒤로'
            },
            'th': {
                'w0': 'อา',
                'w1': 'จ',
                'w2': 'อ',
                'w3': 'พ',
                'w4': 'พฤ',
                'w5': 'ศ',
                'w6': 'ส',
                'm1': 'ม.ค.',
                'm2': 'ก.พ.',
                'm3': 'มี.ค.',
                'm4': 'เม.ย.',
                'm5': 'พ.ค.',
                'm6': 'มิ.ย.',
                'm7': 'ก.ค.',
                'm8': 'ส.ค.',
                'm9': 'ก.ย.',
                'm10': 'ต.ค.',
                'm11': 'พ.ย.',
                'm12': 'ธ.ค.',
                'year': 'ปี',
                'today': 'วันนี้',
                'back': 'กลับ'
            },
            'es': {
                'w0': 'Dom',
                'w1': 'Lun',
                'w2': 'Mar',
                'w3': 'Mié',
                'w4': 'Jue',
                'w5': 'Vie',
                'w6': 'Sáb',
                'm1': 'Ene',
                'm2': 'Feb',
                'm3': 'Mar',
                'm4': 'Abr',
                'm5': 'May',
                'm6': 'Jun',
                'm7': 'Jul',
                'm8': 'Ago',
                'm9': 'Sep',
                'm10': 'Oct',
                'm11': 'Nov',
                'm12': 'Dic',
                'year': 'Año',
                'today': 'Hoy',
                'back': 'Volver'
            },
            'de': {
                'w0': 'So',
                'w1': 'Mo',
                'w2': 'Di',
                'w3': 'Mi',
                'w4': 'Do',
                'w5': 'Fr',
                'w6': 'Sa',
                'm1': 'Jan',
                'm2': 'Feb',
                'm3': 'Mär',
                'm4': 'Apr',
                'm5': 'Mai',
                'm6': 'Jun',
                'm7': 'Jul',
                'm8': 'Aug',
                'm9': 'Sep',
                'm10': 'Okt',
                'm11': 'Nov',
                'm12': 'Dez',
                'year': 'Jahr',
                'today': 'Heute',
                'back': 'Zurück'
            },
            'fr': {
                'w0': 'Dim',
                'w1': 'Lun',
                'w2': 'Mar',
                'w3': 'Mer',
                'w4': 'Jeu',
                'w5': 'Ven',
                'w6': 'Sam',
                'm1': 'Jan',
                'm2': 'Fév',
                'm3': 'Mar',
                'm4': 'Avr',
                'm5': 'Mai',
                'm6': 'Juin',
                'm7': 'Juil',
                'm8': 'Aoû',
                'm9': 'Sep',
                'm10': 'Oct',
                'm11': 'Nov',
                'm12': 'Déc',
                'year': 'Année',
                'today': 'Aujourd\'hui',
                'back': 'Retour'
            },
            'pt': {
                'w0': 'Dom',
                'w1': 'Seg',
                'w2': 'Ter',
                'w3': 'Qua',
                'w4': 'Qui',
                'w5': 'Sex',
                'w6': 'Sáb',
                'm1': 'Jan',
                'm2': 'Fev',
                'm3': 'Mar',
                'm4': 'Abr',
                'm5': 'Mai',
                'm6': 'Jun',
                'm7': 'Jul',
                'm8': 'Ago',
                'm9': 'Set',
                'm10': 'Out',
                'm11': 'Nov',
                'm12': 'Dez',
                'year': 'Ano',
                'today': 'Hoje',
                'back': 'Voltar'
            },
            'ru': {
                'w0': 'Вс',
                'w1': 'Пн',
                'w2': 'Вт',
                'w3': 'Ср',
                'w4': 'Чт',
                'w5': 'Пт',
                'w6': 'Сб',
                'm1': 'Янв',
                'm2': 'Фев',
                'm3': 'Мар',
                'm4': 'Апр',
                'm5': 'Май',
                'm6': 'Июн',
                'm7': 'Июл',
                'm8': 'Авг',
                'm9': 'Сен',
                'm10': 'Окт',
                'm11': 'Ноя',
                'm12': 'Дек',
                'year': 'Год',
                'today': 'Сегодня',
                'back': 'Назад'
            },
            'vi': {
                'w0': 'CN',
                'w1': 'T2',
                'w2': 'T3',
                'w3': 'T4',
                'w4': 'T5',
                'w5': 'T6',
                'w6': 'T7',
                'm1': 'Th1',
                'm2': 'Th2',
                'm3': 'Th3',
                'm4': 'Th4',
                'm5': 'Th5',
                'm6': 'Th6',
                'm7': 'Th7',
                'm8': 'Th8',
                'm9': 'Th9',
                'm10': 'Th10',
                'm11': 'Th11',
                'm12': 'Th12',
                'year': 'Năm',
                'today': 'Hôm nay',
                'back': 'Trở lại'
            }
        };
        this.maps = [];
        this.vyear = [''];
        this.vmonth = [''];
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
        this.cursorDate = '';
        this.rangeDate = undefined;
    }
    refreshStartValue() {
        this.startValue.date = this.startDate.getUTCDate();
        this.startValue.month = this.startDate.getUTCMonth();
        this.startValue.year = this.startDate.getUTCFullYear();
    }
    get startYm() {
        return this.startValue.year.toString() + (this.startValue.month + 1).toString().padStart(2, '0');
    }
    get startYmd() {
        return this.startYm + this.startValue.date.toString().padStart(2, '0');
    }
    refreshEndValue() {
        this.endValue.date = this.endDate.getUTCDate();
        this.endValue.month = this.endDate.getUTCMonth();
        this.endValue.year = this.endDate.getUTCFullYear();
    }
    get endYm() {
        return this.endValue.year.toString() + (this.endValue.month + 1).toString().padStart(2, '0');
    }
    get endYmd() {
        return this.endYm + this.endValue.date.toString().padStart(2, '0');
    }
    get dateValueStr() {
        return this.dateValue.year.toString() + (this.dateValue.month + 1).toString().padStart(2, '0') + this.dateValue.date.toString().padStart(2, '0');
    }
    get years() {
        const arr = [];
        for (let i = this.startValue.year; i <= this.endValue.year; ++i) {
            arr.push({
                'label': i.toString(),
                'value': i.toString(),
            });
        }
        return arr;
    }
    get months() {
        const arr = [];
        for (let i = 1; i <= 12; ++i) {
            const ym = this.vyear[0] + i.toString().padStart(2, '0');
            arr.push({
                'label': this.l('m' + i.toString()),
                'value': i.toString(),
                'disabled': ym > this.endYm || ym < this.startYm ? true : false,
            });
        }
        return arr;
    }
    refreshView() {
        const now = new Date();
        now.setUTCFullYear(parseInt(this.vyear[0]), parseInt(this.vmonth[0]) - 1, 1);
        const day1 = now.getUTCDay();
        if (day1 > 0) {
            now.setUTCDate(1 - day1);
        }
        this.maps.length = 0;
        for (let i = 0; i < 6; ++i) {
            this.maps[i] = [];
            for (let j = 0; j < 7; ++j) {
                this.maps[i].push({
                    'date': now.getUTCDate(),
                    'month': now.getUTCMonth(),
                    'year': now.getUTCFullYear()
                });
                now.setUTCDate(now.getUTCDate() + 1);
            }
        }
    }
    refreshDateValue() {
        this.dateValue.date = this.dateObj.getUTCDate();
        this.dateValue.month = this.dateObj.getUTCMonth();
        this.dateValue.year = this.dateObj.getUTCFullYear();
        this.updateTimestamp();
    }
    updateTimestamp() {
        if (!this.nowSelected) {
            return;
        }
        this.timestamp = this.dateObj.getTime() - this.tzData * 60 * 60 * 1000;
        if (this.propNumber('modelValue') !== this.timestamp) {
            this.emit('update:modelValue', this.timestamp);
        }
    }
    goSelected() {
        let change = false;
        if (parseInt(this.vyear[0]) !== this.dateValue.year) {
            this.vyear[0] = this.dateValue.year.toString();
            change = true;
        }
        if (parseInt(this.vmonth[0]) - 1 !== this.dateValue.month) {
            this.vmonth[0] = (this.dateValue.month + 1).toString();
            change = true;
        }
        if (change) {
            this.emit('update:yearmonth', this.vyear[0] + this.vmonth[0].padStart(2, '0'));
        }
    }
    colClick(col) {
        if (this.rangeDate === undefined && this.nowSelected && this.props.to) {
            const cols = col.year.toString() + (col.month + 1).toString().padStart(2, '0') + col.date.toString().padStart(2, '0');
            if (cols === this.dateValueStr) {
                return;
            }
            if (this.props.to === 'start') {
                if (cols < this.dateValueStr) {
                    const date = new Date();
                    date.setUTCFullYear(col.year, col.month, col.date);
                    date.setUTCHours(parseInt(this.vhour[0]), parseInt(this.vminute[0]), parseInt(this.vsecond[0]), 0);
                    const event = {
                        'go': true,
                        preventDefault: function () {
                            this.go = false;
                        },
                        'detail': {
                            'start': date.getTime() - this.tzData * 60 * 60 * 1000,
                            'end': this.timestamp
                        }
                    };
                    this.emit('range', event);
                    if (event.go) {
                        this.rangeDate = date;
                    }
                    return;
                }
            }
            else {
                if (cols > this.dateValueStr) {
                    const date = new Date();
                    date.setUTCFullYear(col.year, col.month, col.date);
                    date.setUTCHours(parseInt(this.vhour[0]), parseInt(this.vminute[0]), parseInt(this.vsecond[0]), 0);
                    const event = {
                        'go': true,
                        preventDefault: function () {
                            this.go = false;
                        },
                        'detail': {
                            'start': this.timestamp,
                            'end': date.getTime() - this.tzData * 60 * 60 * 1000
                        }
                    };
                    this.emit('range', event);
                    if (event.go) {
                        this.rangeDate = date;
                    }
                    return;
                }
            }
        }
        this.rangeDate = undefined;
        if (this.cursorDate !== '') {
            this.cursorDate = '';
            this.emit('update:cursor', this.cursorDate);
        }
        this.dateObj.setUTCFullYear(col.year, col.month, col.date);
        this.nowSelected = true;
        this.refreshDateValue();
        this.goSelected();
        const event = {
            'detail': {
                'value': this.timestamp
            }
        };
        this.emit('changed', event);
    }
    today() {
        const now = new Date();
        this.dateObj.setFullYear(now.getFullYear(), now.getMonth(), now.getDate());
        this.refreshDateValue();
        this.goSelected();
    }
    back() {
        this.vyear[0] = this.dateValue.year.toString();
        this.vmonth[0] = (this.dateValue.month + 1).toString();
        this.emit('update:yearmonth', this.vyear[0] + this.vmonth[0].padStart(2, '0'));
    }
    onMounted() {
        this.watch('start', () => {
            if (this.props.start === undefined) {
                this.startDate.setUTCFullYear(1900, 0, 1);
                this.startDate.setUTCHours(0, 0, 0, 0);
                this.startTs = this.startDate.getTime();
                this.startDate.setTime(this.startTs + this.tzData * 60 * 60 * 1000);
                this.startDate.setMilliseconds(0);
            }
            else {
                this.startTs = this.propNumber('start');
                this.startDate.setTime(this.startTs + this.tzData * 60 * 60 * 1000);
                this.startDate.setMilliseconds(0);
            }
            this.refreshStartValue();
        }, {
            'immediate': true
        });
        this.watch('end', () => {
            if (this.props.end === undefined) {
                this.endDate.setTime(Date.now());
                this.endDate.setUTCFullYear(this.endDate.getUTCFullYear() + 100);
                this.endDate.setUTCHours(23, 59, 59, 0);
                this.endTs = this.endDate.getTime();
                this.endDate.setTime(this.endTs + this.tzData * 60 * 60 * 1000);
                this.endDate.setMilliseconds(0);
            }
            else {
                this.endTs = this.propNumber('end');
                this.endDate.setTime(this.endTs + this.tzData * 60 * 60 * 1000);
                this.endDate.setMilliseconds(0);
            }
            this.refreshEndValue();
        }, {
            'immediate': true
        });
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
        this.watch(() => {
            return this.vyear[0] + '-' + this.vmonth[0];
        }, () => {
            this.refreshView();
        });
        this.watch(() => {
            return this.vhour[0] + ':' + this.vminute[0] + ':' + this.vsecond[0];
        }, () => {
            if (!this.vhour[0] || !this.vminute[0] || !this.vsecond[0]) {
                return;
            }
            this.dateObj.setUTCHours(parseInt(this.vhour[0]), parseInt(this.vminute[0]), parseInt(this.vsecond[0]));
            this.updateTimestamp();
        });
        this.watch(() => {
            return this.vzone[0] + ' ' + this.vzdec[0];
        }, () => {
            if (!this.vzone[0] || !this.vzdec[0]) {
                return;
            }
            const vz = parseInt(this.vzone[0]);
            if (vz >= 0) {
                this.tzData = vz + (parseInt(this.vzdec[0]) / 60);
            }
            else {
                this.tzData = vz - (parseInt(this.vzdec[0]) / 60);
            }
            this.emit('update:tz', this.tzData);
            this.updateTimestamp();
            this.startDate.setTime(this.startTs + this.tzData * 60 * 60 * 1000);
            this.startDate.setMilliseconds(0);
            this.refreshStartValue();
            this.endDate.setTime(this.endTs + this.tzData * 60 * 60 * 1000);
            this.endDate.setMilliseconds(0);
            this.refreshEndValue();
        });
        this.watch('tz', () => {
            if (this.props.tz === undefined) {
                this.tzData = -(this.dateObj.getTimezoneOffset() / 60);
                this.emit('update:tz', this.tzData);
            }
            else {
                this.tzData = this.propNumber('tz');
            }
            const z = this.tzData.toString().split('.');
            this.vzone[0] = (parseInt(z[0]) >= 0 ? '+' : '') + z[0];
            this.vzdec[0] = z[1] ? (parseFloat('0.' + z[1]) * 60).toString() : '00';
            this.updateTimestamp();
            this.startDate.setTime(this.startTs + this.tzData * 60 * 60 * 1000);
            this.startDate.setMilliseconds(0);
            this.refreshStartValue();
            this.endDate.setTime(this.endTs + this.tzData * 60 * 60 * 1000);
            this.endDate.setMilliseconds(0);
            this.refreshEndValue();
        }, {
            'immediate': true
        });
        this.watch('cursor', () => {
            this.cursorDate = this.props.cursor;
        }, {
            'immediate': true
        });
        let mvfirst = true;
        this.watch('modelValue', () => {
            if (this.props.modelValue !== undefined) {
                this.nowSelected = true;
                this.timestamp = this.propNumber('modelValue');
                this.dateObj.setTime(this.timestamp + this.tzData * 60 * 60 * 1000);
                this.dateObj.setMilliseconds(0);
                this.vyear[0] = this.dateObj.getUTCFullYear().toString();
                this.vmonth[0] = (this.dateObj.getUTCMonth() + 1).toString();
                this.vhour[0] = this.dateObj.getUTCHours().toString().padStart(2, '0');
                this.vminute[0] = this.dateObj.getUTCMinutes().toString().padStart(2, '0');
                this.vsecond[0] = this.dateObj.getUTCSeconds().toString().padStart(2, '0');
                this.refreshDateValue();
                if (!mvfirst) {
                    this.emit('update:yearmonth', this.vyear[0] + this.vmonth[0].padStart(2, '0'));
                }
            }
            else {
                this.nowSelected = false;
                if (mvfirst) {
                    const date = new Date();
                    this.vyear[0] = date.getUTCFullYear().toString();
                    this.vmonth[0] = (date.getUTCMonth() + 10).toString();
                }
            }
            mvfirst = false;
        }, {
            'immediate': true
        });
        this.watch('yearmonth', () => {
            if (!this.props.yearmonth) {
                this.emit('update:yearmonth', this.vyear[0] + this.vmonth[0].padStart(2, '0'));
                return;
            }
            this.vyear[0] = this.props.yearmonth.slice(0, 4);
            this.vmonth[0] = this.props.yearmonth.slice(4).replace('0', '');
        }, {
            'immediate': true
        });
    }
    colenter(e, col) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        if (this.props.to === '') {
            return;
        }
        if (this.rangeDate) {
            return;
        }
        this.cursorDate = col.year.toString() + (col.month + 1).toString().padStart(2, '0') + col.date.toString().padStart(2, '0');
        this.emit('update:cursor', this.cursorDate);
    }
    get isDisabled() {
        return (col) => {
            const cols = col.year.toString() + (col.month + 1).toString().padStart(2, '0') + col.date.toString().padStart(2, '0');
            return cols > this.endYmd || cols < this.startYmd ? '' : undefined;
        };
    }
    get toclass() {
        return (col) => {
            if (this.props.to === '' || this.cursorDate === '' || !this.nowSelected) {
                return undefined;
            }
            const cols = col.year.toString() + (col.month + 1).toString().padStart(2, '0') + col.date.toString().padStart(2, '0');
            if (this.cursorDate > this.dateValueStr) {
                if (this.props.to === 'start') {
                    return undefined;
                }
                if (cols > this.cursorDate || cols < this.dateValueStr) {
                    return undefined;
                }
                if (cols === this.cursorDate) {
                    return 'range-left';
                }
                if (cols === this.dateValueStr) {
                    return 'range-right';
                }
                return 'range';
            }
            else if (this.cursorDate < this.dateValueStr) {
                if (this.props.to === 'end') {
                    return undefined;
                }
                if (cols < this.cursorDate || cols > this.dateValueStr) {
                    return undefined;
                }
                if (cols === this.cursorDate) {
                    return 'range-right';
                }
                if (cols === this.dateValueStr) {
                    return 'range-left';
                }
                return 'range';
            }
            return undefined;
        };
    }
    clearRange() {
        this.nowSelected = false;
        this.emit('update:modelValue', undefined);
        this.rangeDate = undefined;
        this.cursorDate = '';
        this.emit('update:cursor', '');
    }
}
exports.default = default_1;

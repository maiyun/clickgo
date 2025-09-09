import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.emits = {
            'changed': null,
            'yearmonthchanged': null,
            'selected': null,
            'range': null,
            'update:modelValue': null,
            'update:tz': null,
            'update:yearmonth': null,
            'update:hourminute': null,
            'update:cursor': null
        };
        this.props = {
            'disabled': false,
            'plain': false,
            'disabledList': [],
            'modelValue': undefined,
            'start': undefined,
            'end': undefined,
            'tz': undefined,
            'yearmonth': '',
            'hourminute': '',
            'cursor': '',
            'jump': true,
            'time': true,
            'zone': false,
            'range': false,
            'clearbtn': true,
            'backbtn': true
        };
        /** --- 当前 date 对象 --- */
        this.dateObj = new Date();
        /** --- 当前 date 对象的 utc 值 --- */
        this.dateValue = {
            'year': 0,
            'month': 0,
            'date': 0
        };
        /** --- 当前选中的真正用户的时间戳 --- */
        this.timestamp = undefined;
        /** --- 最小时间限制 --- */
        this.startDate = new Date();
        this.startTs = 0;
        this.startValue = {
            'year': 0,
            'month': 0,
            'date': 0
        };
        /** --- 最大时间限制 --- */
        this.endDate = new Date();
        this.endTs = 0;
        this.endValue = {
            'year': 0,
            'month': 0,
            'date': 0
        };
        /** --- 当前时区信息（小时） --- */
        this.tzData = 0;
        /** --- 语言包 --- */
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
                'clear': 'Clear'
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
                'clear': '清除',
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
                'back': '返回',
                'clear': '清除',
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
                'back': '戻る',
                'clear': 'クリア',
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
                'back': '뒤로',
                'clear': '지우기',
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
                'back': 'กลับ',
                'clear': 'ล้าง',
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
                'back': 'Volver',
                'clear': 'Claro',
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
                'back': 'Zurück',
                'clear': 'Löschen',
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
                'back': 'Retour',
                'clear': 'Effacer',
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
                'back': 'Voltar',
                'clear': 'Limpar',
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
                'back': 'Назад',
                'clear': 'Очистить',
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
                'back': 'Trở lại',
                'clear': 'Xóa',
            }
        };
        /** --- 日历视图表 --- */
        this.maps = [];
        // --- 上面的选项 ---
        this.vyear = [''];
        this.prevNextDate = new Date();
        /** --- 上个月的年月字符串 --- */
        this.prevYm = '';
        /** --- 下个月的年月字符串 --- */
        this.nextYm = '';
        this.vmonth = [''];
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
        // --- range ---
        /** --- 当前鼠标放置的日期无符号 --- */
        this.cursorDate = '';
        /** --- 另一个参数值 --- */
        this.rangeDate = undefined;
    }
    /** --- 当前选中的日期的无符号字符串 --- */
    get dateValueStr() {
        return this.dateValue.year.toString() + (this.dateValue.month + 1).toString().padStart(2, '0') + this.dateValue.date.toString().padStart(2, '0');
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
    get years() {
        return Array.from({ 'length': this.endValue.year - this.startValue.year + 1 }, (_, i) => ({
            'label': (this.startValue.year + i).toString(),
            'value': (this.startValue.year + i).toString(),
        }));
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
    /**
     * --- 刷新视图（当时间戳或时区变动时执行） ---
     */
    refreshView() {
        const now = new Date(Date.UTC(parseInt(this.vyear[0]), parseInt(this.vmonth[0]) - 1, 1));
        /** --- 当月 1 号在周几，0 代表周日 --- */
        const day1 = now.getUTCDay();
        if (day1 > 0) {
            now.setUTCDate(1 - day1);
        }
        this.maps.length = 0;
        const zone = this.tzData * 60 * 60_000;
        for (let i = 0; i < 6; ++i) {
            // --- 生成行列 ---
            this.maps[i] = Array.from({ length: 7 }, () => {
                const col = {
                    'time': now.getTime() - zone,
                    'date': now.getUTCDate(),
                    'month': now.getUTCMonth(),
                    'year': now.getUTCFullYear(),
                    'day': now.getUTCDay(),
                    'str': `${now.getUTCFullYear()}${(now.getUTCMonth() + 1).toString().padStart(2, '0')}${now.getUTCDate().toString().padStart(2, '0')}`
                };
                now.setUTCDate(now.getUTCDate() + 1);
                return col;
            });
        }
    }
    /**
     * --- 刷新 date value 的数据为最新的 ---
     */
    refreshDateValue() {
        this.dateValue.date = this.dateObj.getUTCDate();
        this.dateValue.month = this.dateObj.getUTCMonth();
        this.dateValue.year = this.dateObj.getUTCFullYear();
    }
    /**
     * --- 更新 time stamp，会自动根据 dateObj 设置时间戳基 ---
     */
    updateTimestamp() {
        const modelValue = this.props.modelValue === undefined ? undefined : this.propNumber('modelValue');
        if (this.timestamp === undefined) {
            if (modelValue !== undefined) {
                const event = {
                    'detail': {
                        'before': modelValue,
                        'value': undefined
                    }
                };
                this.emit('changed', event);
            }
            return;
        }
        this.timestamp = this.dateObj.getTime() - this.tzData * 60 * 60_000;
        if (modelValue !== this.timestamp) {
            const event = {
                'detail': {
                    'before': modelValue,
                    'value': this.timestamp
                }
            };
            this.emit('update:modelValue', this.timestamp);
            this.emit('changed', event);
        }
    }
    /**
     * --- 跳转到当前选中的年份和月份 ---
     */
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
            const ym = `${this.vyear[0]}${this.vmonth[0].padStart(2, '0')}`;
            if (this.props.yearmonth !== ym) {
                this.emit('update:yearmonth', ym);
                this.emit('yearmonthchanged');
            }
        }
    }
    /** --- col 点击 --- */
    colClick(col) {
        if (this.rangeDate === undefined && (this.timestamp !== undefined) && this.propBoolean('range')) {
            const cols = col.year.toString() + (col.month + 1).toString().padStart(2, '0') + col.date.toString().padStart(2, '0');
            if (cols === this.dateValueStr) {
                // --- range 状态，自己点击自己，只选择一天 ---
                const endDate = new Date(Date.UTC(col.year, col.month, col.date, 23, 59, 59, 0));
                const event = {
                    'go': true,
                    preventDefault: function () {
                        this.go = false;
                    },
                    'detail': {
                        'start': this.timestamp,
                        'end': endDate.getTime() - this.tzData * 60 * 60_000
                    }
                };
                this.emit('range', event);
                if (event.go) {
                    this.rangeDate = endDate;
                }
                return;
            }
            if (cols > this.dateValueStr) {
                const nhour = parseInt(this.vhour[0] ?? '00');
                const nminute = parseInt(this.vminute[0] ?? '00');
                const nseconds = parseInt(this.vseconds[0] ?? '00');
                /** --- 开始日 --- */
                const sdate = new Date(this.dateObj.getTime());
                if (nhour === 23 && nminute === 59 && nseconds === 59) {
                    sdate.setUTCHours(0, 0, 0, 0);
                }
                /** --- 截止日 --- */
                const edate = new Date(Date.UTC(col.year, col.month, col.date, nhour, nminute, nseconds, 0));
                if (nhour === 0 && nminute === 0 && nseconds === 0) {
                    edate.setUTCHours(23, 59, 59, 0);
                }
                const event = {
                    'go': true,
                    preventDefault: function () {
                        this.go = false;
                    },
                    'detail': {
                        'start': sdate.getTime() - this.tzData * 60 * 60_000,
                        'end': edate.getTime() - this.tzData * 60 * 60_000
                    }
                };
                this.emit('range', event);
                if (event.go) {
                    this.rangeDate = edate;
                }
                return;
            }
        }
        this.rangeDate = undefined;
        if (this.cursorDate !== '') {
            this.cursorDate = '';
            this.emit('update:cursor', this.cursorDate);
        }
        // --- 解除 undefined 限制，使选中的时间戳可以 emit 上去 ---
        this.timestamp = 0;
        this.dateObj.setUTCFullYear(col.year, col.month, col.date);
        this.dateObj.setUTCHours(parseInt(this.vhour[0] ?? '00'), parseInt(this.vminute[0] ?? '00'), parseInt(this.vseconds[0] ?? '00'), 0);
        this.refreshDateValue();
        this.updateTimestamp();
        this.goSelected();
        const event = {
            'detail': {
                'time': col.time,
                'date': col.date,
                'month': col.month,
                'year': col.year,
                'day': col.day,
                'str': col.str
            }
        };
        this.emit('selected', event);
    }
    /** --- 跳转到今天 --- */
    today() {
        // --- 解除 undefined 限制，使选中的时间戳可以 emit 上去 ---
        this.timestamp = 0;
        const now = new Date();
        this.dateObj.setFullYear(now.getFullYear(), now.getMonth(), now.getDate());
        this.refreshDateValue();
        this.updateTimestamp();
        this.goSelected();
    }
    /** --- 返回选中年月 --- */
    back() {
        this.vyear[0] = this.dateValue.year.toString();
        this.vmonth[0] = (this.dateValue.month + 1).toString();
        this.emit('update:yearmonth', this.vyear[0] + this.vmonth[0].padStart(2, '0'));
        this.emit('yearmonthchanged');
    }
    // --- 选上个月 ---
    prev() {
        const month = parseInt(this.vmonth[0]);
        if (month === 1) {
            const year = parseInt(this.vyear[0]);
            this.vyear[0] = (year - 1).toString();
            this.vmonth[0] = '12';
            return;
        }
        this.vmonth[0] = (month - 1).toString();
    }
    // --- 选下个月 ---
    next() {
        const month = parseInt(this.vmonth[0]);
        if (month === 12) {
            const year = parseInt(this.vyear[0]);
            this.vyear[0] = (year + 1).toString();
            this.vmonth[0] = '1';
            return;
        }
        this.vmonth[0] = (month + 1).toString();
    }
    onMounted() {
        // --- 监听最大最小值限定 ---
        this.watch('start', () => {
            if (this.props.start === undefined) {
                this.startDate.setUTCFullYear(1900, 0, 1);
                this.startDate.setUTCHours(0, 0, 0, 0);
                this.startTs = this.startDate.getTime();
                this.startDate.setTime(this.startTs + this.tzData * 60 * 60 * 1_000);
                this.startDate.setMilliseconds(0);
            }
            else {
                this.startTs = this.propNumber('start');
                if (this.startTs.toString().length < 13) {
                    this.startTs *= 1_000;
                }
                this.startDate.setTime(this.startTs + this.tzData * 60 * 60 * 1_000);
                this.startDate.setMilliseconds(0);
            }
            this.refreshStartValue();
            // --- 判断选中的是不是小于 start ---
            if (this.timestamp !== undefined && this.timestamp < this.startTs) {
                this.dateObj.setTime(this.startDate.getTime());
                this.refreshDateValue();
                this.updateTimestamp();
            }
        }, {
            'immediate': true
        });
        this.watch('end', () => {
            if (this.props.end === undefined) {
                this.endDate.setTime(Date.now());
                this.endDate.setUTCFullYear(this.endDate.getUTCFullYear() + 100);
                this.endDate.setUTCHours(23, 59, 59, 0);
                this.endTs = this.endDate.getTime();
                this.endDate.setTime(this.endTs + this.tzData * 60 * 60 * 1_000);
                this.endDate.setMilliseconds(0);
            }
            else {
                this.endTs = this.propNumber('end');
                if (this.endTs.toString().length < 13) {
                    this.endTs *= 1_000;
                }
                this.endDate.setTime(this.endTs + this.tzData * 60 * 60 * 1_000);
                this.endDate.setMilliseconds(0);
            }
            this.refreshEndValue();
            // --- 判断选中的是不是大于 end ---
            if (this.timestamp !== undefined && this.timestamp > this.endTs) {
                this.dateObj.setTime(this.endDate.getTime());
                this.refreshDateValue();
                this.updateTimestamp();
            }
        }, {
            'immediate': true
        });
        // --- 填充年月日时分秒时区 ---
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
        // --- 检测年月变动 ---
        this.prevNextDate.setUTCHours(0, 0, 0, 0);
        this.watch(() => {
            return this.vyear[0] + '-' + this.vmonth[0];
        }, () => {
            if (!this.vyear[0] || !this.vmonth[0]) {
                return;
            }
            this.prevNextDate.setUTCFullYear(parseInt(this.vyear[0]), parseInt(this.vmonth[0]) - 2, 1);
            this.prevYm = this.prevNextDate.getUTCFullYear().toString() + (this.prevNextDate.getUTCMonth() + 1).toString().padStart(2, '0');
            this.prevNextDate.setUTCFullYear(parseInt(this.vyear[0]), parseInt(this.vmonth[0]), 1);
            this.nextYm = this.prevNextDate.getUTCFullYear().toString() + (this.prevNextDate.getUTCMonth() + 1).toString().padStart(2, '0');
            /** --- year + month --- */
            const ym = this.vyear[0] + this.vmonth[0].padStart(2, '0');
            if (this.props.yearmonth !== ym) {
                this.emit('update:yearmonth', ym);
                this.emit('yearmonthchanged');
            }
            this.refreshView();
        });
        // --- 检测时分秒变动 ---
        this.watch(() => {
            return (this.vhour[0] ?? '') + ':' + (this.vminute[0] ?? '') + ':' + (this.vseconds[0] ?? '');
        }, () => {
            if (!this.vhour[0] || !this.vminute[0] || !this.vseconds[0]) {
                return;
            }
            /** --- hour + minute + seconds --- */
            const hm = this.vhour[0] + this.vminute[0] + this.vseconds[0];
            if (this.props.hourminute !== hm) {
                this.emit('update:hourminute', hm);
            }
            this.dateObj.setUTCHours(parseInt(this.vhour[0]), parseInt(this.vminute[0]), parseInt(this.vseconds[0]));
            this.updateTimestamp();
        });
        // --- 检测按钮操作的时区变动 ---
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
            // --- 更新 start 和 end ---
            this.startDate.setTime(this.startTs + this.tzData * 60 * 60 * 1000);
            this.startDate.setMilliseconds(0);
            this.refreshStartValue();
            this.endDate.setTime(this.endTs + this.tzData * 60 * 60 * 1000);
            this.endDate.setMilliseconds(0);
            this.refreshEndValue();
        });
        // --- 监测 prop 时区信息变动 ---
        this.watch('tz', () => {
            if (this.props.tz === undefined) {
                this.tzData = -(this.dateObj.getTimezoneOffset() / 60);
                this.emit('update:tz', this.tzData);
            }
            else {
                if (this.tzData === this.propNumber('tz')) {
                    return;
                }
                this.tzData = this.propNumber('tz');
            }
            const z = this.tzData.toString().split('.');
            this.vzone[0] = (parseInt(z[0]) >= 0 ? '+' : '') + z[0];
            this.vzdec[0] = z[1] ? (parseFloat('0.' + z[1]) * 60).toString() : '00';
            this.updateTimestamp();
            // --- 更新 start 和 end ---
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
        // --- 初始化 ---
        // --- 监听 modelValue 变动 ---
        let mvfirst = true;
        this.watch('modelValue', () => {
            if (this.props.modelValue !== undefined) {
                this.timestamp = this.propNumber('modelValue');
                this.dateObj.setTime(this.timestamp + this.tzData * 60 * 60 * 1000);
                this.dateObj.setMilliseconds(0);
                this.vhour[0] = this.dateObj.getUTCHours().toString().padStart(2, '0');
                this.vminute[0] = this.dateObj.getUTCMinutes().toString().padStart(2, '0');
                this.vseconds[0] = this.dateObj.getUTCSeconds().toString().padStart(2, '0');
                if (this.propBoolean('jump')) {
                    this.vyear[0] = this.dateObj.getUTCFullYear().toString();
                    this.vmonth[0] = (this.dateObj.getUTCMonth() + 1).toString();
                    this.refreshDateValue();
                    if (!mvfirst) {
                        // --- 不是第一次 ---
                        const ym = this.vyear[0] + this.vmonth[0].padStart(2, '0');
                        if (this.props.yearmonth !== ym) {
                            this.emit('update:yearmonth', ym);
                            this.emit('yearmonthchanged');
                        }
                    }
                }
                const hm = this.vhour[0] + this.vminute[0] + this.vseconds[0];
                if (this.props.hourminute !== hm) {
                    this.emit('update:hourminute', hm);
                }
            }
            else {
                this.timestamp = undefined;
                if (mvfirst) {
                    const date = new Date();
                    this.vyear[0] = date.getFullYear().toString();
                    this.vmonth[0] = (date.getMonth() + 1).toString();
                    this.vhour[0] = '00';
                    this.vminute[0] = '00';
                    this.vseconds[0] = '00';
                }
            }
            mvfirst = false;
        }, {
            'immediate': true
        });
        // --- 年月翻页 ---
        this.watch('yearmonth', () => {
            if (!this.props.yearmonth) {
                this.emit('update:yearmonth', this.vyear[0] + this.vmonth[0].padStart(2, '0'));
                this.emit('yearmonthchanged');
                return;
            }
            const ym = this.vyear[0] + this.vmonth[0].padStart(2, '0');
            if (ym !== this.props.yearmonth) {
                this.vyear[0] = this.props.yearmonth.slice(0, 4);
                let vmonth = this.props.yearmonth.slice(4);
                if (vmonth.startsWith('0')) {
                    vmonth = vmonth[1];
                }
                this.vmonth[0] = vmonth;
            }
        }, {
            'immediate': true
        });
        // --- 时分秒 ---
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
    /** --- 鼠标移动到 col 上的事件 --- */
    colenter(e, col) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        if (!this.propBoolean('range')) {
            return;
        }
        if (this.rangeDate) {
            return;
        }
        this.cursorDate = col.year.toString() + (col.month + 1).toString().padStart(2, '0') + col.date.toString().padStart(2, '0');
        this.emit('update:cursor', this.cursorDate);
    }
    /** --- 当前日期是否可选 --- */
    get isDisabled() {
        return (col) => {
            const cols = col.year.toString() + (col.month + 1).toString().padStart(2, '0') + col.date.toString().padStart(2, '0');
            if (this.propArray('disabledList').length) {
                if (this.propArray('disabledList').includes(cols)) {
                    return '';
                }
            }
            return cols > this.endYmd || cols < this.startYmd ? '' : undefined;
        };
    }
    /** --- col 显示的 class 效果，有四种，1: undefined, 2: range, 3: range-left, 4: range-right --- */
    get toclass() {
        return (col) => {
            if (!this.propBoolean('range') || this.cursorDate === '' || this.timestamp === undefined) {
                return undefined;
            }
            /** --- cols 是要判断的盒子 --- */
            const cols = col.year.toString() + (col.month + 1).toString().padStart(2, '0') + col.date.toString().padStart(2, '0');
            if (this.cursorDate <= this.dateValueStr) {
                // --- 如果鼠标小于等于选中的位置，那么啥也不管 ---
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
        };
    }
    // --- 供用户调用的方法 ---
    /** --- 清除所有状态 --- */
    clear() {
        const event = {
            'detail': {
                'before': this.timestamp,
                'value': undefined
            }
        };
        this.timestamp = undefined;
        this.emit('update:modelValue', undefined);
        this.rangeDate = undefined;
        this.emit('changed', event);
        if (this.cursorDate !== '') {
            this.cursorDate = '';
            this.emit('update:cursor', '');
        }
    }
}

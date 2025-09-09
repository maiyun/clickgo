import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.emits = {
            'changed': null,
            'yearmonthchanged': null,
            'selected': null,
            'update:modelValue': null,
            'update:yearmonth': null,
            'update:select': null,
        };
        this.props = {
            'disabled': false,
            'plain': false,
            'disabledList': [],
            'modelValue': [],
            'start': undefined,
            'end': undefined,
            'yearmonth': '',
            'select': undefined,
            'jump': true,
            'clearbtn': true,
            'backbtn': true,
        };
        /** --- 当前选中的日期数组 --- */
        this.values = [];
        /** --- 当前选中的日期 --- */
        this.dateValue = {
            'year': '0',
            'month': '0',
            'date': '0',
        };
        this.startValue = {
            'year': '0',
            'month': '0',
            'date': '0',
        };
        this.endValue = {
            'year': '0',
            'month': '0',
            'date': '0',
        };
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
                'clear': 'Clear',
                'whole month': 'Month',
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
                'whole month': '整月',
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
                'whole month': '整月',
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
                'whole month': '全月',
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
                'whole month': '전체월',
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
                'whole month': 'ทั้งเดือน',
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
                'whole month': 'Mes',
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
                'whole month': 'Monat',
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
                'whole month': 'Mois',
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
                'whole month': 'Mês',
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
                'whole month': 'Месяц',
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
                'whole month': 'Cả tháng',
            }
        };
        /** --- 日历视图表 --- */
        this.maps = [];
        /** --- 当前月份所有天数 --- */
        this.monthMaps = [];
        /** --- 周对应的数组 --- */
        this.weekMaps = [];
        // --- 上面的选项 ---
        this.vyear = [''];
        this.prevNextDate = new Date();
        /** --- 上个月的年月字符串 --- */
        this.prevYm = '';
        /** --- 下个月的年月字符串 --- */
        this.nextYm = '';
        this.vmonth = [''];
    }
    /** --- 当前选中的日期的无符号字符串 --- */
    get dateValueStr() {
        return this.dateValue.year + this.dateValue.month + this.dateValue.date;
    }
    refreshStartValue() {
        if (!this.props.start) {
            this.startValue.date = '01';
            this.startValue.month = '01';
            this.startValue.year = '1900';
            return;
        }
        this.startValue.date = this.props.start.slice(6);
        this.startValue.month = this.props.start.slice(4, 6);
        this.startValue.year = this.props.start.slice(0, 4);
    }
    get startYm() {
        return this.startValue.year + this.startValue.month;
    }
    get startYmd() {
        return this.startValue.year + this.startValue.month + this.startValue.date;
    }
    refreshEndValue() {
        const year = ((new Date()).getUTCFullYear() + 100).toString();
        if (!this.props.end) {
            this.endValue.date = '31';
            this.endValue.month = '12';
            this.endValue.year = year;
            return;
        }
        this.endValue.date = this.props.end.slice(6);
        this.endValue.month = this.props.end.slice(4, 6);
        this.endValue.year = this.props.end.slice(0, 4);
    }
    get endYm() {
        return this.endValue.year + this.endValue.month;
    }
    get endYmd() {
        return this.endValue.year + this.endValue.month + this.endValue.date;
    }
    get years() {
        return Array.from({
            'length': parseInt(this.endValue.year) - parseInt(this.startValue.year) + 1,
        }, (_, i) => ({
            'label': (parseInt(this.startValue.year) + i).toString(),
            'value': (parseInt(this.startValue.year) + i).toString(),
        }));
    }
    get months() {
        const arr = [];
        for (let i = 1; i <= 12; ++i) {
            const m = i.toString().padStart(2, '0');
            const ym = this.vyear[0] + m;
            arr.push({
                'label': this.l('m' + i.toString()),
                'value': m,
                'disabled': ym > this.endYm || ym < this.startYm ? true : false,
            });
        }
        return arr;
    }
    /**
     * --- 刷新视图 ---
     */
    refreshView() {
        const now = new Date(Date.UTC(parseInt(this.vyear[0]), parseInt(this.vmonth[0]) - 1, 1));
        /** --- 当月 1 号在周几，0 代表周日 --- */
        const day1 = now.getUTCDay();
        if (day1 > 0) {
            now.setUTCDate(1 - day1);
        }
        this.maps.length = 0;
        this.weekMaps.length = 0;
        this.monthMaps.length = 0;
        for (let i = 0; i < 6; ++i) {
            // --- 生成行列 ---
            this.maps[i] = Array.from({ length: 7 }, () => {
                const day = now.getUTCDay();
                const month = (now.getUTCMonth() + 1).toString().padStart(2, '0');
                const col = {
                    'year': now.getUTCFullYear().toString(),
                    'month': month,
                    'date': now.getUTCDate().toString().padStart(2, '0'),
                    'day': day,
                    'value': '',
                };
                col.value = `${col.year}${col.month}${col.date}`;
                // --- 周数组，月数组 ---
                if (month === this.vmonth[0]) {
                    if (!this.weekMaps[day]) {
                        this.weekMaps[day] = [];
                    }
                    this.weekMaps[day].push(col.value);
                    // --- 添加到月里面 ---
                    this.monthMaps.push(col.value);
                }
                // --- 下一天 ---
                now.setUTCDate(now.getUTCDate() + 1);
                return col;
            });
        }
    }
    /**
     * --- 跳转到当前选中的年份和月份 ---
     */
    goSelected() {
        let change = false;
        if (this.vyear[0] !== this.dateValue.year) {
            this.vyear[0] = this.dateValue.year;
            change = true;
        }
        if (this.vmonth[0] !== this.dateValue.month) {
            this.vmonth[0] = this.dateValue.month;
            change = true;
        }
        if (change) {
            const ym = `${this.vyear[0]}${this.vmonth[0]}`;
            if (this.props.yearmonth !== ym) {
                this.emit('update:yearmonth', ym);
                this.emit('yearmonthchanged');
            }
        }
    }
    /** --- col 点击 --- */
    colClick(col) {
        this.dateValue.year = col.year;
        this.dateValue.month = col.month;
        this.dateValue.date = col.date;
        this.goSelected();
        this.updateSelect('click');
    }
    /** --- 周复选框 --- */
    weekCheckChanged(e, col) {
        if (e.detail.value) {
            // --- 不选 -> 选，半选 -> 选 ---
            const newValues = this.weekMaps[col].filter(item => !this.values.includes(item));
            this.values.push(...newValues);
            this.emit('update:modelValue', clickgo.tool.clone(this.values));
            this.emit('changed');
            return;
        }
        // --- 选 -> 不选 ---
        this.values = this.values.filter(item => !this.weekMaps[col].includes(item));
        this.emit('update:modelValue', clickgo.tool.clone(this.values));
        this.emit('changed');
    }
    /** --- 月复选框 --- */
    monthCheckChanged(e) {
        if (e.detail.value) {
            // --- 不选 -> 选，半选 -> 选 ---
            const newValues = this.monthMaps.filter(item => !this.values.includes(item));
            this.values.push(...newValues);
            this.emit('update:modelValue', clickgo.tool.clone(this.values));
            this.emit('changed');
            return;
        }
        // --- 选 -> 不选 ---
        this.values = this.values.filter(item => !this.monthMaps.includes(item));
        this.emit('update:modelValue', clickgo.tool.clone(this.values));
        this.emit('changed');
    }
    /** --- 复选框 --- */
    checkChanged(col) {
        if (this.values.includes(col.value)) {
            this.values.splice(this.values.indexOf(col.value), 1);
        }
        else {
            this.values.push(col.value);
        }
        this.emit('update:modelValue', clickgo.tool.clone(this.values));
        this.emit('changed');
    }
    checkClick(e) {
        e.stopPropagation();
    }
    /** --- 将当前的 select 的日期的情况向上同步 --- */
    updateSelect(type = 'default') {
        this.emit('update:select', this.dateValueStr === '000' ? undefined : this.dateValueStr);
        const event = {
            'detail': {
                'year': this.dateValue.year === '0' ? '' : this.dateValue.year,
                'month': this.dateValue.month === '0' ? '' : this.dateValue.month,
                'date': this.dateValue.date === '0' ? '' : this.dateValue.date,
                'value': this.dateValueStr === '000' ? '' : this.dateValueStr,
                'type': type,
            }
        };
        this.emit('selected', event);
    }
    /** --- 跳转到今天 --- */
    today() {
        const now = new Date();
        this.dateValue.year = now.getFullYear().toString();
        this.dateValue.month = (now.getMonth() + 1).toString().padStart(2, '0');
        this.dateValue.date = now.getDate().toString().padStart(2, '0');
        this.goSelected();
        this.updateSelect();
    }
    /** --- 返回选中年月 --- */
    back() {
        this.vyear[0] = this.dateValue.year;
        this.vmonth[0] = this.dateValue.month;
        this.emit('update:yearmonth', this.vyear[0] + this.vmonth[0]);
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
        this.vmonth[0] = (month - 1).toString().padStart(2, '0');
    }
    // --- 选下个月 ---
    next() {
        const month = parseInt(this.vmonth[0]);
        if (month === 12) {
            const year = parseInt(this.vyear[0]);
            this.vyear[0] = (year + 1).toString();
            this.vmonth[0] = '01';
            return;
        }
        this.vmonth[0] = (month + 1).toString().padStart(2, '0');
    }
    onMounted() {
        // --- 监听最大最小值限定 ---
        this.watch('start', () => {
            this.refreshStartValue();
            // --- 判断选中的是不是小于 start ---
            if (this.dateValue.year !== '0' && this.dateValueStr < this.startYmd) {
                this.dateValue.year = this.startYmd.slice(0, 4);
                this.dateValue.month = this.startYmd.slice(4, 6);
                this.dateValue.date = this.startYmd.slice(6);
                this.updateSelect();
            }
        }, {
            'immediate': true
        });
        this.watch('end', () => {
            this.refreshEndValue();
            // --- 判断选中的是不是大于 end ---
            if (this.dateValue.year !== '0' && this.dateValueStr > this.endYmd) {
                this.dateValue.year = this.endYmd.slice(0, 4);
                this.dateValue.month = this.endYmd.slice(4, 6);
                this.dateValue.date = this.endYmd.slice(6);
                this.updateSelect();
            }
        }, {
            'immediate': true
        });
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
            const ym = this.vyear[0] + this.vmonth[0];
            if (this.props.yearmonth !== ym) {
                this.emit('update:yearmonth', ym);
                this.emit('yearmonthchanged');
            }
            this.refreshView();
        });
        // --- 初始化 ---
        // --- 监听 modelValue 变动 ---
        let mvfirst = true;
        this.watch('modelValue', () => {
            if (!mvfirst) {
                if ((this.values.length === this.propArray('modelValue').length)
                    && this.values.every((item) => this.propArray('modelValue').includes(item))) {
                    return;
                }
            }
            if (this.propArray('modelValue').length) {
                this.values = clickgo.tool.clone(this.propArray('modelValue'));
                if (this.propBoolean('jump') && this.values[0]) {
                    this.vyear[0] = this.values[0].slice(0, 4);
                    this.vmonth[0] = this.values[0].slice(4, 6);
                    if (!mvfirst) {
                        // --- 不是第一次 ---
                        const ym = this.vyear[0] + this.vmonth[0];
                        if (this.props.yearmonth !== ym) {
                            this.emit('update:yearmonth', ym);
                            this.emit('yearmonthchanged');
                        }
                    }
                }
            }
            else {
                this.values.length = 0;
                if (mvfirst) {
                    const date = new Date();
                    this.vyear[0] = date.getFullYear().toString();
                    this.vmonth[0] = (date.getMonth() + 1).toString().padStart(2, '0');
                }
            }
            mvfirst = false;
        }, {
            'immediate': true
        });
        // --- 年月翻页 ---
        this.watch('yearmonth', () => {
            if (!this.props.yearmonth) {
                this.emit('update:yearmonth', this.vyear[0] + this.vmonth[0]);
                this.emit('yearmonthchanged');
                return;
            }
            const ym = this.vyear[0] + this.vmonth[0];
            if (ym !== this.props.yearmonth) {
                this.vyear[0] = this.props.yearmonth.slice(0, 4);
                this.vmonth[0] = this.props.yearmonth.slice(4);
            }
        }, {
            'immediate': true
        });
        // --- 选中的日期 ---
        this.watch('select', () => {
            if (!this.props.select) {
                // -- 清空 ---
                this.dateValue.year = '0';
                this.dateValue.month = '0';
                this.dateValue.date = '0';
                this.updateSelect();
                return;
            }
            // --- 设置 ---
            this.dateValue.year = this.props.select.slice(0, 4);
            this.dateValue.month = this.props.select.slice(4, 6);
            this.dateValue.date = this.props.select.slice(6);
            this.goSelected();
            this.updateSelect();
        }, {
            'immediate': true
        });
    }
    // --- range ---
    /** --- 当前日期是否可选 --- */
    get isDisabled() {
        return (col) => {
            if (this.propArray('disabledList').length) {
                if (this.propArray('disabledList').includes(col.value)) {
                    return '';
                }
            }
            return col.value > this.endYmd || col.value < this.startYmd ? '' : undefined;
        };
    }
    // --- 供用户调用的方法 ---
    /** --- 清除所有状态 --- */
    clear() {
        this.values.length = 0;
        this.emit('update:modelValue', clickgo.tool.clone(this.values));
        this.dateValue.year = '0';
        this.dateValue.month = '0';
        this.dateValue.date = '0';
        this.updateSelect();
        this.emit('changed');
    }
}

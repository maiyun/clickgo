import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'update:modelValue': null,
        'update:tz': null
    };

    public props: {
        'disabled': boolean | string;
        'readonly': boolean | string;

        /** --- 当前日期时间戳，毫秒 --- */
        'modelValue': number | string;
        /** --- 小时，如 8 --- */
        'tz'?: number | string;

        'time': boolean | string;
        'date': boolean | string;
        'zone': boolean | string;
    } = {
            'disabled': false,
            'readonly': false,

            'modelValue': 0,
            'tz': undefined,

            'time': true,
            'date': true,
            'zone': false
        };

    /** --- 当前时区信息（小时） --- */
    public tzData: number = 0;

    /** --- 当前 date 对象 --- */
    public dateObj: Date = new Date();

    /** --- 时间戳基数 --- */
    public timestamp = 0;

    // --- 选项 ---

    public vyear: string[] = [''];

    public years: string[] = [];

    public vmonth: string[] = [''];

    public months: string[] = [];

    public vdate: string[] = [''];

    /** --- 当前月份日期可以设置的最大日期，如 1 月就是 31，4 月就是 30 --- */
    public maxdate: number = 31;

    public dates: string[] = [];

    public vhour: string[] = [];

    public hours: string[] = [];

    public vminute: string[] = [];

    public minutes: string[] = [];

    public vsecond: string[] = [];

    public seconds: string[] = [];

    public vzone: string[] = [];

    public zones: string[] = [];

    public vzdec: string[] = [];

    public zdecs: string[] = ['00', '15', '30', '45'];

    /** --- 语言包 --- */
    public localeData = {
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

    /** --- 补全两位 --- */
    public pad(n: number): string {
        const ns = n.toString();
        if (ns.length >= 2) {
            return ns;
        }
        return '0' + ns;
    }

    /** --- 是否是闰年 --- */
    public isLeapYear(y: number): boolean {
        return (!(y % 4) && (y % 100) || !(y % 400)) ? true : false;
    }

    // --- 单击事件 ---
    public click(type: string): void {
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

    public select(type: string): void {
        switch (type) {
            case 'date': {
                this.dateObj.setUTCFullYear(
                    parseInt(this.vyear[0]), parseInt(this.vmonth[0]) - 1, parseInt(this.vdate[0])
                );
                this.timestamp = this.dateObj.getTime() - this.tzData * 60 * 60 * 1000;
                this.emit('update:modelValue', this.timestamp);
                break;
            }
            case 'time': {
                this.dateObj.setUTCHours(
                    parseInt(this.vhour[0]), parseInt(this.vminute[0]), parseInt(this.vsecond[0])
                );
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

    public cancel(): void {
        clickgo.form.hidePop();
    }

    public onMounted(): void {
        // --- 填充年月日时分秒时区 ---
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
        // --- 监测 prop 时区信息变动 ---
        this.watch('tz', () => {
            if (this.props.tz === undefined) {
                this.tzData = -(this.dateObj.getTimezoneOffset() / 60);
                this.emit('update:tz', this.tzData);
            }
            else {
                this.tzData = this.propNumber('tz');
            }
            // --- 更新 date 对象的时间戳 ---
            this.dateObj.setTime(this.timestamp + this.tzData * 60 * 60 * 1000);
        }, {
            'immediate': true
        });
        // --- 用户输入时间戳变动 ---
        this.watch('modelValue', () => {
            this.timestamp = this.propNumber('modelValue');
            this.dateObj.setTime(this.timestamp + this.tzData * 60 * 60 * 1000);
        }, {
            'immediate': true
        });
        // --- 检测年份变动 ---
        this.watch('vyear', () => {
            if (this.vmonth[0] !== '02') {
                return;
            }
            // --- 2 月，可能有因为闰年的原因会有变动 ---
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
        // --- 检测月份变动 ---
        this.watch('vmonth', () => {
            if (!this.vmonth[0]) {
                return;
            }
            let nowMaxdate = 0;
            if (this.vmonth[0] === '02') {
                // --- 2 月 ---
                nowMaxdate = this.isLeapYear(parseInt(this.vyear[0])) ? 29 : 28;
            }
            else if (['01', '03', '05', '07', '08', '10', '12'].includes(this.vmonth[0])) {
                // --- 大月 ---
                nowMaxdate = 31;
            }
            else {
                // --- 小月 ---
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
                // --- 当前日期更小，看超出几天就减掉几天 ---
                this.dates.splice(nowMaxdate - this.maxdate);
            }
            this.maxdate = nowMaxdate;
        }, {
            'deep': true
        });
    }

}

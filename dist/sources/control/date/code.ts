import * as clickgo from 'clickgo';
import * as types from '~/types';

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'changed': null,
        'yearmonthchanged': null,
        'update:modelValue': null,
        'update:tz': null,
        'update:yearmonth': null,
        'update:hourminute': null,
    };

    public props: {
        'disabled': boolean | string;
        'disabledList': string[] | string;

        /** --- 当前日期时间戳，毫秒 --- */
        'modelValue': number | string | undefined;
        /** --- 小时，如 8 --- */
        'tz'?: number | string;
        /** --- 年份月份的组合，如 200708，自动跳转到此页面但不选中 --- */
        'yearmonth': string;
        /** --- 时分秒的字符串，跳转也自动选中 --- */
        'hourminute': string;
        /** --- 限定可选的最小时间 --- */
        'start'?: number | string;
        /** --- 限定可选的最大时间 --- */
        'end'?: number | string;

        'date': boolean | string;
        'time': boolean | string;
        'zone': boolean | string;
        'close': boolean | string;
    } = {
            'disabled': false,
            'disabledList': [],

            'modelValue': undefined,
            'tz': undefined,
            'yearmonth': '',
            'hourminute': '',
            'start': undefined,
            'end': undefined,

            'date': true,
            'time': true,
            'zone': false,
            'close': true
        };

    public dateObj: Date = new Date();

    /** --- 时间戳基数（真正的选择的时间戳） --- */
    public timestamp?: number = undefined;

    public dateStr: string = '';

    public timeStr: string = '';

    /** --- 当前时区信息（小时） --- */
    public tzData: number = 0;

    public vhour: string[] = [];

    public hours: string[] = [];

    public vminute: string[] = [];

    public minutes: string[] = [];

    public vseconds: string[] = [];

    public seconds: string[] = [];

    public vzone: string[] = [];

    public zones: string[] = [];

    public vzdec: string[] = [];

    public zdecs: string[] = ['00', '15', '30', '45'];

    /** --- 语言包 --- */
    public localeData = {
        'en': {
            'hour': 'Hr',
            'minute': 'Min',
            'second': 'Sec',
            'zone': 'Zone',
            'cancel': 'Cancel',
            'ok': 'OK',
            'please click select': 'Click to select'
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
            'zone': '時區', // --- タイムゾーン ---
            'cancel': '取消',
            'ok': '確定',
            'please click select': '選択して下さい'
        },
        'ko': {
            'hour': '시',
            'minute': '분',
            'second': '초',
            'zone': '時區', // --- 시간대 ---
            'cancel': '취소',
            'ok': '확인',
            'please click select': '선택 클릭'
        },
        'th': {
            'hour': 'ชม.',
            'minute': 'น.',
            'second': 'วิ',
            'zone': 'เขต',
            'cancel': 'ยกเลิก',
            'ok': 'ตกลง',
            'please click select': 'คลิกเลือก'
        },
        'es': {
            'hour': 'Hr',
            'minute': 'Min',
            'second': 'Seg',
            'zone': 'Zona',
            'cancel': 'Cancelar',
            'ok': 'OK',
            'please click select': 'Clic para elegir'
        },
        'de': {
            'hour': 'Std',
            'minute': 'Min',
            'second': 'Sek',
            'zone': 'Zone',
            'cancel': 'Abbr.',
            'ok': 'OK',
            'please click select': 'Klicken Sie wählen'
        },
        'fr': {
            'hour': 'Hr',   // 或 'H'
            'minute': 'Min',
            'second': 'Sec',
            'zone': 'Zone',
            'cancel': 'Annul.',
            'ok': 'OK',
            'please click select': 'Cliquer choisir'
        },
        'pt': {
            'hour': 'Hr',
            'minute': 'Min',
            'second': 'Seg',
            'zone': 'Fuso',
            'cancel': 'Cancelar',
            'ok': 'OK',
            'please click select': 'Clique para sel.'
        },
        'ru': {
            'hour': 'Час',
            'minute': 'Мин',
            'second': 'Сек',
            'zone': 'Зона',
            'cancel': 'Отмена',
            'ok': 'ОК',
            'please click select': 'Нажмите выбрать'
        },
        'vi': {
            'hour': 'Giờ',
            'minute': 'Phút',
            'second': 'Giây',
            'zone': 'Múi',
            'cancel': 'Hủy',
            'ok': 'OK',
            'please click select': 'Nhấn chọn'
        },
    };

    // --- 单击事件 ---
    public click(type: 'first' | 'zone'): void {
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

    public zoneOk(): void {
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
            const event: types.IDateChangedEvent = {
                'detail': {
                    'before': this.timestamp,
                    'value': ts
                }
            };
            this.timestamp = ts;
            this.emit('update:modelValue', this.timestamp);
            this.emit('changed', event);
        }
        clickgo.form.hidePop();
    }

    public timeOk(): void {
        const event: types.IDateChangedEvent = {
            'detail': {
                'before': this.timestamp,
                'value': this.dateObj.getTime() - this.tzData * 60 * 60 * 1000
            }
        };
        this.dateObj.setUTCHours(parseInt(this.vhour[0]), parseInt(this.vminute[0]), parseInt(this.vseconds[0]), 0);
        this.timestamp = event.detail.value;
        this.dateStr = this.dateObj.getUTCFullYear().toString() + '-' + (this.dateObj.getUTCMonth() + 1).toString().padStart(2, '0') + '-' + this.dateObj.getUTCDate().toString().padStart(2, '0');
        this.timeStr = this.dateObj.getUTCHours().toString().padStart(2, '0') + ':' + this.dateObj.getUTCMinutes().toString().padStart(2, '0') + ':' + this.dateObj.getUTCSeconds().toString().padStart(2, '0');
        this.emit('update:modelValue', this.timestamp);
        this.emit('update:hourminute', this.vhour[0] + this.vminute[0] + this.vseconds[0]);
        this.emit('changed', event);
        clickgo.form.hidePop();
    }

    public cancel(): void {
        clickgo.form.hidePop();
    }

    // --- 清除已选中的 ---
    public clear(): void {
        this.timestamp = undefined;
        this.emit('update:modelValue', undefined);
    }

    // --- date panel 的 changed ---
    public changed(e: types.IDatepanelChangedEvent): void {
        this.emit('update:modelValue', this.timestamp);
        const event: types.IDateChangedEvent = {
            'detail': {
                'before': e.detail.before,
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

    public selected(): void {
        clickgo.form.hidePop(this.refs.firstpop);
    }

    public onMounted(): void {
        // --- 填充年时分秒时区 ---
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
        // --- 监测 prop 时区信息变动 ---
        this.watch('tz', () => {
            let tz: number = 0;
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
            // --- 更新时间戳 ---
            if (this.timestamp !== undefined) {
                this.emit('update:modelValue', this.dateObj.getTime() - this.tzData * 60 * 60_000);
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
            if (this.timestamp === this.propInt('modelValue')) {
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

}

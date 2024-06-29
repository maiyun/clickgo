import * as clickgo from 'clickgo';
import * as types from '~/types';

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'range': null,
        'update:modelValue': null,
        'update:tz': null
    };

    public props: {
        'disabled': boolean | string;

        /** --- 当前日期时间戳，毫秒 --- */
        'modelValue': number | string;
        /** --- 小时，如 8 --- */
        'tz'?: number | string;
        /** --- 开启 range 模式 --- */
        'range'?: number | string;

        'time': boolean | string;
        'zone': boolean | string;
    } = {
            'disabled': false,

            'modelValue': 0,
            'tz': undefined,
            'range': undefined,

            'time': true,
            'zone': false
        };
    
    public dates: Date[] = [
        new Date(), new Date()
    ];

    /** --- range 模式下，当前鼠标的位置年月字符串 --- */
    public cursor = '';

    /** --- pop 的 ts --- */
    public popts?: number = undefined;

    /** --- 开始和结束的时间戳 --- */
    public tsValues: number[] = [0, 0];

    public dateStrs: string[] = ['', ''];

    public timeStrs: string[] = ['', ''];

    /** --- 当前时区信息（小时） --- */
    public tzData: number = 0;

    public vzone: string[] = [];

    public zones: string[] = [];

    public vzdec: string[] = [];

    public zdecs: string[] = ['00', '15', '30', '45'];

    /** --- 语言包 --- */
    public localeData = {
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

    // --- 单击事件 ---
    public click(type: 'first' | 'zone'): void {
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

    public zoneOk(): void {
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

    public cancel(): void {
        clickgo.form.hidePop();
    }

    public firstChanged() {
        if (this.props.range !== undefined) {
            // --- 选区间的，要在 range 事件中关闭 ---
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

    /** --- 下面函数用到的常用对象 ---- */
    public startCompDate = new Date();

    /** --- 限定第二个 panel 的起始位置 --- */
    public get startComp() {
        if (this.popts === undefined) {
            return undefined;
        }
        this.startCompDate.setTime(this.popts);
        this.startCompDate.setMonth(this.startCompDate.getMonth() + 1, 1);
        return this.startCompDate.getTime();
    }

    public onRange(e: types.IDatepanelRangeEvent) {
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

        const event: types.IDateRangeEvent = {
            'detail': {
                'start': e.detail.start,
                'end': e.detail.end
            }
        };
        this.emit('range', event);

        clickgo.form.hidePop(this.refs.firstpop);
        this.refs.firstpanel.clearRange();
        this.refs.endpanel.clearRange();
    }

    public onMounted(): void {
        // --- 填充年月日时分秒时区 ---
        for (let i = -12; i <= 14; ++i) {
            this.zones.push((i >= 0 ? '+' : '') + i.toString());
        }
        // --- 监测 prop 时区信息变动 ---
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

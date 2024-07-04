import * as clickgo from 'clickgo';
import * as types from '~/types';

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'changed': null,
        'update:modelValue': null,
        'update:tz': null
    };

    public props: {
        'disabled': boolean | string;

        /** --- 当前日期时间戳，毫秒 --- */
        'modelValue': number | string | undefined;
        /** --- 小时，如 8 --- */
        'tz'?: number | string;

        'date': boolean | string;
        'time': boolean | string;
        'zone': boolean | string;
    } = {
            'disabled': false,

            'modelValue': undefined,
            'tz': undefined,

            'date': true,
            'time': true,
            'zone': false
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
        clickgo.form.hidePop();
    }

    public timeOk(): void {
        this.dateObj.setUTCHours(parseInt(this.vhour[0]), parseInt(this.vminute[0]), parseInt(this.vseconds[0]), 0);
        this.timestamp = this.dateObj.getTime() - this.tzData * 60 * 60 * 1000;
        this.dateStr = this.dateObj.getUTCFullYear().toString() + '-' + (this.dateObj.getUTCMonth() + 1).toString().padStart(2, '0') + '-' + this.dateObj.getUTCDate().toString().padStart(2, '0');
        this.timeStr = this.dateObj.getUTCHours().toString().padStart(2, '0') + ':' + this.dateObj.getUTCMinutes().toString().padStart(2, '0') + ':' + this.dateObj.getUTCSeconds().toString().padStart(2, '0');
        this.emit('update:modelValue', this.timestamp);
        const event: types.IDateChangedEvent = {
            'detail': {
                'value': this.timestamp
            }
        };
        this.emit('changed', event);
        clickgo.form.hidePop();
    }

    public cancel(): void {
        clickgo.form.hidePop();
    }

    // --- date panel 的 changed ---
    public changed(): void {
        this.emit('update:modelValue', this.timestamp);
        const event: types.IDateChangedEvent = {
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
        this.timeStr = this.dateObj.getUTCHours().toString().padStart(2, '0') + ':' + this.dateObj.getUTCMinutes().toString().padStart(2, '0') + ':' + this.dateObj.getUTCSeconds().toString().padStart(2, '0');
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
        }, {
            'immediate': true
        });
        this.watch('modelValue', () => {
            if (this.props.modelValue === undefined) {
                this.timestamp = undefined;
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
    }

}

import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'changed': null,
        'update:modelValue': null,
        'update:tz': null,
    };

    public props: {
        'disabled': boolean | string;

        /** --- 当前日期时间戳，毫秒 --- */
        'modelValue': Array<number | string> | string;
        /** --- 小时，如 8 --- */
        'tz'?: number | string;
        /** --- 限定可选的最小时间 --- */
        'start'?: number | string;
        /** --- 限定可选的最大时间 --- */
        'end'?: number | string;

        'time': boolean | string;
        'zone': boolean | string;
        'close': boolean | string;
    } = {
            'disabled': false,

            'modelValue': [],
            'tz': undefined,
            'start': undefined,
            'end': undefined,

            'time': true,
            'zone': false,
            'close': true,
        };

    public dateObj: Date[] = [
        new Date(), new Date()
    ];

    public cursor: string = '';

    /** --- first 的 ts --- */
    public ts?: number = undefined;

    /** --- end 的 ts --- */
    public ts2?: number = undefined;

    public dateStr: string[] = ['', ''];

    public timeStr: string[] = ['', ''];

    /** --- 当前时区信息（小时） --- */
    public tzData: number = 0;

    public vzone: string[] = [];

    public zones: string[] = [];

    public vzdec: string[] = [];

    public zdecs: string[] = ['00', '15', '30', '45'];

    /** --- 语言包 --- */
    public localeData = {
        'en': {
            'minute': 'Min',
            'zone': 'Zone',
            'cancel': 'Cancel',
            'ok': 'OK',
            'please click select': 'Click to select'
        },
        'sc': {
            'minute': '分',
            'zone': '时区',
            'cancel': '取消',
            'ok': '确定',
            'please click select': '请点击选择'
        },
        'tc': {
            'minute': '分',
            'zone': '時區',
            'cancel': '取消',
            'ok': '確定',
            'please click select': '請點擊選擇'
        },
        'ja': {
            'minute': '分',
            'zone': '時區', // --- タイムゾーン ---
            'cancel': '取消',
            'ok': '確定',
            'please click select': '選択して下さい'
        },
        'ko': {
            'minute': '분',
            'zone': '時區', // --- 시간대 ---
            'cancel': '취소',
            'ok': '확인',
            'please click select': '선택 클릭'
        },
        'th': {
            'minute': 'น.',
            'zone': 'เขต',
            'cancel': 'ยกเลิก',
            'ok': 'ตกลง',
            'please click select': 'คลิกเลือก'
        },
        'es': {
            'minute': 'Min',
            'zone': 'Zona',
            'cancel': 'Cancelar',
            'ok': 'OK',
            'please click select': 'Clic para elegir'
        },
        'de': {
            'minute': 'Min',
            'zone': 'Zone',
            'cancel': 'Abbr.',
            'ok': 'OK',
            'please click select': 'Klicken Sie wählen'
        },
        'fr': {
            'minute': 'Min',
            'zone': 'Zone',
            'cancel': 'Annul.',
            'ok': 'OK',
            'please click select': 'Cliquer choisir'
        },
        'pt': {
            'minute': 'Min',
            'zone': 'Fuso',
            'cancel': 'Cancelar',
            'ok': 'OK',
            'please click select': 'Clique para sel.'
        },
        'ru': {
            'minute': 'Мин',
            'zone': 'Зона',
            'cancel': 'Отмена',
            'ok': 'ОК',
            'please click select': 'Нажмите выбрать'
        },
        'vi': {
            'minute': 'Phút',
            'zone': 'Múi',
            'cancel': 'Hủy',
            'ok': 'OK',
            'please click select': 'Nhấn chọn'
        }
    };

    /** --- 小屏不显示两个 --- */
    public showTwoDatePanel = false;

    // --- 单击事件 ---
    public click(type: 'first' | 'zone'): void {
        const el = this.refs[type];
        if (el.dataset.cgPopOpen !== undefined) {
            clickgo.form.hidePop(el);
            return;
        }
        if (type === 'first') {
            const area = clickgo.core.getAvailArea();
            this.showTwoDatePanel = area.width >= 600 ? true : false;
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
        if (this.dateStr[0]) {
            this.emit('update:modelValue', [
                this.dateObj[0].getTime() - this.tzData * 60 * 60_000,
                this.dateObj[1].getTime() - this.tzData * 60 * 60_000
            ]);
        }
        clickgo.form.hidePop();
    }

    public cancel(): void {
        clickgo.form.hidePop();
    }

    // --- 清除已选中的 ---
    public clear(): void {
        this.ts = undefined;
        this.dateStr.length = 0;
        this.emit('update:modelValue', []);
    }

    public onRange(e: clickgo.control.IDatepanelRangeEvent): void {
        e.preventDefault();
        const value: number[] = [];
        // --- start ---
        let res = clickgo.tool.formatTime(e.detail.start, this.tzData);
        this.dateStr[0] = res.date;
        this.timeStr[0] = res.time;
        value.push(e.detail.start);
        this.dateObj[0].setTime(e.detail.start + this.tzData * 60 * 60_000);
        // --- end ---
        res = clickgo.tool.formatTime(e.detail.end, this.tzData);
        this.dateStr[1] = res.date;
        this.timeStr[1] = res.time;
        value.push(e.detail.end);
        this.dateObj[1].setTime(e.detail.end + this.tzData * 60 * 60_000);
        // --- 提交数据 ---
        this.emit('update:modelValue', value);
        clickgo.form.hidePop(this.refs.firstpop);
        // --- 清空选中 ---
        this.refs.firstpanel.clear();
        this.refs.endpanel.clear();
    }

    /** --- 左侧的 changed --- */
    public firstChanged(e: clickgo.control.IDatepanelChangedEvent): void {
        if (e.detail.value === undefined) {
            this.ts2 = undefined;
            return;
        }
        const date = new Date(e.detail.value);
        date.setUTCHours(23, 59, 59, 0);
        this.ts2 = date.getTime() - this.tzData * 60 * 60_000;
    }

    // --- yearmonth 处理 ---

    public firstym: string = '';

    public endym: string = '';

    public onYmChange(): void {
        if (this.endym > this.firstym) {
            return;
        }
        const date = new Date();
        date.setUTCFullYear(parseInt(this.firstym.slice(0, 4)), parseInt(this.firstym.slice(4)), 1);
        this.endym = date.getUTCFullYear().toString() + (date.getUTCMonth() + 1).toString().padStart(2, '0');
    }

    public onMounted(): void {
        // --- 填充时区 ---
        for (let i = -12; i <= 14; ++i) {
            this.zones.push((i >= 0 ? '+' : '') + i.toString());
        }
        // --- 监测 prop 时区信息变动 ---
        this.watch('tz', () => {
            if (this.props.tz === undefined) {
                this.tzData = -(this.dateObj[0].getTimezoneOffset() / 60);
                this.emit('update:tz', this.tzData);
            }
            else {
                this.tzData = this.propNumber('tz');
            }
            const z = this.tzData.toString().split('.');
            this.vzone[0] = (parseInt(z[0]) >= 0 ? '+' : '') + z[0];
            this.vzdec[0] = z[1] ? (parseFloat('0.' + z[1]) * 60).toString() : '00';
            // --- 更新时间戳 ---
            if (this.dateStr[0]) {
                this.emit('update:modelValue', [
                    this.dateObj[0].getTime() - this.tzData * 60 * 60_000,
                    this.dateObj[1].getTime() - this.tzData * 60 * 60_000
                ]);
            }
        }, {
            'immediate': true
        });
        this.watch('modelValue', () => {
            if (this.props.modelValue[0] === undefined || this.props.modelValue[1] === undefined) {
                this.dateStr.length = 0;
                return;
            }
            const modelValue = this.propArray('modelValue');
            for (let i = 0; i <= 1; ++i) {
                const ts = typeof modelValue[i] === 'string' ? parseInt(modelValue[i]) : modelValue[i];
                const res = clickgo.tool.formatTime(ts, this.tzData);
                this.dateStr[i] = res.date;
                this.timeStr[i] = res.time;
            }
        }, {
            'immediate': true,
            'deep': true
        });
    }

}

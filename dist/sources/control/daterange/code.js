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
            'update:modelValue': null,
            'update:tz': null,
        };
        this.props = {
            'disabled': false,
            'modelValue': [],
            'tz': undefined,
            'start': undefined,
            'end': undefined,
            'time': true,
            'zone': false
        };
        this.dateObj = [
            new Date(), new Date()
        ];
        this.cursor = '';
        this.ts = undefined;
        this.dateStr = ['', ''];
        this.timeStr = ['', ''];
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
                'ok': 'OK',
                'please click select': 'Please click select'
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
                'zone': 'タイムゾーン',
                'cancel': 'キャンセル',
                'ok': 'OK',
                'please click select': '選択をクリックしてください'
            },
            'ko': {
                'minute': '분',
                'zone': '시간대',
                'cancel': '취소',
                'ok': '확인',
                'please click select': '선택을 클릭하십시오'
            },
            'th': {
                'minute': 'นาที',
                'zone': 'เขตเวลา',
                'cancel': 'ยกเลิก',
                'ok': 'ตกลง',
                'please click select': 'โปรดคลิกเลือก'
            },
            'es': {
                'minute': 'Minuto',
                'zone': 'Zona',
                'cancel': 'Cancelar',
                'ok': 'Aceptar',
                'please click select': 'Por favor haga clic en seleccionar'
            },
            'de': {
                'minute': 'Minute',
                'zone': 'Zone',
                'cancel': 'Abbrechen',
                'ok': 'OK',
                'please click select': 'Bitte klicken Sie auf Auswahl'
            },
            'fr': {
                'minute': 'Minute',
                'zone': 'Zone',
                'cancel': 'Annuler',
                'ok': 'Valider',
                'please click select': 'Veuillez cliquer sur sélectionner'
            },
            'pt': {
                'minute': 'Minuto',
                'zone': 'Fuso Horário',
                'cancel': 'Cancelar',
                'ok': 'OK',
                'please click select': 'Por favor clique em selecionar'
            },
            'ru': {
                'minute': 'Минута',
                'zone': 'Часовой пояс',
                'cancel': 'Отмена',
                'ok': 'ОК',
                'please click select': 'Пожалуйста, нажмите выбрать'
            },
            'vi': {
                'minute': 'Phút',
                'zone': 'Múi giờ',
                'cancel': 'Hủy',
                'ok': 'OK',
                'please click select': 'Vui lòng nhấp chọn'
            }
        };
        this.firstym = '';
        this.endym = '';
    }
    click(type) {
        const el = this.refs[type];
        if (el.dataset.cgPopOpen !== undefined) {
            clickgo.form.hidePop(el);
            return;
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
        if (this.dateStr[0]) {
            this.emit('update:modelValue', [
                this.dateObj[0].getTime() - this.tzData * 60 * 60000,
                this.dateObj[1].getTime() - this.tzData * 60 * 60000
            ]);
        }
        clickgo.form.hidePop();
    }
    cancel() {
        clickgo.form.hidePop();
    }
    clear() {
        this.ts = undefined;
        this.dateStr.length = 0;
        this.emit('update:modelValue', []);
    }
    onRange(e) {
        e.preventDefault();
        const value = [];
        let res = clickgo.tool.formatTime(e.detail.start, this.tzData);
        this.dateStr[0] = res.date;
        this.timeStr[0] = res.time;
        value.push(e.detail.start);
        this.dateObj[0].setTime(e.detail.start + this.tzData * 60 * 60000);
        res = clickgo.tool.formatTime(e.detail.end, this.tzData);
        this.dateStr[1] = res.date;
        this.timeStr[1] = res.time;
        value.push(e.detail.end);
        this.dateObj[1].setTime(e.detail.end + this.tzData * 60 * 60000);
        this.emit('update:modelValue', value);
        clickgo.form.hidePop(this.refs.firstpop);
        this.refs.firstpanel.clear();
        this.refs.endpanel.clear();
    }
    onYmChange() {
        if (this.endym > this.firstym) {
            return;
        }
        const date = new Date();
        date.setUTCFullYear(parseInt(this.firstym.slice(0, 4)), parseInt(this.firstym.slice(4)), 1);
        this.endym = date.getUTCFullYear().toString() + (date.getUTCMonth() + 1).toString().padStart(2, '0');
    }
    onMounted() {
        for (let i = -12; i <= 14; ++i) {
            this.zones.push((i >= 0 ? '+' : '') + i.toString());
        }
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
            if (this.dateStr[0]) {
                this.emit('update:modelValue', [
                    this.dateObj[0].getTime() - this.tzData * 60 * 60000,
                    this.dateObj[1].getTime() - this.tzData * 60 * 60000
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
exports.default = default_1;

import * as clickgo from 'clickgo';
import * as range from './lib/range';

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

    /** --- 已提交的毫秒范围，空数组表示未选择 --- */
    public value: number[] = [];

    /** --- 日历选择的起始日与悬停日期 --- */
    public ts?: number = undefined;

    public cursor = '';

    /** --- 起止时间独立于日历，单日历也能分别编辑 --- */
    public times = [
        { 'hour': ['00'], 'minute': ['00'], 'second': ['00'] },
        { 'hour': ['23'], 'minute': ['59'], 'second': ['59'] }
    ];

    public hours = Array.from({ 'length': 24 }, (_, i) => i.toString().padStart(2, '0'));

    public minutes = Array.from({ 'length': 60 }, (_, i) => i.toString().padStart(2, '0'));

    /** --- 当前时区信息（小时） --- */
    public tzData = 0;

    public vzone = ['+0'];

    public zones: string[] = [];

    public vzdec = ['00'];

    public zdecs = ['00', '15', '30', '45'];

    /** --- 日期和时间共用一次格式化结果 --- */
    public get display() {
        return this.value.map(value => clickgo.tool.formatTime(value, this.tzData));
    }

    /** --- 语言包 --- */
    public localeData = {
        'en': {
            'start': 'Start',
            'end': 'End',
            'today': 'Today',
            'last3days': 'Last 3 days',
            'last7days': 'Last 7 days',
            'thismonth': 'This month',
            'last1month': 'Past 1 month',
            'last3months': 'Last 3 months',
            'last6months': 'Last 6 months',
            'minute': 'Min',
            'zone': 'Zone',
            'cancel': 'Cancel',
            'ok': 'OK',
            'please click select': 'Click to select'
        },
        'sc': {
            'start': '开始',
            'end': '结束',
            'today': '今天',
            'last3days': '近3天',
            'last7days': '近7天',
            'thismonth': '本月',
            'last1month': '近1个月',
            'last3months': '近3个月',
            'last6months': '近6个月',
            'minute': '分',
            'zone': '时区',
            'cancel': '取消',
            'ok': '确定',
            'please click select': '请点击选择'
        },
        'tc': {
            'start': '開始',
            'end': '結束',
            'today': '今天',
            'last3days': '近3天',
            'last7days': '近7天',
            'thismonth': '本月',
            'last1month': '近1個月',
            'last3months': '近3個月',
            'last6months': '近6個月',
            'minute': '分',
            'zone': '時區',
            'cancel': '取消',
            'ok': '確定',
            'please click select': '請點擊選擇'
        },
        'ja': {
            'start': '開始',
            'end': '終了',
            'today': '今日',
            'last3days': '過去3日',
            'last7days': '過去7日',
            'thismonth': '今月',
            'last1month': '過去1か月',
            'last3months': '過去3か月',
            'last6months': '過去6か月',
            'minute': '分',
            'zone': '時區', // --- タイムゾーン ---
            'cancel': '取消',
            'ok': '確定',
            'please click select': '選択して下さい'
        },
        'ko': {
            'start': '시작',
            'end': '종료',
            'today': '오늘',
            'last3days': '지난 3일',
            'last7days': '지난 7일',
            'thismonth': '이번 달',
            'last1month': '지난 1개월',
            'last3months': '지난 3개월',
            'last6months': '지난 6개월',
            'minute': '분',
            'zone': '時區', // --- 시간대 ---
            'cancel': '취소',
            'ok': '확인',
            'please click select': '선택 클릭'
        },
        'th': {
            'start': 'เริ่มต้น',
            'end': 'สิ้นสุด',
            'today': 'วันนี้',
            'last3days': '3 วันที่ผ่านมา',
            'last7days': '7 วันที่ผ่านมา',
            'thismonth': 'เดือนนี้',
            'last1month': '1 เดือนที่ผ่านมา',
            'last3months': '3 เดือนที่ผ่านมา',
            'last6months': '6 เดือนที่ผ่านมา',
            'minute': 'น.',
            'zone': 'เขต',
            'cancel': 'ยกเลิก',
            'ok': 'ตกลง',
            'please click select': 'คลิกเลือก'
        },
        'es': {
            'start': 'Inicio',
            'end': 'Fin',
            'today': 'Hoy',
            'last3days': 'Últimos 3 días',
            'last7days': 'Últimos 7 días',
            'thismonth': 'Este mes',
            'last1month': 'Último mes',
            'last3months': 'Últimos 3 meses',
            'last6months': 'Últimos 6 meses',
            'minute': 'Min',
            'zone': 'Zona',
            'cancel': 'Cancelar',
            'ok': 'OK',
            'please click select': 'Clic para elegir'
        },
        'de': {
            'start': 'Start',
            'end': 'Ende',
            'today': 'Heute',
            'last3days': 'Letzte 3 Tage',
            'last7days': 'Letzte 7 Tage',
            'thismonth': 'Dieser Monat',
            'last1month': 'Letzter Monat',
            'last3months': 'Letzte 3 Monate',
            'last6months': 'Letzte 6 Monate',
            'minute': 'Min',
            'zone': 'Zone',
            'cancel': 'Abbr.',
            'ok': 'OK',
            'please click select': 'Klicken Sie wählen'
        },
        'fr': {
            'start': 'Début',
            'end': 'Fin',
            'today': 'Aujourd’hui',
            'last3days': '3 derniers jours',
            'last7days': '7 derniers jours',
            'thismonth': 'Ce mois-ci',
            'last1month': 'Dernier mois',
            'last3months': '3 derniers mois',
            'last6months': '6 derniers mois',
            'minute': 'Min',
            'zone': 'Zone',
            'cancel': 'Annul.',
            'ok': 'OK',
            'please click select': 'Cliquer choisir'
        },
        'pt': {
            'start': 'Início',
            'end': 'Fim',
            'today': 'Hoje',
            'last3days': 'Últimos 3 dias',
            'last7days': 'Últimos 7 dias',
            'thismonth': 'Este mês',
            'last1month': 'Último mês',
            'last3months': 'Últimos 3 meses',
            'last6months': 'Últimos 6 meses',
            'minute': 'Min',
            'zone': 'Fuso',
            'cancel': 'Cancelar',
            'ok': 'OK',
            'please click select': 'Clique para sel.'
        },
        'ru': {
            'start': 'Начало',
            'end': 'Конец',
            'today': 'Сегодня',
            'last3days': 'Последние 3 дня',
            'last7days': 'Последние 7 дней',
            'thismonth': 'Этот месяц',
            'last1month': 'Последний месяц',
            'last3months': 'Последние 3 месяца',
            'last6months': 'Последние 6 месяцев',
            'minute': 'Мин',
            'zone': 'Зона',
            'cancel': 'Отмена',
            'ok': 'ОК',
            'please click select': 'Нажмите выбрать'
        },
        'vi': {
            'start': 'Bắt đầu',
            'end': 'Kết thúc',
            'today': 'Hôm nay',
            'last3days': '3 ngày qua',
            'last7days': '7 ngày qua',
            'thismonth': 'Tháng này',
            'last1month': '1 tháng qua',
            'last3months': '3 tháng qua',
            'last6months': '6 tháng qua',
            'minute': 'Phút',
            'zone': 'Múi',
            'cancel': 'Hủy',
            'ok': 'OK',
            'please click select': 'Nhấn chọn'
        },
        'ar': {
            'start': 'البداية',
            'end': 'النهاية',
            'today': 'اليوم',
            'last3days': 'آخر 3 أيام',
            'last7days': 'آخر 7 أيام',
            'thismonth': 'هذا الشهر',
            'last1month': 'آخر شهر',
            'last3months': 'آخر 3 أشهر',
            'last6months': 'آخر 6 أشهر',
            'minute': 'دقيقة',
            'zone': 'منطقة',
            'cancel': 'إلغاء',
            'ok': 'موافق',
            'please click select': 'انقر للاختيار'
        },
        'id': {
            'start': 'Mulai',
            'end': 'Selesai',
            'today': 'Hari ini',
            'last3days': '3 hari terakhir',
            'last7days': '7 hari terakhir',
            'thismonth': 'Bulan ini',
            'last1month': '1 bulan terakhir',
            'last3months': '3 bulan terakhir',
            'last6months': '6 bulan terakhir',
            'minute': 'Menit',
            'zone': 'Zona',
            'cancel': 'Batal',
            'ok': 'OK',
            'please click select': 'Klik untuk memilih'
        },
        'it': {
            'start': 'Inizio',
            'end': 'Fine',
            'today': 'Oggi',
            'last3days': 'Ultimi 3 giorni',
            'last7days': 'Ultimi 7 giorni',
            'thismonth': 'Questo mese',
            'last1month': 'Ultimo mese',
            'last3months': 'Ultimi 3 mesi',
            'last6months': 'Ultimi 6 mesi',
            'minute': 'Min',
            'zone': 'Fuso',
            'cancel': 'Annulla',
            'ok': 'OK',
            'please click select': 'Fai clic per selezionare'
        },
        'tr': {
            'start': 'Başlangıç',
            'end': 'Bitiş',
            'today': 'Bugün',
            'last3days': 'Son 3 gün',
            'last7days': 'Son 7 gün',
            'thismonth': 'Bu ay',
            'last1month': 'Son 1 ay',
            'last3months': 'Son 3 ay',
            'last6months': 'Son 6 ay',
            'minute': 'Dak',
            'zone': 'Bölge',
            'cancel': 'İptal',
            'ok': 'Tamam',
            'please click select': 'Seçmek için tıklayın'
        }
    };

    /** --- 小屏不显示两个 --- */
    public showTwoDatePanel = false;

    /** --- 日期面板仅在首次打开时挂载，避免阻塞所在窗体的初始显示 --- */
    public datePanelsMounted = false;

    /** --- 每次打开重新计算今天，避免跨午夜后快捷范围过期 --- */
    public shortcutNow = Date.now();

    /** --- 所有快捷范围都先与可选边界取交集 --- */
    public get shortcuts() {
        const ids: range.Shortcut[] = [
            'today', 'last3days', 'last7days', 'thismonth', 'last1month', 'last3months', 'last6months'
        ];
        return ids.map(id => ({
            'id': id,
            'value': range.restrictRange(range.getRange(id, this.shortcutNow, this.tzData), this.props.start, this.props.end)
        }));
    }

    /**
     * --- 快捷选择一次提交完整范围 ---
     * @param id 快捷范围
     * @returns 提交完成；不可选时不修改值
     */
    public selectShortcut(id: range.Shortcut): void {
        if (this.propBoolean('disabled')) {
            return;
        }
        this.shortcutNow = Date.now();
        const value = range.restrictRange(
            range.getRange(id, this.shortcutNow, this.tzData), this.props.start, this.props.end
        );
        if (value === null) {
            return;
        }
        this.commitRange(value);
        clickgo.form.hidePop(this.refs.first);
    }

    /**
     * --- 提交有变化的范围，绑定方回传同值时无需再次更新 ---
     * @param value 毫秒范围或空数组
     * @returns 提交完成
     */
    public commitRange(value: number[]): void {
        this.resetDraft();
        if (value[0] === this.value[0] && value[1] === this.value[1]) {
            return;
        }
        this.value = value;
        this.emit('update:modelValue', [...value]);
        this.emit('changed');
    }

    /**
     * --- 清除尚未提交的起点与悬停范围 ---
     * @returns 清除完成
     */
    public resetDraft(): void {
        this.ts = undefined;
        this.cursor = '';
    }

    /**
     * --- 打开或关闭日期、时区面板 ---
     * @param type 面板类型
     * @returns 浮层更新完成
     */
    public async click(type: 'first' | 'zone'): Promise<void> {
        if (this.propBoolean('disabled')) {
            return;
        }
        const el = this.refs[type];
        if (el.dataset.cgPopOpen !== undefined) {
            clickgo.form.hidePop(el);
            return;
        }
        if (type === 'first') {
            this.shortcutNow = Date.now();
            this.resetDraft();
            const area = clickgo.core.getAvailArea();
            this.showTwoDatePanel = area.width >= 600;
            this.datePanelsMounted = true;
            await this.nextTick();
        }
        else {
            const hours = Math.trunc(Math.abs(this.tzData));
            this.vzone = [(this.tzData < 0 ? '-' : '+') + hours.toString()];
            this.vzdec = [Math.round((Math.abs(this.tzData) - hours) * 60).toString().padStart(2, '0')];
        }
        clickgo.form.showPop(el, this.refs[type + 'pop'], 'v', {
            'autoPosition': true,
            'autoScroll': true
        });
    }

    /**
     * --- 保留所选墙上时间并切换时区 ---
     * @returns 更新完成
     */
    public zoneOk(): void {
        if (this.propBoolean('disabled')) {
            return;
        }
        const hours = Math.abs(parseInt(this.vzone[0])) + parseInt(this.vzdec[0]) / 60;
        const tz = this.vzone[0].startsWith('-') ? -hours : hours;
        if (tz !== this.tzData) {
            let value: number[] = [];
            if (this.value.length) {
                const offset = (this.tzData - tz) * 3_600_000;
                const limited = range.restrictRange(
                    [this.value[0] + offset, this.value[1] + offset], this.props.start, this.props.end
                );
                if (limited === null) {
                    return;
                }
                value = limited;
            }
            this.tzData = tz;
            this.emit('update:tz', tz);
            this.commitRange(value);
        }
        clickgo.form.hidePop();
    }

    /**
     * --- 关闭时区面板 ---
     * @returns 关闭完成
     */
    public cancel(): void {
        clickgo.form.hidePop();
    }

    /**
     * --- 清除已提交范围和未完成的日历选择 ---
     * @returns 清除完成
     */
    public clear(): void {
        if (this.propBoolean('disabled')) {
            return;
        }
        this.commitRange([]);
    }

    /**
     * --- 保存手动选择的起始日 ---
     * @param e 日历选日事件
     * @returns 起点更新完成
     */
    public onSelected(e: clickgo.control.IDatepanelSelectedEvent): void {
        this.ts = e.detail.time;
    }

    /**
     * --- 将所选日期与独立的起止时间合并，再应用时间边界 ---
     * @param e 日历范围事件
     * @returns 提交完成；无有效范围时保留面板
     */
    public onRange(e: clickgo.control.IDatepanelRangeEvent): void {
        e.preventDefault();
        if (this.propBoolean('disabled')) {
            return;
        }
        const dates = [this.ts ?? e.detail.start, e.detail.end];
        const value = dates.map((date, i) => {
            const time = this.times[i];
            let hms = i === 0 ? '000000' : '235959';
            if (this.propBoolean('time')) {
                hms = time.hour[0] + time.minute[0] + time.second[0];
            }
            return range.withTime(date, this.tzData, hms);
        });
        const limited = range.restrictRange([value[0], value[1]], this.props.start, this.props.end);
        if (limited === null) {
            return;
        }
        this.commitRange(limited);
        clickgo.form.hidePop(this.refs.first);
    }

    // --- yearmonth 处理 ---

    public firstym: string = '';

    public endym: string = '';

    /**
     * --- 保持右侧月份晚于左侧月份 ---
     * @returns 月份同步完成
     */
    public onYmChange(): void {
        if (this.endym > this.firstym) {
            return;
        }
        const date = new Date();
        date.setUTCFullYear(parseInt(this.firstym.slice(0, 4)), parseInt(this.firstym.slice(4)), 1);
        this.endym = date.getUTCFullYear().toString() + (date.getUTCMonth() + 1).toString().padStart(2, '0');
    }

    /**
     * --- 初始化时区选项并同步外部绑定 ---
     * @returns 监听注册完成
     */
    public onMounted(): void {
        for (let i = -12; i <= 14; ++i) {
            if (i === 0) {
                this.zones.push('-0');
            }
            this.zones.push((i >= 0 ? '+' : '') + i.toString());
        }
        // --- 合并监听，外部同时修改日期和时区时以传入时间戳为准 ---
        this.watch(() => {
            const model = this.propArray('modelValue');
            return {
                'source': this.props.modelValue,
                'value': model.length >= 2 ? [Number(model[0]), Number(model[1])] : [],
                'tz': this.props.tz === undefined ? -new Date().getTimezoneOffset() / 60 : this.propNumber('tz')
            };
        }, (next, previous) => {
            const offset = (this.tzData - next.tz) * 3_600_000;
            this.tzData = next.tz;
            if (!previous || next.source !== previous.source ||
                next.value[0] !== previous.value[0] || next.value[1] !== previous.value[1]) {
                if (offset || next.value[0] !== this.value[0] || next.value[1] !== this.value[1]) {
                    this.value = next.value;
                    this.resetDraft();
                }
            }
            else if (offset) {
                // --- 单独改时区沿用保留墙上时间的语义，外部赋值不裁剪 ---
                this.commitRange(this.value.map(value => value + offset));
            }
            if (this.props.tz === undefined && (!previous || next.tz !== previous.tz)) {
                this.emit('update:tz', this.tzData);
            }
        }, {
            'immediate': true,
            'deep': true
        });
    }

}

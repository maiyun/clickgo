import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        'mode': 'default' | 'tip' | 'date';

        'time': boolean | string;
        'date': boolean | string;
        'zone': boolean | string;
        /** --- 小时，如 8 --- */
        'tz'?: number | string;
    } = {
            'mode': 'default',

            'time': true,
            'date': true,
            'zone': false,
            'tz': undefined
        };

    public dateTxt: string = '';

    /** --- 补全两位 --- */
    public pad(n: number): string {
        const ns = n.toString();
        if (ns.length >= 2) {
            return ns;
        }
        return '0' + ns;
    }

    /** --- 刷新 date 显示文本 --- */
    public refreshDate(): void {
        if (this.props.mode !== 'date') {
            return;
        }
        const dateTxt: string[] = [];
        const date = new Date(parseInt(this.element.innerHTML) * 1000);
        /** --- 当前设定的时区 --- */
        const tz = this.props.tz === undefined ? -(date.getTimezoneOffset() / 60) : this.propNumber('tz');
        date.setTime(date.getTime() + tz * 60 * 60 * 1000);
        if (this.propBoolean('date')) {
            dateTxt.push(date.getUTCFullYear().toString() + '-' + this.pad(date.getUTCMonth() + 1) + '-' + this.pad(date.getUTCDate()));
        }
        if (this.propBoolean('time')) {
            dateTxt.push(this.pad(date.getUTCHours()) + ':' + this.pad(date.getUTCMinutes()) + ':' + this.pad(date.getUTCSeconds()));
        }
        if (this.propBoolean('zone')) {
            dateTxt.push('UTC' + (tz >= 0 ? '+' : '') + tz.toString());
        }
        this.dateTxt = dateTxt.join(' ');
    }

    public onMounted(): void | Promise<void> {
        this.watch('mode', () => {
            if (this.props.mode === 'date') {
                clickgo.dom.watch(this.element, () => {
                    this.refreshDate();
                }, 'text', true);
            }
            else {
                clickgo.dom.unwatch(this.element);
            }
        }, {
            'immediate': true
        });
        this.watch('time', () => {
            this.refreshDate();
        });
        this.watch('date', () => {
            this.refreshDate();
        });
        this.watch('zone', () => {
            this.refreshDate();
        });
        this.watch('tz', () => {
            this.refreshDate();
        });
    }

}

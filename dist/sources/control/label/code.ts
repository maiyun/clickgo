import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        'mode': 'default' | 'tip' | 'mtip' | 'date';
        'content': string;

        'time': boolean | string;
        'date': boolean | string;
        'zone': boolean | string;
        /** --- 小时，如 8 --- */
        'tz'?: number | string;
    } = {
            'mode': 'default',
            'content': '',

            'time': true,
            'date': true,
            'zone': false,
            'tz': undefined
        };
    
    /** --- 替换 slot 数据 --- */
    public get contentComp(): string {
        if (this.props.mode !== 'date') {
            return this.props.content;
        }
        if (this.propNumber('content') === 0) {
            return '';
        }
        const dateTxt: string[] = [];
        const date = new Date(this.propNumber('content') * 1000);
        /** --- 当前设定的时区 --- */
        const tz = this.props.tz === undefined ? -(date.getTimezoneOffset() / 60) : this.propNumber('tz');
        date.setTime(date.getTime() + tz * 60 * 60 * 1000);
        if (this.propBoolean('date')) {
            dateTxt.push(date.getUTCFullYear().toString() + '-' + (date.getUTCMonth() + 1).toString().padStart(2, '0') + '-' + date.getUTCDate().toString().padStart(2, '0'));
        }
        if (this.propBoolean('time')) {
            dateTxt.push(date.getUTCHours().toString().padStart(2, '0') + ':' + date.getUTCMinutes().toString().padStart(2, '0') + ':' + date.getUTCSeconds().toString().padStart(2, '0'));
        }
        if (this.propBoolean('zone')) {
            dateTxt.push('UTC' + (tz >= 0 ? '+' : '') + tz.toString());
        }
        return dateTxt.join(' ');
    }

}

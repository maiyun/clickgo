import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        'mode': 'default' | 'tip' | 'mtip' | 'date';
        'content': string;
        'size': 's' | 'm' | 'l' | 'xl';

        'time': boolean | string;
        'date': boolean | string;
        'zone': boolean | string;
        /** --- 小时，如 8 --- */
        'tz'?: number | string;
    } = {
            'mode': 'default',
            'content': '',
            'size': 's',

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
        const rtn: string[] = [];
        const res = clickgo.tool.formatTime(this.propNumber('content') * 1000, this.props.tz === undefined ? undefined : this.propNumber('tz'));
        if (this.propBoolean('date')) {
            rtn.push(res.date);
        }
        if (this.propBoolean('time')) {
            rtn.push(res.time);
        }
        if (this.propBoolean('zone')) {
            rtn.push(res.zone);
        }
        return rtn.join(' ');
    }

}

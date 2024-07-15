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
        return clickgo.tool.formatTime(this.propNumber('content'), {
            'date': this.propBoolean('date'),
            'time': this.propBoolean('time'),
            'zone': this.propBoolean('zone'),
            'tz': this.props.tz === undefined ? undefined : this.propNumber('tz')
        });
    }

}

import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        'mode': 'default' | 'tip' | 'mtip' | 'date' | 'important' | 'click';
        'content': string;
        'size': 's' | 'm' | 'l' | 'xl';

        'copy': boolean | string;
        'time': boolean | string;
        'date': boolean | string;
        'zone': boolean | string;
        /** --- 小时，如 8 --- */
        'tz'?: number | string;
    } = {
            'mode': 'default',
            'content': '',
            'size': 's',

            'copy': false,
            'time': true,
            'date': true,
            'zone': false,
            'tz': undefined
        };

    /** --- 语言包 --- */
    public localeData = {
        'en': {
            'copied': 'Copied'
        },
        'sc': {
            'copied': '已复制'
        },
        'tc': {
            'copied': '已複製'
        },
        'ja': {
            'copied': 'コピーしました'
        },
        'ko': {
            'copied': '복사됨'
        },
        'th': {
            'copied': 'คัดลอกแล้ว'
        },
        'es': {
            'copied': 'Copiado'
        },
        'de': {
            'copied': 'Kopiert'
        },
        'fr': {
            'copied': 'Copié'
        },
        'pt': {
            'copied': 'Copiado'
        },
        'ru': {
            'copied': 'Скопировано'
        },
        'vi': {
            'copied': 'Đã sao chép'
        }
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
        const content = this.props.content.toString().length >= 13 ? this.propNumber('content') : this.propNumber('content') * 1000;
        const res = clickgo.tool.formatTime(content, this.props.tz === undefined ? undefined : this.propNumber('tz'));
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

    /** --- label 点击 --- */
    public async click(): Promise<void> {
        if (!this.propBoolean('copy')) {
            return;
        }
        await navigator.clipboard.writeText(this.props.content ? this.contentComp : this.element.innerText);
        clickgo.form.alert(this.l('copied'));
    }

}

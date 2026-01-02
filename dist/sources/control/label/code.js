import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    props = {
        'mode': 'default',
        'content': '',
        'size': 's',
        'align': 'left',
        'nowrap': false,
        'copy': false,
        'thru': false,
        'time': true,
        'date': true,
        'zone': false,
        'tz': undefined
    };
    /** --- 语言包 --- */
    localeData = {
        'en': {
            'copy': 'Copy',
            'copied': 'Copied'
        },
        'sc': {
            'copy': '复制',
            'copied': '已复制'
        },
        'tc': {
            'copy': '複製',
            'copied': '已複製'
        },
        'ja': {
            'copy': 'コピー',
            'copied': 'コピーしました'
        },
        'ko': {
            'copy': '복사',
            'copied': '복사됨'
        },
        'th': {
            'copy': 'คัดลอก',
            'copied': 'คัดลอกแล้ว'
        },
        'es': {
            'copy': 'Copiar',
            'copied': 'Copiado'
        },
        'de': {
            'copy': 'Kopieren',
            'copied': 'Kopiert'
        },
        'fr': {
            'copy': 'Copier',
            'copied': 'Copié'
        },
        'pt': {
            'copy': 'Copiar',
            'copied': 'Copiado'
        },
        'ru': {
            'copy': 'Копировать',
            'copied': 'Скопировано'
        },
        'vi': {
            'copy': 'Sao chép',
            'copied': 'Đã sao chép'
        }
    };
    /** --- 获取 align 的 css 属性模式 --- */
    get alignComp() {
        switch (this.props.align) {
            case 'center': {
                return 'center';
            }
            case 'left':
            case 'start': {
                return 'flex-start';
            }
            default: {
                return 'flex-end';
            }
        }
    }
    /** --- 替换 slot 数据 --- */
    get contentComp() {
        if (this.props.mode !== 'date') {
            return this.props.content;
        }
        if (this.propNumber('content') === 0) {
            return '';
        }
        const rtn = [];
        const content = this.props.content.toString().length >= 13 ? this.propNumber('content') : this.propNumber('content') * 1_000;
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
    async click() {
        if (!this.propBoolean('copy')) {
            return;
        }
        await navigator.clipboard.writeText(this.props.content ? this.contentComp : this.element.innerText);
        clickgo.form.alert(this.l('copied'));
    }
    /** --- wrap 的 down --- */
    down(e) {
        if (!this.propBoolean('copy')) {
            return;
        }
        // --- 点击复制 ---
        clickgo.modules.pointer.click(e, async () => {
            await navigator.clipboard.writeText(this.props.content ? this.contentComp : this.element.innerText);
            clickgo.form.alert(this.l('copied'));
        });
        if (!navigator.clipboard) {
            return;
        }
        clickgo.modules.pointer.menu(e, () => {
            clickgo.form.showPop(this.element, this.refs.pop, e);
        });
        // --- 若正在显示菜单则隐藏 ---
        if (this.element.dataset.cgPopOpen === undefined) {
            return;
        }
        clickgo.form.hidePop();
    }
    /** --- 执行复制 --- */
    execCmd(ac) {
        clickgo.tool.execCommand(ac);
    }
}

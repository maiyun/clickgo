import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    url = 'ws://127.0.0.1:8080/rsocket';
    pwd = '';
    config = {
        'url': '',
        'pwd': '',
    };
    list = [];
    /** --- 连接 --- */
    toConnect() {
        if (this.config.url) {
            this.refs.novnc.disconnect();
            return;
        }
        this.config.url = this.url;
        this.config.pwd = this.pwd;
    }
    /** --- 当前时间 --- */
    date() {
        const d = new Date();
        return `[${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}] `;
    }
    connect(data) {
        this.list.unshift(this.date() + 'connect: ' + JSON.stringify(data));
    }
    /** --- 断开 --- */
    disconnect() {
        this.list.unshift(this.date() + 'disconnect');
        this.config.url = '';
        this.config.pwd = '';
    }
    /** --- 需要密码 --- */
    async password() {
        this.list.unshift(this.date() + 'password');
        // --- 向用户索要密码 ---
        const pwd = await clickgo.form.prompt(this, {
            'content': 'Please input password',
            select: (e, button) => {
                if (!button) {
                    // --- 取消 ---
                    this.refs.novnc.disconnect();
                    return;
                }
                if (e.detail.value) {
                    return;
                }
                clickgo.form.alert('must input password');
                e.preventDefault();
                return;
            }
        });
        if (!pwd) {
            return;
        }
        this.refs.novnc.sendPassword(pwd);
    }
    /** --- 失败 --- */
    fail() {
        this.list.unshift(this.date() + 'fail');
    }
    desktopresize(e) {
        this.list.unshift(this.date() + 'desktopresize: ' + e.width + 'x' + e.height);
    }
    clipboard(text) {
        this.list.unshift(this.date() + 'clipboard: ' + text);
    }
}

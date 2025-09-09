import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public url = 'ws://127.0.0.1:8080/rsocket';

    public pwd = '';

    public config = {
        'url': '',
        'pwd': '',
    };

    public list: string[] = [];

    /** --- 连接 --- */
    public toConnect(): void {
        if (this.config.url) {
            this.refs.novnc.disconnect();
            return;
        }
        this.config.url = this.url;
        this.config.pwd = this.pwd;
    }

    /** --- 当前时间 --- */
    public date(): string {
        const d = new Date();
        return `[${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}] `;
    }

    public connect(data: any): void {
        this.list.unshift(this.date() + 'connect: ' + JSON.stringify(data));
    }

    /** --- 断开 --- */
    public disconnect(): void {
        this.list.unshift(this.date() + 'disconnect');
        this.config.url = '';
        this.config.pwd = '';
    }

    /** --- 需要密码 --- */
    public async password(): Promise<void> {
        this.list.unshift(this.date() + 'password');
        // --- 向用户索要密码 ---
        const pwd = await clickgo.form.prompt(this, {
            'content': 'Please input password',
            select: (e: clickgo.form.IFormPromptSelectEvent, button: boolean) => {
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
    public fail(): void {
        this.list.unshift(this.date() + 'fail');
    }

    public desktopresize(e: {
        'width': number;
        'height': number;
    }): void {
        this.list.unshift(this.date() + 'desktopresize: ' + e.width + 'x' + e.height);
    }

    public clipboard(text: string): void {
        this.list.unshift(this.date() + 'clipboard: ' + text);
    }

}

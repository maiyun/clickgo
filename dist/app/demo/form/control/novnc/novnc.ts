import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public url = '';

    public pwd = '';

    public config = {
        'url': '',
        'pwd': '',
    };

    public list: string[] = [];

    /** --- 连接 --- */
    public toConnect(): void {
        this.config.url = this.url;
        this.config.pwd = this.pwd;
    }

    /** --- 当前时间 --- */
    public date(): string {
        const d = new Date();
        return `[${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}] `;
    }

    public connect(): void {
        this.list.unshift(this.date() + 'connect');
    }

    /** --- 断开 --- */
    public disconnect(): void {
        this.list.unshift(this.date() + 'disconnect');
    }

    /** --- 需要密码 --- */
    public password(): void {
        this.list.unshift(this.date() + 'password');
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

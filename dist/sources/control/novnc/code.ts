import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'init': null,
        'connect': null,
        'disconnect': null,
        'password': null,
        'fail': null,
        'desktopresize': null,
        'clipboard': null,
    };

    public notInit = false;

    public isLoading = true;

    /** --- 用户最后一次活动时间 --- */
    public lastActive: number = 0;

    /** --- 定时器 --- */
    public activeTimer: number = 0;

    public access: {
        'novnc': any;
        /** --- 连接对象 --- */
        'rfb': any;
    } = {
            'novnc': undefined,
            'rfb': undefined,
        };

    public props: {
        'modelValue': {
            'url': string;
            'pwd'?: string;
            'view'?: boolean;
        };
    } = {
            'modelValue': {
                'url': '',
                'pwd': '',
            },
        };

    public async onMounted(): Promise<void> {
        const novnc = await clickgo.core.getModule('novnc');
        if (!novnc) {
            // --- 没有成功 ---
            this.isLoading = false;
            this.notInit = true;
            return;
        }
        this.access.novnc = novnc;
        // --- 监听上面的值的变动 ---
        this.watch(() => JSON.stringify(this.props.modelValue), (v: string, o: string) => {
            if (v === o) {
                return;
            }
            if (!this.access.novnc) {
                return;
            }
            if (!this.props.modelValue?.url) {
                if (!this.access.rfb) {
                    return;
                }
                this.access.rfb.disconnect();
                this.access.rfb = undefined;
                return;
            }
            // --- 开始吧 ---
            this.access.rfb = new this.access.novnc(this.refs.content, this.props.modelValue.url, {
                'credentials': {
                    'password': this.props.modelValue.pwd,
                },
                'viewOnly': this.props.modelValue.view ?? false,
                'clipViewport': false,
                'scaleViewport': true,
            });
            this.access.rfb.addEventListener('connect', () => {
                this.lastActive = Date.now();
                this.emit('connect', {
                    'width': this.access.rfb._fbWidth,
                    'height': this.access.rfb._fbHeight,
                });
            });
            this.access.rfb.addEventListener('disconnect', () => {
                this.emit('disconnect');
            });
            this.access.rfb.addEventListener('credentialsrequired', () => {
                this.emit('password');
            });
            this.access.rfb.addEventListener('securityfailure', () => {
                this.emit('fail');
            });
            this.access.rfb.addEventListener('desktopresize', () => {
                this.emit('desktopresize', {
                    'width': this.access.rfb._fbWidth,
                    'height': this.access.rfb._fbHeight,
                });
            });
            this.access.rfb.addEventListener('clipboard', (e: any) => {
                this.emit('clipboard', e.detail.text);
            });
        }, {
            'deep': true,
            'immediate': true,
        });
        // --- 初始化成功 ---
        this.isLoading = false;
        this.emit('init', this.access.novnc);
        // --- 创建定时器 ---
        this.activeTimer = clickgo.task.createTimer(() => {
            if (!this.access.rfb) {
                return;
            }
            if (Date.now() - this.lastActive < 30_000) {
                return;
            }
            // --- 发送 ---
            this.access.rfb.sendPointer(0, 0, 0);
            this.lastActive = Date.now();
        }, 5_000);
    }

    public onUnmounted(): void {
        clickgo.task.removeTimer(this.activeTimer);
        if (!this.access.rfb) {
            return;
        }
        this.access.rfb.disconnect();
        this.access.rfb = undefined;
    }

    public mousemove(): void {
        if (!this.access.rfb) {
            return;
        }
        this.lastActive = Date.now();
    }

    // --- 供用户调用的方法 --

    /**
     * --- 发送密码 ---
     * @param pwd 密码
     */
    public sendPassword(pwd: string): boolean {
        if (!this.access.rfb) {
            return false;
        }
        this.access.rfb.sendCredentials({
            'password': pwd,
        });
        return true;
    }

    /**
     * --- 发送到对方剪贴板 ---
     * @param text 文本
     */
    public sendClipboard(text: string): boolean {
        if (!this.access.rfb) {
            return false;
        }
        this.access.rfb.clipboardPasteFrom(text);
        return true;
    }

    /**
     * --- 发送 Ctrl + Alt + Del ---
     */
    public sendCtrlAltDel(): boolean {
        if (!this.access.rfb) {
            return false;
        }
        this.access.rfb.sendCtrlAltDel();
        return true;
    }

}

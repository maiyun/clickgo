import * as clickgo from 'clickgo';
import * as types from '~/types';

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'result': null,
    };

    public props: {
        'factory': 'tc' | 'cf';
        'akey': string;
    } = {
            'factory': 'tc',
            'akey': '',
        };

    public get showMask(): boolean {
        // --- 防止拖动导致卡顿 ---
        return this.isLoading ? true : clickgo.dom.is.move;
    }

    public access: {
        'lib': any;
        'instance': any;
    } = {
            'lib': undefined,
            'instance': undefined,
        };

    /** --- 是否没有初始化 --- */
    public notInit = false;

    /** --- 当前是否加载中 --- */
    public isLoading = false;

    /** --- 当前状态 --- */
    public state: '' | 'failed' | 'successful' = '';

    public localeData = {
        'en': {
            'click': 'Click to verify',
            'failed': 'Failed, retry',
            'successful': 'Verified'
        },
        'sc': {
            'click': '点击进行验证',
            'failed': '失败，点击重试',
            'successful': '验证成功'
        },
        'tc': {
            'click': '點選進行驗證',
            'failed': '失敗，點選重試',
            'successful': '驗證成功'
        },
        'ja': {
            'click': '認証する',
            'failed': '失敗、再試行',
            'successful': '成功'
        },
        'ko': {
            'click': '인증하기',
            'failed': '실패, 재시도',
            'successful': '성공'
        },
        'th': {
            'click': 'ยืนยัน',
            'failed': 'ล้มเหลว, ลองอีก',
            'successful': 'สำเร็จ'
        },
        'es': {
            'click': 'Verificar',
            'failed': 'Error, reintenta',
            'successful': 'Verificado'
        },
        'de': {
            'click': 'Prüfen',
            'failed': 'Fehler, retry',
            'successful': 'Erfolgreich'
        },
        'fr': {
            'click': 'Vérifier',
            'failed': 'Échec, réessayer',
            'successful': 'Réussi'
        },
        'pt': {
            'click': 'Verificar',
            'failed': 'Falha, retry',
            'successful': 'Sucesso'
        },
        'ru': {
            'click': 'Проверить',
            'failed': 'Ошибка, повтор',
            'successful': 'Успешно'
        },
        'vi': {
            'click': 'Xác minh',
            'failed': 'Thất bại, thử lại',
            'successful': 'Thành công'
        }
    };

    /** --- 供外部调用的 --- */
    public reset(): void {
        if (this.props.factory === 'tc') {
            // --- 腾讯云验证码 ---
            this.state = '';
            this.refs.content.innerHTML = this.l('click');
            return;
        }
        // --- CF 验证码 ---
        if (!this.access.lib || !this.access.instance) {
            return;
        }
        this.access.lib.reset(this.access.instance);
    }

    /** --- 腾讯云验证码显示 --- */
    public click(): void {
        if (!this.access.instance) {
            return;
        }
        this.access.instance.show();
    }

    public async onMounted(): Promise<void> {
        if (this.props.factory === 'tc') {
            // --- 腾讯云验证码 ---
            const tcc = await clickgo.core.getModule('tcc');
            if (!tcc) {
                // --- 没有成功 ---
                this.isLoading = false;
                this.notInit = true;
                return;
            }
            this.access.lib = tcc;
            this.refs.content.innerHTML = this.l('click');
            try {
                const captcha = new tcc(this.props.akey, (res: any) => {
                    if (res.ret === 0) {
                        this.state = 'successful';
                        this.refs.content.innerHTML = this.l('successful');
                    }
                    else {
                        this.state = 'failed';
                        this.refs.content.innerHTML = this.l('failed');
                    }
                    const event: types.ICaptchaResultEvent = {
                        'detail': {
                            'result': res.ret === 0 ? 1 : 0,
                            'token': res.ticket + '|' + res.randstr,
                        },
                    };
                    this.emit('result', event);
                }, {
                    'needFeedBack': false,
                });
                this.access.instance = captcha;
            }
            catch {
                return;
            }
            // --- 初始化成功 ---
            this.isLoading = false;
            return;
        }
        // --- CF 验证码 ---
        const cft = await clickgo.core.getModule('cft');
        if (!cft) {
            // --- 没有成功 ---
            this.isLoading = false;
            this.notInit = true;
            return;
        }
        this.access.lib = cft;
        const captcha = cft.render(this.refs.content, {
            'sitekey': this.props.akey,
            'size': 'flexible',
            callback: (token: string) => {
                const event: types.ICaptchaResultEvent = {
                    'detail': {
                        'result': 1,
                        'token': token,
                    },
                };
                this.emit('result', event);
            },
        });
        this.access.instance = captcha;
        // --- 初始化成功 ---
        this.isLoading = false;
    }

    public onUnmounted(): void {
        if (this.props.factory === 'tc') {
            this.access.instance = undefined;
            return;
        }
        if (!this.access.lib || !this.access.instance) {
            return;
        }
        this.access.lib.remove(this.access.instance);
    }

}

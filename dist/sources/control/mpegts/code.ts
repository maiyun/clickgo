import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'canplay': null,
        'init': null,
        'update:play': null,
        'update:volume': null,
    };

    public props: {
        'src': string;
        'fsrc': string;
        'text': string;

        'controls': boolean | string;

        'volume': number | string;
        'play': boolean | string;
        /** --- 自动销毁重置时间，0 为不自动重置，毫秒 --- */
        'reset': number;
    } = {
            'src': '',
            'fsrc': '',
            'text': '',

            'controls': false,

            'volume': 80,
            'play': false,
            'reset': 0,
        };

    public access: {
        'instance': any;
        'mpegts': any;
        'ctx': any;
    } = {
            'instance': undefined,
            'mpegts': undefined,
            'ctx': undefined
        };

    public notInit = false;

    public isLoading = true;

    /** --- 是否在显示 (controls) --- */
    public isShow = false;

    /** --- 将在多久后隐藏 (controls) --- */
    public hideTimer = 0;

    /** --- 存储的音量大小 --- */
    public volumeSave = 0;

    /** --- 当前的声量 --- */
    public volumeData = 0;

    // --- 播放状态相关事件 ---

    /** --- 正式开始播放 --- */
    public toPlay() {
        /** --- 要加载的 url --- */
        const url = this.isFull ? (this.props.fsrc || this.props.src) : this.props.src;
        this.access.instance = this.access.mpegts.createPlayer({
            'type': 'mse',
            'isLive': true,
            'url': url
        }, {
            'enableStashBuffer': false,
            'stashInitialSize': 128,
            'enableWorkerForMSE': true,
            'lazyLoad': false,
            'lazyLoadMaxDuration': 0.2,
            'liveBufferLatencyChasing': true,
            'liveBufferLatencyMinRemain': 0.2,
            'autoCleanupSourceBuffer': true,
            'autoCleanupMaxBackwardDuration': 10,
            'autoCleanupMinBackwardDuration': 10
        });
        this.access.instance.attachMediaElement(this.refs.video);
        this.access.instance.load();
        this.access.instance.on(this.access.mpegts.Events.ERROR, (e: any, e2: any, e3: any) => {
            // --- 会是啥错误呢 ---
            console.log('[ERROR][CONTROL][MPEGTS]', 'ERROR', e, e2, e3);
            this.capture();
            this.access.instance.destroy();
            this.toPlay();
        });
        this.access.instance.on(this.access.mpegts.Events.STATISTICS_INFO, () => {
            // --- 如果有连接，这里将一直正常 ---
        });
        this.access.instance.play();
    }

    /** --- 播放状态 --- */
    public playData: boolean = false;

    public playClick(): void {
        if (this.playData) {
            // --- 变暂停 ---
            if (this.access.instance) {
                this.capture();
                this.access.instance.destroy();
                this.access.instance = undefined;
            }
        }
        else {
            // --- 变播放 ---
            this.toPlay();
        }
        this.playData = !this.playData;
        this.emit('update:play', this.playData);
    }

    /** --- 捕获一帧 --- */
    public capture() {
        if (!this.access.instance) {
            return;
        }
        this.refs.canvas.width = this.refs.video.videoWidth;
        this.refs.canvas.height = this.refs.video.videoHeight;
        this.refs.canvas.style.aspectRatio = this.refs.video.videoWidth + ' / ' + this.refs.video.videoHeight;
        this.access.ctx.drawImage(
            this.refs.video,
            0, 0, this.refs.video.videoWidth, this.refs.video.videoHeight,
            0, 0, this.refs.canvas.width, this.refs.canvas.height
        );
    }

    /** --- 清除画布 --- */
    public clear() {
        this.access.ctx.clearRect(0, 0, this.refs.canvas.width, this.refs.canvas.height);
    }

    public async fullClick(): Promise<void> {
        if (clickgo.dom.is.full) {
            await clickgo.dom.exitFullscreen();
            if (!this.access.instance) {
                return;
            }
            // --- 等待全屏事件响应 ---
            await clickgo.tool.sleep(150);
            if (this.props.fsrc) {
                this.capture();
                this.access.instance.destroy();
                this.toPlay();
            }
            return;
        }
        await this.element.requestFullscreen();
        if (!this.access.instance) {
            return;
        }
        // --- 等待全屏事件响应 ---
        await clickgo.tool.sleep(150);
        if (this.props.fsrc && (this.props.fsrc !== this.props.src)) {
            this.capture();
            this.access.instance.destroy();
            this.toPlay();
        }
    }

    /** --- 当前是否是全屏 --- */
    public get isFull(): boolean {
        return clickgo.dom.is.full;
    }

    // --- 进入时保持 controls 常亮 ---
    public onMouseEnter(e: MouseEvent): void {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        if (!this.propBoolean('controls')) {
            return;
        }
        this.isShow = true;
        if (this.hideTimer) {
            clickgo.task.removeTimer(this.hideTimer);
            this.hideTimer = 0;
        }
    }

    public onMouseLeave(e: MouseEvent): void {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        if (!this.propBoolean('controls')) {
            return;
        }
        this.hideTimer = clickgo.task.sleep(() => {
            this.isShow = false;
        }, 800);
    }

    public onTouch(e: TouchEvent): void {
        if (!this.propBoolean('controls')) {
            return;
        }
        // --- 防止在手机模式按下状态下 controls 被自动隐藏，PC 下有 enter 所以没事 ---
        clickgo.dom.bindDown(e, {
            down: () => {
                this.isShow = true;
                if (this.hideTimer) {
                    clickgo.task.removeTimer(this.hideTimer);
                    this.hideTimer = 0;
                }
            },
            up: () => {
                this.hideTimer = clickgo.task.sleep(() => {
                    this.isShow = false;
                }, 800);
            }
        });
    }
    // --- 当视频可以播放之时要处理的事件 ---
    public onCanplay(): void {
        this.playData = this.propBoolean('play');
        if (this.playData && this.access.instance) {
            this.access.instance.play();
        }
        this.emit('canplay');
    }

    /** --- 等待超过 5 秒就重建 --- */
    private _waitingTimer = 0;

    public onPlaying(): void{
        this.clear();
        if (!this._waitingTimer) {
            return;
        }
        clickgo.task.removeTimer(this._waitingTimer);
        this._waitingTimer = 0;
    }

    public onPause(): void {
        if (this._waitingTimer) {
            clickgo.task.removeTimer(this._waitingTimer);
        }
        this._waitingTimer = clickgo.task.createTimer(() => {
            this._waitingTimer = 0;
            if (!this.access.instance) {
                return;
            }
            this.capture();
            this.access.instance.destroy();
            this.toPlay();
        }, 5_000, {
            'count': 1,
        })
    }

    public onWaiting(): void {
        if (this._waitingTimer) {
            clickgo.task.removeTimer(this._waitingTimer);
        }
        this._waitingTimer = clickgo.task.createTimer(() => {
            this._waitingTimer = 0;
            if (!this.access.instance) {
                return;
            }
            this.capture();
            this.access.instance.destroy();
            this.toPlay();
        }, 5_000, {
            'count': 1,
        })
    }

    /** --- 喇叭事件 --- */
    public volumeClick() {
        if (this.volumeData) {
            // --- 有声音变没声音 ---
            this.refs.video.volume = 0;
            this.volumeData = 0;
            this.emit('update:volume', 0);
            return;
        }
        // --- 没声音变有声音 ---
        this.refs.video.volume = this.volumeSave / 100;
        this.volumeData = this.volumeSave;
        this.emit('update:volume', this.volumeData);
    }

    public async onMounted(): Promise<void> {
        const mpegts = await clickgo.core.getModule('mpegts');
        if (!mpegts) {
            // --- 没有成功 ---
            this.isLoading = false;
            this.notInit = true;
            return;
        }
        this.access.mpegts = mpegts;
        this.access.ctx = this.refs.canvas.getContext('2d');

        // --- 设置音量 ---
        this.watch('volume', () => {
            if (this.volumeData === this.propInt('volume')) {
                return;
            }
            this.refs.video.volume = this.propInt('volume') / 100;
            this.volumeData = this.propInt('volume');
            if (!this.propInt('volume')) {
                return;
            }
            this.volumeSave = this.propInt('volume');
        }, {
            'immediate': true
        });

        // --- 监听控件显示/隐藏状态 ---
        this.watch('controls', () => {
            if (this.propBoolean('controls')) {
                this.isShow = true;
                this.hideTimer = clickgo.task.sleep(() => {
                    this.isShow = false;
                }, 800);
            }
            else {
                if (this.hideTimer) {
                    clickgo.task.removeTimer(this.hideTimer);
                    this.hideTimer = 0;
                }
            }
        }, {
            'immediate': true
        });

        // --- 检测播放状态 ---
        this.watch('play', () => {
            if (this.playData === this.propBoolean('play')) {
                return;
            }
            this.playData = this.propBoolean('play');
            if (this.playData) {
                this.toPlay();
            }
            else {
                this.capture();
                this.access.instance.destroy();
                this.access.instance = undefined;
            }
        });
        this.playData = this.propBoolean('play');

        // --- src 变更和初始化 ---
        this.watch('src', async (n, o) => {
            if (n === o) {
                return;
            }
            if (!this.props.src) {
                if (!this.access.instance) {
                    return;
                }
                this.access.instance.destroy();
                this.access.instance = undefined;
                return;
            }
            // --- 本次不为空，看看是不是还有上次的 ---
            if (this.access.instance) {
                this.access.instance.destroy();
            }
            if (this.playData) {
                this.toPlay();
            }
        }, {
            'immediate': true
        });

        /** --- 自动重置的 timer --- */
        let resetTimer: number = 0;
        this.watch('reset', () => {
            if (!this.propInt('reset')) {
                // --- 关闭 ---
                if (!resetTimer) {
                    // --- 本来就关闭 ---
                    return;
                }
                clickgo.task.removeTimer(resetTimer);
                resetTimer = 0;
                return;
            }
            // --- 打开 ---
            if (resetTimer) {
                clickgo.task.removeTimer(resetTimer);
            }
            resetTimer = clickgo.task.createTimer(() => {
                if (!this.access.instance) {
                    return;
                }
                // --- 存在必然在播放状态 ---
                this.capture();
                this.access.instance.destroy();
                this.toPlay();
            }, this.propInt('reset'))
        }, {
            'immediate': true
        });

        /** --- 先存储到历史里面 --- */
        this.volumeSave = this.propInt('volume');
        this.volumeData = this.propInt('volume');

        // --- 初始化成功 ---
        this.isLoading = false;
        this.emit('init', {
            'mpegts': this.access.mpegts,
            'instance': this.access.instance
        });
    }

    public onUnmounted(): void {
        if (!this.access.instance) {
            return;
        }
        this.access.instance.destroy();
    }

}

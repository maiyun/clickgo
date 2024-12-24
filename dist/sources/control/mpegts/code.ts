import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'canplay': null,
        'init': null,
        'update:play': null
    };

    public props: {
        'src': string;
        'text': string;

        'controls': boolean | string;

        'volume': number | string;
        'play': boolean | string;
    } = {
            'src': '',
            'text': '',

            'controls': false,

            'volume': 80,
            'play': false,
        };

    public access: {
        'instance': any;
        'mpegts': any;
    } = {
            'instance': undefined,
            'mpegts': undefined
        };

    public notInit = false;

    public isLoading = true;

    /** --- 是否在显示 (controls) --- */
    public isShow = false;

    /** --- 将在多久后隐藏 (controls) --- */
    public hideTimer = 0;

    // --- 播放状态相关事件 ---

    /** --- 正式开始播放 --- */
    public toPlay() {
        this.access.instance = this.access.mpegts.createPlayer({
            'type': 'mse',
            'isLive': true,
            'url': this.props.src
        }, {
            'enableStashBuffer': false,
            'stashInitialSize': 128,
            'lazyLoad': false,
            'lazyLoadMaxDuration': 0.2,
            'liveBufferLatencyChasing': true,
            'liveBufferLatencyMinRemain': 0.2,
            'autoCleanupSourceBuffer': true,
            'autoCleanupMaxBackwardDuration': 5,
            'autoCleanupMinBackwardDuration': 5
        });
        this.access.instance.attachMediaElement(this.refs.video);
        this.access.instance.load();
        this.access.instance.play();
    }

    public playData: boolean = false;

    public playClick(): void {
        if (this.playData) {
            if (this.access.instance) {
                this.access.instance.destroy();
                this.access.instance = undefined;
            }
        }
        else {
            this.toPlay();
        }
        this.playData = !this.playData;
        this.emit('update:play', this.playData);
    }

    public async fullClick(): Promise<void> {
        if (clickgo.dom.is.full) {
            await clickgo.dom.exitFullscreen();
            return;
        }
        await this.element.requestFullscreen();
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

    public async onMounted(): Promise<void> {
        const mpegts = await clickgo.core.getModule('mpegts');
        if (!mpegts) {
            // --- 没有成功 ---
            this.isLoading = false;
            this.notInit = true;
            return;
        }
        this.access.mpegts = mpegts;

        // --- 设置音量 ---
        this.watch('volume', () => {
            this.refs.video.volume = this.propInt('volume') / 100;
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

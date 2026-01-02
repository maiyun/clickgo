import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'durationchange': null,
        'canplay': null,
        'canplaythrough': null,
        'emptied': null,
        'ended': null,
        'error': null,
        'loadeddata': null,
        'loadedmetadata': null,
        'loadstart': null,
        'playing': null,
        'progress': null,
        'ratechange': null,
        'readystatechange': null,
        'seeked': null,
        'seeking': null,
        'stalled': null,
        'suspend': null,
        'waiting': null,

        'update:current': null,
        'update:play': null
    };

    public props: {
        'src': string;

        'controls': boolean | string;
        'loop': boolean | string;
        'muted': boolean | string;

        'volume': number | string;
        'play': boolean | string;
        'current': number | string;
    } = {
            'src': '',

            'controls': false,
            'loop': false,
            'muted': false,

            'volume': 50,
            'play': false,
            'current': 0
        };

    public srcData = '';

    /** --- 当前是否加载的 blob 模式文件 --- */
    public isBlob = false;

    /** --- watch: src 变更次数 --- */
    public count = 0;

    /** --- 媒介长度，秒数 --- */
    public duration: number = 0;

    /** --- 当前鼠标是否在进度条内 --- */
    public inBar: boolean = false;

    /** --- 将在多久后隐藏 (controls) --- */
    public hideTimer = 0;

    /** --- 是否在显示 (controls) --- */
    public isShow = false;

    /** --- 媒介长度改变时 video 会触发 --- */
    public onDurationchange(): void {
        if (!this.refs.video) {
            return;
        }
        this.duration = this.refs.video.duration;
        this.emit('durationchange', this.duration);
    }

    public get durations(): string {
        return clickgo.tool.formatSecond(this.duration);
    }

    /** --- 当前播放秒数 --- */
    public currentData: number = 0;

    /** --- 用于 current 更新的 timer --- */
    private _currentTimer: number = 0;

    public currentUpdateStart(): void {
        if (this._currentTimer) {
            return;
        }
        this._currentTimer = clickgo.task.onFrame(this, () => {
            if (this.currentData === this.refs.video.currentTime) {
                return;
            }
            this.currentData = this.refs.video.currentTime;
            this.emit('update:current', this.currentData);
        }, {
            'formId': this.formId
        });
    }

    public currentUpdateEnd(): void {
        if (!this._currentTimer) {
            return;
        }
        clickgo.task.offFrame(this, this._currentTimer);
        this._currentTimer = 0;
    }

    public get currents(): string {
        return clickgo.tool.formatSecond(this.currentData);
    }

    // --- 播放状态相关事件 ---

    public playData: boolean = false;

    public onPlay(): void {
        if (this.playData) {
            return;
        }
        this.currentUpdateStart();
        this.playData = true;
        this.emit('update:play', this.playData);
    }

    public onPause(): void {
        if (!this.playData) {
            return;
        }
        this.currentUpdateEnd();
        this.playData = false;
        this.emit('update:play', this.playData);
    }

    public playClick(): void {
        if (this.playData) {
            this.refs.video.pause();
            this.currentUpdateEnd();
        }
        else {
            this.refs.video.play();
            this.currentUpdateStart();
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
    public onDown(e: PointerEvent): void {
        if (!this.propBoolean('controls')) {
            return;
        }
        clickgo.modules.pointer.hover(e, {
            enter: () => {
                this.isShow = true;
                if (this.hideTimer) {
                    clickgo.task.removeTimer(this, this.hideTimer);
                    this.hideTimer = 0;
                }
            },
            leave: () => {
                this.hideTimer = clickgo.task.sleep(this, () => {
                    this.isShow = false;
                }, 800);
            }
        });
    }

    // --- 鼠标和 bar 相关 ---

    public bcurrent: number = 0;

    public get bcurrents(): string {
        return clickgo.tool.formatSecond(this.bcurrent);
    }

    public onBDown(oe: PointerEvent): void {
        clickgo.modules.pointer.down(oe, {
            up: () => {
                this.currentData = this.bcurrent;
                this.refs.video.currentTime = this.currentData;
                this.emit('update:current', this.currentData);
            }
        });
        this.onBEnter(oe);
    }

    public onBEnter(oe: PointerEvent): void {
        clickgo.modules.pointer.hover(oe, {
            enter: e => {
                this.inBar = true;
                const bcr = this.refs.top.getBoundingClientRect();
                const x = e.clientX - bcr.left;
                this.bcurrent = x / bcr.width * this.duration;
            },
            move: e => {
                const bcr = this.refs.top.getBoundingClientRect();
                const x = e.clientX - bcr.left;
                this.bcurrent = x / bcr.width * this.duration;
            },
            leave: () => {
                this.inBar = false;
            },
        });
    }

    // --- 当视频可以播放之时要处理的事件 ---
    public onCanplay(): void {
        this.playData = this.propBoolean('play');
        if (this.playData && !this._currentTimer) {
            this.refs.video.play();
            this.currentUpdateStart();
        }
        this.emit('canplay');
    }

    public onMounted(): void {
        this.watch('src', async () => {
            const count = ++this.count;
            if (typeof this.props.src !== 'string' || this.props.src === '') {
                if (this.isBlob) {
                    this.isBlob = false;
                    URL.revokeObjectURL(this.srcData);
                }
                this.srcData = '';
                return;
            }
            const pre = this.props.src.slice(0, 6).toLowerCase();
            if (pre === 'file:/') {
                if (this.isBlob) {
                    this.isBlob = false;
                    URL.revokeObjectURL(this.srcData);
                }
                this.srcData = '';
                return;
            }
            if (pre === 'http:/' || pre === 'https:' || pre.startsWith('data:')) {
                if (this.isBlob) {
                    this.isBlob = false;
                    URL.revokeObjectURL(this.srcData);
                }
                this.srcData = this.props.src;
                return;
            }
            // --- 本 app 包或 blob 模式的文件 ---
            const path = clickgo.tool.urlResolve('/package' + this.path + '/', this.props.src);
            const blob = await clickgo.fs.getContent(this, path);
            if ((count !== this.count) || !blob || typeof blob === 'string') {
                return;
            }
            if (this.isBlob) {
                URL.revokeObjectURL(this.srcData);
            }
            const t = URL.createObjectURL(blob);
            this.srcData = t;
        }, {
            'immediate': true
        });

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
                this.hideTimer = clickgo.task.sleep(this, () => {
                    this.isShow = false;
                }, 800);
            }
            else {
                if (this.hideTimer) {
                    clickgo.task.removeTimer(this, this.hideTimer);
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
                this.refs.video.play();
                this.currentUpdateStart();
            }
            else {
                this.refs.video.pause();
                this.currentUpdateEnd();
            }
        });
    }

    public onUnmounted(): void {
        if (this.isBlob) {
            URL.revokeObjectURL(this.srcData);
        }
    }

}

import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.emits = {
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
        this.props = {
            'src': '',
            'controls': false,
            'loop': false,
            'muted': false,
            'volume': 50,
            'play': false,
            'current': 0
        };
        this.srcData = '';
        /** --- 当前是否加载的 blob 模式文件 --- */
        this.isBlob = false;
        /** --- watch: src 变更次数 --- */
        this.count = 0;
        /** --- 媒介长度，秒数 --- */
        this.duration = 0;
        /** --- 当前鼠标是否在进度条内 --- */
        this.inBar = false;
        /** --- 将在多久后隐藏 (controls) --- */
        this.hideTimer = 0;
        /** --- 是否在显示 (controls) --- */
        this.isShow = false;
        /** --- 当前播放秒数 --- */
        this.currentData = 0;
        /** --- 用于 current 更新的 timer --- */
        this._currentTimer = 0;
        // --- 播放状态相关事件 ---
        this.playData = false;
        // --- 鼠标和 bar 相关 ---
        this.bcurrent = 0;
    }
    /** --- 媒介长度改变时 video 会触发 --- */
    onDurationchange() {
        if (!this.refs.video) {
            return;
        }
        this.duration = this.refs.video.duration;
        this.emit('durationchange', this.duration);
    }
    get durations() {
        return clickgo.tool.formatSecond(this.duration);
    }
    currentUpdateStart() {
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
    currentUpdateEnd() {
        if (!this._currentTimer) {
            return;
        }
        clickgo.task.offFrame(this, this._currentTimer);
        this._currentTimer = 0;
    }
    get currents() {
        return clickgo.tool.formatSecond(this.currentData);
    }
    onPlay() {
        if (this.playData) {
            return;
        }
        this.currentUpdateStart();
        this.playData = true;
        this.emit('update:play', this.playData);
    }
    onPause() {
        if (!this.playData) {
            return;
        }
        this.currentUpdateEnd();
        this.playData = false;
        this.emit('update:play', this.playData);
    }
    playClick() {
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
    async fullClick() {
        if (clickgo.dom.is.full) {
            await clickgo.dom.exitFullscreen();
            return;
        }
        await this.element.requestFullscreen();
    }
    /** --- 当前是否是全屏 --- */
    get isFull() {
        return clickgo.dom.is.full;
    }
    // --- 进入时保持 controls 常亮 ---
    onMouseEnter(e) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        if (!this.propBoolean('controls')) {
            return;
        }
        this.isShow = true;
        if (this.hideTimer) {
            clickgo.task.removeTimer(this, this.hideTimer);
            this.hideTimer = 0;
        }
    }
    onMouseLeave(e) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        if (!this.propBoolean('controls')) {
            return;
        }
        this.hideTimer = clickgo.task.sleep(this, () => {
            this.isShow = false;
        }, 800);
    }
    onTouch(e) {
        if (!this.propBoolean('controls')) {
            return;
        }
        // --- 防止在手机模式按下状态下 controls 被自动隐藏，PC 下有 enter 所以没事 ---
        clickgo.dom.bindDown(e, {
            down: () => {
                this.isShow = true;
                if (this.hideTimer) {
                    clickgo.task.removeTimer(this, this.hideTimer);
                    this.hideTimer = 0;
                }
            },
            up: () => {
                this.hideTimer = clickgo.task.sleep(this, () => {
                    this.isShow = false;
                }, 800);
            }
        });
    }
    get bcurrents() {
        return clickgo.tool.formatSecond(this.bcurrent);
    }
    /** --- 鼠标移动事件 --- */
    onBMove(e) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        this.inBar = true;
        const bcr = this.refs.top.getBoundingClientRect();
        const x = e.clientX - bcr.left;
        this.bcurrent = x / bcr.width * this.duration;
    }
    onBLeave(e) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        this.inBar = false;
    }
    onBClick(e) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        this.currentData = this.bcurrent;
        this.refs.video.currentTime = this.currentData;
        this.emit('update:current', this.currentData);
    }
    /** --- 手指移动事件 --- */
    onBTouch(e) {
        const bcr = this.refs.top.getBoundingClientRect();
        clickgo.dom.bindDown(e, {
            move: (e2) => {
                this.inBar = true;
                const x = e2.touches[0].clientX - bcr.left;
                this.bcurrent = x / bcr.width * this.duration;
            },
            up: () => {
                this.inBar = false;
                // --- 直接响应 ---
                this.currentData = this.bcurrent;
                this.refs.video.currentTime = this.currentData;
                this.emit('update:current', this.currentData);
            }
        });
    }
    // --- 当视频可以播放之时要处理的事件 ---
    onCanplay() {
        this.playData = this.propBoolean('play');
        if (this.playData && !this._currentTimer) {
            this.refs.video.play();
            this.currentUpdateStart();
        }
        this.emit('canplay');
    }
    onMounted() {
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
    onUnmounted() {
        if (this.isBlob) {
            URL.revokeObjectURL(this.srcData);
        }
    }
}

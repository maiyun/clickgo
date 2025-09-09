import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.emits = {
            'init': null,
            'playing': null,
            'disconnected': null,
        };
        this.props = {
            'init': {
                'type': 'relay',
                'url': '',
                'stream': 'video',
                'volume': 80,
                'sid': '',
                'skey': '',
            },
            'volume': 80,
        };
        this.access = {
            'tums': undefined,
            'instance': undefined,
        };
        /** --- 是否没有初始化 --- */
        this.notInit = false;
        /** --- 当前是否加载中 --- */
        this.isLoading = false;
    }
    async onMounted() {
        const tums = await clickgo.core.getModule('tums-player');
        if (!tums) {
            // --- 没有成功 ---
            this.isLoading = false;
            this.notInit = true;
            return;
        }
        this.access.tums = tums;
        // --- init 数据变更 ---
        this.watch(() => JSON.stringify(this.props.init), (n, o) => {
            if (n === o) {
                return;
            }
            if (this.access.instance) {
                // --- 已经连接成功了，就断开之前的 ---
                this.access.instance.destroy();
                this.access.instance = undefined;
                return;
            }
            // --- 开始连接 ---
            if (!this.props.init.url || !this.props.init.sid || !this.props.init.skey) {
                return;
            }
            this.access.instance = new this.access.tums.default(this.refs.content, {
                'type': this.props.init.type ?? 'relay',
                'url': this.props.init.url,
                'pluginPath': clickgo.getDirname() + '/ext',
                'volume': this.props.init.volume,
                'autoplay': true,
                'appKey': this.props.init.sid,
                'appSecret': this.props.init.skey,
            });
            this.access.instance.on('playing', () => {
                this.emit('playing');
            });
            this.access.instance.on('disconnected', () => {
                this.emit('disconnected');
            });
        }, {
            'deep': true,
            'immediate': true,
        });
        // --- 监听 volume 变化 ---
        this.watch('volume', (n) => {
            if (!this.access.instance) {
                return;
            }
            this.access.instance.setVolume(n);
        });
        // --- 初始化成功 ---
        this.isLoading = false;
        this.emit('init', {
            'tums': this.access.tums,
            'instance': this.access.instance,
        });
    }
    onUnmounted() {
        if (!this.access.instance) {
            return;
        }
        this.access.instance.destroy();
    }
    // --- 供外部调用 ---
    /** --- 开始播放 --- */
    start() {
        if (!this.access.instance) {
            return;
        }
        this.access.instance.start();
    }
    /** --- 停止播放 --- */
    stop() {
        if (!this.access.instance) {
            return;
        }
        this.access.instance.stop();
    }
    /** --- 暂停播放 --- */
    pause() {
        if (!this.access.instance) {
            return;
        }
        this.access.instance.pause();
    }
    /** --- 继续播放 --- */
    play() {
        if (!this.access.instance) {
            return;
        }
        this.access.instance.play();
    }
}

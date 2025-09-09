import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'init': null,
        'playing': null,
        'disconnected': null,
    };

    public props: {
        'init': {
            'type'?: 'relay';
            'url': string;
            'stream'?: 'video' | 'sdvod';
            'volume'?: number;
            'sid': string;
            'skey': string;
        };
        'volume': number;
    } = {
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

    public access: {
        'tums': any;
        'instance': any;
    } = {
            'tums': undefined,
            'instance': undefined,
        };

    /** --- 是否没有初始化 --- */
    public notInit = false;

    /** --- 当前是否加载中 --- */
    public isLoading = false;

    public async onMounted(): Promise<void> {
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

    public onUnmounted(): void {
        if (!this.access.instance) {
            return;
        }
        this.access.instance.destroy();
    }

    // --- 供外部调用 ---

    /** --- 开始播放 --- */
    public start(): void {
        if (!this.access.instance) {
            return;
        }
        this.access.instance.start();
    }

    /** --- 停止播放 --- */
    public stop(): void {
        if (!this.access.instance) {
            return;
        }
        this.access.instance.stop();
    }

    /** --- 暂停播放 --- */
    public pause(): void {
        if (!this.access.instance) {
            return;
        }
        this.access.instance.pause();
    }

    /** --- 继续播放 --- */
    public play(): void {
        if (!this.access.instance) {
            return;
        }
        this.access.instance.play();
    }

}

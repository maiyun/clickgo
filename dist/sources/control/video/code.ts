import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        'src': string;

        'controls': boolean | string;
        'loop': boolean | string;
        'muted': boolean | string;

        'volume': number | string;
        'play': boolean | string;
    } = {
            'src': '',

            'controls': false,
            'loop': false,
            'muted': false,

            'volume': 50,
            'play': false
        };

    public srcData = '';

    /** --- 当前是否加载的 blob 模式文件 --- */
    public isBlob = false;

    /** --- watch: src 变更次数 --- */
    public count = 0;

    // --- 播放状态相关事件 ---

    public playData: boolean = false;

    public onPlay(): void {
        this.playData = true;
        this.emit('update:play', this.playData);
    }

    public onPause(): void {
        this.playData = false;
        this.emit('update:play', this.playData);
    }

    public playClick(): void {
        if (this.playData) {
            this.refs.video.pause();
        }
        else {
            this.refs.video.play();
        }
        this.playData = !this.playData;
        this.emit('update:play', this.playData);
    }

    public async fullClick(): Promise<void> {
        await this.element.requestFullscreen();
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
            const blob = await clickgo.fs.getContent(path);
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

        // --- 检测播放状态 ---
        this.watch('play', () => {
            if (this.playData === this.propBoolean('play')) {
                return;
            }
            this.playData = this.propBoolean('play');
            if (this.playData) {
                this.refs.video.play();
            }
            else {
                this.refs.video.pause();
            }
        }, {
            'immediate': true
        });
    }

    public onUnmounted(): void {
        if (this.isBlob) {
            URL.revokeObjectURL(this.srcData);
        }
    }

}

import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'init': null,
    };

    public props: {
        'init': {
            'sid': string;
            'skey': string;
        };
        'controls': boolean | string;
        'layout': Array<{
            /** --- 单页总共画面数 --- */
            'cellNum': number;
            /** --- 行数 --- */
            'rows': number;
            /** --- 列数 --- */
            'columns': number;
            /** --- 坐标合并布局 --- */
            'cellList': Array<[number, number]>;
        }>,
        'list': Array<{
            /** --- qrCode 或 mac --- */
            'device': string;
            /** --- 设备通道号；若设备为直连IPC，此参数固定为1，请主动传入1，若设备为 NVR 下的通道，传 IPC 在 NVR 下的通道编号，从 1 开始，此时 qrCode 或 mac 参数应传NVR设备的 qrCode 或 mac --- */
            'channel': number;
            /** --- 播放的窗口编号，从0开始，最大值63(目前最多支持64画面) --- */
            'index': number;
            /** --- 清晰度，0：VGA，流畅，1：QVGA，清晰，2：HD，高清，3：THIRD，超高清 --- */
            'mode': number;
            /** --- 是否发出声音，默认发出 --- */
            'volume'?: boolean;
        }>;
        /** --- 不为 null 则为回放模式，秒/毫秒均可，仅当天 --- */
        'range': [number, number] | null;
        /** --- 最大 10 --- */
        'volume': number,
    } = {
            'init': {
                'sid': '',
                'skey': '',
            },
            'controls': true,
            'layout': [
                {
                    'cellNum': 4,
                    'rows': 2,
                    'columns': 2,
                    'cellList': [
                        [0, 0],
                        [1, 1],
                        [2, 2],
                        [3, 3]
                    ]
                }
            ],
            'list': [],
            'range': null,
            'volume': 10,
        };

    public access: {
        'tplink': any;
        'instance': any;
    } = {
            'tplink': undefined,
            'instance': undefined,
        };

    public notInit = false;

    public isLoading = true;

    /** --- 重试次数 --- */
    public initCount = 0;

    /** --- 随机种子 --- */
    public rand: string = '';

    /** --- 当前占用的 index --- */
    public indexs: Array<{
        'index': number;
        'range': boolean;
    }> = [];

    /** --- 初始化控件 --- */
    private _init() {
        this.access.instance = new this.access.tplink({
            'szPluginContainer': 'cg-control-tplink-' + this.rand,
            'iServicePortStart': 15410,
            'iServicePortEnd': 15419,
            cbConnectSuccess: async () => {
                const bcr = this.refs.content.getBoundingClientRect();
                try {
                    await this.access.instance.CreateWnd('cg-control-tplink-' + this.rand, Math.round(bcr.width), Math.round(bcr.height), 0);
                    this.initCount = 0;
                    this.access.instance.InitAuthInfo(this.props.init.sid, this.props.init.skey);
                    this.access.instance.SetCustomLayout(JSON.stringify(this.props.layout));
                    if (!this.propBoolean('controls')) {
                        this.access.instance.HideWndToolbar();
                    }
                    this._play();
                }
                catch (e) {
                    console.log('[CONTROL] [TPLINK] ERROR', e);
                }
            },
            cbConnectError: async () => {
                // --- 程序未启动时执行 error 函数，采用 wakeup 来启动程序 ---
                this.access.instance = null;
                this.access.tplink.WakeUpPlugin("SMBCloudHDPlugin://");
                ++this.initCount;
                if (this.initCount > 3) {
                    clickgo.form.alert('Tplink error', 'danger');
                }
                clickgo.form.alert('Tplink retry ' + this.initCount, 'warning');
                await clickgo.tool.sleep(3_000);
                this._init();
            },
            cbConnectClose: async () => {
                this.access.instance = null;
                this.access.tplink.WakeUpPlugin("SMBCloudHDPlugin://");
                ++this.initCount;
                if (this.initCount > 3) {
                    clickgo.form.alert('Tplink error', 'danger');
                }
                clickgo.form.alert('Tplink retry ' + this.initCount, 'warning');
                await clickgo.tool.sleep(3_000);
                this._init();
            }
        });
    }

    /** --- 清除所有正在播放的 --- */
    private _clear() {
        for (const item of this.indexs) {
            if (item.range) {
                this.access.instance.StopPlayback(item.index);
            }
            else {
                this.access.instance.StopPreview(item.index);
            }
        }
        this.indexs.length = 0;
    }

    /** --- 播放所有 list 里的 --- */
    private _play() {
        for (const item of this.props.list) {
            let qrCode = '';
            let mac = '';
            if (item.device.includes('-') || item.device.includes(':')) {
                mac = item.device.replace(/:/g, '-');
            }
            else {
                qrCode = item.device;
            }
            if (this.props.range === null) {
                this.access.instance.StartPreview(
                    qrCode, mac,
                    item.channel,
                    item.index,
                    item.mode,
                );
                this.indexs.push({
                    'index': item.index,
                    'range': false
                });
            }
            else {
                this.access.instance.StartPlayback(
                    qrCode, mac,
                    item.channel,
                    item.index,
                    clickgo.tool.isMs(this.props.range[0]) ? this.props.range[0] : this.props.range[0] * 1000,
                );
                this.indexs.push({
                    'index': item.index,
                    'range': true
                });
            }
            this.access.instance.SetVolume(item.index, item.volume === false ? 0 : this.propInt('volume'));
        }
    }

    /** --- 可供外部调用，刷新当前画面，应对可能得网络问题 --- */
    public refresh() {
        if (!this.access.instance) {
            return;
        }
        this._clear();
        this._play();
    }

    /** --- 可供外部调用，开始对讲 --- */
    public startTalk(index: number) {
        this.access.instance.StartTalk(index);
    }

    /** --- 可供外部调用，停止对讲 --- */
    public stopTalk(index: number) {
        this.access.instance.StopTalk(index);
    }

    public async onMounted(): Promise<void> {
        this.rand = clickgo.tool.random(16);
        const tplink = await clickgo.core.getModule('tplink');
        if (!tplink) {
            // --- 没有成功 ---
            this.isLoading = false;
            this.notInit = true;
            return;
        }
        this.access.tplink = tplink;
        this._init();

        // --- 如果窗口大小、位置改变 ---
        clickgo.dom.watchPosition(this.element, () => {
            if (!this.access.instance) {
                return;
            }
            const bcr = this.refs.content.getBoundingClientRect();
            this.access.instance.Resize(Math.round(bcr.width), Math.round(bcr.height));
        });

        // --- layout 变更 ---
        this.watch('layout', async () => {
            if (!this.access.instance) {
                return;
            }
            this.access.instance.SetCustomLayout(JSON.stringify(this.props.layout));
        }, {
            'deep': true,
        });

        // --- 监听控件显示/隐藏状态 ---
        this.watch('controls', () => {
            if (!this.access.instance) {
                return;
            }
            if (this.propBoolean('controls')) {
                this.access.instance.ShowWndToolbar();
            }
            else {
                this.access.instance.HideWndToolbar();
            }
        });

        // --- list 变动，重新加载 ---
        this.watch('list', () => {
            this.refresh();
        }, {
            'deep': true,
        });

        // --- range 变动，重新加载 ---
        this.watch('range', () => {
            this.refresh();
        }, {
            'deep': true,
        });

        // --- 音量设置变动 ---
        this.watch('volume', () => {
            for (const item of this.indexs) {
                this.access.instance.SetVolume(item.index, this.propInt('volume'));
            }
        });

        // --- 初始化成功 ---
        this.isLoading = false;
        this.emit('init', {
            'tplink': this.access.tplink,
            'instance': this.access.instance,
        });
    }

    public onUnmounted(): void {
        if (!this.access.instance) {
            return;
        }
        this.access.instance.DestroyWnd();
    }

}

import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.emits = {
            'init': null,
        };
        this.props = {
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
        this.access = {
            'tplink': undefined,
            'instance': undefined,
        };
        this.notInit = false;
        this.isLoading = true;
        /** --- 重试次数 --- */
        this.initCount = 0;
        /** --- 随机种子 --- */
        this.rand = '';
        /** --- 当前占用的 index --- */
        this.indexs = [];
    }
    /** --- 初始化控件 --- */
    _init() {
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
                this.access.tplink.WakeUpPlugin('SMBCloudHDPlugin://');
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
                this.access.tplink.WakeUpPlugin('SMBCloudHDPlugin://');
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
    _clear() {
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
    _play() {
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
                this.access.instance.StartPreview(qrCode, mac, item.channel, item.index, item.mode);
                this.indexs.push({
                    'index': item.index,
                    'range': false,
                    'volume': item.volume ?? true,
                });
            }
            else {
                this.access.instance.StartPlayback(qrCode, mac, item.channel, item.index, clickgo.tool.isMs(this.props.range[0]) ? this.props.range[0] : this.props.range[0] * 1000);
                this.indexs.push({
                    'index': item.index,
                    'range': true,
                    'volume': item.volume ?? true,
                });
            }
            this.access.instance.SetVolume(item.index, item.volume === false ? 0 : this.propInt('volume'));
        }
    }
    /** --- 可供外部调用，刷新当前画面，应对可能得网络问题 --- */
    refresh() {
        if (!this.access.instance) {
            return;
        }
        this._clear();
        this._play();
    }
    /** --- 可供外部调用，开始对讲 --- */
    startTalk(index) {
        if (!this.access.instance) {
            return;
        }
        this.access.instance.StartTalk(index);
    }
    /** --- 可供外部调用，停止对讲 --- */
    stopTalk(index) {
        if (!this.access.instance) {
            return;
        }
        this.access.instance.StopTalk(index);
    }
    async onMounted() {
        this.rand = clickgo.tool.random(16);
        const tplink = await clickgo.core.getModule('tplinkhd');
        if (!tplink) {
            // --- 没有成功 ---
            this.isLoading = false;
            this.notInit = true;
            return;
        }
        this.access.tplink = tplink;
        this._init();
        // --- 如果窗口大小、位置改变 ---
        let count = 0;
        clickgo.dom.watchPosition(this.element, async () => {
            if (!this.access.instance) {
                return;
            }
            const now = ++count;
            const bcr = this.refs.content.getBoundingClientRect();
            this.access.instance.Resize(Math.round(bcr.width), Math.round(bcr.height));
            await clickgo.tool.sleep(600);
            // --- 再执行一次 ---
            if (now < count) {
                return;
            }
            this.access.instance.Resize(Math.round(bcr.width), Math.round(bcr.height));
        });
        // --- layout 变更 ---
        this.watch('layout', () => {
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
                this.access.instance.SetVolume(item.index, item.volume ? this.propInt('volume') : 0);
            }
        });
        // --- 初始化成功 ---
        this.isLoading = false;
        this.emit('init', {
            'tplink': this.access.tplink,
            'instance': this.access.instance,
        });
    }
    onUnmounted() {
        if (!this.access.instance) {
            return;
        }
        this.access.instance.DestroyWnd();
    }
}

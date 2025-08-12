"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const clickgo = __importStar(require("clickgo"));
class default_1 extends clickgo.control.AbstractControl {
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
        this.initCount = 0;
        this.rand = '';
        this.indexs = [];
    }
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
    refresh() {
        if (!this.access.instance) {
            return;
        }
        this._clear();
        this._play();
    }
    startTalk(index) {
        this.access.instance.StartTalk(index);
    }
    stopTalk(index) {
        this.access.instance.StopTalk(index);
    }
    async onMounted() {
        this.rand = clickgo.tool.random(16);
        const tplink = await clickgo.core.getModule('tplink');
        if (!tplink) {
            this.isLoading = false;
            this.notInit = true;
            return;
        }
        this.access.tplink = tplink;
        this._init();
        let count = 0;
        clickgo.dom.watchPosition(this.element, async () => {
            if (!this.access.instance) {
                return;
            }
            const now = ++count;
            const bcr = this.refs.content.getBoundingClientRect();
            this.access.instance.Resize(Math.round(bcr.width), Math.round(bcr.height));
            await clickgo.tool.sleep(600);
            if (now < count) {
                return;
            }
            this.access.instance.Resize(Math.round(bcr.width), Math.round(bcr.height));
        });
        this.watch('layout', () => {
            if (!this.access.instance) {
                return;
            }
            this.access.instance.SetCustomLayout(JSON.stringify(this.props.layout));
        }, {
            'deep': true,
        });
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
        this.watch('list', () => {
            this.refresh();
        }, {
            'deep': true,
        });
        this.watch('range', () => {
            this.refresh();
        }, {
            'deep': true,
        });
        this.watch('volume', () => {
            for (const item of this.indexs) {
                this.access.instance.SetVolume(item.index, item.volume ? this.propInt('volume') : 0);
            }
        });
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
exports.default = default_1;

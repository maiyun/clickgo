import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.emits = {
            'data': null,
            'resize': null,
            'init': null
        };
        this.props = {
            'disabled': false,
            'theme': 'black'
        };
        this.notInit = false;
        this.isLoading = true;
        this.access = {
            'term': undefined,
        };
    }
    // --- 鼠标、手势按下事件 ---
    async down(e) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        // --- 仅支持鼠标 ---
        if (e.button !== 2) {
            return;
        }
        // --- 鼠标右键 ---
        const sel = this.access.term.getSelection();
        if (sel) {
            // --- 复制 ---
            try {
                await navigator.clipboard.writeText(sel);
                this.access.term.clearSelection();
            }
            catch { }
        }
        else {
            // --- 粘贴 ---
            const str = await navigator.clipboard.readText();
            this.access.term.paste(str);
        }
    }
    async onMounted() {
        const xterm = clickgo.modules.xterm;
        if (!xterm) {
            // --- 没有成功 ---
            this.isLoading = false;
            this.notInit = true;
            return;
        }
        this.access.term = new xterm.Terminal();
        // --- 用户输入事件 ---
        this.access.term.onData((char) => {
            this.emit('data', char);
        });
        // --- onResize ---
        this.access.term.onResize(async (cr) => {
            const screen = this.refs.content.querySelector('.xterm-screen');
            await clickgo.tool.sleep(50);
            this.emit('resize', {
                'cols': cr.cols,
                'rows': cr.rows,
                'width': screen.clientWidth,
                'height': screen.clientHeight
            });
        });
        // --- 加载自适应插件 ---
        const fitAddon = new xterm.FitAddon();
        this.access.term.loadAddon(fitAddon);
        // --- 加载 webgl 插件 ---
        const webgl = new xterm.WebglAddon();
        this.access.term.loadAddon(webgl);
        // --- 初始化标签 ---
        this.access.term.open(this.refs.content);
        // --- 自适应大小 ---
        clickgo.dom.watchSize(this, this.element, () => {
            fitAddon.fit();
        });
        // --- 初始化成功 ---
        this.isLoading = false;
        this.emit('init', this.access.term);
        // --- 得等待一下，xterm 有可能有问题不能立马 fit ---
        await clickgo.tool.sleep(34);
        fitAddon.fit();
    }
}

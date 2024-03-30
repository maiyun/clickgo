import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'data': null,
        'resize': null,
        'init': null
    };

    public props: {
        'disabled': boolean | string;

        'theme': string;
    } = {
            'disabled': false,

            'theme': 'black'
        };

    public notInit = false;

    public isLoading = true;

    public access: {
        /** --- 终端控件对象 --- */
        'term': any;
    } = {
            'term': undefined
        };

    // --- 鼠标、手势按下事件 ---
    public async down(e: MouseEvent): Promise<void> {
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
            catch (e) {
                console.log('Clipboard error.', e);
            }
        }
        else {
            // --- 粘贴 ---
            const str = await navigator.clipboard.readText();
            this.access.term.paste(str);
        }

    }

    public async onMounted(): Promise<void> {
        const xterm = await clickgo.core.getModule('xterm');
        if (!xterm) {
            // --- 没有成功 ---
            this.isLoading = false;
            this.notInit = true;
            return;
        }
        this.access.term = new xterm[0]();
        // --- 用户输入事件 ---
        this.access.term.onData((char: string) => {
            this.emit('data', char);
        });
        // --- onResize ---
        this.access.term.onResize(async (cr: Record<string, number>) => {
            const screen: HTMLDivElement = this.refs.content.querySelector('.xterm-screen')!;
            await clickgo.tool.sleep(50);
            this.emit('resize', {
                'cols': cr.cols,
                'rows': cr.rows,
                'width': screen.clientWidth,
                'height': screen.clientHeight
            });
        });
        // --- 加载自适应插件 ---
        const fitAddon = new xterm[1]();
        this.access.term.loadAddon(fitAddon);
        // --- 加载 webgl 插件 ---
        const webgl = new xterm[2]();
        this.access.term.loadAddon(webgl);
        // --- 初始化标签 ---
        this.access.term.open(this.refs.content);
        // --- 自适应大小 ---
        clickgo.dom.watchSize(this.element, () => {
            fitAddon.fit();
        }, true);
        // --- 初始化成功 ---
        this.isLoading = false;
        this.emit('init', this.access.term);
    }

}

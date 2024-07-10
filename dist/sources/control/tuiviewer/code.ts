import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'init': null
    };

    public props: {
        'modelValue': string;
    } = {
            'modelValue': ''
        };

    public notInit = false;

    public isLoading = true;

    public access: {
        /** --- 终端控件对象 --- */
        'tuieditor': any;
    } = {
            'tuieditor': undefined
        };

    public async onMounted(): Promise<void> {
        const tuieditor = await clickgo.core.getModule('tuieditor');
        if (!tuieditor) {
            // --- 没有成功 ---
            this.isLoading = false;
            this.notInit = true;
            return;
        }
        this.access.tuieditor = new tuieditor.factory({
            'el': this.refs.content,
            'viewer': true,
            'initialValue': this.props.modelValue,
        });
        // --- 监听上面的值的变动 ---
        this.watch('modelValue', (v: string) => {
            if (!this.access.tuieditor) {
                return;
            }
            this.access.tuieditor.setMarkdown(v);
        });
        // --- 监听 font 相关信息 ---
        clickgo.dom.watchStyle(this.element, ['font-size', 'font-family'], (n, v) => {
            if (!this.access.tuieditor) {
                return;
            }
            const pm = this.refs.content.children[0] as HTMLElement | null;
            if (!pm) {
                return;
            }
            switch (n) {
                case 'font-size': {
                    pm.style.fontSize = v;
                    break;
                }
                case 'font-family': {
                    pm.style.fontFamily = v;
                    break;
                }
            }
        }, true);
        // --- 初始化成功 ---
        this.isLoading = false;
        this.emit('init', this.access.tuieditor);
    }

}

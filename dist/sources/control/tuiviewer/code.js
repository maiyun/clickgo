import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    emits = {
        'init': null
    };
    props = {
        'modelValue': ''
    };
    notInit = false;
    isLoading = true;
    access = {
        'tuieditor': undefined
    };
    async onMounted() {
        const tuieditor = await clickgo.core.getModule('@toast-ui/editor');
        if (!tuieditor) {
            // --- 没有成功 ---
            this.isLoading = false;
            this.notInit = true;
            return;
        }
        this.access.tuieditor = new tuieditor.Editor.factory({
            'el': this.refs.content,
            'viewer': true,
            'initialValue': this.props.modelValue,
        });
        // --- 监听上面的值的变动 ---
        this.watch('modelValue', (v) => {
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
            const pm = this.refs.content.children[0];
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

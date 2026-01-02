import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    emits = {
        'init': null,
    };
    props = {
        'modelValue': '',
        'css': '',
    };
    notInit = false;
    isLoading = true;
    html = '';
    async onMounted() {
        const makred = await clickgo.core.getModule('@toast-ui/editor');
        if (!makred) {
            // --- 没有成功 ---
            this.isLoading = false;
            this.notInit = true;
            return;
        }
        // --- 监听上面的值的变动 ---
        this.watch('modelValue', (v) => {
            if (!makred) {
                return;
            }
            this.html = clickgo.modules.marked.parse(v, {
                'breaks': true,
            });
        }, {
            'immediate': true,
        });
        // --- 初始化成功 ---
        this.isLoading = false;
        this.emit('init');
    }
}

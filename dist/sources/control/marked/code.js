import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.emits = {
            'init': null,
        };
        this.props = {
            'modelValue': '',
            'css': '',
        };
        this.notInit = false;
        this.isLoading = true;
        this.html = '';
    }
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

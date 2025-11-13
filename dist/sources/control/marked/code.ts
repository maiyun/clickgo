import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'init': null,
    };

    public props: {
        'modelValue': string;
        'css': string;
    } = {
            'modelValue': '',
            'css': '',
        };

    public notInit = false;

    public isLoading = true;

    public html = '';

    public async onMounted(): Promise<void> {
        const makred = await clickgo.core.getModule('@toast-ui/editor');
        if (!makred) {
            // --- 没有成功 ---
            this.isLoading = false;
            this.notInit = true;
            return;
        }
        // --- 监听上面的值的变动 ---
        this.watch('modelValue', (v: string) => {
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

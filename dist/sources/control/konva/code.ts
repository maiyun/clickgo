import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'failed': null,
        'init': null,
    };

    public access: {
        /** --- 终端控件对象 --- */
        'konva': any;
    } = {
            'konva': undefined
        };

    public async onMounted(): Promise<void> {
        const konva = await clickgo.core.getModule('konva');
        if (!konva) {
            // --- 没有成功 ---
            this.emit('failed');
            return;
        }
        this.access.konva = konva;
        // --- 初始化成功 ---
        this.emit('init', this.access.konva);
    }

}

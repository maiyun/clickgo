import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    emits = {
        'failed': null,
        'init': null,
    };
    access = {
        'konva': undefined
    };
    async onMounted() {
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

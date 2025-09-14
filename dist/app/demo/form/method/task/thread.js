import * as clickgo from 'clickgo';
export default class extends clickgo.task.AbstractThread {
    main(data) {
        console.log('Thread main', data);
        this.send({
            'custom': 'main',
            'data': data,
        });
        return;
    }
    onMessage(e) {
        console.log('Thread onMessage', e.data);
        setTimeout(() => {
            // --- 模拟处理等待 ---
            this.send({
                'custom': 'msg',
                'done': e.data,
            });
        }, 1_500);
    }
    onEnded() {
        console.log('Thread ended.');
        return;
    }
}

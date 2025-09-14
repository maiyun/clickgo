import * as clickgo from 'clickgo';

export default class extends clickgo.task.AbstractThread {

    public main(data: Record<string, any>): void {
        console.log('Thread main', data);
        this.send({
            'custom': 'main',
            'data': data,
        });
        return;
    }

    public onMessage(e: MessageEvent): void {
        console.log('Thread onMessage', e.data);
        setTimeout(() => {
            // --- 模拟处理等待 ---
            this.send({
                'custom': 'msg',
                'done': e.data,
            });
        }, 1_500);
    }

    public onEnded(): void {
        console.log('Thread ended.');
        return;
    }

}

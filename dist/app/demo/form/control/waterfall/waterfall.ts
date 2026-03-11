import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public data: any[] = [];

    public sizes: Record<string, number> = {};

    public columns: number = 3;

    public onMounted(): void {
        for (let i = 0; i < 20; i++) {
            this.addData();
        }
    }

    public addData(): void {
        const id = (this.data.length + 1).toString();
        // --- 随机生成 100 - 250 之间的高度 ---
        const height = clickgo.tool.rand(100, 250);
        this.data.push({
            'id': id
        });
        this.sizes[id] = height;
    }

}

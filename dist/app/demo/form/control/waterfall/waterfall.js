import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    data = [];
    sizes = {};
    columns = 3;
    onMounted() {
        for (let i = 0; i < 20; i++) {
            this.addData();
        }
    }
    addData() {
        const id = (this.data.length + 1).toString();
        // --- 随机生成 100 - 250 之间的高度 ---
        const height = clickgo.tool.rand(100, 250);
        this.data.push({
            'id': id
        });
        this.sizes[id] = height;
    }
}

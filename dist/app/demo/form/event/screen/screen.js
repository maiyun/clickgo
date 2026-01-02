import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    width = 0;
    height = 0;
    scale = 4;
    list = [];
    onScreenResize() {
        const area = clickgo.core.getAvailArea();
        this.width = area.width;
        this.height = area.height;
        if (this.width > 1100 || this.height > 1100) {
            this.scale = 5;
        }
        else if (this.width < 420 || this.height < 420) {
            this.scale = 3;
        }
        else {
            this.scale = 4;
        }
        const date = new Date();
        this.list.unshift({
            'time': date.getHours().toString() + ':' + date.getMinutes().toString() + ':' + date.getSeconds().toString(),
            'width': area.width,
            'height': area.height
        });
    }
    onMounted() {
        const area = clickgo.core.getAvailArea();
        this.width = area.width;
        this.height = area.height;
        if (this.width > 1100 || this.height > 1100) {
            this.scale = 5;
        }
        else if (this.width < 420 || this.height < 420) {
            this.scale = 3;
        }
        else {
            this.scale = 4;
        }
        const date = new Date();
        this.list.unshift({
            'time': date.getHours().toString() + ':' + date.getMinutes().toString() + ':' + date.getSeconds().toString(),
            'width': this.width,
            'height': this.height
        });
    }
}

import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    lineCount = 2;
    style = false;
    direction = 'top';
    changeDirection() {
        switch (this.direction) {
            case 'top': {
                this.direction = 'bottom';
                break;
            }
            case 'bottom': {
                this.direction = 'left';
                break;
            }
            case 'left': {
                this.direction = 'right';
                break;
            }
            default: {
                this.direction = 'top';
            }
        }
    }
}

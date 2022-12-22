import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public lineCount = 2;

    public style = false;

    public direction = 'top';

    public changeDirection(): void {
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

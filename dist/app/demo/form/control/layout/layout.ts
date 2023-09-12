import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public direction = ['h'];

    public bigColor = false;

    public media = [];

    public mediaVal = -1;

    public gutter = [0];

    public onMedia(v: number): void {
        this.mediaVal = v;
        switch (v) {
            case 450: {
                this.direction[0] = 'h';
                this.bigColor = true;
                break;
            }
            case 300:
            case -1: {
                this.direction[0] = 'h';
                this.bigColor = false;
                break;
            }
            default: {
                this.direction[0] = 'v';
                this.bigColor = false;
            }
        }
    }

}

import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public alayout: any = null;

    public get gap(): string {
        if (!this.alayout?.propNumber) {
            return '0';
        }
        return this.alayout.propNumber('gutter') + 'px';
    }

    public onMounted(): void {
        this.alayout = this.parentByName('alayout');
    }

}

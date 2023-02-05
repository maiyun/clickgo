import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public desc: any = null;

    public get isBorder(): boolean {
        return this.desc?.propBoolean?.('border') ? true : false;
    }

    public onMounted(): void | Promise<void> {
        this.desc = this.parentByName('desc');
    }

}

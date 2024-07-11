import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public desc: any = null;

    public get isBorder(): boolean {
        return this.desc?.propBoolean?.('border') ? true : false;
    }

    public get size(): string {
        return this.desc?.props.size;
    }

    public get plain(): boolean {
        return this.desc?.propBoolean('plain');
    }

    public onMounted(): void | Promise<void> {
        this.desc = this.parentByName('desc');
    }

}

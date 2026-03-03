import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public desc: any = null;

    public descRow: any = null;

    public get isBorder(): boolean {
        return this.desc?.propBoolean?.('border') ? true : false;
    }

    public get size(): string {
        return this.desc?.props.size;
    }

    public get plain(): boolean {
        return this.desc?.propBoolean('plain');
    }

    public get isRowlr(): boolean {
        return this.desc?.propBoolean?.('rowlr') ? true : false;
    }

    public get isHover(): boolean {
        if (!this.descRow?.propBoolean?.('hover')) {
            return false;
        }
        return this.descRow?.hovered ? true : false;
    }

    public onMounted(): void | Promise<void> {
        this.desc = this.parentByName('desc');
        this.descRow = this.parentByName('desc-row');
    }

}

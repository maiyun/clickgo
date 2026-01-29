import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        'stripe': boolean | string;
        'nopadding': boolean | string;
        'colspan': number | string;
        'rowspan': number | string;
    } = {
            'stripe': false,
            'nopadding': false,
            'colspan': 1,
            'rowspan': 1,
        };

    public desc: any = null;

    public descRow: any = null;

    public get isBorder(): boolean {
        return this.desc?.propBoolean?.('border') ? true : false;
    }

    public get size(): string {
        return this.desc?.props.size;
    }

    public get plain(): boolean {
        return this.desc?.propBoolean?.('plain') ? true : false;
    }

    /** --- 上层是 stripe 或本层是 stripe --- */
    public get isStripe(): boolean {
        return this.desc?.propBoolean('stripe') ?
            true :
            (this.descRow?.propBoolean('stripe') ?
                true :
                this.propBoolean('stripe')
            );
    }

    public onMounted(): void | Promise<void> {
        this.desc = this.parentByName('desc');
        this.descRow = this.parentByName('desc-row');
    }

}

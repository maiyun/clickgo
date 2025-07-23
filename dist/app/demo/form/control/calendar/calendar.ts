import * as clickgo from 'clickgo';
import * as types from '~/types';

export default class extends clickgo.form.AbstractForm {

    public mv: string[] = [];

    public ym: string = '';

    public bottom: boolean = false;

    public left: boolean = false;

    public disabled: boolean = false;

    public plain: boolean = false;

    public start: boolean = false;

    public end: boolean = false;

    public dlist: boolean = false;

    public selected: string = '';

    public onChanged(): void {
        console.log('onChanged', JSON.stringify(this.mv));
    }

    public onSelected(e: types.ICalendarSelectedEvent): void {
        this.selected = e.detail.value;
    }

}

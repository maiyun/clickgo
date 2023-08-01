import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public date: boolean = true;

    public time: boolean = true;

    public zone: boolean = true;

    public ts: number = 0;

    public disabled: boolean = false;

}

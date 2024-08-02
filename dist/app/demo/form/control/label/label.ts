import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public daten: number = 1672599845;

    public date: boolean = true;

    public time: boolean = true;

    public zone: boolean = true;

    public tz: string[] = ['08'];

    public addDate(): void {
        this.daten += clickgo.tool.rand(0, 3600);
    }

    /** --- 是否可复制 --- */
    public copy = false;

}

import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public changeValue: number = 35;

    public disabled = false;

    public inputValue: number = 35;

    public label = 'Zoom';

    public max = '100';

    public min = '0';

    public showValue = true;

    public size: Array<'s' | 'm' | 'l'> = ['m'];

    public step = '5';

    public value: number | string = 35;

    /**
     * --- 记录持续输入事件 ---
     * @param value 当前值
     */
    public onInput(value: number): void {
        this.inputValue = value;
    }

    /**
     * --- 记录操作完成事件 ---
     * @param value 最终值
     */
    public onChange(value: number): void {
        this.changeValue = value;
    }

}

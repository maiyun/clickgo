import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public radio = 'radio1';

    public check1 = true;

    public check2 = false;

    public check3 = true;

    public onCheck(event: Event): void {
        event.preventDefault();
    }

    public async onRadio(event: Event, o: string, n: string): Promise<void> {
        if (o !== 'radio2') {
            return;
        }
        event.preventDefault();
        await clickgo.form.dialog(this, 'When the value is set to "radio2," this option cannot be selected. Now is: ' + n);
    }

    public async dialogClick(): Promise<void> {
        await clickgo.form.dialog(this, 'Dialog from menu item clicked.');
    }

}

import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public value = 'radio1';

    public disabled = false;

    public async onChange(e: Event, o: string, n: string): Promise<void> {
        if (o !== 'radio2') {
            return;
        }
        e.preventDefault();
        await clickgo.form.dialog('o: ' + o + ', n: ' + n);
    }

}

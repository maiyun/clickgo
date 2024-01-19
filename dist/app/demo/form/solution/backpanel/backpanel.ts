import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public fd: string = '';

    public onMounted(): void {
        this.watch('formHash', () => {
            this.fd = this.formHash;
        });
    }

}

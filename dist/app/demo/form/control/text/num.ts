import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public value = 2007;

    public onMounted(data: Record<string, any>): void | Promise<void> {
        this.value = data['value'] ?? 2027;
    }

}

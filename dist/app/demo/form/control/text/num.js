import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    value = 2007;
    onMounted(data) {
        this.value = data['value'] ?? 2027;
    }
}

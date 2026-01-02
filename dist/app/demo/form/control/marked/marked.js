import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    html = '';
    text = 'a**b**c';
    size = ['12px'];
    family = false;
    async onMounted() {
        await clickgo.core.getModule('marked');
        this.watch('text', (v) => {
            this.html = clickgo.modules.marked.parse(v);
        }, {
            'immediate': true,
        });
    }
}

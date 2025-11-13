import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.html = '';
        this.text = 'a**b**c';
        this.size = ['12px'];
        this.family = false;
    }
    async onMounted() {
        await clickgo.core.getModule('marked');
        this.watch('text', (v) => {
            this.html = clickgo.modules.marked.parse(v);
        }, {
            'immediate': true,
        });
    }
}

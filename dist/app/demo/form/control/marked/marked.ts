import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public html = '';

    public text = 'a**b**c';

    public size = ['12px'];

    public family = false;

    public async onMounted(): Promise<void> {
        await clickgo.core.getModule('marked');
        this.watch('text', (v: string) => {
            this.html = clickgo.modules.marked.parse(v);
        }, {
            'immediate': true,
        });
    }

}

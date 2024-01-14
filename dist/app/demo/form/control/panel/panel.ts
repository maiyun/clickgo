import * as clickgo from 'clickgo';
import test1 from './test1';

export default class extends clickgo.form.AbstractForm {

    public selected: string[] = ['none'];

    public parentData = 'yeah!';

    public loading = false;

    public async go(): Promise<void> {
        this.loading = true;
        await this.refs.panel.go(test1, {
            'type': 'show'
        });
        this.loading = false;
    }

    public ssend(): void {
        this.refs.panel.send({
            'type': 'send'
        });
    }

    public onMounted(): void {
        this.watch('selected', async (): Promise<void> => {
            switch (this.selected[0]) {
                case 'none': {
                    break;
                }
                case './test1': {
                    this.loading = true;
                    await this.refs.panel.go(test1);
                    this.loading = false;
                    break;
                }
                case './test2': {
                    this.loading = true;
                    await this.refs.panel.go('./test2');
                    this.loading = false;
                    break;
                }
            }
        }, {
            'deep': true,
            'immediate': true
        });
    }

}

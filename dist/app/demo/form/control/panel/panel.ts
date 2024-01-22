import * as clickgo from 'clickgo';
import test1 from './test1';

export default class extends clickgo.form.AbstractForm {

    public selected: string[] = ['none'];

    /** --- panel de mv --- */
    public panelv: string = '';

    public parentData = 'yeah!';

    /** --- 当前的 map 模式 --- */
    public map: Record<string, string | (new () => clickgo.form.AbstractPanel)> | null = null;

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

    public changeMap(): void {
        this.map = this.map ? null : {
            'test1': test1,
            'test2': './test2'
        };
    }

    public onMounted(): void {
        this.watch('selected', async (): Promise<void> => {
            switch (this.selected[0]) {
                case 'none': {
                    if (this.map) {
                        this.panelv = '';
                    }
                    break;
                }
                case './test1': {
                    if (this.map) {
                        this.panelv = 'test1';
                    }
                    else {
                        this.loading = true;
                        await this.refs.panel.go(test1);
                        this.loading = false;
                    }
                    break;
                }
                case './test2': {
                    if (this.map) {
                        this.panelv = 'test2';
                    }
                    else {
                        this.loading = true;
                        await this.refs.panel.go('./test2');
                        this.loading = false;
                    }
                    break;
                }
            }
        }, {
            'deep': true,
            'immediate': true
        });
    }

}

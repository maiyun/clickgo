import * as clickgo from 'clickgo';
import test1 from './test1';

export default class extends clickgo.form.AbstractForm {

    public selected: string[] = ['none'];

    public go(): void {
        this.refs.panel.go(test1, {
            'type': 'show'
        });
    }

    public ssend(): void {
        this.refs.panel.send({
            'type': 'send'
        });
    }

    public onMounted(): void {
        this.watch('selected', () => {
            switch (this.selected[0]) {
                case 'none': {
                    break;
                }
                case './test1': {
                    this.refs.panel.go(test1);
                    break;
                }
                case './test2': {
                    this.refs.panel.go('./test2');
                    break;
                }
            }
        }, {
            'deep': true,
            'immediate': true
        });
    }

}

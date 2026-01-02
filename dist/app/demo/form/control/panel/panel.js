import * as clickgo from 'clickgo';
import test1 from './test1';
export default class extends clickgo.form.AbstractForm {
    selected = ['none'];
    /** --- panel de mv --- */
    panelv = '';
    parentData = 'yeah!';
    plain = false;
    /** --- 当前的 map 模式 --- */
    map = null;
    async go() {
        this.loading = true;
        await this.refs.panel.go(test1, {
            'type': 'show'
        });
        this.loading = false;
    }
    ssend() {
        this.refs.panel.send({
            'type': 'send'
        });
    }
    changeMap() {
        this.map = this.map ? null : {
            'test1': test1,
            'test2': './test2'
        };
    }
    onMounted() {
        this.watch('selected', async () => {
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

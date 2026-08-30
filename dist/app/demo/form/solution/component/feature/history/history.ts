import * as clickgo from 'clickgo';

import type { IHistoryState } from '../../model';

export default class extends clickgo.form.AbstractComponent {

    public props: {
        'state': IHistoryState;
    } = {
            'state': {
                'redo': 0,
                'stroke': 0,
                'undo': 0
            }
        };

    /** --- 本组件实例首次挂载时间 --- */
    public mountedAt = '';

    public onMounted(): void {
        this.mountedAt = new Date().toLocaleTimeString();
    }

}

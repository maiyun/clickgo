import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractComponent {
    props = {
        'state': {
            'redo': 0,
            'stroke': 0,
            'undo': 0
        }
    };
    /** --- 本组件实例首次挂载时间 --- */
    mountedAt = '';
    onMounted() {
        this.mountedAt = new Date().toLocaleTimeString();
    }
}

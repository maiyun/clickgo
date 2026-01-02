import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    plain = false;
    bg = ['dot'];
    anistart() {
        console.log('anistart');
    }
    aniend() {
        console.log('aniend');
    }
    onMounted() {
        this.refs.objviewer.addLine({
            'start': {
                'obj': this.refs['objviewer-item-1'],
                'pos': 'r',
            },
            'end': {
                'obj': this.refs['objviewer-item-2'],
                'pos': 'l',
            },
        });
        this.refs.objviewer.addLine({
            'start': {
                'obj': this.refs['objviewer-item-3'],
                'pos': 'r',
            },
            'end': {
                'obj': this.refs['objviewer-item-4'],
                'pos': 't',
            },
            'hue': '160',
            'stroke': 'down',
        });
        this.refs.objviewer.addLine({
            'start': {
                'obj': this.refs['objviewer-item-6'],
                'pos': 'b',
            },
            'end': {
                'obj': this.refs['objviewer-item-5'],
                'pos': 't',
            },
            'hue': '80',
            'stroke': 'up',
        });
    }
}

import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.val1 = {
            'id1': {
                'type': 'rect',
                'width': 150,
                'height': 120,
                'x': 40,
                'y': 20
            }
        };
        this.id = 0;
        this.selected = [];
        this.val2 = {
            'btn': {
                'type': 'rect',
                'width': 150,
                'height': 120,
                'x': 40,
                'y': 20
            }
        };
    }
    add() {
        this.val2['tmp' + (++this.id).toString()] = {
            'type': 'rect',
            'width': clickgo.tool.rand(50, 150),
            'height': clickgo.tool.rand(50, 150),
            'x': clickgo.tool.rand(0, 200),
            'y': clickgo.tool.rand(0, 200)
        };
    }
    remove() {
        for (const id in this.val2) {
            delete this.val2[id];
            break;
        }
    }
    up() {
        for (const item of this.selected) {
            this.val2[item].index = 999;
        }
    }
    down() {
        for (const item of this.selected) {
            this.val2[item].index = 0;
        }
    }
}

import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public val1 = {
        'id1': {
            'type': 'rect',
            'width': 150,
            'height': 120,
            'x': 40,
            'y': 20
        }
    };

    public id: number = 0;

    public val2: Record<string, any> = {
        'btn': {
            'type': 'rect',
            'width': 150,
            'height': 120,
            'x': 40,
            'y': 20
        }
    };

    public add(): void {
        this.val2['tmp' + (++this.id).toString()] = {
            'type': 'rect',
            'width': clickgo.tool.rand(50, 150),
            'height': clickgo.tool.rand(50, 150),
            'x': clickgo.tool.rand(0, 200),
            'y': clickgo.tool.rand(0, 200)
        };
    }

    public remove(): void {
        for (const id in this.val2) {
            delete this.val2[id];
            break;
        }
    }

}

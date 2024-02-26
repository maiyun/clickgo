import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        'title': string;

        'direction': 'h' | 'v';
        'gutter': number | string;
        'alignH': string;
        'alignV': string;
    } = {
            'title': '',

            'direction': 'h',
            'gutter': '',
            'alignH': '',
            'alignV': ''
        };
    
    

}

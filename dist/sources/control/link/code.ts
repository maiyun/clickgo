import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        'url': string;
        'plain': boolean | string;
    } = {
            'url': '',
            'plain': false
        };

    public keydown(e: KeyboardEvent): void {
        if (e.key !== 'Enter') {
            return;
        }
        // --- 回车 ---
        e.preventDefault();
        this.element.click();
    }

}

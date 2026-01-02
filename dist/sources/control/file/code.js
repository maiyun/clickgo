import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    emits = {
        'change': null
    };
    props = {
        'accept': [],
        'multi': false,
        'dir': false
    };
    get acceptComp() {
        const accept = [];
        for (const item of this.propArray('accept')) {
            accept.push('.' + item);
        }
        return accept.join(',');
    }
    // --- method ---
    select() {
        this.refs.input.click();
    }
    change(e) {
        e.stopPropagation();
        const inputEl = this.refs.input;
        const files = [];
        if (inputEl.files) {
            for (const file of inputEl.files) {
                files.push(file);
            }
        }
        this.emit('change', files);
        inputEl.value = '';
    }
}

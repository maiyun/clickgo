import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.r = {
            'cols': 0,
            'rows': 0,
            'width': 0,
            'height': 0
        };
        this.access = {
            'term': undefined
        };
        /** --- input --- */
        this.input = '';
    }
    onData(data) {
        switch (data) {
            case '\u0003': { // Ctrl+C
                this.access.term.writeln('^C');
                this.access.term.write('~$ ');
                this.input = '';
                break;
            }
            case '\r': { // Enter
                this.access.term.writeln('');
                if (this.input.length > 0) {
                    this.access.term.writeln(`${this.input}: command not found`);
                }
                this.access.term.write('~$ ');
                this.input = '';
                break;
            }
            case '\u007F': { // Backspace (DEL)
                if (this.input.length === 0) {
                    break;
                }
                this.input = this.input.slice(0, -1);
                this.access.term.write('\b \b');
                break;
            }
            default: { // Print all other characters for demo
                if ((data >= String.fromCharCode(0x20) && data <= String.fromCharCode(0x7E)) || (data === '\u00a0')) {
                    for (const item of data) {
                        if (this.input.length < 15) {
                            this.input += item;
                            this.access.term.write(item);
                        }
                    }
                }
                else {
                    console.log('data', data);
                }
            }
        }
    }
    onInit(term) {
        this.access.term = term;
        this.access.term.write('~$ ');
        this.access.term.focus();
    }
    onResize(r) {
        this.r = r;
    }
}

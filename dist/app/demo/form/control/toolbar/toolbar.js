import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    commands = ['New', 'Open', 'Save', 'Undo', 'Redo', 'Preview', 'Export'];
    border = true;
    plain = false;
    scroll = true;
    message = 'Ready';
    run(command) {
        this.message = command;
    }
}

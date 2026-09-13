import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public commands = ['New', 'Open', 'Save', 'Undo', 'Redo', 'Preview', 'Export'];

    public border = true;

    public plain = false;

    public scroll = true;

    public message = 'Ready';

    public run(command: string): void {
        this.message = command;
    }

}

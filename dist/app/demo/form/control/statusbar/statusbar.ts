import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public border = true;

    public separator = true;

    public grow = false;

    public message = 'Ready';

    public online = true;

    public plain = false;

    public scroll = true;

    public showRight = true;

    public type: Array<'default' | 'primary' | 'info' | 'warning' | 'danger' | 'cg'> = ['primary'];

}

import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public cache = true;

    public collapsible = true;

    public expanded = true;

    public grow = true;

    public groupCollapsed = false;

    public historyTab = 'history';

    public lazy = true;

    public optionTab = 'project';

    public position: Array<'left' | 'right'> = ['left'];

    public width = '240';

}

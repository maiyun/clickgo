import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        'html': string;
        'css': string;
    } = {
            'html': '',
            'css': ''
        };

    public htmlPrep: string = '';

    // --- 编译后的布局标签列 ---
    public get layout(): string {
        let layout = this.props.html;
        if (!layout) {
            return '';
        }
        layout = layout.replace(/ on(\w+=)/gi, ' data-on$1');
        layout = layout.replace(/<style>[\s\S]*?<\/style>/gi, '');
        layout = layout.replace(/<script>[\s\S]*?<\/script>/gi, '');
        layout = clickgo.tool.layoutAddTagClassAndReTagName(layout, false);
        layout = clickgo.tool.layoutClassPrepend(layout, [this.htmlPrep + '_']);
        return layout;
    }

    // --- 编译后的样式表 ---
    public get style(): string {
        if (!this.props.css) {
            return '';
        }
        return clickgo.tool.stylePrepend(this.props.css, this.htmlPrep + '_').style;
    }

    public onMounted(): void | Promise<void> {
        this.htmlPrep = 'cg-hscope' + Math.round(Math.random() * 1000000000000000).toString();
    }

}

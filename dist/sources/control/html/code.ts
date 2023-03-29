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
        /** --- 加入尾随 --- */
        const after = (list: string[], after: string): string => {
            const rtn: string[] = [];
            for (const item of list) {
                rtn.push(item + after);
            }
            return rtn.join(',');
        };
        /** --- 预设 css --- */
        const pre: string[] = [];

        /** --- 按钮类 --- */
        const buttons = ['input[type=submit]', 'input[type=button]', 'button'];
        pre.push(buttons.join(',') + '{border:solid .5px var(--g-border-color);background:var(--g-background);color:inherit;font:inherit;padding:var(--g-padding);border-radius:var(--g-radius);outline:dotted .5px transparent;outline-offset:-4px;line-height:inherit;}');
        pre.push(after(buttons, ':hover') + '{border:solid .5px var(--g-border-color-hover);background:var(--g-background-hover);color:var(--g-color-hover)}');
        pre.push(after(buttons, ':active') + '{border:solid .5px var(--g-border-color-active);background:var(--g-background-active);color:var(--g-color-active)}');
        pre.push(after(buttons, ':focus:not(:active):not(:hover)') + '{border:solid .5px var(--g-border-color-focus);background:var(--g-background-focus);color:var(--g-color-focus)}');
        pre.push(after(buttons, ':focus') + '{outline-color:var(--g-border-color)}');
        pre.push(after(buttons, ':disabled') + '{border:solid .5px var(--g-border-color-disabled);background:var(--g-background-disabled);color:var(--g-color-disabled)}');

        /** --- 输入框类 --- */
        const texts = ['input:not([type])', 'input[type=text]', 'input[type=password]', 'input[type=email]', 'input[type=url]', 'input[type=tel]', 'input[type=search]', 'input[type=color]', 'input[type=number]'];
        pre.push(texts.join(',') + '{border:solid .5px var(--g-plain-border-color);background:var(--g-plain-background);color:inherit;font:inherit;padding:var(--g-padding);border-radius:var(--g-radius);outline:none;line-height:inherit}');
        pre.push(after(texts, ':hover') + '{border:solid .5px var(--g-plain-border-color-hover)}');
        pre.push(after(texts, ':active') + '{border:solid .5px var(--g-plain-border-color-active)}');
        pre.push(after(texts, ':focus:not(:active):not(:hover)') + '{border:solid .5px var(--g-plain-border-color-focus)}');
        pre.push(after(texts, ':disabled') + '{border:solid .5px var(--g-plain-border-color-disabled);background:var(--g-plain-background-disabled);color:var(--g-plain-color-disabled)}');

        return clickgo.tool.stylePrepend(pre.join('') + (this.props.css ? this.props.css : ''), this.htmlPrep + '_').style;
    }

    public onMounted(): void | Promise<void> {
        this.htmlPrep = 'cg-hscope' + Math.round(Math.random() * 1000000000000000).toString();
    }

}

import * as clickgo from 'clickgo';
import * as types from '~/types';

export default class extends clickgo.control.AbstractControl {
    
    public emits = {
        'init': null,

        'update:modelValue': null
    };

    public props: {
        'modelValue': string;
        'text': string;
        'css': string;
    } = {
            'modelValue': '',
            'text': '',
            'css': ''
        };

    public notInit = false;

    public isLoading = true;

    public access: {
        /** --- 终端控件对象 --- */
        'markdownit': any;
        /** --- 创建的准备 render 的对象 --- */
        'md': any;
    } = {
            'markdownit': undefined,
            'md': undefined
        };
    
    /** --- 渲染后的 html --- */
    public value: string = '';

    public async onMounted(): Promise<void> {
        const markdownit = await clickgo.core.getModule('markdownit');
        if (!markdownit) {
            // --- 没有成功 ---
            this.isLoading = false;
            this.notInit = true;
            return;
        }
        this.access.md = markdownit({
            'html': true,
            'linkify': true,
            'typographer': true,
            'breaks': true
        });
        // --- 监听 modelValue 变动 ---
        this.watch('text', () => {
            const text = this.props.text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/<br[ /]*>\n/ig, '\n').replace(/\n{3,}/g, '\n\n').replace(/(^|\n)(.+?)($|\n)/g, (t: string, t1: string) => {
                if (t.includes('<') && t.includes('>')) {
                    return t + '\n\n';
                }
                return t;
            });
            this.value = this.access.md.render(text);
            this.emit('update:modelValue', this.value);
        }, {
            'immediate': true
        });
        // --- 初始化成功 ---
        this.isLoading = false;
        this.emit('init', this.access.markdownit);
    }

}
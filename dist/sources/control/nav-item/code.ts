import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        'label': string;
        'name': string;
        'show': boolean | string;
    } = {
            'label': '',
            'name': '',
            'show': false
        };

    public showData = false;

    /** --- 是否是嵌套中的 nav-item --- */
    public isChild = false;

    /** --- nav 控件 --- */
    public nav: any = {};

    /** --- 是否有子项 --- */
    public get hasChild(): boolean {
        return this.slotsAll('default').length ? true : false;
    }

    /** --- name 应该值，name 为空则为 label 值 --- */
    public get overName(): string {
        return this.props.name === '' ? this.props.label : this.props.name;
    }

    /** --- 当前选择的 label 字符串 --- */
    public get selected(): string {
        return this.nav.selected ?? '';
    }

    /** --- 当前是否是选中状态 --- */
    public get isSelected(): boolean {
        if (this.selected === this.overName) {
            return true;
        }
        return false;
    }

    // --- 展开或收缩菜单 ---
    public click(): void {
        if (!this.hasChild) {
            // --- 没有子项，是选择 ---
            if (this.isSelected) {
                return;
            }
            this.nav.select(this.overName);
            return;
        }
        this.showData = !this.showData;
        this.emit('update:show', this.showData);
    }

    public onMounted(): void | Promise<void> {
        this.watch('show', () => {
            if (!this.hasChild) {
                return;
            }
            this.showData = this.propBoolean('show');
        }, {
            'immediate': true
        });

        this.watch('showData', async () => {
            if (!this.hasChild) {
                return;
            }
            if (this.showData) {
                this.refs.menu.style.height = (this.refs.menu.children[0] as HTMLElement).offsetHeight.toString() + 'px';
                await clickgo.tool.sleep(150);
                this.refs.menu.style.height = '';
            }
            else {
                this.refs.menu.style.height = this.refs.menu.offsetHeight.toString() + 'px';
                await clickgo.tool.sleep(50);
                this.refs.menu.style.height = '0';
            }
        });
        if (this.hasChild && !this.showData) {
            this.refs.menu.style.height = '0';
        }

        if (this.parentByName('nav-item')) {
            this.isChild = true;
        }

        this.watch('isSelected', () => {
            if (!this.isSelected) {
                return;
            }
            let parent = this.parentByName('nav-item');
            while (parent) {
                if (!parent.showData) {
                    parent.showData = true;
                    parent.emit('update:show', parent.showData);
                }
                parent = parent.parentByName('nav-item');
            }
        });

        this.nav = this.parentByName('nav');
    }

}

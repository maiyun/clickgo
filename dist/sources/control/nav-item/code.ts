import * as clickgo from 'clickgo';
import * as types from '~/types';

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'select': null
    };

    public props: {
        /** --- 仅仅为显示的名字，若 name 不存在，则这个成了 name --- */
        'label': string;
        /** --- 一般为 panel 名，可带类似 ?a=b 的 qs --- */
        'name': string;
        'icon': string;
        'show': boolean | string;
    } = {
            'label': '',
            'name': '',
            'icon': '',
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

    /** --- 当前正在选择的 name 字符串 --- */
    public get selected(): string {
        return this.nav.selected ?? '';
    }

    /**
     * --- 当前是否是选中状态 ---
     * --- 如果 name 和 qs 完全相等，则一定选中 ---
     * --- 当前没有 qs：如果同 name 没有相同 sqs，则本条就被选中，否则不管 ---
     * --- 当前有 qs：qs 相等，那么选中，不相等，就不会被选中 ---
     */
    public get isSelected(): boolean {
        if (this.selected === this.overName) {
            return true;
        }
        const selecteda = this.selected.split('?');
        const namea = this.overName.split('?');
        if (selecteda[0] !== namea[0]) {
            return false;
        }
        if (namea[1]) {
            // --- 当前有 qs，上面却没选择自己，那必然不是自己 ---
            return false;
        }
        // --- 当前没 qs ---
        if (!selecteda[1]) {
            // --- 选中的也没 qs ---
            return true;
        }
        // --- 选中的有 qs，那得看有没有带 qs 一致的，有的话，自己不会被选中 ---
        if (this.nav.childs.includes(this.selected)) {
            return false;
        }
        return true;
    }

    // --- 展开或收缩菜单 ---
    public click(): void {
        if (!this.hasChild) {
            // --- 没有子项，是选择 ---
            if (this.isSelected) {
                return;
            }
            const event: types.INavItemSelectEvent = {
                'go': true,
                preventDefault: function() {
                    this.go = false;
                },
                'detail': {
                    'name': this.overName,
                    'selected': this.selected
                }
            };
            this.emit('select', event);
            if (event.go) {
                this.nav.select(this.overName);
            }
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

        // --- 监听展示状态 ---
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

        // --- 判断是不是子项 ---
        if (this.parentByName('nav-item')) {
            this.isChild = true;
        }

        // --- 选中状态改变 ---
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

        // --- 监听 name 的变动 ---
        this.watch('overName', (n, o) => {
            const io = this.nav.childs.indexOf(o);
            this.nav.childs.splice(io, 1);
            this.nav.childs.push(n);
        });

        // --- 更新到顶层 ---
        this.nav = this.parentByName('nav');
        this.nav.childs.push(this.overName);
    }

    public onUnmounted(): void | Promise<void> {
        const io = this.nav.childs.indexOf(this.overName);
        this.nav.childs.splice(io, 1);
    }

}

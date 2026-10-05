import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    props = {
        'icon': '',
        'label': '',
        'showLabel': 'auto',
        'opened': false,
        'disabled': false
    };
    emits = {
        // --- ClickGo 将调用方的 @click 编译为 @tap，声明后避免原生冒泡重复激活。 ---
        'tap': null
    };
    /** --- 空格按住状态独立于调用方传入的菜单打开状态 --- */
    isSpaceDown = false;
    /** --- 默认由主题决定文字显隐；显式参数优先 --- */
    get labelMode() {
        if (this.props.showLabel === 'auto') {
            return 'auto';
        }
        return this.propBoolean('showLabel') ? 'show' : 'hide';
    }
    /** --- 跟随所在任务栏的位置 --- */
    get position() {
        return this.parentByName('task')?.position ?? 'bottom';
    }
    /** --- 跟随所在任务栏的显示模式 --- */
    get mode() {
        return this.parentByName('task')?.mode ?? 'bar';
    }
    /**
     * --- 保留独立指针操作，不触发任务栏背景菜单 ---
     * @param e 指针事件
     * @returns 无返回值
     */
    down(e) {
        e.stopPropagation();
        if (this.propBoolean('disabled')) {
            e.preventDefault();
        }
    }
    /**
     * --- 只发送操作，由调用方打开自己的菜单或 Launcher ---
     * @param e 点击事件
     * @returns 无返回值
     */
    click(e) {
        e.stopPropagation();
        if (this.propBoolean('disabled')) {
            return;
        }
        this.emit('tap', e);
    }
    /**
     * --- Enter 激活；空格按住期间显示按下状态 ---
     * @param e 键盘事件
     * @returns 无返回值
     */
    keydown(e) {
        if (this.propBoolean('disabled') || e.isComposing) {
            return;
        }
        if (e.key !== 'Enter' && e.key !== ' ') {
            return;
        }
        e.preventDefault();
        if (e.repeat) {
            return;
        }
        if (e.key === 'Enter') {
            // --- 模板中的指针点击由框架转为 tap，键盘应直接发送控件事件。 ---
            this.click(e);
        }
        else {
            this.isSpaceDown = true;
        }
    }
    /**
     * --- 空格释放后激活；失焦或禁用后不补发点击 ---
     * @param e 键盘事件
     * @returns 无返回值
     */
    keyup(e) {
        if (e.key !== ' ' || !this.isSpaceDown) {
            return;
        }
        e.preventDefault();
        this.isSpaceDown = false;
        if (!this.propBoolean('disabled')) {
            this.click(e);
        }
    }
    /**
     * --- 禁用期间取消尚未完成的键盘操作 ---
     * @returns 无返回值
     */
    onMounted() {
        this.watch('disabled', () => {
            if (this.propBoolean('disabled')) {
                this.isSpaceDown = false;
            }
        });
    }
}

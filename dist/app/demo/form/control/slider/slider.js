import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    changeValue = 35;
    disabled = false;
    inputValue = 35;
    label = 'Zoom';
    max = '100';
    min = '0';
    showValue = true;
    size = ['m'];
    step = '5';
    value = 35;
    /**
     * --- 记录持续输入事件 ---
     * @param value 当前值
     */
    onInput(value) {
        this.inputValue = value;
    }
    /**
     * --- 记录操作完成事件 ---
     * @param value 最终值
     */
    onChange(value) {
        this.changeValue = value;
    }
}

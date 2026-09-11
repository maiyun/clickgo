import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'input': null,
        'change': null,
        'update:modelValue': null
    };

    public props: {
        /** --- disabled，是否禁用滑块交互 --- */
        'disabled': boolean | string;
        /** --- label，滑块提供给辅助技术识别的名称 --- */
        'label': string;
        /** --- max，滑块允许选择的最大值 --- */
        'max': number | string;
        /** --- min，滑块允许选择的最小值 --- */
        'min': number | string;
        /** --- modelValue，滑块当前选择的数值 --- */
        'modelValue': number | string;
        /** --- showValue，是否在滑块右侧显示当前值 --- */
        'showValue': boolean | string;
        /** --- size，滑块控制点的尺寸 --- */
        'size': 's' | 'm' | 'l';
        /** --- step，滑块每次调整的数值步长 --- */
        'step': number | string;
    } = {
            'disabled': false,
            'label': '',
            'max': 100,
            'min': 0,
            'modelValue': 0,
            'showValue': false,
            'size': 'm',
            'step': 1
        };

    /** --- 有效最小值 --- */
    public get minComp(): number {
        const min = this.propNumber('min');
        return Number.isFinite(min) ? min : 0;
    }

    /** --- 有效最大值，不小于最小值 --- */
    public get maxComp(): number {
        const max = this.propNumber('max');
        return Number.isFinite(max) ? Math.max(this.minComp, max) : Math.max(this.minComp, 100);
    }

    /** --- 有效步长 --- */
    public get stepComp(): number {
        const step = this.propNumber('step');
        return Number.isFinite(step) && (step > 0) ? step : 1;
    }

    /** --- 修正到范围和步长后的当前值 --- */
    public get valueComp(): number {
        const value = this.propNumber('modelValue');
        const current = Number.isFinite(value) ? value : this.minComp;
        const clamped = Math.min(this.maxComp, Math.max(this.minComp, current));
        const stepped = this.minComp + Math.round((clamped - this.minComp) / this.stepComp) * this.stepComp;
        return Math.min(this.maxComp, Math.max(this.minComp, Number(stepped.toPrecision(12))));
    }

    /** --- 当前值在轨道上的百分比 --- */
    public get progressComp(): string {
        if (this.maxComp === this.minComp) {
            return '0%';
        }
        return `${(this.valueComp - this.minComp) / (this.maxComp - this.minComp) * 100}%`;
    }

    /**
     * --- 拖动时持续更新当前值 ---
     * @param event 输入事件
     */
    public input(event: Event): void {
        const value = (event.target as HTMLInputElement).valueAsNumber;
        this.emit('update:modelValue', value);
        this.emit('input', value);
    }

    /**
     * --- 操作完成时提交当前值 ---
     * @param event 变更事件
     */
    public change(event: Event): void {
        this.emit('change', (event.target as HTMLInputElement).valueAsNumber);
    }

}

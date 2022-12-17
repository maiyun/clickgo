import * as clickgo from 'clickgo';
import * as types from '~/types/index';

export default class extends clickgo.control.AbstractControl {

    public props: {

        // --- 内部不可变更 ---

        'icon': string;
        'title': string;

        'min': boolean | string;
        'max': boolean | string;
        'close': boolean | string;
        'resize': boolean | string;
        'move': boolean | string;
        'loading': boolean | string;
        'minWidth': number | string;
        'minHeight': number | string;

        'border': string;
        'background': string;
        'padding': string;
        'direction': 'h' | 'v';

        // --- 内部可变更 ---

        'stateMin': boolean | string;
        'stateMax': boolean | string;
        'width': number | string;
        'height': number | string;
        'left': number | string;
        'top': number | string;
    } = {
            'icon': '',
            'title': 'title',

            'min': true,
            'max': true,
            'close': true,
            'resize': true,
            'move': true,
            'loading': false,
            'minWidth': 200,
            'minHeight': 100,
            'border': 'normal',
            'background': '',
            'padding': '',
            'direction': 'h',

            'stateMin': false,
            'stateMax': false,
            'width': 300,
            'height': 200,
            'left': -1,
            'top': -1,
        };

    public stateMinData = false;

    public stateMaxData = false;

    public widthData = 0;

    public heightData = 0;

    public leftData = 0;

    public topData = 0;

    public isShow = false;

    public iconDataUrl = '';

    public zIndex = 0;

    /** --- 当前的吸附状态 --- */
    public stateAbs: '' | 'l' | 'lt' | 'tr' | 'r' | 'rb' | 'b' | 'bl' = '';

    /** --- 最大化、吸附前的位置 --- */
    public historyLocation = {
        'width': 0,
        'height': 0,
        'left': 0,
        'top': 0
    };

    public flashTimer?: number = undefined;

    /** --- 是否是内联窗体 --- */
    public isInside = false;

    /** --- 当前窗体是否和 native 的实体窗体大小、状态同步 --- */
    public isNativeSync = false;

    public get isMin(): boolean {
        return clickgo.tool.getBoolean(this.props.min);
    }

    public get isMax(): boolean {
        return clickgo.tool.getBoolean(this.props.max);
    }

    public get isClose(): boolean {
        return clickgo.tool.getBoolean(this.props.close);
    }

    public get isResize(): boolean {
        return this.isNativeSync ? false : clickgo.tool.getBoolean(this.props.resize);
    }

    public get isMove(): boolean {
        return clickgo.tool.getBoolean(this.props.move);
    }

    public get isLoading(): boolean {
        return clickgo.tool.getBoolean(this.props.loading);
    }

    public get isStateMax(): boolean {
        return clickgo.tool.getBoolean(this.props.stateMax);
    }

    public get isStateMin(): boolean {
        return clickgo.tool.getBoolean(this.props.stateMin);
    }

    public get taskPosition(): string {
        return clickgo.task.systemTaskInfo.taskId === 0 ? 'bottom' : clickgo.core.config['task.position'];
    }

    // --- 位置 computed ---

    public get widthComp(): number {
        return typeof this.props.width === 'string' ? parseInt(this.props.width) : this.props.width;
    }

    public get heightComp(): number {
        return typeof this.props.height === 'string' ? parseInt(this.props.height) : this.props.height;
    }

    public get minWidthComp(): number {
        return typeof this.props.minWidth === 'string' ? parseInt(this.props.minWidth) : this.props.minWidth;
    }

    public get minHeightComp(): number {
        return typeof this.props.minHeight === 'string' ? parseInt(this.props.minHeight) : this.props.minHeight;
    }

    public get leftComp(): number {
        return typeof this.props.left === 'string' ? parseInt(this.props.left) : this.props.left;
    }

    public get topComp(): number {
        return typeof this.props.top === 'string' ? parseInt(this.props.top) : this.props.top;
    }

    /**
     * --- 是否在本窗体上显示遮罩层 ---
     */
    public get isMask(): boolean {
        if (this.isInside) {
            return false;
        }
        return this.parentByName('root')?.isMask;
    }

    // --- 拖动 ---
    public moveMethod(e: MouseEvent | TouchEvent, custom: boolean = false): void {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        if (!this.isMove && !custom) {
            // --- !this.isMove 代表不能拖动，并且不是用户的指令 custom，那么则禁止拖动 ---
            return;
        }
        if (this.isInside) {
            return;
        }
        // --- 绑定双击事件 ---
        const el = e.currentTarget as HTMLElement;
        const dataHasDbl = el.getAttribute('data-has-dbl');
        if (!dataHasDbl) {
            el.setAttribute('data-has-dbl', 'yes');
            el.addEventListener('dblclick', () => {
                if (this.stateAbs) {
                    this.maxVMethod(true);
                }
                else {
                    if (this.propBoolean('max')) {
                        this.maxMethod();
                    }
                }
            });
        }
        /** --- 当前所处边框 --- */
        let isBorder: types.TDomBorder = '';
        clickgo.dom.bindMove(e, {
            'start': (x, y) => {
                if (this.stateMaxData) {
                    // --- 不能用 maxMethod 方法，因为那个获得的形状不能满足拖动还原的形状 ---
                    this.emit('max', e, 0, this.historyLocation);
                    this.element.removeAttribute('data-cg-max');
                    this.stateMaxData = false;
                    this.emit('update:stateMax', false);
                    // --- 进行位置设定 ---
                    const olx = x - this.leftData;
                    const orx = this.leftData + this.widthData - x;
                    const w2 = this.historyLocation.width / 2;
                    if (olx <= w2) {
                        this.leftData = x - olx;
                    }
                    else if (orx <= w2) {
                        this.leftData = x - (this.historyLocation.width - orx);
                    }
                    else {
                        this.leftData = x - w2;
                    }
                    this.emit('update:left', this.leftData);
                    // --- 高 ---
                    const oty = y - this.topData;
                    const oby = this.topData + this.heightData - y;
                    const h2 = this.historyLocation.height / 2;
                    if (oty <= h2) {
                        this.topData = y - oty;
                    }
                    else if (oby <= h2) {
                        this.topData = y - (this.historyLocation.height - oby);
                    }
                    else {
                        this.topData = y - h2;
                    }
                    this.emit('update:top', this.topData);
                    // --- 还原宽高 ---
                    if (!this.widthComp) {
                        this.widthData = 0;
                    }
                    else {
                        this.widthData = this.historyLocation.width;
                        this.emit('update:width', this.historyLocation.width);
                    }
                    if (!this.heightComp) {
                        this.heightData = 0;
                    }
                    else {
                        this.heightData = this.historyLocation.height;
                        this.emit('update:height', this.historyLocation.height);
                    }
                }
                else if (this.stateAbs) {
                    // --- 吸附拖动还原 ---
                    this.stateAbs = '';
                    // --- 进行位置设定 ---
                    /** --- 相对于窗体左侧的 x 坐标 --- */
                    const olx = x - this.leftData;
                    /** --- 相对于窗体右侧的 x 坐标 --- */
                    const orx = this.leftData + this.widthData - x;
                    /** --- 原始窗体宽度的一半 --- */
                    const hW2 = this.historyLocation.width / 2;
                    if (olx <= hW2) {
                        // --- 窗体左侧部位拖动 ---
                        this.leftData = x - olx;
                    }
                    else if (orx <= hW2) {
                        this.leftData = x - (this.historyLocation.width - orx);
                    }
                    else {
                        this.leftData = x - hW2;
                    }
                    this.emit('update:left', this.leftData);
                    // --- 顶 ---
                    const oty = y - this.topData;
                    const oby = this.topData + this.heightData - y;
                    const hH2 = this.historyLocation.height / 2;
                    if (oty <= hH2) {
                        this.topData = y - oty;
                    }
                    else if (oby <= hH2) {
                        this.topData = y - (this.historyLocation.height - oby);
                    }
                    else {
                        this.topData = y - hH2;
                    }
                    this.emit('update:top', this.topData);
                    // --- 还原宽高 ---
                    if (!this.widthComp) {
                        this.widthData = 0;
                    }
                    else {
                        this.widthData = this.historyLocation.width;
                        this.emit('update:width', this.historyLocation.width);
                    }
                    if (!this.heightComp) {
                        this.heightData = 0;
                    }
                    else {
                        this.heightData = this.historyLocation.height;
                        this.emit('update:height', this.historyLocation.height);
                    }
                }
                else if (!this.stateMinData) {
                    this.historyLocation = {
                        'width': this.widthData || this.element.offsetWidth,
                        'height': this.heightData || this.element.offsetHeight,
                        'left': this.leftData,
                        'top': this.topData
                    };
                }
            },
            'move': (e, o) => {
                this.leftData += o.ox;
                this.emit('update:left', this.leftData);
                this.topData += o.oy;
                this.emit('update:top', this.topData);
                if (o.border !== '') {
                    if ((o.border === 't' && this.isMax) || (o.border !== 't' && this.isResize)) {
                        if (isBorder === '') {
                            isBorder = o.border;
                            clickgo.form.showCircular(o.x, o.y);
                            clickgo.form.showRectangle(o.x, o.y, o.border);
                        }
                        else {
                            isBorder = o.border;
                            clickgo.form.moveRectangle(o.border);
                        }
                    }
                    else {
                        if (isBorder !== '') {
                            isBorder = '';
                            clickgo.form.hideRectangle();
                        }
                    }
                }
                else {
                    if (isBorder !== '') {
                        isBorder = '';
                        clickgo.form.hideRectangle();
                    }
                }
            },
            'end': () => {
                if (isBorder !== '') {
                    // --- 贴合了边缘，检测贴合了哪里 ---
                    if (isBorder === 't') {
                        // --- 要最大化 ---
                        if (this.isMax) {
                            // --- 不要使用 emit，只是模拟原大小，马上值就又被改变了 ---
                            this.widthData = !this.widthComp ? 0 : this.historyLocation.width;
                            this.heightData = !this.heightComp ? 0 : this.historyLocation.height;
                            this.leftData = this.historyLocation.left;
                            this.topData = this.historyLocation.top;
                            this.maxMethod();
                        }
                    }
                    else {
                        // --- 要做大小调整 ---
                        if (this.isResize) {
                            /*
                            if (this.stateMinData) {
                                if (!this.minMethod()) {
                                    clickgo.form.hideRectangle();
                                    return;
                                }
                            }
                            */
                            this.stateAbs = isBorder;
                            const pos = clickgo.form.getRectByBorder(isBorder);
                            this.widthData = pos.width;
                            if (this.widthComp > 0) {
                                this.emit('update:width', this.widthData);
                            }
                            this.heightData = pos.height;
                            if (this.heightComp > 0) {
                                this.emit('update:height', this.heightData);
                            }
                            this.leftData = pos.left;
                            this.emit('update:left', this.leftData);
                            this.topData = pos.top;
                            this.emit('update:top', this.topData);
                        }
                    }
                    clickgo.form.hideRectangle();
                }
            }
        });
    }

    // --- 最小化 ---
    public minMethod(): boolean {
        if (this.isInside) {
            return true;
        }
        const event = {
            'go': true,
            preventDefault: function() {
                this.go = false;
            }
        };
        // --- 如果当前是最大化状态，要先还原 ---
        // --- 不应该还原，直接最小化，然后点击后返回来还是最大化状态 ---
        /*
        if (this.stateMaxData) {
            if (this.maxMethod() === false) {
                return false;
            }
        }
        */
        // --- 当前是吸附状态 ---
        // --- 吸附状态也不应该还原，直接最小化，然后点击后返回来还是吸附状态 ---
        /*
        if (this.stateAbs) {
            this.stateAbs = false;
            this.widthData = this.width === 'auto' ? undefined : this.historyLocation.width;
            this.heightData = this.height === 'auto' ? undefined : this.historyLocation.height;
            this.leftData = this.historyLocation.left;
            this.$emit('update:left', this.leftData);
            this.topData = this.historyLocation.top;
            this.$emit('update:top', this.topData);
        }
        */
        if (!this.stateMinData) {
            // --- 当前是正常/最大化状态，需要变成最小化 ---
            this.emit('min', event, 1, {});
            if (event.go) {
                // --- 不能用 isNativeSync，因为沉浸式也要最小化 ---
                if (clickgo.isNative() && (this.formId === 1) && !clickgo.hasFrame()) {
                    // --- 最小化不要管是否是沉浸式，沉浸式也要实体最小化 ---
                    clickgo.native.min() as any;
                }
                else {
                    this.element.dataset.cgMin = '';
                    this.stateMinData = true;
                    this.emit('update:stateMin', true);
                    // --- 如果当前有焦点，则使别人获取焦点 ---
                    if (this.formFocus) {
                        const formId = clickgo.form.getMaxZIndexID({
                            'formIds': [this.formId]
                        });
                        clickgo.tool.sleep(100).then(() => {
                            if (formId) {
                                clickgo.form.changeFocus(formId);
                            }
                            else {
                                clickgo.form.changeFocus();
                            }
                        }).catch((e) => { throw e; });
                    }
                }
            }
            else {
                return false;
            }
        }
        else {
            // --- 需要变正常 ---
            this.emit('min', event, 0, this.historyLocation);
            if (event.go) {
                this.element.removeAttribute('data-cg-min');
                this.stateMinData = false;
                this.emit('update:stateMin', false);
            }
            else {
                return false;
            }
        }
        // --- 触发 formStateMinChanged 事件 ---
        this.trigger('formStateMinChanged', this.stateMinData);
        return true;
    }

    // --- 竖版扩大 ---
    public maxVMethod(dbl: boolean): void {
        if (this.isInside) {
            return;
        }
        if (this.stateAbs) {
            // --- 从吸附状态变为非吸附状态 ---
            this.stateAbs = '';
            this.topData = this.historyLocation.top;
            this.emit('update:top', this.topData);
            if (!this.heightComp) {
                this.heightData = 0;
            }
            else {
                this.heightData = this.historyLocation.height;
                this.emit('update:height', this.heightData);
            }
            if (dbl) {
                this.leftData = this.historyLocation.left;
                this.emit('update:left', this.leftData);
                if (!this.widthComp) {
                    this.widthData = 0;
                }
                else {
                    this.widthData = this.historyLocation.width;
                    this.emit('update:width', this.widthData);
                }
            }
        }
        else {
            this.stateAbs = 'l';
            this.historyLocation = {
                'width': this.widthData || this.element.offsetWidth,
                'height': this.heightData || this.element.offsetHeight,
                'left': this.leftData,
                'top': this.topData
            };
            const area = clickgo.core.getAvailArea();
            this.topData = area.top;
            this.emit('update:top', this.topData);
            this.heightData = area.height;
            if (this.heightComp) {
                this.emit('update:height', this.heightData);
            }
        }
    }

    // --- 最大化 ---
    public maxMethod(): boolean {
        if (this.isInside) {
            return true;
        }
        if (this.stateMinData) {
            if (!this.minMethod()) {
                return false;
            }
        }
        const event = {
            'go': true,
            preventDefault: function() {
                this.go = false;
            }
        };
        if (!this.stateMaxData) {
            // --- 当前是正常状态，需要变成最大化 ---
            this.emit('max', event, 1, {});
            if (event.go) {
                if (this.stateAbs) {
                    this.stateAbs = '';
                }
                else {
                    this.historyLocation = {
                        'width': this.widthData || this.element.offsetWidth,
                        'height': this.heightData || this.element.offsetHeight,
                        'left': this.leftData,
                        'top': this.topData
                    };
                }
                if (this.isNativeSync) {
                    clickgo.native.max() as any;
                }
                else {
                    this.element.dataset.cgMax = '';
                    this.stateMaxData = true;
                    this.emit('update:stateMax', true);
                }
                // --- 变窗体样子 ---
                if (!this.isNativeSync) {
                    this.element.style.transition = 'all .1s linear';
                    this.element.style.transitionProperty = 'left,top,width,height';
                    clickgo.tool.sleep(150).then(() => {
                        this.element.style.transition = '';
                    }).catch((e) => { console.log(e); });
                }
                const area = clickgo.core.getAvailArea();
                this.leftData = area.left;
                this.emit('update:left', this.leftData);
                this.topData = area.top;
                this.emit('update:top', this.topData);
                this.widthData = area.width;
                if (this.widthComp > 0) {
                    this.emit('update:width', this.widthData);
                }
                this.heightData = area.height;
                if (this.heightComp > 0) {
                    this.emit('update:height', this.heightData);
                }
            }
            else {
                return false;
            }
        }
        else {
            // --- 需要变正常 ---
            this.emit('max', event, 0, this.historyLocation);
            if (event.go) {
                // --- 变窗体样子 ---
                if (this.isNativeSync) {
                    clickgo.native.restore() as any;
                }
                else {
                    this.element.removeAttribute('data-cg-max');
                    this.stateMaxData = false;
                    this.emit('update:stateMax', false);
                    // --- 动画效果 ---
                    this.element.style.transition = 'all .1s linear';
                    this.element.style.transitionProperty = 'left,top,width,height';
                }
                if (!this.widthComp) {
                    this.widthData = 0;
                }
                else {
                    this.widthData = this.historyLocation.width;
                    this.emit('update:width', this.historyLocation.width);
                }
                if (!this.heightComp) {
                    this.heightData = 0;
                }
                else {
                    this.heightData = this.historyLocation.height;
                    this.emit('update:height', this.historyLocation.height);
                }
                this.leftData = this.historyLocation.left;
                this.emit('update:left', this.historyLocation.left);
                this.topData = this.historyLocation.top;
                this.emit('update:top', this.historyLocation.top);
                // --- native 模式非 frame、非沉浸模式，要调整 size ---
                if (this.isNativeSync) {
                    // --- mac 要多处理一步 ---
                    if (clickgo.getPlatform() === 'darwin') {
                        clickgo.native.size(this.widthData, this.heightData) as any;
                    }
                }
                else {
                    clickgo.tool.sleep(150).then(() => {
                        this.element.style.transition = '';
                    }).catch((e) => { console.log(e); });
                }
            }
            else {
                return false;
            }
        }
        // --- 触发 formRemoved 事件 ---
        this.trigger('formStateMaxChanged', this.stateMaxData);
        return true;
    }

    // --- 关闭窗体 ---
    public closeMethod(): void {
        if (this.isInside) {
            return;
        }
        const event = {
            go: true,
            preventDefault: function() {
                this.go = false;
            }
        };
        this.emit('close', event);
        if (event.go) {
            clickgo.form.close(this.formId);
        }
    }

    // --- 改变窗体大小 ---
    public resizeMethod(e: MouseEvent | TouchEvent, border: types.TDomBorder): void {
        if (this.stateMaxData) {
            return;
        }
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        let isBorder: types.TDomBorder = '';
        let top = this.topData;
        let left = this.leftData;
        /** --- 真实窗体高度 --- */
        let height = this.heightData || this.element.offsetHeight;
        /** --- 真实窗体宽度 --- */
        let width = this.widthData || this.element.offsetWidth;
        /** --- 恢复吸附标记 --- */
        let changeStateAbs = false;
        if (this.stateAbs) {
            switch (this.stateAbs) {
                case 'l':
                case 'r': {
                    // --- 左右、竖版吸附 ---
                    if (border === 'l' || border === 'r') {
                        // --- 仅左右调整，无需改变吸附状态 ---
                        break;
                    }
                    changeStateAbs = true;
                    // --- 以下必定涉及上下变动，则要改变吸附状态 ---
                    if (border === 'bl' || border === 'b' || border === 'rb') {
                        // --- 左下、下、右下 ---
                        top = height - this.historyLocation.height;
                    }
                    height = this.historyLocation.height;
                    break;
                }
                case 'b': {
                    // --- 底部半屏吸附 ---
                    if (border === 't' || border === 'b') {
                        break;
                    }
                    changeStateAbs = true;
                    // --- 调整宽度 ---
                    if (border === 'tr' || border === 'r' || border === 'rb') {
                        // --- 右上、右、右下 ---
                        left = width - this.historyLocation.width;
                    }
                    width = this.historyLocation.width;
                    break;
                }
                default: {
                    break;
                }
            }
        }
        else {
            this.historyLocation = {
                'width': width,
                'height': height,
                'left': this.leftData,
                'top': this.topData
            };
        }
        clickgo.dom.bindResize(e, {
            'objectLeft': left,
            'objectTop': top,
            'objectWidth': width,
            'objectHeight': height,
            'minWidth': this.minWidthComp,
            'minHeight': this.minHeightComp,
            'border': border,
            'start': () => {
                if (this.stateAbs && changeStateAbs) {
                    // --- 吸附拖动还原 ---
                    this.stateAbs = '';
                }
            },
            'move': (left, top, width, height, x, y, nborder) => {
                this.leftData = left;
                this.emit('update:left', left);
                this.topData = top;
                this.emit('update:top', top);
                this.widthData = width;
                this.emit('update:width', width);
                this.heightData = height;
                this.emit('update:height', height);
                if (!this.isInside) {
                    if (nborder !== '') {
                        if (
                            ((border === 'lt' || border === 't' || border === 'tr') && (nborder === 'lt' || nborder === 't' || nborder === 'tr')) ||
                            ((border === 'bl' || border === 'b' || border === 'rb') && (nborder === 'bl' || nborder === 'b' || nborder === 'rb'))
                        ) {
                            if (isBorder === '') {
                                isBorder = nborder;
                                clickgo.form.showCircular(x, y);
                                clickgo.form.showRectangle(x, y, {
                                    'left': left,
                                    'width': width
                                });
                            }
                            else {
                                isBorder = nborder;
                                clickgo.form.moveRectangle({
                                    'left': left,
                                    'width': width
                                });
                            }
                        }
                        else {
                            if (isBorder !== '') {
                                isBorder = '';
                                clickgo.form.hideRectangle();
                            }
                        }
                    }
                    else {
                        if (isBorder !== '') {
                            isBorder = '';
                            clickgo.form.hideRectangle();
                        }
                    }
                }
            },
            'end': () => {
                if (isBorder !== '') {
                    if (!this.stateAbs && isBorder !== 'l' && isBorder !== 'r') {
                        // --- 当前不是吸附状态，判断是否要吸附 ---
                        const area = clickgo.core.getAvailArea();
                        this.stateAbs = 'l';
                        this.heightData = area.height;
                        this.emit('update:height', this.heightData);
                        this.topData = area.top;
                        this.emit('update:top', this.topData);
                    }
                    clickgo.form.hideRectangle();
                }
            }
        });
    }

    // --- 设置 left, width 等 ---
    public setPropData(name: string, val: number, mode: string = ''): void {
        switch (name) {
            case 'left': {
                switch (mode) {
                    case '': {
                        this.leftData = val;
                        break;
                    }
                    case '+': {
                        this.leftData += val;
                        break;
                    }
                    default: {
                        this.leftData -= val;
                    }
                }
                this.emit('update:left', this.leftData);
                break;
            }
            case 'top': {
                switch (mode) {
                    case '': {
                        this.topData = val;
                        break;
                    }
                    case '+': {
                        this.topData += val;
                        break;
                    }
                    default: {
                        this.topData -= val;
                    }
                }
                this.emit('update:top', this.topData);
                break;
            }
            case 'width': {
                if (!val) {
                    this.widthData = 0;
                    this.emit('update:width', 0);
                }
                else {
                    switch (mode) {
                        case '': {
                            this.widthData = val;
                            break;
                        }
                        case '+': {
                            this.widthData += val;
                            break;
                        }
                        default: {
                            this.widthData -= val;
                        }
                    }
                    this.emit('update:width', this.widthData);
                }
                break;
            }
            case 'height': {
                if (!val) {
                    this.heightData = 0;
                    this.emit('update:height', 0);
                }
                else {
                    if (typeof val !== 'number') {
                        break;
                    }
                    switch (mode) {
                        case '': {
                            this.heightData = val;
                            break;
                        }
                        case '+': {
                            this.heightData += val;
                            break;
                        }
                        default: {
                            this.heightData -= val;
                        }
                    }
                    this.emit('update:height', this.heightData);
                }
                break;
            }
        }
    }

    public onMounted(): void {
        this.watch('icon', async () => {
            /*
            let first: boolean = false;
            if (this.iconData === undefined) {
                first = true;
            }
            //*/
            if (this.props.icon === '') {
                this.iconDataUrl = '';
            }
            else {
                const icon = await clickgo.fs.getContent(this.props.icon);
                this.iconDataUrl = (icon instanceof Blob) ? await clickgo.tool.blob2DataUrl(icon) : '';
            }
            // --- 触发 formIconChanged 事件 ---
            this.trigger('formIconChanged', this.iconDataUrl);
            /*
            if (!first) {
                // --- 触发 formIconChanged 事件 ---
                this.trigger('formIconChanged', this.iconData);
            }
            */
        });
        this.watch('title', () => {
            // --- 触发 formTitleChanged 事件 ---
            this.trigger('formTitleChanged', this.props.title);
        });

        this.watch('isStateMin', () => {
            if (this.isStateMin === this.stateMinData) {
                return;
            }
            this.minMethod();
        });
        this.watch('isStateMax', () => {
            if (this.isStateMax === this.stateMaxData) {
                return;
            }
            this.maxMethod();
        });
        this.watch('isShow', () => {
            this.trigger('formShowChanged', this.isShow);
        });
        this.watch('width', () => {
            if (this.widthComp === this.widthData) {
                return;
            }
            this.widthData = this.widthComp;
            if (!this.widthComp) {
                return;
            }
            if (this.widthData < this.minWidthComp) {
                this.widthData = this.minWidthComp;
                this.emit('update:width', this.widthData);
            }
        }, {
            'immediate': true
        });
        this.watch('height', () => {
            if (this.heightComp === this.heightData) {
                return;
            }
            this.heightData = this.heightComp;
            if (!this.heightComp) {
                return;
            }
            if (this.heightData < this.minHeightComp) {
                this.heightData = this.minHeightComp;
                this.emit('update:height', this.heightData);
            }
        }, {
            'immediate': true
        });
        this.watch('left', () => {
            this.leftData = this.leftComp;
        });
        this.watch('top', () => {
            this.topData = this.topComp;
        });

        // --- 监听 native 窗体状态变化 ---

        if (this.parent.controlName === 'root') {
            this.isNativeSync = this.parent.isNativeSync;
            if (this.isNativeSync) {
                clickgo.native.on('maximize', () => {
                    this.element.dataset.cgMax = '';
                    this.stateMaxData = true;
                    this.emit('update:stateMax', true);
                }, false, this.formId);
                clickgo.native.on('unmaximize', () => {
                    this.element.removeAttribute('data-cg-max');
                    this.stateMaxData = false;
                    this.emit('update:stateMax', false);
                }, false, this.formId);
                // --- 同步情况下，需要同步 max 状态到 native ---
                this.watch('max', () => {
                    // --- 设置实体窗口是否可以最大化（主要应对的就是双击最大化，毕竟没有最大化按钮） ---
                    clickgo.native.maximizable(this.propBoolean('max')) as any;
                }, {
                    'immediate': true
                });
            }
        }

        // --- 其他 ---

        if (this.parent.controlName !== 'root') {
            this.isInside = true;
            this.isShow = true;
        }
        if (this.isStateMax) {
            const area = clickgo.core.getAvailArea();
            this.leftData = (area.width - this.widthData) / 2;
            this.topData = (area.height - this.heightData) / 2;
            this.maxMethod();
        }
    }

}

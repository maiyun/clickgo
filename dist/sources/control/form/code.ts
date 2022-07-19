import * as clickgo from 'clickgo';
import * as types from '~/types/index';

export const props = {
    'icon': {
        'default': '',
    },
    'title': {
        'default': 'title'
    },
    'min': {
        'default': true
    },
    'max': {
        'default': true
    },
    'close': {
        'default': true
    },

    'stateMax': {
        'default': false
    },
    'stateMin': {
        'default': false
    },
    'show': {
        'default': undefined
    },

    'width': {
        'default': 300
    },
    'height': {
        'default': 200
    },
    'left': {
        'default': -1
    },
    'top': {
        'default': -1
    },
    'zIndex': {
        'default': -1
    },
    'minWidth': {
        'default': 200
    },
    'minHeight': {
        'default': 100
    },
    'resize': {
        'default': true
    },
    'loading': {
        'default': false
    },
    'move': {
        'default': true
    },
    'border': {
        'default': 'normal'
    },
    'background': {
        'default': undefined
    },
    'padding': {
        'default': undefined
    },
    'direction': {
        'default': 'h'
    }
};

export const data = {
    'stateMaxData': false,
    'stateMinData': false,
    'stateAbs': false,
    'showData': false,

    'iconData': '',

    'widthData': undefined,
    'heightData': undefined,
    'leftData': 0,
    'topData': 0,
    'zIndexData': 0,

    'historyLocation': {
        'width': 0,
        'height': 0,
        'left': 0,
        'top': 0
    },
    'maskFor': undefined,
    'maskFrom': undefined,
    'flashTimer': undefined,
    'isInside': false,
    'isNativeSync': false
};

export const computed = {
    'isMin': function(this: types.IVControl): boolean {
        return clickgo.tool.getBoolean(this.min);
    },
    'isMax': function(this: types.IVControl): boolean {
        return clickgo.tool.getBoolean(this.max);
    },
    'isClose': function(this: types.IVControl): boolean {
        return clickgo.tool.getBoolean(this.close);
    },
    'isStateMax': function(this: types.IVControl): boolean {
        return clickgo.tool.getBoolean(this.stateMax);
    },
    'isStateMin': function(this: types.IVControl): boolean {
        return clickgo.tool.getBoolean(this.stateMin);
    },
    'isResize': function(this: types.IVControl): boolean {
        return this.isNativeSync ? false : clickgo.tool.getBoolean(this.resize);
    },
    'isMove': function(this: types.IVControl): boolean {
        return clickgo.tool.getBoolean(this.move);
    },
    'taskPosition': function(this: types.IVControl): string {
        return clickgo.task.systemTaskInfo.taskId === 0 ? 'bottom' : clickgo.core.config['task.position'];
    }
};

export const watch = {
    'icon': {
        handler: async function(this: types.IVControl): Promise<void> {
            /*
            let first: boolean = false;
            if (this.iconData === undefined) {
                first = true;
            }
            //*/
            if (this.icon === '') {
                this.iconData = '';
            }
            else {
                const icon = await clickgo.fs.getContent(this.icon);
                this.iconData = (icon instanceof Blob) ? await clickgo.tool.blob2DataUrl(icon) : '';
            }
            // --- 触发 formIconChanged 事件 ---
            clickgo.core.trigger('formIconChanged', this.iconData);
            /*
            if (!first) {
                // --- 触发 formIconChanged 事件 ---
                clickgo.core.trigger('formIconChanged', this.iconData);
            }
            */
        },
        'immediate': false
    },
    'title': function(this: types.IVControl): void {
        // --- 触发 formTitleChanged 事件 ---
        clickgo.core.trigger('formTitleChanged', this.title);
    },
    'isStateMin': function(this: types.IVControl): void {
        if (this.stateMin === this.stateMinData) {
            return;
        }
        this.minMethod();
    },
    'isStateMax': function(this: types.IVControl): void {
        if (this.stateMax === this.stateMaxData) {
            return;
        }
        this.maxMethod();
    },
    'show': function(this: types.IVControl): void {
        if (this.showData !== this.show) {
            this.showData = this.show;
        }
    },
    'showData': function(this: types.IVControl): void {
        clickgo.core.trigger('formShowChanged', this.showData);
    },

    'width': function(this: types.IVControl): void {
        if (this.width === 'auto') {
            if (this.widthData !== undefined) {
                this.widthData = undefined;
            }
        }
        else {
            this.widthData = parseInt(this.width);
        }
    },
    'height': function(this: types.IVControl): void {
        if (this.height === 'auto') {
            if (this.heightData !== undefined) {
                this.heightData = undefined;
            }
        }
        else {
            this.heightData = parseInt(this.height);
        }
    },
    'left': function(this: types.IVControl): void {
        this.leftData = parseInt(this.left);
    },
    'top': function(this: types.IVControl): void {
        this.topData = parseInt(this.top);
    },
    'zIndex': function(this: types.IVControl): void {
        this.zIndexData = parseInt(this.zIndex);
    }
};

export const methods = {
    // --- 拖动 ---
    moveMethod: function(this: types.IVControl, e: MouseEvent | TouchEvent, custom: boolean = false): void {
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
                    this.maxMethod();
                }
            });
        }
        /** --- 当前所处边框 --- */
        let isBorder: types.TBorder = '';
        clickgo.dom.bindMove(e, {
            'start': (x, y) => {
                if (this.stateMaxData) {
                    // --- 不能用 maxMethod 方法，因为那个获得的形状不能满足拖动还原的形状 ---
                    this.$emit('max', e, 0, this.historyLocation);
                    this.$el.removeAttribute('data-cg-max');
                    this.stateMaxData = false;
                    this.$emit('update:stateMax', false);
                    // --- 进行位置设定 ---
                    const olx = x - this.leftData;
                    const orx = (this.leftData as number) + (this.widthData as number) - x;
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
                    this.$emit('update:left', this.leftData);
                    // --- 高 ---
                    const oty = y - this.topData;
                    const oby = (this.topData as number) + (this.heightData as number) - y;
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
                    this.$emit('update:top', this.topData);
                    // --- 还原宽高 ---
                    if (this.width === 'auto') {
                        this.widthData = undefined;
                    }
                    else {
                        this.widthData = this.historyLocation.width;
                        this.$emit('update:width', this.historyLocation.width);
                    }
                    if (this.height === 'auto') {
                        this.heightData = undefined;
                    }
                    else {
                        this.heightData = this.historyLocation.height;
                        this.$emit('update:height', this.historyLocation.height);
                    }
                    // --- 如果是原生应用，则处理外围窗体 ---
                    if (this.isNativeSync) {
                        clickgo.native.restore();// --- mac 要多处理一步 ---
                        if (clickgo.getPlatform() === 'darwin') {
                            clickgo.native.size(this.widthData, this.heightData);
                        }
                    }
                }
                else if (this.stateAbs) {
                    // --- 吸附拖动还原 ---
                    this.stateAbs = false;
                    // --- 进行位置设定 ---
                    const olx = x - this.leftData;
                    const orx = (this.leftData as number) + (this.widthData as number) - x;
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
                    this.$emit('update:left', this.leftData);
                    // --- 高 ---
                    const oty = y - this.topData;
                    const oby = (this.topData as number) + (this.heightData as number) - y;
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
                    this.$emit('update:top', this.topData);
                    // --- 还原宽高 ---
                    if (this.width === 'auto') {
                        this.widthData = undefined;
                    }
                    else {
                        this.widthData = this.historyLocation.width;
                        this.$emit('update:width', this.historyLocation.width);
                    }
                    if (this.height === 'auto') {
                        this.heightData = undefined;
                    }
                    else {
                        this.heightData = this.historyLocation.height;
                        this.$emit('update:height', this.historyLocation.height);
                    }
                }
                else if (!this.stateMinData) {
                    this.historyLocation = {
                        'width': this.widthData ?? this.$el.offsetWidth,
                        'height': this.heightData ?? this.$el.offsetHeight,
                        'left': this.leftData,
                        'top': this.topData
                    };
                }
            },
            'move': (ox, oy, x, y, border) => {
                (this.leftData as number) += ox;
                this.$emit('update:left', this.leftData);
                (this.topData as number) += oy;
                this.$emit('update:top', this.topData);
                if (border !== '') {
                    if ((border === 't' && this.isMax) || (border !== 't' && this.isResize)) {
                        if (isBorder === '') {
                            isBorder = border;
                            clickgo.form.showCircular(x, y);
                            clickgo.form.showRectangle(x, y, border);
                        }
                        else {
                            isBorder = border;
                            clickgo.form.moveRectangle(border);
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
                    if (isBorder === 't') {
                        // --- 要最大化 ---
                        if (this.isMax) {
                            // --- 不要使用 emit，只是模拟原大小，马上值就又被改变了 ---
                            this.widthData = this.width === 'auto' ? undefined : this.historyLocation.width;
                            this.heightData = this.height === 'auto' ? undefined : this.historyLocation.height;
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
                            this.stateAbs = true;
                            const pos = clickgo.form.getRectByBorder(isBorder);
                            this.widthData = pos.width;
                            if (this.width !== 'auto') {
                                this.$emit('update:width', this.widthData);
                            }
                            this.heightData = pos.height;
                            if (this.height !== 'auto') {
                                this.$emit('update:height', this.heightData);
                            }
                            this.leftData = pos.left;
                            this.$emit('update:left', this.leftData);
                            this.topData = pos.top;
                            this.$emit('update:top', this.topData);
                        }
                    }
                    clickgo.form.hideRectangle();
                }
            }
        });
    },
    // --- 最小化 ---
    minMethod: function(this: types.IVControl): boolean {
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
            this.$emit('min', event, 1, {});
            if (event.go) {
                if (this.isNativeSync) {
                    clickgo.native.min();
                }
                else {
                    this.$el.dataset.cgMin = '';
                    this.stateMinData = true;
                    this.$emit('update:stateMin', true);
                    // --- 如果当前有焦点，则使别人获取焦点 ---
                    if (this.cgFocus) {
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
            this.$emit('min', event, 0, this.historyLocation);
            if (event.go) {
                this.$el.removeAttribute('data-cg-min');
                this.stateMinData = false;
                this.$emit('update:stateMin', false);
            }
            else {
                return false;
            }
        }
        // --- 触发 formStateMinChanged 事件 ---
        clickgo.core.trigger('formStateMinChanged', this.stateMinData);
        return true;
    },
    // --- 竖版扩大 ---
    maxVMethod: function(this: types.IVControl, dbl: boolean): void {
        if (this.isInside) {
            return;
        }
        if (this.stateAbs) {
            this.stateAbs = false;
            this.topData = this.historyLocation.top;
            this.$emit('update:top', this.topData);
            if (this.height === 'auto') {
                this.heightData = undefined;
            }
            else {
                this.heightData = this.historyLocation.height;
                this.$emit('update:height', this.heightData);
            }
            if (dbl) {
                this.leftData = this.historyLocation.left;
                this.$emit('update:top', this.leftData);
                if (this.width === 'auto') {
                    this.widthData = undefined;
                }
                else {
                    this.widthData = this.historyLocation.width;
                    this.$emit('update:width', this.widthData);
                }
            }
        }
        else {
            this.stateAbs = true;
            this.historyLocation = {
                'width': this.widthData ?? this.$el.offsetWidth,
                'height': this.heightData ?? this.$el.offsetHeight,
                'left': this.leftData,
                'top': this.topData
            };
            const area = clickgo.core.getAvailArea();
            this.topData = area.top;
            this.$emit('update:top', this.topData);
            this.heightData = area.height;
            if (this.height !== 'auto') {
                this.$emit('update:height', this.heightData);
            }
        }
    },
    // --- 最大化 ---
    maxMethod: function(this: types.IVControl): boolean {
        if (this.isInside) {
            return true;
        }
        if (this.stateMinData) {
            if (this.minMethod() === false) {
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
            this.$emit('max', event, 1, {});
            if (event.go) {
                if (this.isNativeSync) {
                    clickgo.native.max();
                }
                if (this.stateAbs) {
                    this.stateAbs = false;
                }
                else {
                    this.historyLocation = {
                        'width': this.widthData ?? this.$el.offsetWidth,
                        'height': this.heightData ?? this.$el.offsetHeight,
                        'left': this.leftData,
                        'top': this.topData
                    };
                }
                this.$el.dataset.cgMax = '';
                this.stateMaxData = true;
                this.$emit('update:stateMax', true);
                // --- 变窗体样子 ---
                const area = clickgo.core.getAvailArea();
                this.leftData = area.left;
                this.$emit('update:left', this.leftData);
                this.topData = area.top;
                this.$emit('update:top', this.topData);
                this.widthData = area.width;
                if (this.width !== 'auto') {
                    this.$emit('update:width', this.widthData);
                }
                this.heightData = area.height;
                if (this.height !== 'auto') {
                    this.$emit('update:height', this.heightData);
                }
            }
            else {
                return false;
            }
        }
        else {
            // --- 需要变正常 ---
            this.$emit('max', event, 0, this.historyLocation);
            if (event.go) {
                this.$el.removeAttribute('data-cg-max');
                this.stateMaxData = false;
                this.$emit('update:stateMax', false);
                // --- 变窗体样子 ---
                this.leftData = this.historyLocation.left;
                this.$emit('update:left', this.historyLocation.left);
                this.topData = this.historyLocation.top;
                this.$emit('update:top', this.historyLocation.top);
                if (this.width === 'auto') {
                    this.widthData = undefined;
                }
                else {
                    this.widthData = this.historyLocation.width;
                    this.$emit('update:width', this.historyLocation.width);
                }
                if (this.height === 'auto') {
                    this.heightData = undefined;
                }
                else {
                    this.heightData = this.historyLocation.height;
                    this.$emit('update:height', this.historyLocation.height);
                }
                if (this.isNativeSync) {
                    clickgo.native.restore();
                    // --- mac 要多处理一步 ---
                    if (clickgo.getPlatform() === 'darwin') {
                        clickgo.native.size(this.widthData, this.heightData);
                    }
                }
            }
            else {
                return false;
            }
        }
        // --- 触发 formRemoved 事件 ---
        clickgo.core.trigger('formStateMaxChanged', this.stateMaxData);
        return true;
    },
    // --- 关闭窗体 ---
    closeMethod: function(this: types.IVControl): void {
        if (this.isInside) {
            return;
        }
        const event = {
            go: true,
            preventDefault: function() {
                this.go = false;
            }
        };
        this.$emit('close', event);
        if (event.go) {
            clickgo.form.close();
        }
    },
    // --- 改变窗体大小 ---
    resizeMethod: function(this: types.IVControl, e: MouseEvent | TouchEvent, border: types.TBorder): void {
        if (this.stateMaxData) {
            return;
        }
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        let isBorder: types.TBorder = '';
        let top = this.topData;
        let height = this.heightData ?? this.$el.offsetHeight;
        if (border !== 'l' && border !== 'r') {
            if (this.stateAbs) {
                // --- 进行高度还原 ---
                if (border === 'lt' || border === 't' || border === 'tr') {
                    // --- 左上、上、右上 ---
                    height = (this.historyLocation.top as number) + (this.historyLocation.height as number);
                }
                else {
                    // --- 左下、下、右下 ---
                    top = this.historyLocation.top;
                    height = clickgo.core.getAvailArea().height - top;
                }
            }
            else {
                this.historyLocation = {
                    'width': this.widthData ?? this.$el.offsetWidth,
                    'height': this.heightData ?? this.$el.offsetHeight,
                    'left': this.leftData,
                    'top': this.topData
                };
            }
        }
        clickgo.dom.bindResize(e, {
            'objectLeft': this.leftData,
            'objectTop': top,
            'objectWidth': this.widthData ?? this.$el.offsetWidth,
            'objectHeight': height,
            'minWidth': parseInt(this.minWidth),
            'minHeight': parseInt(this.minHeight),
            'border': border,
            'start': () => {
                if (border === 'l' || border === 'r') {
                    return;
                }
                if (this.stateAbs) {
                    // --- 吸附拖动还原 ---
                    this.stateAbs = false;
                }
            },
            'move': (left, top, width, height, x, y, nborder) => {
                this.leftData = left;
                this.$emit('update:left', left);
                this.topData = top;
                this.$emit('update:top', top);
                this.widthData = width;
                this.$emit('update:width', width);
                this.heightData = height;
                this.$emit('update:height', height);
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
                    if (isBorder !== 'l' && isBorder !== 'r') {
                        const area = clickgo.core.getAvailArea();
                        this.stateAbs = true;
                        this.heightData = area.height;
                        this.$emit('update:height', this.heightData);
                        this.topData = area.top;
                        this.$emit('update:top', this.topData);
                    }
                    clickgo.form.hideRectangle();
                }
            }
        });
    },
    // --- 设置 left, width, zIndex 等 ---
    setPropData: function(this: types.IVControl, name: string, val: number | string, mode: string = ''): void {
        switch (name) {
            case 'left': {
                if (typeof val !== 'number') {
                    break;
                }
                switch (mode) {
                    case '': {
                        this.leftData = val;
                        break;
                    }
                    case '+': {
                        (this.leftData as number) += val;
                        break;
                    }
                    default: {
                        this.leftData -= val;
                    }
                }
                this.$emit('update:left', this.leftData);
                break;
            }
            case 'top': {
                if (typeof val !== 'number') {
                    break;
                }
                switch (mode) {
                    case '': {
                        this.topData = val;
                        break;
                    }
                    case '+': {
                        (this.topData as number) += val;
                        break;
                    }
                    default: {
                        this.topData -= val;
                    }
                }
                this.$emit('update:top', this.topData);
                break;
            }
            case 'width': {
                if (val === 'auto') {
                    this.widthData = undefined;
                    this.$emit('update:width', 'auto');
                }
                else {
                    if (typeof val !== 'number') {
                        break;
                    }
                    switch (mode) {
                        case '': {
                            this.widthData = val;
                            break;
                        }
                        case '+': {
                            (this.widthData as number) += val;
                            break;
                        }
                        default: {
                            this.widthData -= val;
                        }
                    }
                    this.$emit('update:width', this.widthData);
                }
                break;
            }
            case 'height': {
                if (val === 'auto') {
                    this.heightData = undefined;
                    this.$emit('update:height', 'auto');
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
                            (this.heightData as number) += val;
                            break;
                        }
                        default: {
                            this.heightData -= val;
                        }
                    }
                    this.$emit('update:height', this.heightData);
                }
                break;
            }
            case 'zIndex': {
                if (typeof val !== 'number') {
                    break;
                }
                switch (mode) {
                    case '': {
                        this.zIndexData = val;
                        break;
                    }
                    case '+': {
                        (this.zIndexData as number) += val;
                        break;
                    }
                    default: {
                        this.zIndexData -= val;
                    }
                }
                this.$emit('update:zIndex', this.zIndexData);
                break;
            }
        }
    }
};

export const mounted = async function(this: types.IVControl): Promise<void> {
    await this.$nextTick();
    await clickgo.tool.sleep(0);
    if (this.$parent!.controlName !== 'root') {
        this.isInside = true;
        this.showData = true;
    }
    if (this.width !== 'auto') {
        this.widthData = parseInt(this.width);
        if (this.widthData < this.minWidth) {
            this.widthData = this.minWidth;
            this.$emit('update:width', this.widthData);
        }
    }
    if (this.height !== 'auto') {
        this.heightData = parseInt(this.height);
        if (this.heightData < this.minHeight) {
            this.heightData = this.minHeight;
            this.$emit('update:height', this.heightData);
        }
    }
    const zIndex = parseInt(this.zIndex);
    if (zIndex !== -1) {
        this.zIndexData = zIndex;
    }
    if (this.isStateMax) {
        const area = clickgo.core.getAvailArea();
        this.leftData = (area.width - this.widthData) / 2;
        this.topData = (area.height - this.heightData) / 2;
        this.maxMethod();
    }
};

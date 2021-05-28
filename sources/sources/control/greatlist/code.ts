export let props = {
    'width': {
        'default': undefined
    },
    'height': {
        'default': undefined
    },
    'left': {
        'default': 0
    },
    'top': {
        'default': 0
    },
    'zIndex': {
        'default': 0
    },
    'flex': {
        'default': ''
    },

    'adaptation': {
        'dafault': false
    },
    'same': {
        'default': false
    },
    'disabled': {
        'default': false
    },
    'must': {
        'default': true
    },
    'multi': {
        'default': false,
    },

    'data': {
        'default': []
    },
    'modelValue': {
        'default': -1
    }
};

export let data = {
    'direction': 'v',

    'client': 0,
    'length': 0,
    'offset': 0,

    'valueData': -1,
    'shiftStart': 0,

    'itemDown': false,       // --- 本次 down 事件是在 item 上触发的，因此本次 greatlist 上不响应相关事件 ---
    'itemClick': false
};

export let computed = {
    'isAdaptation': function(this: IVueControl): boolean {
        return clickgo.tool.getBoolean(this.adaptation);
    },
    'isSame': function(this: IVueControl): boolean {
        return clickgo.tool.getBoolean(this.same);
    },
    'isDisabled': function(this: IVueControl): boolean {
        return clickgo.tool.getBoolean(this.disabled);
    },
    'isMust': function(this: IVueControl): boolean {
        return clickgo.tool.getBoolean(this.must);
    },
    'isMulti': function(this: IVueControl): boolean {
        return clickgo.tool.getBoolean(this.multi);
    }
};

export let watch = {
    'data': {
        handler: function(this: IVueControl): void {
            this.select();
        },
        'deep': true
    },
    'modelValue': {
        handler: function(this: IVueControl): void {
            this.valueData = this.modelValue;
            this.select();
            if (typeof this.valueData !== 'object') {
                this.shiftStart = this.valueData;
            }
        },
        'deep': true,
        'immediate': true
    },
    'must': {
        handler: function(this: IVueControl): void {
            this.select();
        }
    },
    'multi': {
        handler: function(this: IVueControl): void {
            this.select();
        }
    }
};

export let methods = {
    select: function(this: IVueControl, value?: number, shift: boolean = false, ctrl: boolean = false): boolean {
        let change: boolean = false;
        // --- 处理选中数据（多行模式但单选、单行模式所有情况） ---
        if (value !== undefined) {
            if (this.isMulti) {
                if (!shift && !ctrl) {
                    this.valueData = this.isMulti ? [value] : value;
                    this.shiftStart = value;
                    this.$emit('update:modelValue', this.valueData);
                    // --- 排除: 有 value，多行，没有 shift，没有 ctrl ---
                    return true;
                }
            }
            else {
                if (this.valueData !== value) {
                    this.valueData = value;
                    this.shiftStart = value;
                    this.$emit('update:modelValue', this.valueData);
                    return true;
                }
                // --- 排除: 有 value 且单行全部排除 ---
                return false;
            }
        }
        // --- 剩：无 value、有 value 多行且有 shift 或有 ctrl ---
        // --- 检测过去 value 的数据格式是否正确（多行为数组、单行为值，以及必须状态下是否未选择） ---
        if (typeof this.valueData === 'object') {
            // --- 当前是数组 ---
            if (this.isMust && (this.valueData.length === 0)) {
                this.valueData = [0];
                change = true;
            }
            if (!this.isMulti) {
                // --- 但是不等于多行 ---
                this.valueData = this.valueData[0] ?? -1;
                change = true;
            }
        }
        else {
            // --- 当前是值 ---
            if (this.isMust && (this.valueData === -1)) {
                this.valueData = 0;
                change = true;
            }
            if (this.isMulti) {
                this.valueData = this.valueData === -1 ? [] : [this.valueData];
                change = true;
            }
        }
        // --- 判断历史的 value 的数据内容是否合规 ---
        if (this.isMulti) {
            if (this.valueData.length > 0) {
                for (let k = 0; k < this.valueData.length; ++k) {
                    if (!this.data[this.valueData[k]]) {
                        this.valueData.splice(k, 1);
                        --k;
                        change = true;
                    }
                }
            }
        }
        else {
            if (this.valueData > -1) {
                if (!this.data[this.valueData]) {
                    this.valueData = this.isMust ? 0 : -1;
                    change = true;
                }
            }
        }
        // --- 选择新的 ---
        if (value === undefined) {
            if (change) {
                this.$emit('update:modelValue', this.valueData);
                return true;
            }
            // --- 排除无 value 情况的所有情况 ---
            return false;
        }
        // --- 剩：有 value 多行且有 shift 或有 ctrl ---
        if (shift) {
            this.valueData = [];
            if (value > this.shiftStart) {
                for (let k = this.shiftStart; k <= value; ++k) {
                    this.valueData.push(k);
                    change = true;
                }
            }
            else {
                for (let k = this.shiftStart; k >= value; --k) {
                    this.valueData.push(k);
                    change = true;
                }
            }
            if (change) {
                this.$emit('update:modelValue', this.valueData);
                return true;
            }
            return false;
        }
        else {
            // --- ctrl ---
            if (this.valueData.includes(value)) {
                if (this.isMust && this.valueData.length === 1) {
                    // --- 必须有至少 1 个选定，移除当前的就没选定了，所以不能移除 ---
                    if (change) {
                        this.$emit('update:modelValue', this.valueData);
                        return true;
                    }
                    return false;
                }
                this.valueData.splice(this.valueData.indexOf(value), 1);
                this.shiftStart = value;
                this.$emit('update:modelValue', this.valueData);
                return true;
            }
            else {
                this.valueData.push(value);
                this.shiftStart = value;
                this.valueData.sort();
                this.$emit('update:modelValue', this.valueData);
                return true;
            }
        }
    },

    down: function(this: IVueControl, e: MouseEvent | TouchEvent): void {
        if (this.cgIsMouseAlsoTouchEvent(e)) {
            return;
        }
        this.cgDown(e);
        if (this.cgSelfPopOpen) {
            this.cgHidePop();
        }
        if (!this.itemDown) {
            if (this.cgChildPopItemShowing) {
                this.cgChildPopItemShowing.cgHidePop();
            }
        }
        else {
            this.itemDown = false;
        }
    },
    innerDown: function(this: IVueControl, e: MouseEvent | TouchEvent): void {
        if (this.cgIsMouseAlsoTouchEvent(e)) {
            return;
        }
        if (this.itemDown) {
            return;
        }
        if (e instanceof MouseEvent) {
            // --- 电脑 ---
            if (!this.isMust) {
                this.valueData = this.isMulti ? [] : -1;
                this.$emit('update:modelValue', this.valueData);
            }
        }
        else {
            // --- 手机 ---
            // --- 长按触发 contextmenu ---
            clickgo.dom.bindLong(e, () => {
                if (!this.isMust) {
                    this.valueData = this.isMulti ? [] : -1;
                    this.$emit('update:modelValue', this.valueData);
                }
                this.cgShowPop(e);
            });
        }
    },
    click: function(this: IVueControl, e: MouseEvent): void {
        if (!this.cgIsMouseAlsoTouchEvent(e)) {
            // --- 电脑不响应本事件 ---
            return;
        }
        // --- 手机 ---
        if (!this.itemClick) {
            if (!this.isMust) {
                this.valueData = this.isMulti ? [] : -1;
                this.$emit('update:modelValue', this.valueData);
            }
        }
        else {
            this.itemClick = false;
        }
    },
    // --- 以下为空白处右键菜单 ---
    contextmenu: function(this: IVueControl, e: MouseEvent): void {
        if (this.cgIsMouseAlsoTouchEvent(e)) {
            return;
        }
        this.cgShowPop(e);
    }
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = exports.computed = exports.watch = exports.data = exports.props = void 0;
exports.props = {
    'disabled': {
        'default': false
    },
    'width': {
        'default': undefined
    },
    'height': {
        'default': 30
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
    'padding': {
        'default': undefined
    },
    'value': {
        'default': ''
    },
    'editable': {
        'default': false
    },
    'data': {
        'default': []
    }
};
exports.data = {
    'valueData': 0,
    'valueIndex': 0
};
exports.watch = {
    'data': {
        handler: function () {
            if (this.dataComp[this.valueIndex]) {
                return;
            }
            this.valueIndex = this.dataComp.length - 1;
            if (!this.editable) {
                this.valueData = this.valueIndex >= 0 ? this.dataComp[this.valueIndex].value : '';
                this.$emit('input', this.valueData);
            }
        }
    },
    'value': {
        handler: function () {
            if (this.valueData === this.value) {
                return;
            }
            this.valueData = this.value;
            for (let i = 0; i < this.dataComp.length; ++i) {
                if (this.dataComp[i].value !== this.value) {
                    continue;
                }
                this.valueIndex = i;
                return;
            }
            this.valueIndex = 0;
            if (!this.editable) {
                this.valueData = this.dataComp[0] ? this.dataComp[0].value : '';
                this.$emit('input', this.valueData);
            }
        },
        'immediate': true
    }
};
exports.computed = {
    'editableComp': function () {
        if (typeof this.editable === 'boolean') {
            return this.editable;
        }
        return this.editable === 'true' ? true : false;
    },
    'dataComp': function () {
        let data = [];
        for (let i = 0; i < this.data.length; ++i) {
            if (this.data[i].value) {
                data[i] = this.data[i];
                continue;
            }
            data[i] = {
                'value': this.data[i]
            };
        }
        return data;
    }
};
exports.methods = {
    input: function (index) {
        this.valueIndex = index;
        this.valueData = this.dataComp[index] ? this.dataComp[index].value : '';
        this.$emit('input', this.valueData);
    },
    tinput: function () {
        this.valueData = this.$refs.input.value;
        this.$emit('input', this.valueData);
        for (let i = 0; i < this.dataComp.length; ++i) {
            if (this.dataComp[i].value !== this.valueData) {
                continue;
            }
            this.valueIndex = i;
            return;
        }
        this.valueIndex = 0;
    }
};

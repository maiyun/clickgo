"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = exports.computed = exports.data = exports.props = void 0;
exports.props = {
    "disabled": {
        "default": false
    },
    "focus": {
        "default": false
    },
    "width": {
        "default": undefined
    },
    "height": {
        "default": 30
    },
    "left": {
        "default": 0
    },
    "top": {
        "default": 0
    },
    "zIndex": {
        "default": 0
    },
    "flex": {
        "default": ""
    },
    "padding": {
        "default": "7"
    },
    "value": {
        "default": undefined
    },
    "editable": {
        "default": false
    },
    "data": {
        "default": []
    }
};
exports.data = {
    "valueData": 0
};
exports.computed = {
    "editableComp": function () {
        if (typeof this.editable === "boolean") {
            return this.editable;
        }
        return this.editable === "true" ? true : false;
    },
    "dataComp": function () {
        var data = [];
        for (var i = 0; i < this.data.length; ++i) {
            if (this.data[i].value) {
                data[i] = this.data[i];
                continue;
            }
            data[i] = {
                "value": this.data[i]
            };
        }
        return data;
    }
};
exports.methods = {
    input: function (index) {
        this.valueData = index;
        this.$emit("input", this.dataComp[index].value);
    }
};

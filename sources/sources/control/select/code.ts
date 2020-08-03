export let props = {
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

export let data = {
    "valueData": 0
};

export let computed = {
    "editableComp": function(this: IVue): boolean {
        if (typeof this.editable === "boolean") {
            return this.editable;
        }
        return this.editable === "true" ? true : false;
    },
    "dataComp": function(this: IVue): any {
        let data = [];
        for (let i = 0; i < this.data.length; ++i) {
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

export let methods = {
    input: function(this: IVue, index: number): void {
        this.valueData = index;
        this.$emit("input", this.dataComp[index].value);
    }
};


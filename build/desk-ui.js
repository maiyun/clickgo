Vue.component("di-icon", {
    name: "DiIcon",
    template: "<span class=\"di-icon\" :class=\"classObject\" :style=\"styleObject\"></span>",
    props: ["margin",
        "icon"],
    computed: {
        classObject: function () {
            return "di-icon--" + this.icon;
        },
        styleObject: function () {
            return {
                "margin": this.margin && this.margin.replace(/ /g, "px ") + "px"
            };
        }
    }
});
Vue.component("di-layout", {
    name: "DiLayout",
    template: "<div class=\"di-layout\" :style=\"styleObject\"><slot></div>",
    props: ["margin", "flex", "padding", "radius", "opacity",
        "bgcolor", "direction", "type", "color"],
    computed: {
        styleObject: function () {
            return {
                "margin": this.margin && this.margin.replace(/ /g, "px ") + "px",
                "flex": this.flex,
                "padding": this.padding && this.padding.replace(/ /g, "px ") + "px",
                "border-radius": this.radius && this.radius.replace(/ /g, "px ") + "px",
                "opacity": this.opacity,
                "background-color": this.bgcolor,
                "flex-direction": (this.direction === "vertical" || this.direction === "v") && "column",
                "display": this.type,
                "color": this.color
            };
        }
    }
});
Vue.component("di-button-group", {
    name: "DiButtonGroup",
    template: "<div class=\"di-button-group\" :style=\"styleObject\"><slot></div>",
    props: ["margin", "flex", "padding", "radius", "opacity"],
    computed: {
        styleObject: function () {
            return {
                "margin": this.margin && this.margin.replace(/ /g, "px ") + "px",
                "flex": this.flex,
                "padding": this.padding && this.padding.replace(/ /g, "px ") + "px",
                "border-radius": this.radius && this.radius.replace(/ /g, "px ") + "px",
                "opacity": this.opacity
            };
        }
    }
});
Vue.component("di-button", {
    name: "DiButton",
    template: "<button :class=\"classObject\" :style=\"styleObject\" :disabled=\"isDisabled\" @click=\"click\"><span v-if=\"iconLeft\" :class=\"['di-icon', 'di-icon--' + icon]\"></span><span v-if=\"$slots.default\"><slot></slot></span><span v-if=\"iconRight\" :class=\"['di-icon', 'di-icon--' + icon]\"></span></button>",
    props: ["margin", "flex", "padding", "radius", "opacity",
        "type", "icon", "disabled", "icon-alien", "size"],
    computed: {
        isDisabled: function () {
            return this.disabled === "true" || this.disabled === true ? true : false;
        },
        iconLeft: function () {
            if (this.icon) {
                if (!this.iconAlien || this.iconAlien === "left")
                    return true;
            }
            return false;
        },
        iconRight: function () {
            if (this.icon) {
                if (this.iconAlien === "right")
                    return true;
            }
            return false;
        },
        classObject: function () {
            var o = ["di-button"];
            if (this.type) {
                o.push("di-button--" + this.type);
            }
            else {
                o.push("di-button--plain");
            }
            if (this.disabled === "true" || this.disabled === true) {
                o.push("is-disabled");
            }
            if (this.size) {
                if (this.size !== "" && this.size !== "normal")
                    o.push("di-button--" + this.size);
            }
            return o;
        },
        styleObject: function () {
            return {
                "margin": this.margin && this.margin.replace(/ /g, "px ") + "px",
                "flex": this.flex,
                "padding": this.padding && this.padding.replace(/ /g, "px ") + "px",
                "border-radius": this.radius && this.radius.replace(/ /g, "px ") + "px",
                "opacity": this.opacity
            };
        },
        iconDom: function () {
            if (this.icon) {
                return "<span class=\"di-icon di-icon--" + this.icon + "\" style=\"margin-right: 5px;\"></span>";
            }
            return "";
        }
    },
    methods: {
        click: function () {
            this.$emit("click");
        }
    }
});
Vue.component("di-checkbox", {
    name: "DiCheckbox",
    template: "<label class=\"di-checkbox\":class=\"{'is-disabled': isDisabled}\" :style=\"styleObject\"><span class=\"di-checkbox__input\"><span class=\"di-checkbox__inner\" :class=\"{'is-checked': isChecked}\"></span><input type=\"checkbox\" class=\"di-checkbox__original\" :value=\"label\" :checked=\"isChecked\" :disabled=\"isDisabled\" v-model=\"isChecked\"></span><span class=\"di-checkbox__label\">{{label}}</span></label>",
    props: ["margin", "flex", "padding", "radius", "opacity",
        "label", "checked", "disabled"],
    data: function () {
        return {
            isChecked: false,
            inGroup: this.$parent.$options.name === "DiCheckboxGroup"
        };
    },
    created: function () {
        if (this.checked && (this.checked === true || this.checked === "true"))
            this.isChecked = true;
    },
    computed: {
        isDisabled: function () {
            return this.disabled === "true" || this.disabled === true ? true : false;
        },
        styleObject: function () {
            return {
                "margin": this.margin && this.margin.replace(/ /g, "px ") + "px",
                "flex": this.flex,
                "padding": this.padding && this.padding.replace(/ /g, "px ") + "px",
                "border-radius": this.radius && this.radius.replace(/ /g, "px ") + "px",
                "opacity": this.opacity
            };
        }
    },
    watch: {
        isChecked: function (val, old) {
            if (!this.inGroup) {
                this.$emit("input", val);
            }
            else {
                if (val) {
                    this.$parent.checkList.push(this.label);
                }
                else {
                    this.$parent.checkList.splice(this.$parent.checkList.indexOf(this.label), 1);
                }
            }
        }
    }
});
Vue.component("di-checkbox-group", {
    name: "DiCheckboxGroup",
    template: "<div class=\"di-checkbox-group\" :style=\"styleObject\"><slot></slot></div>",
    props: ["margin", "flex", "padding", "radius", "opacity"],
    data: function () {
        return {
            checkList: []
        };
    },
    computed: {
        styleObject: function () {
            return {
                "margin": this.margin && this.margin.replace(/ /g, "px ") + "px",
                "flex": this.flex,
                "padding": this.padding && this.padding.replace(/ /g, "px ") + "px",
                "border-radius": this.radius && this.radius.replace(/ /g, "px ") + "px",
                "opacity": this.opacity
            };
        }
    },
    watch: {
        checkList: function (val, old) {
            this.$emit("input", val);
            this.$emit("change", val);
        }
    }
});
//# sourceMappingURL=desk-ui.js.map
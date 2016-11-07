/* ------------ *
 * --- Icon --- *
 * ------------ */

Vue.component("di-icon", {
    template: `<span class="di-icon" :class="classObject" :style="styleObject"></span>`,
    props: ["margin",
        "icon"],
    computed: {
        classObject: function(): Object {
            return "di-icon--" + this.icon;
        },
        styleObject: function(): Object {
            return {
                "margin": this.margin && this.margin.replace(/ /g, "px ") + "px"
            };
        }
    }
});

/* -------------- *
 * --- Layout --- *
 * -------------- */

Vue.component("di-layout", {
    template: `<div class="di-layout" :style="styleObject"><slot></div>`,
    props: ["margin", "flex", "padding", "radius", "opacity",
        "bgcolor", "direction", "type", "color"],
    computed: {
        styleObject: function(): Object {
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

/* ------------------- *
 * --- ButtonGroup --- *
 * ------------------- */

Vue.component("di-button-group", {
    template: `<div class="di-button-group" :style="styleObject"><slot></div>`,
    props: ["margin", "flex", "padding", "radius", "opacity"],
    computed: {
        styleObject: function(): Object {
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

/* -------------- *
 * --- Button --- *
 * -------------- */

Vue.component("di-button", {
    template: `<button :class="classObject" :style="styleObject" :disabled="isDisabled" @click="click"><span v-if="iconLeft" :class="['di-icon', 'di-icon--' + icon]"></span><span v-if="$slots.default"><slot></slot></span><span v-if="iconRight" :class="['di-icon', 'di-icon--' + icon]"></span></button>`,
    props: ["margin", "flex", "padding", "radius", "opacity",
        "type", "icon", "disabled", "icon-alien", "size"],
    computed: {
        isDisabled: function(): boolean {
            return this.disabled === "true" || this.disabled === true ? true : false;
        },
        iconLeft: function(): boolean {
            if (this.icon) {
                if (!this.iconAlien || this.iconAlien === "left")
                    return true;
            }
            return false;
        },
        iconRight: function(): boolean {
            if (this.icon) {
                if (this.iconAlien === "right")
                    return true;
            }
            return false;
        },
        classObject: function(): Object {
            let o = ["di-button"];
            if (this.type) {
                o.push("di-button--" + this.type);
            } else {
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
        styleObject: function(): Object {
            return {
                "margin": this.margin && this.margin.replace(/ /g, "px ") + "px",
                "flex": this.flex,
                "padding": this.padding && this.padding.replace(/ /g, "px ") + "px",
                "border-radius": this.radius && this.radius.replace(/ /g, "px ") + "px",
                "opacity": this.opacity
            };
        },
        iconDom: function(): string {
            if (this.icon) {
                return `<span class="di-icon di-icon--${this.icon}" style="margin-right: 5px;"></span>`;
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

/* ---------------- *
 * --- Checkbox --- *
 * ---------------- */

Vue.component("di-checkbox", {
    template: `<label class="di-checkbox":class="{'is-disabled': isDisabled}" :style="styleObject"><span class="di-checkbox__input"><span class="di-checkbox__inner" :class="{'is-checked': isChecked}"></span><input type="checkbox" class="di-checkbox__original" :value="label" :checked="isChecked" :disabled="isDisabled" v-model="isChecked"></span><span class="di-checkbox__label">{{label}}</span></label>`,
    props: ["margin", "flex", "padding", "radius", "opacity",
        "label", "checked", "disabled"],
    data: function() {
        return {
            isChecked: false
        };
    },
    created: function () {
        if (this.checked && (this.checked === true || this.checked === "true"))
            this.isChecked = true;
    },
    computed: {
        isDisabled: function(): boolean {
            return this.disabled === "true" || this.disabled === true ? true : false;
        },
        styleObject: function(): Object {
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
        isChecked: function(val, old) {
            this.$emit("input", val);
        }
    }
});
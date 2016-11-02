document.addEventListener("DOMContentLoaded", function(): void {
    /* --- Icon --- */
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

    /* --- Layout --- */
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

    /* --- Button --- */
    Vue.component("di-button", {
        template: `<button class="di-button" :class="classObject" :style="styleObject"><span v-if="icon" :class="['di-icon', 'di-icon--' + icon]" style="margin-right: 5px;"></span><slot></button>`,
        props: ["margin", "flex", "padding", "radius", "opacity",
            "type", "icon"],
        computed: {
            classObject: function(): Object {
                return {
                    "di-button--primary": this.type === "primary"
                };
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
        }
    });
    /* --- Init --- */
    new Vue({
        el: "#desk-ui",
    });
}, false);
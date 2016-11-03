document.addEventListener("DOMContentLoaded", function(): void {
    /* --- Init --- */
    new Vue({
        el: "#desk-ui",
        data: {
            buttonGlDis: "false",
            buttonGl2Dis: "false"
        },
        methods: {
            buttonGl: function(): void {
                this.buttonGlDis = this.buttonGlDis === "false" ? "true" : "false";
            },
            buttonGl2: function(): void {
                this.buttonGl2Dis = this.buttonGl2Dis === "false" ? "true" : "false";
            }
        }
    });
}, false);
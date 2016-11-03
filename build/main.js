document.addEventListener("DOMContentLoaded", function () {
    new Vue({
        el: "#desk-ui",
        data: {
            buttonGlDis: "false",
            buttonGl2Dis: "false"
        },
        methods: {
            buttonGl: function () {
                this.buttonGlDis = this.buttonGlDis === "false" ? "true" : "false";
            },
            buttonGl2: function () {
                this.buttonGl2Dis = this.buttonGl2Dis === "false" ? "true" : "false";
            }
        }
    });
}, false);
//# sourceMappingURL=main.js.map
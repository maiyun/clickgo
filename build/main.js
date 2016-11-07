document.addEventListener("DOMContentLoaded", function () {
    new Vue({
        el: "#desk-ui",
        data: {
            buttonGlDis: "false",
            buttonGl2Dis: "false",
            buttonGroupNextIcon: "arrow-right",
            checkboxBtnDis: "false",
            checkboxBtnText: "false",
            checkboxCheckList: []
        },
        methods: {
            buttonGl: function () {
                this.buttonGlDis = this.buttonGlDis === "false" ? "true" : "false";
            },
            buttonGl2: function () {
                this.buttonGl2Dis = this.buttonGl2Dis === "false" ? "true" : "false";
            },
            buttonGroupNext: function () {
                this.buttonGroupNextIcon = "loading";
                setTimeout((function () {
                    this.buttonGroupNextIcon = "arrow-right";
                }).bind(this), 100);
            },
            checkboxBtn: function () {
                this.checkboxBtnDis = this.checkboxBtnDis === "false" ? "true" : "false";
            }
        }
    });
}, false);
//# sourceMappingURL=main.js.map
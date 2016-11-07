document.addEventListener("DOMContentLoaded", function(): void {
    /* --- Init --- */
    new Vue({
        el: "#desk-ui",
        data: {
            // --- 按钮 ---
            buttonGlDis: "false",
            buttonGl2Dis: "false",
            // --- 按钮组 ---
            buttonGroupNextIcon: "arrow-right",
            // --- 复选框 ---
            checkboxBtnDis: "false",
            checkboxBtnText: "false"
        },
        methods: {
            // --- 按钮 ---
            buttonGl: function(): void {
                this.buttonGlDis = this.buttonGlDis === "false" ? "true" : "false";
            },
            buttonGl2: function(): void {
                this.buttonGl2Dis = this.buttonGl2Dis === "false" ? "true" : "false";
            },
            // --- 按钮组 ---
            buttonGroupNext: function(): void {
                this.buttonGroupNextIcon = "loading";
                setTimeout((function(): void {
                    this.buttonGroupNextIcon = "arrow-right";
                }).bind(this), 100);
            },
            // --- 复选框 ---
            checkboxBtn: function(): void {
                this.checkboxBtnDis = this.checkboxBtnDis === "false" ? "true" : "false";
            }
        }
    });
}, false);
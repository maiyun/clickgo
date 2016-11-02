document.addEventListener("DOMContentLoaded", function () {
    Vue.component("di-button", {
        template: "<button class=\"di-button\"><slot></button>"
    });
    new Vue({
        el: "#desk-ui",
    });
}, false);
//# sourceMappingURL=desk-ui.js.map
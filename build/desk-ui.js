document.addEventListener("DOMContentLoaded", function () {
    Vue.component("du-button", {
        template: "<button class=\"du-button\"><slot></button>"
    });
    new Vue({
        el: "#desk-ui",
    });
}, false);
//# sourceMappingURL=desk-ui.js.map
document.addEventListener("DOMContentLoaded", function(): void {
    /* --- Button --- */
    Vue.component("di-button", {
        template: `<button class="di-button"><slot></button>`
    });
    /* --- Init --- */
    new Vue({
        el: "#desk-ui",
    });
}, false);
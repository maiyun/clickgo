document.addEventListener("DOMContentLoaded", function(): void {
    /* --- Button --- */
    Vue.component("du-button", {
        template: `<button class="du-button"><slot></button>`
    });
    /* --- Init --- */
    new Vue({
        el: "#desk-ui",
    });
}, false);
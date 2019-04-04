define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function random(min, max) {
        var choices = max - min + 1;
        return Math.floor(Math.random() * choices + min);
    }
    var nameList = [
        "Agnes", "Baade", "Cahill", "Dagmar", "Earl", "Fabian", "Gabriel", "Hackett", "Ian", "Jack Ma", "Kaley", "Lacey", "Mabel", "Nadine", "Oakes", "Pony", "Queenie", "Robin", "Sabina", "Tabitha", "Ulysses", "Val", "Waddell", "Xavier", "Yarbrough", "Zachariah"
    ];
    exports.data = {
        name: "",
        age: ""
    };
    exports.methods = {
        onOpen: function () {
            this.rebuild();
        },
        add: function () {
            this.$global.gList.push({ name: this.name, age: this.age });
            this.rebuild();
        },
        del: function (index) {
            this.$global.gList.splice(index, 1);
        },
        rebuild: function () {
            this.age = random(10, 40);
            this.name = nameList[Math.floor(Math.random() * nameList.length)];
        }
    };
});

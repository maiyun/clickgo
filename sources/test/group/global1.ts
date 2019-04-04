function random(min: number, max: number) {
    let choices = max - min + 1;
    return Math.floor(Math.random() * choices + min);
}

let nameList: string[] = [
    "Agnes", "Baade", "Cahill", "Dagmar", "Earl", "Fabian", "Gabriel", "Hackett", "Ian", "Jack Ma", "Kaley", "Lacey", "Mabel", "Nadine", "Oakes", "Pony", "Queenie", "Robin", "Sabina", "Tabitha", "Ulysses", "Val", "Waddell", "Xavier", "Yarbrough", "Zachariah"
];

export let data = {
    name: "",
    age: ""
};

export let methods = {
    onOpen: function(this: any) {
        this.rebuild();
    },
    add: function(this: any) {
        this.$global.gList.push({name: this.name, age: this.age});
        this.rebuild();
    },
    del: function(this: any, index: number) {
        (<any[]>this.$global.gList).splice(index, 1);
    },
    rebuild: function(this: any) {
        this.age = random(10, 40);
        this.name = nameList[Math.floor(Math.random() * nameList.length)];
    }
};
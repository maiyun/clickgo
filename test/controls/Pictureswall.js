"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var datetime = require("../libs/date");
exports.data = {
    list: [],
    linkage: [],
    infos: [],
    dialogVisible: false,
    picList: {
        "pic1.jpg": "Earth",
        "pic2.jpg": "Moon",
        "pic3.jpg": "Sun"
    },
    selectPic: "pic1.jpg"
};
exports.methods = {
    select: function () {
        this.dialogVisible = true;
        this.infos.push({
            time: datetime.date(),
            event: "select",
            info: ""
        });
    },
    remove: function (index) {
        this.linkage.splice(index, 1);
        this.infos.push({
            time: datetime.date(),
            event: "remove",
            info: "index:" + index
        });
    },
    ok: function () {
        this.dialogVisible = false;
        this.list.push(this.selectPic);
        this.linkage.push(this.picList[this.selectPic]);
    }
};

import * as datetime from "../libs/date";

export let data = {
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

export let methods = {
    select: function(this: any) {
        this.dialogVisible = true;
        this.infos.push({
            time: datetime.date(),
            event: "select",
            info: ""
        });
    },
    remove: function(this: any, index: number) {
        this.linkage.splice(index, 1);
        this.infos.push({
            time: datetime.date(),
            event: "remove",
            info: "index:" + index
        });
    },
    ok: function(this: any) {
        this.dialogVisible = false;
        this.list.push(this.selectPic);
        this.linkage.push(this.picList[this.selectPic]);
    }
};
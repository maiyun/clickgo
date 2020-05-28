import * as fs from "fs";

async function run(): Promise<void> {
    let list = await fs.promises.readdir("dist/sources/control/", {
        "withFileTypes": true
    });
    for (let item of list) {
        if (item.isFile()) {
            continue;
        }
        let base = "dist/sources/control/" + item.name;

        // --- 读取 config 文件 ---
        let config = await fs.promises.readFile(base + "/config.json", {
            "encoding": "utf-8"
        });
        /** --- config 对象 --- */
        let configJson = JSON.parse(config);

        let configBuffer = Buffer.from(config);
        let controlBufferArray: Uint8Array[] = [new Uint8Array([12]), Buffer.from("/config.json"), Buffer.from(Uint32Array.from([configBuffer.byteLength]).buffer), configBuffer];

        for (let fpath of configJson.files) {
            let content = await fs.promises.readFile(base + fpath);
            let nameBuffer = Buffer.from(fpath);
            controlBufferArray.push(Uint8Array.from([nameBuffer.byteLength]), nameBuffer, Buffer.from(Uint32Array.from([content.byteLength]).buffer), content);
        }
        let controlBuffer = Buffer.concat(controlBufferArray);

        // --- 组成 cgc 文件 ---
        let nameBuffer = Buffer.from(configJson.name);
        let fileBuffer = Buffer.concat([Buffer.from([192, 1]), Uint8Array.from([nameBuffer.byteLength]), nameBuffer, Buffer.from(Uint32Array.from([controlBuffer.byteLength]).buffer), controlBuffer]);

        await fs.promises.writeFile("dist/control/" + configJson.name + ".cgc", fileBuffer);
    }
}
run().catch(function(e) {
    console.log(e);
});


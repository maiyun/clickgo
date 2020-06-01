import * as fs from "fs";

async function getSingleControlBlob(base: string): Promise<Buffer> {
    // --- 读取 config 文件 ---
    let config = await fs.promises.readFile(base + "/config.json", {
        "encoding": "utf-8"
    });
    /** --- config 对象 --- */
    let configJson = JSON.parse(config);
    let configBuffer = Buffer.from(config);
    // --- 单控件主体 ---
    let controlBufferArray: Uint8Array[] = [Uint8Array.from([12]), Buffer.from("/config.json"), Buffer.from(Uint32Array.from([configBuffer.byteLength]).buffer), configBuffer];

    for (let fpath of configJson.files) {
        let content = await fs.promises.readFile(base + fpath);
        let nameBuffer = Buffer.from(fpath);
        controlBufferArray.push(
            Uint8Array.from([nameBuffer.byteLength]),
            nameBuffer,
            Buffer.from(Uint32Array.from([content.byteLength]).buffer),
            content
        );
    }
    let controlBuffer = Buffer.concat(controlBufferArray);

    let nameBuffer = Buffer.from(configJson.name);
    controlBuffer = Buffer.concat([
        Uint8Array.from([nameBuffer.byteLength]),
        nameBuffer,
        Buffer.from(Uint32Array.from([controlBuffer.byteLength]).buffer),
        controlBuffer
    ]);
    return controlBuffer;
}

async function run(): Promise<void> {
    // --- control to cgc ---
    let list = await fs.promises.readdir("dist/sources/control/", {
        "withFileTypes": true
    });
    for (let item of list) {
        if (item.isFile()) {
            continue;
        }
        if (["menu-item"].includes(item.name)) {
            continue;
        }
        let base = "dist/sources/control/" + item.name;

        let controlBuffer = await getSingleControlBlob(base);
        if (item.name === "menu") {
            controlBuffer = Buffer.concat([controlBuffer, await getSingleControlBlob("dist/sources/control/menu-item")]);
        }

        // --- 组成 cgc 文件 ---
        let fileBuffer = Buffer.concat([
            Uint8Array.from([192, 1]),
            controlBuffer
        ]);
        await fs.promises.writeFile("dist/control/" + item.name + ".cgc", fileBuffer);
    }
    // --- theme to cgt ---
    list = await fs.promises.readdir("dist/sources/theme/", {
        "withFileTypes": true
    });
    for (let item of list) {
        if (item.isFile()) {
            continue;
        }
        let base = "dist/sources/theme/" + item.name;

        // --- 读取 config 文件 ---
        let config = await fs.promises.readFile(base + "/config.json", {
            "encoding": "utf-8"
        });
        /** --- config 对象 --- */
        let configJson = JSON.parse(config);
        let configBuffer = Buffer.from(config);

        let fileBufferArray: Uint8Array[] = [
            Uint8Array.from([192, 2]),
            Uint8Array.from([12]),
            Buffer.from("/config.json"),
            Buffer.from(Uint32Array.from([configBuffer.byteLength]).buffer),
            configBuffer
        ];
        for (let fpath of configJson.files) {
            let content = await fs.promises.readFile(base + fpath);
            let nameBuffer = Buffer.from(fpath);
            fileBufferArray.push(
                Uint8Array.from([nameBuffer.byteLength]),
                nameBuffer,
                Buffer.from(Uint32Array.from([content.byteLength]).buffer),
                content
            );
        }

        // --- 组成 cgt 文件 ---
        await fs.promises.writeFile("dist/theme/" + configJson.name + ".cgt", Buffer.concat(fileBufferArray));
    }
}
run().catch(function(e) {
    console.log(e);
});


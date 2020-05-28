ClickGo.loaderConfig({
    "after": "?" + Math.random().toString()
});
ClickGo.config({
    "offsetHeight": -40
});
ClickGo.onReady(async function() {
    let el = document.getElementById("tip");
    if (!el) {
        return;
    }
    el.innerHTML = "Starting system app...";
    // --- 监听错误 ---
    ClickGo.errorHandler = function(taskId, formId, error, info) {
        if (!el) {
            return;
        }
        let err = document.getElementById("err") as HTMLElement;
        err.style.display = "block";
        err.innerHTML = "Error, Task ID: " + taskId + ", Form ID: " + formId + "<br>" + error.stack.replace(/\n/g, "<br>");
        ClickGo.endTask(taskId);
    };
    // --- 监听任务关闭 ---
    ClickGo.taskEndedHandler = function(taskId: number) {
        el!.innerHTML = "Task ended.";
    };
    // --- 启动 sapp ---
    let sTaskId = await ClickGo.runApp("sapp/");
    if (!sTaskId) {
        el.innerHTML = "Start failed.";
        return;
    }
    // --- sapp 启动成功 ---
    el.innerHTML = "Starting app...";
    let taskId = await ClickGo.runApp("app/");
    if (!taskId) {
        el.innerHTML = "Start failed.";
        return;
    }
    el.innerHTML = "Running...";
    document.getElementsByTagName("body")[0].classList.add("running");
});


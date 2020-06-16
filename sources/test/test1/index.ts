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
        console.log(info, error);
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
    if (sTaskId <= 0) {
        el.innerHTML = "Start failed(" + sTaskId.toString() + ").";
        return;
    }
    // --- sapp 启动成功 ---
    el.innerHTML = "Starting app...";
    let taskId = await ClickGo.runApp("app/");
    if (taskId <= 0) {
        el.innerHTML = "Start failed(" + taskId.toString() + ").";
        return;
    }
    el.innerHTML = "Running...";
    document.getElementsByTagName("body")[0].classList.add("running");
});


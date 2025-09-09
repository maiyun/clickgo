postMessage({ hasInstalled: true });

let offscreenCanvas;
let webgl;
let decoderType;

this.onmessage = (event) => {
    const { data } = event;
    const { cmd } = data;

    if (cmd === 'init') {
        const { canvas, options, scripts } = data;

        self.importScripts(...scripts);
        const WebGL = self.webgl.default;

        offscreenCanvas = canvas;
        webgl = new WebGL(canvas, options);
        decoderType = options.decoderType;
        return;
    }

    if (cmd === 'render') {
        const { frame, width, height, yLength, uvLength } = data;

        offscreenCanvas.width = width;
        offscreenCanvas.height = height;

        if (decoderType === 'webcodecs') {
            webgl && webgl.renderFrame(frame, width, height);
            if (!webgl) frame.close();
        } else {
            webgl && webgl.renderFrame(frame, width, height, yLength, uvLength);
        }
    } else if (cmd === 'display') {
        const { options } = data;
        webgl && webgl.setDisplayInfo(options);
    } else if (cmd === 'close') {
        webgl && webgl.dispose();
        this.close();
    }
};

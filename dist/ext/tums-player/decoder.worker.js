/*
 * Author: Liu Ninggang
 * File Created: Monday, 27th September 2021 10:28:13 am
 * Last Modified: Wednesday, 29th September 2021 5:36:21 pm
 * Modified By: Liu Ninggang
 * Copyright (c) 2021 TP-LINK
 */

/* eslint-disable */

let inputBuffer;
let outputBuffer;
let has_init = 0;
let width, height;
let dataSeq;
let decoderType;
let videoDecoder;
let dataParams = {};
var Module = {};

postMessage({ hasInstalled: true });

const initVideoDecoder = () => {
    videoDecoder = new VideoDecoder({
        output: async (frame) => {
            let { timestamp, format, codedWidth, codedHeight } = frame;
            let param = dataParams[timestamp] || {};
            postMessage({ data: frame, width: codedWidth, height: codedHeight, timestamp, seq: param.seq, format }, [frame]);
            frame.close();
            delete dataParams[timestamp];
        },
        error: (err) => {
            console.log('video decoder error: ', err);
            postMessage({ decodeError: err, state: videoDecoder.state });
        }
    });
    has_init = 1;
};

const initWasmDecoder = (scripts = [], wasmBinary) => {
    Module.wasmBinary = wasmBinary;
    self.importScripts(...scripts);

    Module.onRuntimeInitialized = function () {
        Module._hevc_decoder_init();
        this.bufferLen = 2304 * 1296 * 8;
        inputBuffer = Module._malloc(this.bufferLen);
        outputBuffer = Module._malloc(this.bufferLen);
        width = Module._malloc(4);
        height = Module._malloc(4);
        has_init = 1;
        postMessage({ hasInit: true });
    };
};

this.onmessage = async function (event) {
    let { cmd } = event.data;
    if (cmd === 'init') {
        decoderType = event.data.decoderType;
        let { scripts, wasmBinary } = event.data;

        if (decoderType === 'wasm') {
            initWasmDecoder(scripts, wasmBinary);
        } else if (decoderType === 'webcodecs') {
            postMessage({ hasInit: true });
        } else {
            initVideoDecoder();
            initWasmDecoder(scripts, wasmBinary);
        }
    } else if (cmd === 'webcodecs_config') {
        initVideoDecoder();

        let { data } = event;
        let config = {
            codec: data.codec,
            codeWidth: data.width,
            codeHeight: data.height
        };
        videoDecoder.configure(config);
        width = data.width;
        height = data.height;
        postMessage({ hasWebcodecsConfig: true });
    } else if (cmd === 'decode') {
        if (!has_init) {
            return;
        }

        let chunk = new Uint8Array(event.data.data);
        let { code_type, pts, timestamp, seq, type } = event.data;

        if (decoderType === 'webcodecs') {
            if (videoDecoder.state === 'unconfigured' || videoDecoder.state === 'closed') return;

            let encodedVideoChunk = new EncodedVideoChunk({
                type,
                timestamp,
                data: chunk
            });
            videoDecoder.decode(encodedVideoChunk);
            dataParams[timestamp] = { timestamp, seq, type };
        } else {
            Module.HEAP8.set(chunk, inputBuffer);
            if (seq) {
                dataSeq = seq;
            }

            let len = Module._hevc_to_yuv(code_type, inputBuffer, chunk.length, outputBuffer, width, height);
            if (len > 0) {
                let data1 = Module.HEAPU8.subarray(width, width + 4);
                let result_width = data1[0] + data1[1] * 256;
                let data2 = Module.HEAPU8.subarray(height, height + 4);
                let result_height = data2[0] + data2[1] * 256;

                let outArray = Module.HEAPU8.subarray(outputBuffer, outputBuffer + len);
                let outputData = new Uint8Array(outArray);
                if (dataSeq) {
                    seq = dataSeq;
                    dataSeq = 0;
                }
                postMessage({ data: outputData, pts: pts, width: result_width, height: result_height, timestamp, seq }, [outputData.buffer]);
            }
        }
    } else if (cmd === 'close') {
        if (videoDecoder && videoDecoder.state === 'configured') {
            videoDecoder.close();
        }
        close();
    }
};

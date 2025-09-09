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
let finalInputBuffer;
let finalOutputBuffer;
let has_init = 0;
let isG726 = true;
var Module = {};

postMessage({ hasInstalled: true });

this.onmessage = function (event) {
    let { cmd } = event.data;
    if (cmd === 'init') {
        let { scripts, wasmBinary } = event.data;
        Module.wasmBinary = wasmBinary;
        self.importScripts(...scripts);
        return;
    }
    if (!Module['asm']) return;

    if (!has_init) {
        Module._tp_ns2_init(event.data.samplerate || 8000);
        has_init = 1;
        inputBuffer = Module._malloc(1024 * 2);
        outputBuffer = Module._malloc(1024 * 2);
        finalOutputBuffer = Module._malloc(1024 * 2);
        postMessage({ hasInit: true });
        return;
    }
    let { dts, pts, timestamp, seq, type, samplerate, bitCount, decoderType } = event.data;
    let param = {
        pts: pts,
        dts: dts,
        timestamp: timestamp,
        seq: seq,
        type: type,
        samplerate: samplerate,
        bitCount: bitCount
    };
    const chunk = event.data.data;
    Module.HEAPU8.set(chunk, inputBuffer);
    let chunk_num;
    if (decoderType === '_decodeG726') {
        if (isG726) {
            Module._initG726State(0, bitCount);
            isG726 = false;
        }
        chunk_num = Module._decodeG726(0, inputBuffer, chunk.length, outputBuffer);
        if (chunk_num === 1) {
            let getLength = ((chunk.length << 4) / bitCount) >>> 1;
            Module._tp_ns2_process(outputBuffer, getLength, finalOutputBuffer);
            let finalOutArray = Module.HEAP16.subarray(finalOutputBuffer >> 1, (finalOutputBuffer + getLength * 2) >> 1);
            finalOutArray = new Int16Array(finalOutArray);
            postMessage({
                data: finalOutArray.buffer,
                ...param
            });
        }
    } else if (decoderType === '_decodeAAC') {
        var pcmLen = Module._decodeAAC(outputBuffer, inputBuffer, chunk.length);

        if (pcmLen >= 0) {
            Module._tp_ns2_process(outputBuffer, pcmLen, finalOutputBuffer);
            let finalOutArray = Module.HEAP16.subarray(finalOutputBuffer >> 1, (finalOutputBuffer + pcmLen * 2) >> 1);
            finalOutArray = new Int16Array(finalOutArray);
            postMessage({
                data: finalOutArray.buffer,
                ...param
            });
        }
    } else {
        chunk_num = Module[decoderType](outputBuffer, inputBuffer, chunk.length);
        if (chunk_num === 1) {
            Module._tp_ns2_process(outputBuffer, chunk.length, finalOutputBuffer);
            let finalOutArray = Module.HEAP16.subarray(finalOutputBuffer >> 1, (finalOutputBuffer + chunk.length * 2) >> 1);
            finalOutArray = new Int16Array(finalOutArray);
            postMessage({
                data: finalOutArray.buffer,
                ...param
            });
        }
    }
};

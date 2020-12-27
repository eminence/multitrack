import { createTextChangeRange } from "../node_modules/typescript/lib/typescript.js";
import init, * as mt from "./multitrack.js";

const ctx: Worker = self as any;

console.log("decode worker started");

let did_init = false;

// init().then(() => {
    
ctx.addEventListener("message", async (event) => {

    if (!did_init) {
        console.log("doing wasm init in decode worker");
        await init();
        did_init = true;
    }

    console.log("decode worker has message", event);
    const file: File = event.data[1];
    const port: MessagePort = event.data[2];

    const arr = new Uint8Array(await file.arrayBuffer());
    console.log("Sending bytes to webassembly decode", arr.byteLength, port);
    port.postMessage("message from decode_worker to audioworklet");
    mt.decode(arr);
// 
    // const reader = new FileReader();
    // reader.addEventListener('loadend', () => {
    //     const arr = new Uint8Array(reader.result as ArrayBuffer);
    //     console.log("Sending bytes to webassembly decode", arr.byteLength);
    //     mt.decode(arr);
    // });
    // reader.readAsArrayBuffer(file);
});
// });




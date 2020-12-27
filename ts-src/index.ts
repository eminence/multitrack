import init, * as mt from "./multitrack.js";

export function hello_from_ts() {
    const v = mt.add_two(19);
    console.log("hello from ts", v);
}

async function get_file(): Promise<File> {
    const handles = await (window as any).showOpenFilePicker();

    console.log(handles);

    const file: File = await handles[0].getFile();
    console.log(file.name);
    console.log(file);

    return file;
}


async function handle() {
    const ctx = new window.AudioContext();
    await ctx.audioWorklet.addModule('./pkg/wa_proc.js');
    const whiteNoiseNode = new AudioWorkletNode(ctx, 'white-noise-processor');
    whiteNoiseNode.connect(ctx.destination);

    const arr = new ArrayBuffer(6);
    whiteNoiseNode.port.postMessage(["hello", arr], [arr]);


    const file = await get_file();
    // pass file to new web worker to do the decoding

    const decode_worker = new Worker("./pkg/decode_worker.js",
    {type: "module"});
    decode_worker.postMessage(["hello from main thread", file, whiteNoiseNode.port], [whiteNoiseNode.port]);
}

export async function init_webaudio(elem: HTMLElement) {
    await init();

    hello_from_ts();

    elem.onclick = handle;

   
}

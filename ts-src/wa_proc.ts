class WhiteNoiseProcessor extends AudioWorkletProcessor {
  /** How many samples have been written out */
  private sample_count: number;

  constructor(...args: any[]) {
    super(...args);
    this.sample_count = 0;
    this.port.onmessage = (m) => {
      console.log("worklet processor have message", m);
      console.log(this.port);
    }
  }

  process(inputs: Array<Array<Float32Array>>, outputs: Array<Array<Float32Array>>, parameters: Record<string, Float32Array>) {
    const output = outputs[0]
    output.forEach(channel => {
      for (let i = 0; i < channel.length; i++) {
        channel[i] = (Math.random() * 2 - 1) / 100.0;
      }
    });

    return true
  }

}

registerProcessor('white-noise-processor', WhiteNoiseProcessor)
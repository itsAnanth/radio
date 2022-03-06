interface Visualizer {
    audio: HTMLAudioElement;
    audioContext: AudioContext;
    src: MediaElementAudioSourceNode;
    analyzer: AnalyserNode;
    bufferLength: number;
    data: Uint8Array;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;
    bar: { width: number, height: number };
    color: string;
    theme: number;
}

export type { Visualizer };


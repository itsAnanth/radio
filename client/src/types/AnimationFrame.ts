interface AnimationFrame {
    requestId: number;
    fps: number;
    callback: (delta: number) => any | Promise<any>;
    fn: (() => any | Promise<any>)[]
}

export type { AnimationFrame as IAF }; 
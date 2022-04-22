import type { Visualizer as IVisualizer } from '../../types/Visualizer';

interface Visualizer extends IVisualizer { };

class Visualizer {

    constructor(audio: HTMLAudioElement, canvas: HTMLCanvasElement) {
        /** Audio part*/
        this.audio = audio;
        this.audioContext = null;
        this.src = null;
        this.analyzer = null;
        this.bufferLength = null;
        this.data = null

        /** Canvas rendering part */
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;

        /** Bar */
        this.bar = { width: 0, height: 0 };
        this.color = '#B026FF';
        this.theme = Math.floor(Math.random() * 300);

        /** holders */
        // @ts-ignore
        this.elapsed = document.getElementById('elapsed');
    }

    connect() {
        this.audioContext = new AudioContext();
        !this.src && (this.src = this.audioContext.createMediaElementSource(this.audio));
        this.analyzer = this.audioContext.createAnalyser();
        this.src.connect(this.analyzer);

        this.analyzer.connect(this.audioContext.destination);
        this.analyzer.fftSize = 256;

        this.bufferLength = this.analyzer.frequencyBinCount;
        this.data = new Uint8Array(this.bufferLength);

        this.bar.width = (this.width / this.bufferLength) * 2.5;
    }

    async render(handleStart: () => Promise<any>) {
        // requestAnimationFrame(this.render.bind(this, handleStart));
        if (~~this.audio.duration !== 0 && ~~this.audio.currentTime >= ~~this.audio.duration) {
            this.src.disconnect();
            this.analyzer.disconnect();
            return await handleStart();
        }


        let dx = 0;
        this.analyzer.getByteFrequencyData(this.data);

        // this.ctx.clearRect(0, 0, this.width, this.height);

        for (let i = 0; i < this.bufferLength; i++) {
            let maxH = (this.data[i] * 2) * 95 / 100;
            this.bar.height = Math.max(maxH / 2, 1);

            let r = this.bar.height + (this.theme * (i / this.bufferLength)),
                g = this.theme * (i / this.bufferLength),
                b = this.theme;


            this.ctx.fillStyle = `rgb(${r},${g},${b})`//this.color;

            this.ctx.fillRect(dx, this.height / 2, this.bar.width, this.bar.height);
            this.ctx.fillRect(dx, this.height / 2 - this.bar.height, this.bar.width, this.bar.height);
            dx += this.bar.width + 1;
        }

    }

    convertTime(time: number) {
        let mins: string | number = Math.floor(time / 60);
        if (mins < 10)
            mins = '0' + String(mins);

        let secs: string | number = Math.floor(time % 60);
        if (secs < 10)
            secs = '0' + String(secs);


        return `${mins}:${secs}`;
    }
}

export default Visualizer;
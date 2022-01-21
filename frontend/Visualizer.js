const elapsed = document.getElementById('elapsed');

class Visualizer {
    /**
     * Creates a new visualizer
     * @param {HTMLAudioElement} audio 
     * @param {HTMLCanvasElement} canvas 
     */
    constructor(audio, canvas) {
        /** Audio part*/
        /** @type {HTMLAudioElement} */
        this.audio = audio;
        /** @type {AudioContext} */
        this.audioContext = null;
        /** @type {MediaElementAudioSourceNode} */
        this.src = null;
        /** @type {AnalyserNode} */
        this.analyzer = null;
        /** @type {number} */
        this.bufferLength = null;
        /** @type {Uint8Array} */
        this.data = null

        /** Canvas rendering part */
        /** @type {HTMLCanvasElement} */
        this.canvas = canvas;
        /** @type {CanvasRenderingContext2D} */
        this.ctx = canvas.getContext('2d');
        /** @type {number} */
        this.width = canvas.width;
        /** @type {number} */
        this.height = canvas.height;

        /** Bar */
        /** @type {{ width: number, height: number }} */
        this.bar = { width: 0, height: 0 };
        /** @type {string} */
        this.color = '#B026FF';
    }

    connect() {
        this.audioContext = new AudioContext();
        this.src = this.audioContext.createMediaElementSource(this.audio)
        this.analyzer = this.audioContext.createAnalyser();
        this.src.connect(this.analyzer);

        this.analyzer.connect(this.audioContext.destination);
        this.analyzer.fftSize = 256;

        this.bufferLength = this.analyzer.frequencyBinCount;
        this.data = new Uint8Array(this.bufferLength);

        this.bar.width = (this.width / this.bufferLength) * 2.5;
    }

    render() {
        requestAnimationFrame(this.render.bind(this));
        elapsed.innerHTML = isNaN(this.audio.duration) ? ('00:00 / 00:00') : (`${this.convertTime(this.audio.currentTime)} / ${this.convertTime(this.audio.duration)}`);
        let dx = 0;
        this.analyzer.getByteFrequencyData(this.data);

        this.ctx.clearRect(0, 0, this.width, this.height);

        for (let i = 0; i < this.bufferLength; i++) {
            let maxH = (this.data[i] * 2) * 95 / 100;
            this.bar.height = Math.max(maxH / 2, 1);

            let r = this.bar.height + (200 * (i / this.bufferLength)),
                g = 200 * (i / this.bufferLength),
                b = 200;


            this.ctx.fillStyle = `rgb(${r},${g},${b})`//this.color;

            this.ctx.fillRect(dx, this.height / 2, this.bar.width, this.bar.height);
            this.ctx.fillRect(dx, this.height / 2 - this.bar.height, this.bar.width, this.bar.height);
            dx += this.bar.width + 1;
        }

    }

    convertTime(time) {
        let mins = Math.floor(time / 60);
        if (mins < 10)
            mins = '0' + String(mins);

        let secs = Math.floor(time % 60);
        if (secs < 10)
            secs = '0' + String(secs);


        return `${mins}:${secs}`;
    }
}

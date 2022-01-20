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

        this.bar.width = (this.width / this.bufferLength) * 3;
    }

    render() {
        requestAnimationFrame(this.render.bind(this));
        let dx = 0;
        this.analyzer.getByteFrequencyData(this.data);

        this.ctx.clearRect(0, 0, this.width, this.height);

        for (let i = 0; i < this.bufferLength; i++) {
            let maxH = (this.data[i] * 2) * 90 / 100;
            this.bar.height = Math.max(maxH / 2, 1);

            let r = this.bar.height + (100 * (i / this.bufferLength)),
                g = 100 * (i / this.bufferLength),
                b = 100;


            this.ctx.fillStyle = `rgb(${r},${g},${b})`//this.color;

            this.ctx.fillRect(dx, this.height / 2, this.bar.width, this.bar.height);
            this.ctx.fillRect(dx, this.height / 2 - this.bar.height, this.bar.width, this.bar.height);
            dx += this.bar.width + 1;
        }

    }
}

import Visualizer from "./Visualizer.js";
const canvas = document.getElementById('canvas');
/** @type {HTMLInputElement} */
const colorPicker = document.getElementById('vis-col');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.onload = function() {
    /** @type {HTMLInputElement} */
    let file = document.getElementById('thefile'),
        /** @type {HTMLAudioElement} */
        audio = document.getElementById('audio');

    file.onchange = function() {
        let files = this.files;
        audio.src = URL.createObjectURL(files[0]);
        audio.load();
        audio.play()
        const visualizer = new Visualizer(audio, canvas);

        visualizer.connect();

        audio.play();
        visualizer.render()

        colorPicker.addEventListener('change', () => visualizer.color = colorPicker.value)
    }
}
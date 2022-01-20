const content = document.getElementById('content');
const canvas = document.getElementById('canvas');
/** @type {HTMLInputElement} */
const playBtn = document.getElementById('play');
const base = 'https://krapiv1.herokuapp.com';

resize(canvas);

window.addEventListener('resize', () => resize(canvas));

/** @type {HTMLAudioElement} */
let audio = null;

window.onload = async function () {
    window.paused = null;


    const count = await (await fetch(`${base}/count`)).json();
    playBtn.addEventListener('click', () => {
        if (!audio) {
            audio = document.createElement('audio');
        } else {
            audio.pause();
            audio.remove();
            audio = document.createElement('audio');
        }
        audio.src = `${base}/audio?index=${Math.floor(Math.random() * Number(count))}`;
        audio.crossOrigin = 'anonymous'

        content.appendChild(audio);

        __init__(audio);
    });
}

function __init__(audio) {
    audio.load();
    const visualizer = new Visualizer(audio, canvas);

    visualizer.connect();
    audio.play();
    visualizer.render();
}

function resize(canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
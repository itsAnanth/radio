const details = document.getElementById('details');
const content = document.getElementById('content');
const canvas = document.getElementById('canvas');
const volumetoggle = document.getElementById('volume-toggle');
/** @type {HTMLInputElement} */
const play = document.getElementById('play');
const base = 'https://krapiv1.herokuapp.com';

resize(canvas);

window.addEventListener('resize', () => resize(canvas));

/** @type {HTMLAudioElement} */
let audio = null;

window.onload = async function () {
    window.paused = null;
    window.muted = false;

    const count = await (await fetch(`${base}/count`)).json();

    volumetoggle.addEventListener('click', () => {
        if (window.muted) {
            window.muted = false;
            audio.volume = 1;
            volumetoggle.classList.remove('fa-volume-mute');
            volumetoggle.classList.add('fa-volume-up');
        } else {
            window.muted = true;
            audio.volume = 0;
            volumetoggle.classList.add('fa-volume-mute');
            volumetoggle.classList.remove('fa-volume-up');
        }
    })


    
    canvas.addEventListener('click', async() => {
        if (!audio) {
            audio = document.createElement('audio');
        } else {
            audio.pause();
            audio.remove();
            audio = document.createElement('audio');
        }
        play.innerHTML = 'Loading ...'
        const index = Math.floor(Math.random() * Number(count));
        audio.src = `${base}/audio?index=${index}`;
        audio.crossOrigin = 'anonymous';

        const track = await (await fetch(`${base}/track?index=${index}`)).json();
        track.success && (details.innerText = track.title)
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
    play.innerHTML = 'Click to Play'
}

function resize(canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
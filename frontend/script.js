const details = document.getElementById('details');
const content = document.getElementById('content');
const canvas = document.getElementById('canvas');
const volumetoggle = document.getElementById('volume-toggle');
const loader = document.getElementById('loader_div');
/** @type {HTMLInputElement} */
const play = document.getElementById('play');
const base = 'https://krapiv1.herokuapp.com';

resize(canvas);

window.addEventListener('resize', () => resize(canvas));

/** @type {HTMLAudioElement} */
let audio = null;

window.onload = async function () {
    loader.classList.add('opacity-0')
    // loader.remove();
    window.paused = null;
    window.muted = false;
    window.resolving = false;

    const countRes = (await (await fetch(`${base}/count`)).json());

    if (!countRes.success) return play.innerHTML = 'Request Blocked By Client :(';

    const count = countRes.message;

    volumetoggle.addEventListener('click', handleVolToggle)
    canvas.addEventListener('click', handleStart);
    play.addEventListener('click', handleStart);

    function handleVolToggle() {
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

    }

    async function handleStart() {
        if (window.resolving) return;

        window.resolving = true;

        if (!audio) audio = document.createElement('audio');
        else if (!audio.paused) {
            audio.currentTime = 0
            audio.remove();
            audio = document.createElement('audio');
        }
        play.innerHTML = 'Loading ...'
        const index = Math.floor(Math.random() * Number(count));
        audio.onerror = console.log
        audio.src = `${base}/audio?index=${index}`;
        audio.crossOrigin = 'anonymous';

        const trackRes = await (await fetch(`${base}/info?index=${index}`).catch(console.log)).json();

        trackRes && trackRes.success && (details.innerText = trackRes.message.title);
        content.appendChild(audio);

        window.resolving = await __init__(audio);
        console.log('resolved')
    };
}

/**
 * 
 * @param {HTMLAudioElement} audio 
 */
function __init__(audio) {
    window.resolving = true;
    return new Promise(resolve => {
        audio.load();
        const visualizer = new Visualizer(audio, canvas);

        visualizer.connect();
        audio.play();
        visualizer.render();
        play.innerHTML = 'Click to Change'
        audio.addEventListener('loadeddata', () => resolve(false));
    })
}

function resize(canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
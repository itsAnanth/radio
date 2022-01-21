const details = document.getElementById('details');
const content = document.getElementById('content');
const canvas = document.getElementById('canvas');
const volumetoggle = document.getElementById('volume-toggle');
const loader = document.getElementById('loader_div');
/** @type {HTMLInputElement} */
const play = document.getElementById('play');
const base = 'https://krapiv1.herokuapp.com';

const sidebarWidth = 450;
let sidebarToggled = false;

resize(canvas);

window.addEventListener('resize', () => resize(canvas));

/** @type {HTMLAudioElement} */
let audio = null;

async function startPlayer(count = null, indexOverride = null) {
    if (window.resolving) return;

    window.resolving = true;

    if (!audio) audio = document.createElement('audio');
    else if (!audio.paused) {
        audio.currentTime = 0
        audio.remove();
        audio = document.createElement('audio');
    }
    play.innerHTML = 'Loading ...'
    const index = !indexOverride ? Math.floor(Math.random() * Number(count)) : indexOverride;
    audio.onerror = console.log
    audio.src = `${base}/audio?index=${index}`;
    audio.crossOrigin = 'anonymous';

    const trackRes = await (await fetch(`${base}/info?index=${index}`).catch(console.log)).json();

    trackRes && trackRes.success && (details.innerText = trackRes.message.title);
    content.appendChild(audio);

    window.resolving = await __init__(audio);
    console.log('resolved')
};

window.onload = async function () {
    //loader.classList.add('opacity-0')
    // loader.remove();
    window.paused = null;
    window.muted = false;
    window.resolving = false;

    document.querySelector('.sidebar-toggle').addEventListener('click', handleSidebarToggle);

    const countRes = (await (await fetch(`${base}/count`)).json());

    if (!countRes.success) return play.innerHTML = 'Request Blocked By Client :(';

    const count = countRes.message;

    await populateSideBar();

    volumetoggle.addEventListener('click', handleVolToggle)
    canvas.addEventListener('click', handleStart);
    play.addEventListener('click', handleStart);
    window.addEventListener('keydown', handleKeys);

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

    function handleKeys(e) {
        switch(e.code) {
            case 'Space':
                handleVolToggle();
                break;
            case 'ArrowRight': case 'ArrowLeft': 
                handleStart();
                break;
        }
    }

    function handleStart() {
        startPlayer(count);
    }
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
    canvas.width = !sidebarToggled ? window.innerWidth: window.innerWidth - sidebarWidth;
    canvas.height = window.innerHeight;
}

function handleSidebarToggle() {
    if (sidebarToggled) {
        document.querySelector('.sidebar').style.width = '0';
        document.querySelector('.sidebar-toggle').style.right = '0';
        sidebarToggled = false;
    } else {
        document.querySelector('.sidebar').style.width = `${sidebarWidth}px`;
        document.querySelector('.sidebar-toggle').style.right = `${sidebarWidth}px`;
        sidebarToggled = true;
    }
}

function handleTrackClick() {
    const index = this.getAttribute('data-index');
    startPlayer(null, index);
}

async function populateSideBar() {
    let accumilated = '<li class="aside__title">Tracks</li>';

    const tracks = await (await fetch(`${base}/all`)).json();
    console.log(tracks)
    tracks && tracks.success && tracks.message.forEach((track, index) => {
        const trackTemplate = `
        <li class="aside__content" data-index="${index}">
            <img src="${track.thumbnail}" alt="a video thumbnail" class="thumbnail">
            <p>${track.title.slice(0, 30) + '...'}</p>
            <p class="aside__play">▶</p>
        </li>
        `
        accumilated += trackTemplate;
    })
    document.querySelector('.sidebar').innerHTML = accumilated;

    document.querySelectorAll('.aside__content').forEach(track => {
        track.addEventListener('click', handleTrackClick);
    })
}
import { Radio as IRadio } from '../../types/Radio';
import AnimationFrame from '../../utils/AnimationFrame';
import Utils from '../../utils/Utils';
import Visualizer from '../Visualizer/Visualizer';
// const base = 'https://krapiv1.herokuapp.com';

interface Radio extends IRadio { };

class Radio {

    static async start(indexOverride: boolean | null | number = false) {
        if (window.resolving) return;

        const play = document.getElementById('play');

        if (!window.audio) {
            window.audio = document.createElement('audio');
            window.audio.id = 'audio'
        } else {
            window.audio.currentTime = 0;
            window.audio.remove();
            window.audio = document.createElement('audio');
            window.audio.id = 'audio';
        }

        document.getElementById('root').appendChild(window.audio);
        if (window.muted)
            window.audio.volume = 0;

        play.innerHTML = 'Loading ...';

        const _index = indexOverride ?? false;
        const index = _index === false ? Math.floor(Math.random() * window.count) : indexOverride;

        window.audio.onerror = Radio.handleAudioError;
        window.audio.src = `${window.base}/audio?index=${index}`;
        window.audio.crossOrigin = 'anonymous';

        const details = document.getElementById('details');
        const trackRes: { success: boolean, message: { title: string } } = await (await fetch(`${window.base}/info?index=${index}`)).json();

        trackRes && trackRes.success && (details.innerText = trackRes.message.title);

        window.resolving = await Radio.loadAudio();
        play.innerHTML = 'Click to Change';
        console.log('resolved');
    }

    static loadAudio(): Promise<boolean> {
        window.resolving = true;
        return new Promise(resolve => {
            window.audio.load();

            const visualizer = new Visualizer(window.audio, window.canvas);

            visualizer.connect();
            window.audio.play();
            // visualizer.render(Radio.start);

            const frame = new AnimationFrame(60, visualizer.render.bind(visualizer, Radio.start), [duration, clear]);
        

            window.audio.addEventListener('loadeddata', () => {
                Radio.stopRender();
                frame.start();
                resolve(false)
            });


            function clear() {
                visualizer.ctx.clearRect(0, 0, visualizer.width, visualizer.height);
            }

            function duration() {
                if (visualizer.elapsed)
                    visualizer.elapsed.innerHTML = isNaN(visualizer.audio.duration) ? ('00:00 / 00:00') : (`${visualizer.convertTime(visualizer.audio.currentTime)} / ${visualizer.convertTime(visualizer.audio.duration)}`);
            }
        })
    }

    static async handleAudioError() {
        let gotData = false;
        const loader = document.getElementById('loader_div');
        const text = document.getElementById('loader_text');

        text.innerText = 'Failed Loading Audio';
        loader.classList.remove('opacity-0');

        await Utils.wait(2000);

        text.innerText = 'Retrying'

        for (let i = 0; i < 5; i++) {
            console.info(`Retry count : ${i + 1}`);
            gotData = (await Utils.getState());
            await Utils.wait(1000);
        }

        if (!gotData) {
            text.innerText = 'Request Timed Out';
            return;
        }
    }


    static stopRender() {
		if (window.frameId) {
			cancelAnimationFrame(window.frameId);
			window.frameId = null;
		}
	}


}


export default Radio;
import { Radio as IRadio } from '../../types/Radio';
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
        const index = !indexOverride ? Math.floor(Math.random() * window.count) : indexOverride;

        window.audio.onerror = console.error;
        window.audio.src = `${window.base}/audio?index=${index}`;
        window.audio.crossOrigin = 'anonymous';

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
            visualizer.render(Radio.start);
            window.audio.addEventListener('loadeddata', () => resolve(false));
        })
    }


}

export default Radio;
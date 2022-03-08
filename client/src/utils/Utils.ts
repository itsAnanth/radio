import Radio from "../components/Radio/Radio";
import { App } from "../types/App";

class Utils {
	static resize(canvas: HTMLCanvasElement) {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	}

	static wait(time: number) {
		return new Promise(resolve => {
			setTimeout(resolve, time)
		})
	}

	static async ping(): Promise<boolean> {
		type response = { success: boolean, message: string };
		let res = await fetch(`${window.base}/ping`).catch(console.error);
		if (!res) return false;
		res = await res.json();
		console.log(`[server] got ${(res as unknown as response).message}`)
		return (res as unknown as response).success;
	}

	static async getState(): Promise<boolean> {
		window.audio = document.createElement('audio');
		document.getElementById('root').appendChild(window.audio);

		window.audio.src = `${window.base}/audio?index=0`;
		window.audio.crossOrigin = 'anonymous';

		const promise = new Promise((resolve) => {
			window.audio.onerror = () => resolve(false);
			window.audio.addEventListener('loadeddata', () => resolve(true));
		})

		return (await (promise as unknown as Promise<boolean>));
	}

	static handleVolToggle() {
		if (!(window.audio && (this as unknown as App).volumeBtn)) return;
		if (window.muted) {
			window.muted = false;
			window.audio.volume = 1;
			(this as unknown as App).volumeBtn.current.classList.remove('fa-volume-off');
			(this as unknown as App).volumeBtn.current.classList.add('fa-volume-up');
		} else {
			window.muted = true;
			window.audio.volume = 0;
			(this as unknown as App).volumeBtn.current.classList.add('fa-volume-off');
			(this as unknown as App).volumeBtn.current.classList.remove('fa-volume-up');
		}

	}

	static handleKeys(e: KeyboardEvent) {
		switch (e.code) {
			case 'Space':
				Utils.handleVolToggle.call(this);
				break;
			case 'ArrowRight': case 'ArrowLeft':
				Radio.start();
				break;
		}
	}
}

export default Utils;
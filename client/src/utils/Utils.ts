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
}

export default Utils;
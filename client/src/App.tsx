import React from 'react';
import Radio from './components/Radio/Radio';
import type { App as IApp } from './types/App';
import Utils from './utils/Utils';
import './css/main.css';
import './css/loader.css';
import 'font-awesome/css/font-awesome.min.css'
// @ts-ignore
import burger from './assets/tracksburger.png';

declare global {
	interface Window {
		canvas: HTMLCanvasElement;
		audio: HTMLAudioElement;
		resolving: boolean;
		count: number;

		paused: boolean;
		muted: boolean;
		hasTimeout: boolean;
		base: string;
	}
}

const sidebarWidth = 33;
window.base = 'https://krapiv1.herokuapp.com';

interface App extends IApp { };

class App extends React.Component {

	constructor(props?: any) {
		super(props);
		this.volumeBtn = React.createRef();
		this.canvas = React.createRef();
		this.play = React.createRef();
		this.sidebar = React.createRef();
		this.sidebarToggle = React.createRef();
		this.loaderText = React.createRef();
		this.loader = React.createRef();
		this.sidebarToggled = false;
		this.gotData = false;
	}

	async componentDidMount() {
		await this.init();
	}



	async init() {
		if (!await Utils.getState()) {
			await Utils.wait(1000);
			this.loaderText.current.innerText = 'Failed Loading Audio';
			await Utils.wait(1000);

			this.loaderText.current.innerText = 'Retrying'
			
			for (let i = 0; i < 5; i++) {
				console.info(`Retry count : ${i + 1}`);
				this.gotData = (await Utils.getState());
				await Utils.wait(1000);
			}

			if (!this.gotData) {
				this.loaderText.current.innerText = 'Request Timed Out';
				return;
			}
		}

		const trackCount: { success: boolean, message: string } = (await (await fetch(`${window.base}/count`)).json());

		if (!trackCount.success)
			return this.play.current.innerHTML = 'Request Blocked By Client :(';

		window.count = parseInt(trackCount.message);
		window.canvas = this.canvas.current;
		Utils.resize(this.canvas.current);
		await this.populateSideBar();

		this.sidebarToggle.current.addEventListener('click', this.handleSidebarToggle.bind(this));
		this.canvas.current.addEventListener('click', Radio.start.bind(null, false));
		this.play.current.addEventListener('click', Radio.start.bind(null, false));
		this.canvas.current.addEventListener('resize', Utils.resize.bind(null, this.canvas.current));


		this.loader.current.classList.add('opacity-0');
	}


	render() {
		return (
			<div className="container">
				<div className="main">
					<div ref={this.loader} id="loader_div" className="preloader">
						<div  className="loader"></div>
						<div ref={this.loaderText} id='loader_text'>Initializing</div>
					</div>
					<div id="content">
						<p id="details"></p>
						<canvas id="canvas" ref={this.canvas}></canvas>
						<p id="play" ref={this.play}>Click to Play</p>
						<div className="footer">
							<div id="elapsed" className="elapsed"></div>
							<i ref={this.volumeBtn} onClick={this.handleVolToggle.bind(this)} id="volume-toggle" className='fa fa-volume-up'></i>
						</div>

					</div>
				</div>
				<ul ref={this.sidebar} className="sidebar"></ul>
				<div ref={this.sidebarToggle} className="sidebar-toggle">
					<img src={burger} alt="tracks burger icon"></img>
				</div>
			</div>
		);
	}

	handleSidebarToggle() {
		if (this.sidebarToggled) {
			this.sidebar.current.style.width = '0';
			this.sidebarToggle.current.style.right = '0';
			this.sidebarToggled = false;
		} else {
			this.sidebar.current.style.width = `${sidebarWidth}rem`;
			this.sidebarToggle.current.style.right = `${sidebarWidth}rem`;
			this.sidebarToggled = true;
		}
	}

	handleVolToggle() {
		if (!(window.audio && this.volumeBtn)) return;
		if (window.muted) {
			window.muted = false;
			window.audio.volume = 1;
			this.volumeBtn.current.classList.remove('fa-volume-off');
			this.volumeBtn.current.classList.add('fa-volume-up');
		} else {
			window.muted = true;
			window.audio.volume = 0;
			this.volumeBtn.current.classList.add('fa-volume-off');
			this.volumeBtn.current.classList.remove('fa-volume-up');
		}

	}

	handleTrackClick(track: any) {
		const index = track.getAttribute('data-index');
		Radio.start(Number(index));
		this.sidebarToggle.current.click();
	}

	async populateSideBar() {
		let accumilated = '<li class="aside__title">Tracks</li>';

		const tracks: { success: boolean, message: ({ thumbnail: string, title: string })[] } = await (await fetch(`${window.base}/all`)).json();

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
			track.addEventListener('click', this.handleTrackClick.bind(this, track));
		})
	}
}

export default App;

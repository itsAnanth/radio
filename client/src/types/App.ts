import React, { RefObject } from "react";

interface App extends React.Component {
    volumeBtn: RefObject<HTMLDivElement>;
    canvas: RefObject<HTMLCanvasElement>;
    play: RefObject<HTMLDivElement>;
    sidebarToggled: boolean;
    sidebar: RefObject<HTMLUListElement>;
    sidebarToggle: RefObject<HTMLDivElement>;
    loaderText: RefObject<HTMLDivElement>;
    loader: RefObject<HTMLDivElement>;
    gotData: boolean;
    touchStartX: number;
    touchEndX: number;
}


export type { App };

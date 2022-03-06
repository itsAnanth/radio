import React, { RefObject } from "react";

interface Radio extends React.Component {
    canvas: RefObject<HTMLCanvasElement>;
    playBtn: RefObject<unknown>;
}

export type { Radio };

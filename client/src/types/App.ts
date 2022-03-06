import React, { RefObject } from "react";

interface App extends React.Component {
    playBtn: RefObject<HTMLButtonElement>;
}


export type { App };

/*
  Copyright 2021 David Whiting
  This work is licensed under a Creative Commons Attribution 4.0 International License
  https://creativecommons.org/licenses/by/4.0/
*/
export function pressToStart(fn, title, description, callToAction = "Click, tap or press any key to start") {
    const button = document.createElement("button");
    button.id = "_start_button";
    const introText = document.createElement("div");
    introText.id = "_intro_text";
    button.append(introText);
    introText.innerHTML = title + "<br><br>" + description + "<br><br>" + callToAction;
    document.head.insertAdjacentHTML("beforeend", `
    <style>
        body {
            height: 95vh;  margin: 0; padding: 0;
        }
        #${button.id} {
            width: 100%;
            height: 100%;
            display: block;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 50;
            color:grey;
            background-color: black;
        }

        #${introText.id} {
            max-width: 640px;
            font-size: 1.5em;
            margin-left: auto;
            margin-right: auto;
            text-align:left;
            font-family: monospace;
        }
    </style>
    `);
    document.body.append(button);
    let started = false;
    function handleStartAction() {
        if (!started) {
            started = true;
            fn();
            button.style.display = "none";
        }
    }
    button.addEventListener("click", handleStartAction);
    window.addEventListener("keydown", handleStartAction);
}
export function repeat(seconds, fn) {
    let time = new Date().getTime();
    let n = 0;
    function step() {
        const t = new Date().getTime() - time;
        fn(t, n);
        n++;
    }
    step();
    window.setInterval(step, seconds * 1000);
}
export function Clock(bpm, subdivision = 4, shuffle = 0) {
    let currentBpm = bpm;
    let fn = (time, step) => { };
    let time = new Date().getTime();
    let n = 0;
    function bind(newFn) {
        fn = newFn;
    }
    function step() {
        const t = new Date().getTime() - time;
        fn(t, n);
        const shuffleFactor = n % 2 == 0 ? 1 + shuffle : 1 - shuffle;
        n++;
        window.setTimeout(step, shuffleFactor * (60000 / currentBpm) / subdivision);
    }
    window.setTimeout(step, (60000 / bpm) / subdivision);
    return {
        bind,
        setBpm: (bpm) => currentBpm = bpm
    };
}
//# sourceMappingURL=boilerplate.js.map

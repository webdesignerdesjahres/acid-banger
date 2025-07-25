/*
  Copyright 2021 David Whiting
  This work is licensed under a Creative Commons Attribution 4.0 International License
  https://creativecommons.org/licenses/by/4.0/
*/

function clamp(n: number): number {
    return n < 0 ? 0 : n > 1 ? 1 : n;
}

export function Dial(initial: number, bounds: [number, number], text?: string, dialColor: string = "red", textColor: string="white"){
    const element = document.createElement("canvas");
    element.classList.add("dial");
    const w = element.width = 70;
    const h = element.height = 50;
    const size = 20;
    const g = element.getContext("2d") as CanvasRenderingContext2D;
    let normalizedValue = 0.5;
    let previousNormalisedValue = 0.5;
    let fadeCounter = 0;
    let fadeTimerHandler: number | null = null;

    function paint() {
        g.clearRect(0,0,w,h);

        const arc = [Math.PI * 0.8, Math.PI * 2.2];
        g.strokeStyle = dialColor;
        g.lineWidth = 2;
        g.beginPath();
        g.arc(w/2, h/2, size, arc[0], arc[1]);
        g.stroke();

        g.lineWidth = w / 8;
        const pos = arc[0] + normalizedValue * (arc[1] - arc[0]);
        g.beginPath();
        g.arc(w/2, h/2, size, pos - 0.2, pos + 0.2);
        g.stroke();

        if (fadeCounter > 0) {
            g.strokeStyle = "rgba(0,255,230," + clamp(fadeCounter/10) + ")";
            g.lineWidth = w / 8;
            const pos = arc[0] + normalizedValue * (arc[1] - arc[0]);
            g.beginPath();
            g.arc(w/2, h/2, size, pos - 0.2, pos + 0.2);
            g.stroke();
        }

        if (text) {
            g.fillStyle = textColor;
            g.font = "10px Orbitron";
            const tw = g.measureText(text).width;
            g.fillText(text, w/2 - tw / 2, h/2 + size);
        }
    }

    function fade(frames: number) {
        if (fadeTimerHandler) window.clearInterval(fadeTimerHandler);
        fadeCounter = Math.min(frames, 10);
        fadeTimerHandler = window.setInterval(() => {
            fadeCounter--;
            paint()
        }, 100);
    }


    function normalise(v: number) {
        return (v - bounds[0]) / (bounds[1] - bounds[0]);
    }

    function denormalise(n: number) {
        return bounds[0] + (bounds[1] - bounds[0]) * n;
    }

    function setValue(n: number) {
        normalizedValue = normalise(n);
        paint();
        if (Math.abs(normalizedValue - previousNormalisedValue) > 0.002) {
            fade(4 + Math.floor(Math.abs(normalizedValue - previousNormalisedValue) / 0.001));
        }
        previousNormalisedValue = normalizedValue;
    }

    function getValue(): number {
        return denormalise(normalizedValue);
    }

    const state = {isDragging: false, handler: [(v: number) => {}]};


    function bind(h: (v: number) => void) {
        state.handler.push(h);
    }

    element.addEventListener("dblclick", (e) => {
        const actualValue = initial;
        setValue(actualValue);
        state.handler.forEach(h => h(actualValue));
    });

    element.addEventListener("mousedown", (e) => {
        state.isDragging = true;
    });

    window.addEventListener("mousemove", (e) => {
        if (state.isDragging) {
            const delta = (e.movementX - e.movementY)/100;
            normalizedValue = clamp(normalizedValue+delta);
            const actualValue = denormalise(normalizedValue);
            setValue(actualValue);
            state.handler.forEach(h => h(actualValue));
        }
    })

    window.addEventListener("mouseup", (e) => {
        state.isDragging = false;
    })

    paint();


    return {
        element,
        get value(): number { return getValue(); },
        set value(v: number) { setValue(v); },
        bind
    };
}
export type DialT = ReturnType<typeof Dial>

export function RangeSelect(initial: number, bounds: [number, number], text?: string){
    const element = document.createElement("input");
    element.classList.add("range");
    let normalizedValue = 0.5;
    let previousNormalisedValue = 0.5;
    element.type = "number";
    element.value = getValue().toString();
    element.min = bounds[0].toString();
    element.max = bounds[1].toString();

    function normalise(v: number) {
        return (v - bounds[0]) / (bounds[1] - bounds[0]);
    }

    function denormalise(n: number) {
        return bounds[0] + (bounds[1] - bounds[0]) * n;
    }

    function setValue(n: number) {
        normalizedValue = normalise(n);
        element.value = getValue().toString();
        previousNormalisedValue = normalizedValue;
    }

    function getValue(): number {
        return Math.trunc(denormalise(normalizedValue));
    }

    const state = {isDragging: false, handler: [(v: number) => {}]};


    function bind(h: (v: number) => void) {
        state.handler.push(h);
    }

    element.addEventListener("change", (e) => {
        const actualValue = +element.value;
        setValue(actualValue);
        state.handler.forEach(h => h(actualValue));
    });

    element.addEventListener("dblclick", (e) => {
        const actualValue = initial;
        setValue(actualValue);
        state.handler.forEach(h => h(actualValue));
    });

    element.addEventListener("mousedown", (e) => {
        state.isDragging = true;
    });

    window.addEventListener("mousemove", (e) => {
        if (state.isDragging) {
            const delta = (e.movementX - e.movementY)/100;
            normalizedValue = clamp(normalizedValue+delta);
            const actualValue = denormalise(normalizedValue);
            setValue(actualValue);
            state.handler.forEach(h => h(actualValue));
        }
    })

    window.addEventListener("mouseup", (e) => {
        state.isDragging = false;
    })


    return {
        element,
        get value(): number { return getValue(); },
        set value(v: number) { setValue(v); },
        bind
    };
}
export type RangeSelectT = ReturnType<typeof RangeSelect>

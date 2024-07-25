export interface Card {
    id: number;
    x: number;
    y: number;
    duration: number;
    multiplier: number;
}

export interface ClickerConfig {
    animation: {
        click: {
            duration: number;
            scaleFactor: number;
            rotateFactor: number;
            shadowFactor: number;
        };
        card: {
            duration: number;
            moveDistance: number;
            rotateAngle: number;
            initialOpacity: number;
            finalOpacity: number;
        };
    };
    rapidClick: {
        threshold: number;
        timeout: number;
        shakeThreshold: number;
        shoutThreshold: number;
    };
    shake: {
        threshold: number;
        timeout: number;
    };
    style: {
        containerSize: number;
        catImageOverflow: number;
        backgroundColor: {
            normal: string;
            rapid: string;
        };
    };
    catEffect: {
        scaleFactor: number;
        brightnessFactor: {
            min: number;
            max: number;
        };
        hueRotateAngle: number;
    };
    vibration: {
        enabled: boolean;
        duration: number;
        rapidClickDuration: number;
    };
    sound: {
        threshold: number;
        timeout: number;
    };
    debugMode: boolean;
}
export interface AudioData {
    normalizedAverage: number;
    relativeIncrease: number;
    currentLevel: number;
    baselineNoiseLevel: number;
}

export interface TestCounters {
    counter1: number;
    counter2: number;
    counter3: number;
    counter4: number;
}
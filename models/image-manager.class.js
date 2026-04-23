class ImageManager {

    constructor() {
        this.images = {
            start: this.load('img/9_intro_outro_screens/start/startscreen_1.png'),
            win: this.load('img/You won, you lost/You won A.png'),
            lose: this.load('img/You won, you lost/Game Over.png'),

            // 🔊 SOUND ICONS
            soundOn: this.load('img/8_coin/volume_of.png'),
            soundOff: this.load('img/8_coin/volume_off.png'),

            // ⛶ FULLSCREEN
            fullscreenIcon: this.load('img/8_coin/fullscreen.png'),
  
        };
    }

    load(path) {
        let img = new Image();
        img.src = path;
        img.onload = () => {
            console.log("Loaded:", path);
        };
        return img;
    }

    get(name) {
        return this.images[name];
    }
}

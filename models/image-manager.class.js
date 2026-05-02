class ImageManager {

    constructor() {
        this.images = {
            start: this.load('img/9_intro_outro_screens/start/startscreen_2.png'),
            win: this.load('img/You won, you lost/You won A.png'),
            lose: this.load('img/You won, you lost/Game Over.png'),

            soundOn: this.load('img/8_coin/volume_on.png'),
            soundOff: this.load('img/8_coin/volume_off.png'),
            fullscreenIcon: this.load('img/8_coin/fullscreen.png'),
        };
    }

    /**
     * Loads an image from the specified file path.
     * @param {string} path - The file path of the image to load.
     * @returns {HTMLImageElement} A new Image object with the src set to the given path.
     */
    load(path) {
        let img = new Image();
        img.src = path;
        img.onload = () => {
        };
        return img;
    }

    /**
     * Retrieves a previously loaded image by its key name.
     * @param {string} name - The key of the image (e.g., 'start', 'win', 'soundOn').
     * @returns {HTMLImageElement} The image object associated with the given key.
     */
    get(name) {
        return this.images[name];
    }
}
class ImageManager {

    constructor() {
        this.images = {
            win: this.load('img/You won, you lost/You won A.png'),
            lose: this.load('img/You won, you lost/Game Over.png')
        };
    }

    load(path) {
        let img = new Image();
        img.src = path;
        return img;
    }

    get(name) { 
        return this.images[name];
    }
}

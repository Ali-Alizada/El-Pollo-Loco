/**
 * Represents a splash effect animation created when a bottle hits the ground.
 * The animation plays through a series of splash images and then marks itself as finished.
 * @class Splash
 * @extends Drawableobject
 */
class Splash extends Drawableobject {

    /**
     * Array of image paths for the splash animation frames.
     * @type {string[]}
     */
    IMAGES_SPLASH = [
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ];

    currentImage = 0;
    finished = false;

    /**
     * Creates a new splash effect at the specified position.
     * @param {number} x - The x-coordinate of the splash.
     * @param {number} y - The y-coordinate of the splash.
     * @constructor
     */
    constructor(x, y) {
        super().loadImage(this.IMAGES_SPLASH[0]);
        this.loadImages(this.IMAGES_SPLASH);
        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = 100;
        this.animate();
    }

    /**
     * Plays the splash animation by cycling through the IMAGES_SPLASH array.
     * Once all frames have been displayed, clears the interval and sets `finished` to true.
     * @returns {void}
     */
    animate() {
        let i = 0;
        let interval = setInterval(() => {
            if (i < this.IMAGES_SPLASH.length) {
                let path = this.IMAGES_SPLASH[i];
                this.img = this.imgCache[this.IMAGES_SPLASH[i]];
                i++;
            } else {
                clearInterval(interval);
                this.finished = true;
            }
        }, 100);
    }
}
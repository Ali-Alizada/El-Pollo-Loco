class Splash extends Drawableobject {

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
    constructor(x, y) {
        super().loadImage(this.IMAGES_SPLASH[0]); 
        this.loadImages(this.IMAGES_SPLASH);
        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = 100;
        this.animate();
    }

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

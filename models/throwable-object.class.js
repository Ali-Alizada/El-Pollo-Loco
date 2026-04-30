class ThrowableObject extends MoveableObject {

    IMAGES_BOTTLE_ROTATION = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];

    constructor(x, y, direction) {
        super().loadImage(this.IMAGES_BOTTLE_ROTATION[0]);
        this.loadImages(this.IMAGES_BOTTLE_ROTATION);
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 60;
        this.speedY = 20;
        this.speedX = direction === 'right' ? 6 : -6;
        this.applyGravity();
        this.throw();
        this.animate();
        this.checkGroundContact();
    }

    throw() {
        const interval = setInterval(() => {
            if (this.markedForDeletion) {
                clearInterval(interval);
                return;
            }
            this.x += this.speedX;
        }, 1000 / 60);
    }

    animate() {
        setInterval(() => {
            if (this.markedForDeletion) return;
            this.playAnimation(this.IMAGES_BOTTLE_ROTATION);
        }, 100);
    }

    checkGroundContact() {
    const interval = setInterval(() => {
        if (this.markedForDeletion) {
        clearInterval(interval);
        return;
        }
        if (this.y >= 370 && this.speedY <= 0) {
        this.markedForDeletion = true;
        if (this.world && !this.hitBoss) { 
            let splash = new Splash(this.x, this.y);
            this.world.splashObjects.push(splash);
            this.world.sound.play("splash");
        }
        clearInterval(interval);
        }
    }, 1000 / 30);
    }
    isAboveGround() {
        return this.y < 370; 
    }
}
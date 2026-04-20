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
        this.width = 50;
        this.height = 50;

        this.speedY = 25;
        this.applyGravity();

        this.throw(direction);
        this.animate();
    }

    throw(direction) {
        this.speedX = direction === 'right' ? 10 : -10;

        setInterval(() => {
            this.x += this.speedX;
        }, 1000 / 60);
    }

    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_BOTTLE_ROTATION);
        }, 100);
    }
}

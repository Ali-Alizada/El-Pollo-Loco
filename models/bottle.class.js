class Bottle extends MoveableObject {
    IMAGE_BOTTLE = [

        'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ];

    constructor(x, y) {
        super().loadImage(this.IMAGE_BOTTLE[0]);
        this.loadImages(this.IMAGE_BOTTLE);
        this.x = x;
        this.y = y;
        this.width = 80;
        this.height = 80;

        this.animate();
    }

    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGE_BOTTLE);
        }, 400);
    }
}
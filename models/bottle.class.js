class Bottle extends MoveableObject {
    IMAGE_BOTTLE = [
        'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ];

    /**
     * Creates a new Bottle instance at the specified position.
     * Loads the bottle images, sets size and y‑position, and starts the idle animation.
     * @constructor
     * @param {number} x - The horizontal position of the bottle.
     * @param {number} y - The vertical position of the bottle (the class overrides it to 355).
     */
    constructor(x, y) {
        super().loadImage(this.IMAGE_BOTTLE[0]);
        this.loadImages(this.IMAGE_BOTTLE);
        this.x = x;
        this.y = 355;
        this.width = 60;
        this.height = 60;
        this.animate();
    }

    /**
     * Starts a repeating animation that cycles through the bottle's images.
     * The animation runs every 400 milliseconds.
     * @returns {void}
     */
    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGE_BOTTLE);
        }, 400);
    }
}
class Coin extends MoveableObject {
    IMAGE_COIN = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png',
    ];

    /**
     * Creates a new Coin instance at the specified position.
     * Loads the coin images, sets size, and starts the idle animation.
     * @constructor
     * @param {number} x - The horizontal position of the coin.
     * @param {number} y - The vertical position of the coin.
     */
    constructor(x, y) {
        super().loadImage(this.IMAGE_COIN[0]);
        this.loadImages(this.IMAGE_COIN);
        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = 100;
        this.animate();
    }

    /**
     * Starts a repeating animation that cycles through the coin's images.
     * The animation runs every 200 milliseconds.
     * @returns {void}
     */
    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGE_COIN);
        }, 200);
    }
}
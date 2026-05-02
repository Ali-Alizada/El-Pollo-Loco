class Cloud extends MoveableObject {
    y = 20;
    height = 300;
    width = 550;

    /**
     * Creates a new Cloud instance.
     * Loads the cloud image and places the cloud at a given x position (or random if not provided).
     * Automatically starts the cloud animation.
     * @constructor
     * @param {number|null} [x=null] - The horizontal position of the cloud. If null, a random x is chosen.
     */
    constructor(x = null) {
        super().loadImage('img/5_background/layers/4_clouds/1.png');
        this.x = (x !== null) ? x : Math.random() * 500;
        this.animate();
    }

    /**
     * Starts the cloud movement animation.
     * Moves the cloud left continuously. When the cloud leaves the left edge,
     * it is repositioned to the right end of the level plus a random offset.
     * @returns {void}
     */
    animate() {
        setInterval(() => {
            this.moveLeft();
            if (this.x + this.width < 0 && this.world) {
                this.x = this.world.level.level_end_x + Math.random() * 300;
            }
        }, 1000 / 60);
    }
}
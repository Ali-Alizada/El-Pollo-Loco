class backgroudObject extends MoveableObject {

    height = 480;
    width = 720;   

    /**
     * Creates a new background object.
     * Loads the background image and sets its horizontal position.
     * The vertical position is calculated so the bottom aligns with the ground (y = 480 - height).
     * @constructor
     * @param {string} loadPath - The file path to the background image.
     * @param {number} x - The horizontal position of the background object.
     */
    constructor(loadPath, x) {
        super().loadImage(loadPath);
        this.x = x;
        this.y = 480 - this.height;
    }
}


class Drawableobject {
    x = 120;
    y = 280;
    height = 150;
    width = 100;
    img;
    imgCache = {};
    currentImages = 0;

    /**
     * Creates an instance of Drawableobject.
     * @constructor
     */
    constructor() {}

    /**
     * Loads a single image from the given path and stores it in `this.img`.
     * @param {string} path - The file path to the image.
     * @returns {void}
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Draws the currently loaded image onto the canvas context at the object's position and size.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     * @returns {void}
     */
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    /**
     * Begins a path for drawing a debug frame (collision box) around the object.
     * Currently only implemented for instances of Character or Chicken.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     * @returns {void}
     */
    drawFrame(ctx) {
        if (this instanceof Character || this instanceof Chicken) {
            ctx.beginPath();
        }
    }

    /**
     * Loads multiple images from an array of paths and caches them in `this.imgCache`.
     * The cache keys are the original image paths.
     * @param {string[]} array - Array of image file paths.
     * @returns {void}
     */
    loadImages(array) {
        array.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imgCache[path] = img;
        });
    }
}
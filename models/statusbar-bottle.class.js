/**
 * Represents the bottle status bar that visually displays the player's collected bottle percentage.
 * @class Statusbarbottle
 * @extends Drawableobject
 */
class Statusbarbottle extends Drawableobject {

    /**
     * Array of image paths for different bottle percentage levels (0%, 20%, 40%, 60%, 80%, 100%).
     * @type {string[]}
     */
    IMAGES_BOTTLE = [
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/0.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/20.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/40.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/60.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/80.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/100.png',
    ];

    percentage = 0;

    /**
     * Creates a new bottle status bar at the default position.
     * @constructor
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES_BOTTLE);
        this.setPercentage(0);
        this.x = 10;
        this.y = 10;
        this.width = 200;
        this.height = 50;
    }

    /**
     * Sets the bottle percentage and updates the displayed image accordingly.
     * @param {number} percentage - New bottle percentage (0-100).
     * @returns {void}
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES_BOTTLE[this.resoveImageIndex()];
        this.img = this.imgCache[path];
    }

    /**
     * Determines the correct image index based on the current percentage.
     * @returns {number} Index in the IMAGES_BOTTLE array (0 to 5).
     */
    resoveImageIndex() {
        if (this.percentage == 100) {
            return 5;
        } else if (this.percentage == 80) {
            return 4;
        } else if (this.percentage == 60) {
            return 3;
        } else if (this.percentage == 40) {
            return 2;
        } else if (this.percentage == 20) {
            return 1;
        } else {
            return 0;
        }
    }
}
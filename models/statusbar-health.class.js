/**
 * Represents the health status bar that visually displays the player's health percentage.
 * @class Statusbarhealth
 * @extends Drawableobject
 */
class Statusbarhealth extends Drawableobject {

    /**
     * Array of image paths for different health percentage levels (0%, 20%, 40%, 60%, 80%, 100%).
     * @type {string[]}
     */
    IMAGES_HEALTH = [
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png'
    ];

    percentage = 100;

    /**
     * Creates a new health status bar at the default position.
     * @constructor
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES_HEALTH);
        this.setPercentage(100);
        this.x = 10;
        this.y = 78;
        this.width = 200;
        this.height = 50;
    }

    /**
     * Sets the health percentage and updates the displayed image accordingly.
     * @param {number} percentage - New health percentage (0-100).
     * @returns {void}
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES_HEALTH[this.resoveImageIndex()];
        this.img = this.imgCache[path];
    }

    /**
     * Determines the correct image index based on the current percentage.
     * @returns {number} Index in IMAGES_HEALTH array (0 to 5).
     */
    resoveImageIndex() {
        if (this.percentage == 100) {
            return 5;
        } else if (this.percentage > 80) {
            return 4;
        } else if (this.percentage > 60) {
            return 3;
        } else if (this.percentage > 40) {
            return 2;
        } else if (this.percentage > 20) {
            return 1;
        } else {
            return 0;
        }
    }
}
/**
 * Represents the coin status bar that visually displays the player's collected coin percentage.
 * @class Statusbarcoin
 * @extends Drawableobject
 */
class Statusbarcoin extends Drawableobject {

    /**
     * Array of image paths for different coin percentage levels (0%, 20%, 40%, 60%, 80%, 100%).
     * @type {string[]}
     */
    IMAGES_COIN = [
        'img/7_statusbars/1_statusbar/1_statusbar_coin/green/0.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/green/20.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/green/40.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/green/60.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/green/80.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/green/100.png'
    ];

    percentage = 0;

    /**
     * Creates a new coin status bar at the default position.
     * @constructor
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES_COIN);
        this.setPercentage(0);
        this.x = 10;
        this.y = 46;
        this.width = 200;
        this.height = 50;
    }

    /**
     * Sets the coin percentage and updates the displayed image accordingly.
     * @param {number} percentage - New coin percentage (0-100).
     * @returns {void}
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES_COIN[this.resoveImageIndex()];
        this.img = this.imgCache[path];
    }

    /**
     * Determines the correct image index based on the current percentage.
     * @returns {number} Index in the IMAGES_COIN array (0 to 5).
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
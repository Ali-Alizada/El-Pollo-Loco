/**
 * Represents the boss health status bar that displays the end boss's health percentage.
 * The bar starts invisible and begins blinking when health drops to 20% or below.
 * @class StatusBarBoss
 * @extends Drawableobject
 */
class StatusBarBoss extends Drawableobject {

    /**
     * Array of image paths for different boss health levels (0%, 20%, 40%, 60%, 80%, 100%).
     * @type {string[]}
     */
    IMAGES = [
        'img/7_statusbars/2_statusbar_endboss/green/green0.png',
        'img/7_statusbars/2_statusbar_endboss/green/green20.png',
        'img/7_statusbars/2_statusbar_endboss/green/green40.png',
        'img/7_statusbars/2_statusbar_endboss/green/green60.png',
        'img/7_statusbars/2_statusbar_endboss/green/green80.png',
        'img/7_statusbars/2_statusbar_endboss/green/green100.png'
    ];

    percentage = 100;
    isLow = false;
    visible = false;
    blinkInterval;

    /**
     * Creates a new boss health status bar at the default position.
     * The bar is initially invisible; visibility is managed by the game logic.
     * @constructor
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 505;
        this.y = 56;
        this.width = 200;
        this.height = 50;
        this.setPercentage(100);
    }

    /**
     * Sets the boss health percentage and updates the displayed image.
     * If the percentage drops to 20% or below, it triggers the blinking effect.
     * @param {number} percentage - New health percentage (0-100).
     * @returns {void}
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        if (percentage <= 20) {
            this.isLow = true;
            this.startBlinking();
        }

        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imgCache[path];
    }

    /**
     * Starts the blinking animation by toggling the visibility every frame.
     * The interval runs continuously once started.
     * @returns {void}
     */
    startBlinking() {
        if (this.blinkInterval) return;

        this.blinkInterval = setInterval(() => {
            this.visible = !this.visible;
        });
    }

    /**
     * Determines the correct image index based on the current percentage.
     * @returns {number} Index in the IMAGES array (0 to 5).
     */
    resolveImageIndex() {
        if (this.percentage == 100) return 5;
        if (this.percentage > 80) return 4;
        if (this.percentage > 60) return 3;
        if (this.percentage > 40) return 2;
        if (this.percentage > 20) return 1;
        return 0;
    }
}
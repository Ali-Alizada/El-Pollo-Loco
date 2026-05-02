/**
 * Represents a throwable bottle object that can be thrown left or right,
 * rotates during flight, and creates a splash effect when it hits the ground or a boss.
 * @class ThrowableObject
 * @extends MoveableObject
 */
class ThrowableObject extends MoveableObject {

    /**
     * Array of image paths for the bottle rotation animation.
     * @type {string[]}
     */
    IMAGES_BOTTLE_ROTATION = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];

    hitBoss = false;

    /**
     * Creates a throwable bottle.
     * @param {number} x - The initial x-coordinate.
     * @param {number} y - The initial y-coordinate.
     * @param {string} direction - Throw direction: 'right' or 'left'.
     */
    constructor(x, y, direction) {
        super().loadImage(this.IMAGES_BOTTLE_ROTATION[0]);
        this.loadImages(this.IMAGES_BOTTLE_ROTATION);
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 60;
        this.speedY = 20;
        this.speedX = direction === 'right' ? 6 : -6;
        this.applyGravity();
        this.throw();
        this.animate();
        this.checkGroundContact();
    }

    /**
     * Moves the bottle horizontally at a constant speed.
     * @returns {void}
     */
    throw() {
        const interval = setInterval(() => {
            if (this.markedForDeletion) {
                clearInterval(interval);
                return;
            }
            this.x += this.speedX;
        }, 1000 / 60);
    }

    /**
     * Plays the rotation animation of the bottle.
     * @returns {void}
     */
    animate() {
        setInterval(() => {
            if (this.markedForDeletion) return;
            this.playAnimation(this.IMAGES_BOTTLE_ROTATION);
        }, 100);
    }

    /**
     * Checks for contact with the ground. If the bottle hits the ground,
     * it marks itself for deletion and creates a splash effect.
     * @returns {void}
     */
    checkGroundContact() {
        const interval = setInterval(() => {
            if (this.markedForDeletion) {
                clearInterval(interval);
                return;
            }
            if (this.hitBoss) return;
            if (this.y >= 370 && this.speedY <= 0) {
                this.markedForDeletion = true;
                if (this.world && !this.hitBoss) {
                    let splash = new Splash(this.x, this.y);
                    this.world.splashObjects.push(splash);
                    this.world.sound.play("splash");
                }
                clearInterval(interval);
            }
        }, 1000 / 30);
    }

    /**
     * Checks whether the bottle is above ground level.
     * @returns {boolean} True if y-coordinate is less than 370, otherwise false.
     */
    isAboveGround() {
        return this.y < 370;
    }
}
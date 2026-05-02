/**
 * Represents any movable game object (player, enemies, throwable bottles) with physics,
 * collision detection, health, and animation capabilities.
 * @class MoveableObject
 * @extends Drawableobject
 */
class MoveableObject extends Drawableobject {

    static GROUND_Y = 420;
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    lastHit = 0;

    /**
     * Applies gravity to the object by updating its vertical position and velocity.
     * The effect is applied continuously via a 25 FPS interval.
     * @returns {void}
     */
    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    /**
     * Checks whether the object is above ground level.
     * @returns {boolean} True if the bottom of the object is above the ground Y, otherwise false.
     */
    isAboveGround() {
        return (this.y + this.height) < MoveableObject.GROUND_Y;
    }

    /**
     * Places the object exactly on the ground (y = GROUND_Y - height).
     * @returns {void}
     */
    setToGround() {
        this.y = MoveableObject.GROUND_Y - this.height;
    }

    /**
     * Checks if this object is colliding with another movable object (axis-aligned bounding box).
     * @param {MoveableObject} moveableObject - The other object to test against.
     * @returns {boolean} True if the bounding boxes overlap, otherwise false.
     */
    isColliding(moveableObject) {
        return this.x + this.width > moveableObject.x &&
            this.y + this.height > moveableObject.y &&
            this.x < moveableObject.x + moveableObject.width &&
            this.y < moveableObject.y + moveableObject.height;
    }

    /**
     * Reduces the object's energy by 5 points and updates the last hit timestamp.
     * Energy cannot go below 0.
     * @returns {void}
     */
    hit() {
        this.energy -= 5;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    /**
     * Determines whether the object is currently in a hurt state (invincibility frames).
     * @returns {boolean} True if less than 0.8 seconds have passed since the last hit, otherwise false.
     */
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 0.8;
    }

    /**
     * Checks if the object is dead (energy equals 0).
     * @returns {boolean} True if energy is 0, otherwise false.
     */
    isDead() {
        return this.energy == 0;
    }

    /**
     * Cycles through an array of images to create an animation.
     * Uses the `currentImages` counter (inherited from `Drawableobject`) to determine the next frame.
     * @param {string[]} images - Array of image paths.
     * @returns {void}
     */
    playAnimation(images) {
        let i = this.currentImages % images.length;
        let path = images[i];
        this.img = this.imgCache[path];
        this.currentImages++;
    }

    /**
     * Moves the object to the right by adding its speed to the x-coordinate.
     * @returns {void}
     */
    moveRight() {
        this.x += this.speed;
    }

    /**
     * Moves the object to the left by subtracting its speed from the x-coordinate.
     * @returns {void}
     */
    moveLeft() {
        this.x -= this.speed;
    }

    /**
     * Makes the object jump by setting its upward vertical velocity.
     * @returns {void}
     */
    jump() {
        this.speedY = 30;
    }
}
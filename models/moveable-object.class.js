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
    offset = {        
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    };

    /**
     * Applies gravity to the object, updating its vertical position and speed.
     * Runs continuously on an interval (25 fps). If the object is above ground or moving upward,
     * it decreases speedY due to acceleration (gravity). When on ground, resets speedY and snaps
     * the character to the ground.
     * @returns {void}
     */
    applyGravity() {
        setInterval(() => {
            this.previousY = this.y; 
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            } else {
                this.speedY = 0;
                if (this.constructor.name === 'Character') {
                    this.setToGround();
                }
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
     * Checks if this object collides with another movable object using hitbox offsets.
     * @param {MoveableObject} mo - The other movable object to check collision with.
     * @returns {boolean} True if the hitboxes overlap, false otherwise.
     */
    isColliding(mo) {
        return this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
               this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
               this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
               this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom;
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
        this.speedY = 35;
    }
}
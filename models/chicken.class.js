class Chicken extends MoveableObject {
    y = 345;
    height = 70;
    width = 60;
    isDeadState = false;
    isPanicking = false;
    panicEndTime = 0;
    isPanickingFromBoss = false;
    bossPanicEnd = 0;

    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];

    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_normal/2_dead/dead0.png',
        'img/3_enemies_chicken/chicken_normal/2_dead/dead1.png',
        'img/3_enemies_chicken/chicken_normal/2_dead/dead2.png',
    ];

    /**
     * Creates a new Chicken instance.
     * Loads walking and dead animations, sets random position, speed, and walk range.
     * Animation starts after a random delay.
     * @constructor
     * @param {number|null} [x=null] - The horizontal start position. If null, a random position between 700 and 1200 is chosen.
     */
    constructor(x = null) {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.x = (x !== null) ? x : 700 + Math.random() * 500;
        this.speed = 0.15 + Math.random() * 0.25;
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.walkRange = 300 + Math.random() * 300;
        this.offset = {         
            top: 5,
            bottom: 0,
            left: 5,
            right: 5
        };

        setTimeout(() => {
            this.animate();
        }, Math.random() * 1000);
    }

    /**
     * Starts the movement and animation intervals for the chicken.
     * Movement interval moves the chicken left at 60 FPS (unless dead).
     * Animation interval plays walking or dead sprites every 200ms.
     * @returns {void}
     */
    animate() {
        this.stopIntervals();
        this.moveInterval = setInterval(() => {
            if (this.isDeadState || !this.world?.character) return;
            this.moveLeft();
            this.otherDirection = false;
        }, 1000 / 60);
        this.animationInterval = setInterval(() => {
            this.playAnimation(this.isDeadState ? this.IMAGES_DEAD : this.IMAGES_WALKING);
        }, 200);
    }

    /**
     * Calculates the foot-level hitbox of the object, typically used for ground collision or stomping mechanics.
     * The hitbox is positioned at the bottom of the object, spanning most of its width.
     * @returns {{x: number, y: number, width: number, height: number}} An object defining the foot hitbox position and size.
     */
    getHitbox() {
        return {
            x: this.x + 5,
            y: this.y + 5,
            width: this.width - 10,
            height: this.height - 5
        };
    }

    /**
     * Clears any existing movement and animation intervals.
     * Prevents memory leaks and duplicate intervals.
     * @returns {void}
     */
    stopIntervals() {
        if (this.moveInterval) clearInterval(this.moveInterval);
        if (this.animationInterval) clearInterval(this.animationInterval);
    }

    /**
     * Marks the chicken as dead, stops movement, plays death sound,
     * and schedules removal from the game world after 1 second.
     * @returns {void}
     */
    die() {
        this.isDeadState = true;
        this.speed = 0;
        if (this.world) {
            this.world.sound.play("chicken");
        }
        setTimeout(() => {
            this.markedForDeletion = true;
        }, 1000);
    }
}
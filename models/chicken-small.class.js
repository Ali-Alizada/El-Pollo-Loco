class SmallChicken extends Chicken {
    /**
     * Creates a new SmallChicken instance.
     * Sets custom size, position, and speed for the smaller chicken enemy.
     * Loads smallChicken‑specific walking and death images.
     * @constructor
     * @param {number|null} [x=null] - The horizontal start position. If null, a random position between 700 and 1500 is chosen.
     */
    constructor(x = null) {
        super();
        this.height = 60;
        this.width = 50;
        this.y = 360;
        this.x = (x !== null) ? x : 700 + Math.random() * 800;
        this.speed = 0.2 + Math.random() * 0.3;

        this.IMAGES_WALKING = [
            'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
            'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
            'img/3_enemies_chicken/chicken_small/1_walk/3_w.png',
            'img/3_enemies_chicken/chicken_small/1_walk/4_w.png',
            'img/3_enemies_chicken/chicken_small/1_walk/5_w.png',
            'img/3_enemies_chicken/chicken_small/1_walk/6_w.png'
        ];

        this.IMAGES_DEAD = [
            'img/3_enemies_chicken/chicken_small/2_dead/dead.png'
        ];

        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
    }

    /**
     * Overrides the base Chicken die method.
     * Marks the small chicken as dead, stops movement, plays the small chicken death sound,
     * spawns two bottles at its position, and schedules removal after 1 second.
     * @returns {void}
     */
    die() {
        this.isDeadState = true;
        this.speed = 0;
        if (this.world) {
            this.world.sound.play("smallChicken");
        }
        if (this.world) {
            for (let i = 0; i < 2; i++) {
                this.world.spawnBottle(
                    this.x + Math.random() * 50,
                    this.y
                );
            }
        }
        setTimeout(() => {
            this.markedForDeletion = true;
        }, 1000);
    }
}
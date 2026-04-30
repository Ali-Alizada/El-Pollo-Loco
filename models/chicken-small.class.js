class SmallChicken extends Chicken {

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
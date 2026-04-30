class Chicken extends MoveableObject {

    y = 350;
    height = 70;
    width = 60;

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

    isDeadState = false;
    isPanicking = false;
    panicEndTime = 0;
    isPanickingFromBoss = false;
    bossPanicEnd = 0;

    constructor(x = null) {     
        super().loadImage(this.IMAGES_WALKING[0]);
        this.x = (x !== null) ? x : 700 + Math.random() * 500;
        this.speed = 0.15 + Math.random() * 0.25;
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.walkRange = 300 + Math.random() * 300;

        setTimeout(() => {
            this.animate();
        },  Math.random() * 1000);
    }

    animate() {
        this.stopIntervals();
        this.moveInterval = setInterval(() => {
            if (this.isDeadState) return;
            if (!this.world || !this.world.character) return;
            this.moveLeft();
            this.otherDirection = false;
        }, 1000 / 60);

        this.animationInterval = setInterval(() => {
            if (this.isDeadState) {
                this.playAnimation(this.IMAGES_DEAD);
            } else {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200);
    }

    stopIntervals() {
        if (this.moveInterval) clearInterval(this.moveInterval);
        if (this.animationInterval) clearInterval(this.animationInterval);
    }

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
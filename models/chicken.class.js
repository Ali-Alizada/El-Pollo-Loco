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

    constructor() {     
        super().loadImage(this.IMAGES_WALKING[0]);

        this.x = 200 + Math.random() * 500;
        this.speed = 0.15 + Math.random() * 0.25;

        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);

        this.animate();

        console.log(this.IMAGES_DEAD);
    }

    animate() {
        // Bewegung
        this.moveInterval = setInterval(() => {
            if (!this.isDeadState) {
                this.moveLeft();
            }
        }, 1000/60);

        // Animation
        this.animationInterval = setInterval(() => {
            if (this.isDeadState) {
                this.playAnimation(this.IMAGES_DEAD);
            } else {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200);
    }

    

    die() {
        this.isDeadState = true;
        this.speed = 0;

        setTimeout(() => {
            this.markedForDeletion = true;
        }, 1000);
    }

}

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

    constructor() {     
        super().loadImage(this.IMAGES_WALKING[0]);
        this.x = 200 + Math.random() * 500;
        this.speed = 0.15 + Math.random() * 0.25;
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.walkRange = 300 + Math.random() * 300;
        
        setTimeout(() => {
            this.animate();
        }, Math.random() * 1000);
    }

    animate() {
        this.stopIntervals();
        // Bewegungs-Interval
        this.moveInterval = setInterval(() => {
            if (this.isDeadState) return;
            if (!this.world || !this.world.character) return;

            let character = this.world.character;
            let boss = this.world.boss;
            let characterX = character.x;
            let distance = Math.abs(characterX - this.x);

            // Panik vor Boss
            if (boss) {
                let bossDistance = Math.abs(boss.x - this.x);
                if (bossDistance < 300) {
                    this.isPanickingFromBoss = true;
                    this.bossPanicEnd = Date.now() + 1500;
                }
            }
            if (this.isPanickingFromBoss && Date.now() > this.bossPanicEnd) {
                this.isPanickingFromBoss = false;
            }
            if (this.isPanickingFromBoss) {
                let bossX = boss.x;
                let panicSpeed = this.speed * 2.5;
                if (bossX < this.x) {
                    this.x += panicSpeed;
                    this.otherDirection = true;
                } else {
                    this.x -= panicSpeed;
                    this.otherDirection = false;
                }
                return;
            }

            // Panik vor Spieler (wenn dieser springt)
            if (character.speedY > 5) {
                this.isPanicking = true;
                this.panicEndTime = Date.now() + 1000;
            }
            if (this.isPanicking && Date.now() > this.panicEndTime) {
                this.isPanicking = false;
            }
            if (this.isPanicking) {
                let panicSpeed = this.speed * 2;
                if (characterX < this.x) {
                    this.x += panicSpeed;
                    this.otherDirection = true;
                } else {
                    this.x -= panicSpeed;
                    this.otherDirection = false;
                }
                return;
            }

            // Normales Verhalten
            if (distance < this.walkRange) {
                if (characterX < this.x) {
                    this.moveLeft();
                    this.otherDirection = false;
                } else {
                    this.moveRight();
                    this.otherDirection = true;
                }
            } else {
                this.moveRight();
                this.otherDirection = true;
            }
        }, 1000 / 60);

        // Animations-Interval
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
        setTimeout(() => {
            this.markedForDeletion = true;
        }, 1000);
        }
}
   
   

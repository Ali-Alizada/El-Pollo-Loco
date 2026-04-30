class Endboss extends MoveableObject {

    height = 400;
    width = 280;
    y = 65;
    phase = 1;
    energy = 100;
    world;
    currentImages = 0;
    currentState = "walk";

    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png'
    ];

    IMAGES_ALERT = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png'
    ];

    IMAGES_ATTACK = [
        'img/4_enemie_boss_chicken/3_attack/G13.png',
        'img/4_enemie_boss_chicken/3_attack/G14.png',
        'img/4_enemie_boss_chicken/3_attack/G15.png',
        'img/4_enemie_boss_chicken/3_attack/G16.png',
        'img/4_enemie_boss_chicken/3_attack/G17.png',
        'img/4_enemie_boss_chicken/3_attack/G18.png',
        'img/4_enemie_boss_chicken/3_attack/G19.png',
        'img/4_enemie_boss_chicken/3_attack/G20.png'
    ];

    IMAGES_HURT = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png'
    ];

    IMAGES_DEAD = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png'
    ];

    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 2500;
        this.startX = this.x;
        this.speed = 2.5;
        this.aggressiveSpeed = 8;
        this.aggressiveRange = 300;
        this.otherDirection = true;
        this.normalY = 65;
        this.flyingY = 40;   
        this.currentState = "walk";
    }

    animate() {
    if (this.moveInterval) clearInterval(this.moveInterval);
    if (this.animationInterval) clearInterval(this.animationInterval);

    this.moveInterval = setInterval(() => {
        if (!this.world || this.isDead()) return;
        this.checkPhase();
        const characterX = this.world.character.x;
        const distance = Math.abs(characterX - this.x);
        const alertRange = this.alertRange || 650;

        let currentSpeed = (distance < this.aggressiveRange) ? this.aggressiveSpeed : this.speed;

    if (distance < alertRange) {
        if (characterX < this.x) {
            this.x -= currentSpeed;
            this.otherDirection = false;
        } else {
            this.x += currentSpeed;
            this.otherDirection = true;
        }
    } else {
        if (this.x < this.startX) {
            this.x += currentSpeed;
            this.otherDirection = true;
        }
    }

        if (this.isAttacking()) {
            let floatOffset = Math.sin(Date.now() / 200) * 5;
            this.y = this.flyingY + floatOffset;
        } else {
            this.y = this.normalY;
    }
    }, 1000 / 25);


    this.animationInterval = setInterval(() => {
        if (!this.world) return;
        if (this.isDead()) {
            this.playAnimation(this.IMAGES_DEAD);
            return;
        }

        let newState = "";
        if (this.isHurt()) newState = "hurt";
        else if (this.isAttacking()) newState = "attack";
        else if (Math.abs(this.world.character.x - this.x) < (this.alertRange || 650)) newState = "walk";
        else newState = "idle";

        if (this.currentState !== newState) {
            this.currentImages = 0;
            this.currentState = newState;
        }

        switch (newState) {
            case "hurt": this.playAnimation(this.IMAGES_HURT); break;
            case "attack": this.playAnimation(this.IMAGES_ATTACK); break;
            case "walk": this.playAnimation(this.IMAGES_WALKING); break;
            case "idle": this.playAnimation(this.IMAGES_ALERT); break;
        }
    }, 300);
    }

    checkPhase() {
        if (this.energy < 30 && this.phase === 1) {
            this.enterPhase2();
        }
    }

    enterPhase2() {
        this.phase = 2;
        this.speed = 3;       
        this.alertRange = 800; 

    }

    distanceToCharacter() {
        return Math.abs(this.world.character.x - this.x);
    }

    isAttacking() {
        return this.distanceToCharacter() < this.aggressiveRange;
    }

    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        return timepassed / 1000 < 0.5;
    }

    isDead() {
        return this.energy <= 0;
    }
}

class Endboss extends MoveableObject {

    height = 400;
    width = 280;
    y = 55;
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
    ]
        
    IMAGES_DEAD = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png'
    ]
  
    world;
    deadAnimationPlayed = false;


    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);

        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);

        this.x = 2500;
        this.speed = 0.5;

     
 
    }


    animate() {

        setInterval(() => {
        if (this.isDead()) return;

        if (this.isAttacking() || this.isAlert()) {
            this.moveToCharacter();
        } else {
            if (this.x < 2000) {
                this.x += this.speed;
                this.otherDirection = true;
            }
        }
        }, 1000 / 25); // 🔥 60 FPS!

            setInterval(() => {
        if (this.isDead()) {
            
        } else if (this.isHurt()) {
            this.playAnimation(this.IMAGES_HURT);

        } else if (this.isAttacking()) {
            this.playAnimation(this.IMAGES_ATTACK);

        } else if (this.isAlert()) {
            this.playAnimation(this.IMAGES_WALKING); // 🔥 läuft beim Verfolgen

        } else {
            this.playAnimation(this.IMAGES_WALKING); // idle/patrol
        }

    }, 200);

        }



        energy = 100;

            isDead() {
                return this.energy <= 0;
            }

           isHurt() {
            let timepassed = new Date().getTime() - this.lastHit;
            timepassed = timepassed / 1000;
            return timepassed < 0.5; // nur 0.5 Sekunden verletzt
            }


            distanceToCharacter() {
            return Math.abs(this.world.character.x - this.x);
            }


            isAlert() {
                return this.distanceToCharacter() < 600;
            }

            isAttacking() {
                return this.distanceToCharacter() < 150;
            }



        moveToCharacter() {
            let characterX = this.world.character.x;

            if (characterX < this.x) {
                this.x -= this.speed;
                this.otherDirection = false;
            } else if (characterX > this.x) {
                this.x += this.speed;
                this.otherDirection = true;
            }
        }

    
}

      

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
    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);

        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);

        this.x = 2500;

        // this.moveLeft();
        this.animate();
    }

    animate() {

        setInterval(() => {

            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
                // console.log(this.dead(), 'Endboss ist tot!');

            } else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
                // console.log(this.isHurt(), 'Endboss ist verletzt!');

            } else if (this.isAttacking()) {
                this.playAnimation(this.IMAGES_ATTACK);
                // console.log(this.isAttacking(), 'Endboss greift an!');

                this.x -= this.speed;   // 👉 bewegt sich beim Angriff

            } else if (this.isAlert()) {
                this.playAnimation(this.IMAGES_ALERT);

                this.x -= this.speed;   // 👉 läuft zum Spieler
                // console.log(this.isAlert(), 'Endboss ist wachsam!');

            } else {
                this.playAnimation(this.IMAGES_WALKING);

                this.x -= this.speed;   // 👉 normales Laufen
                // console.log('Endboss läuft normal!');
            }

        }, 200);
    }



        energy = 100;

            isDead() {
                return this.energy <= 0;
            }

            isHurt() {
                return this.energy < 100;
            }

            isAlert() {
                return this.world.character.x > this.x - 600;
            }

            isAttacking() {
                return this.world.character.x > this.x - 150;
            }


    
}

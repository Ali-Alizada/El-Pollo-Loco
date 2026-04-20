class SmallChicken extends Chicken {

    constructor() {
        super();

        console.log("SmallChicken spawned"); // 👈 TEST

        this.height = 50;
        this.width = 45;
        this.y = 370;

        

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

        this.x = 450 + Math.random() * 1000;
        this.speed = 0.2 + Math.random() * 0.3; // bisschen schneller 😈

        
    }

    die() {
    this.isDeadState = true;
    this.speed = 0;

    setTimeout(() => {
        this.markedForDeletion = true;
    }, 1000);
}

}

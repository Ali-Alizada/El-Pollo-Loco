class Chicken extends MoveableObject {

    y = 350;
    height = 70;
    width = 60;
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
     ];


    constructor() {     
        super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.x = 200 + Math.random() * 500; // Zufällige x-Position zwischen 200 und 700
        this.speed = 0.15 + Math.random() * 0.25;
        
        this.loadImages(this.IMAGES_WALKING);
        this.animate();
    }

      animate() {
        this.moveLeft();
        setInterval(() => {
        let i = this.currentImages % this.IMAGES_WALKING.length;
        let path = this.IMAGES_WALKING[i];
        this.img = this.imgCache[path];
        this.currentImages++;

        }, 200);
        
    }




    eat() {
        console.log('Eat!');
    }
}
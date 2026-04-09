class Chicken extends MoveableObject {

    y = 350;
    height = 70;
    width = 60;
    constructor() {     
        super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.x = 200 + Math.random() * 500; // Zufällige x-Position zwischen 200 und 700
      
        // this.height = 80;
        // this.width = 70;
    }


    eat() {
        console.log('Eat!');
    }
}
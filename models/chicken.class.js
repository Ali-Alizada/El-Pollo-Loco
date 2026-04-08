class Chicken extends MoveableObject {

    x = 350;
    y = 200;
    height = 50;
    width = 60;
    constructor() {     
        super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
    }


    eat() {
        console.log('Eat!');
    }
}
class Character extends MoveableObject {

    y = 195;
    height = 230;
    width = 120;

    constructor() {     
        super().loadImage('img/2_character_pepe/2_walk/W-21.png');
    }

    jump(){
        console.log('Jump!');
    }
}
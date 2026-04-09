class backgroudObject extends MoveableObject {

    height = 220;
    width = 480;   
    constructor(loadImage, x, y) {
        super().loadImage(loadImage);
        this.x = x;
        this.y = y;
    }
}
class backgroudObject extends MoveableObject {

    height = 480;
    width = 720;   
    constructor(loadPath, x) {
        super().loadImage(loadPath);
        this.x = x;
        this.y = 480 - this.height;
    }
}


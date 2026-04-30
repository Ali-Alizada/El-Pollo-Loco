class Cloud extends MoveableObject {
    y = 20;
    height = 300;
    width = 550;

    constructor(x = null) {
        super().loadImage('img/5_background/layers/4_clouds/1.png');
        this.x = (x !== null) ? x : Math.random() * 500;
        this.animate();
    }

   animate() {
    setInterval(() => {
        this.moveLeft();
        if (this.x + this.width < 0 && this.world) {
            this.x = this.world.level.level_end_x + Math.random() * 300;
        }
    }, 1000 / 60);
}
}
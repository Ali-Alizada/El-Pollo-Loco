class Cloud extends MoveableObject {

    y = 20;
    height = 250; 
    width = 500;
    constructor() {
        super().loadImage('img/5_background/layers/4_clouds/1.png');
        this.x = Math.random() * 500; // Zufällige x-Position zwischen 0 und 500 für die Wolke
        this.animate();
    }

    animate() {
        this.moveLeft();
    }

} 
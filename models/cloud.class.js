class Cloud extends MoveableObject {

    y = 20;
    height = 200; 
    width = 450;

    constructor() {
        super().loadImage('img/5_background/layers/4_clouds/1.png');

        this.x = Math.random() * 500; // Zufällige x-Position zwischen 0 und 500 für die Wolke
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.x -= 0.15; // Bewegt die Wolke nach links
            if (this.x < -this.width) {
                this.x = 720; // Setzt die Wolke zurück auf die rechte Seite
            }
        }, 1000/60); // ca. 60 FPS
    }
}
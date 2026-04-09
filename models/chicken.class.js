class Chicken extends MoveableObject {

    y = 350;
    height = 70;
    width = 60;
    constructor() {     
        super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.x = 200 + Math.random() * 500; // Zufällige x-Position zwischen 200 und 700
        this.animate();
    }


    animate() {
        setInterval(() => {
            this.x -= 0.5; // Bewegt das Huhn nach links
            if (this.x < -this.width) {
                this.x = 720; // Setzt das Huhn zurück auf die rechte Seite
            }
        }, 1000/60); // ca. 60 FPS  
        
    }



    eat() {
        console.log('Eat!');
    }
}
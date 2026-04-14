class MoveableObject {
    x = 120;
    y = 280; 
    height = 150;
    width = 100;
    img;
    imgCache = {};
    currentImages = 0;
    speed = 0.15;
    otherDirection = false;

    // laodImage('img')
    loadImage(path) {
        this.img = new Image(); // this.img = document.getElementById('img');
        this.img.src = path;
 
    }

    /**
     * 
     * @param {Array} array - ['img/img1.png', 'img/img2' ...] 
     */

    loadImages(array){
        array.forEach((path) => {
            let img = new Image(); 
            img.src = path;
            this.imgCache[path] = img; 
        });
    }

    playAnimation(images) {
        let i = this.currentImages % images.length;
        let path = images[i];
        this.img = this.imgCache[path];
        this.currentImages++;
    }

    moveRight() {
        console.log('Move right!');
    }

    moveLeft() {
        setInterval(() => {
            this.x -= this.speed; // Bewegt die Wolke nach links
        }, 1000/60); // ca. 60 FPS
    }
} 
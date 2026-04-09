class MoveableObject {
    x = 120;
    y = 280; 
    height = 150;
    width = 100;
    img;
    imgCache = {};

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
            this.imgCache[path] = path; 
        });
    }

    moveRight() {
        console.log('Move right!');
    }

    moveLeft() {
        console.log('Move left!');
    }
} 
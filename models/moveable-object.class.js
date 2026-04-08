class MoveableObject {
    x = 80;
    y = 50; 
    img;
    height = 100;
    width = 250;


    // laodImage('img')
    loadImage(path) {
        this.img = new Image(); // this.img = document.getElementById('img');
        this.img.src = path;
 
    }

    moveRight() {
        console.log('Move right!');
    }

    moveLeft() {
        console.log('Move left!');
    }
} 
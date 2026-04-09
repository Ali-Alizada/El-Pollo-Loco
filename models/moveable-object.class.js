class MoveableObject {
    x = 120;
    y = 280; 
    height = 150;
    width = 100;
    img;
    // x = 80;
    // y = 220; 
    // height = 210;
    // width = 110;
    // img;


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
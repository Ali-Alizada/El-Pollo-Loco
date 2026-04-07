class MoveableObject {
    x = 120;
    y = 400; 
    img;


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